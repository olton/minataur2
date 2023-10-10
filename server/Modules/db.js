import {query} from "./postgres.js";
import {debug} from "../Helpers/log.js";
import {on_new_block, on_new_user_tx_memo} from "./events.js";
import {decodeMemo} from "../Helpers/memo.js";
import {ql_get_account_balance} from "./graphql.js";

export const CHAIN_STATUS = {
    PENDING: "pending",
    ORPHANED: "orphaned",
    CANONICAL: "canonical",
    ALL: "all",
}

export const USER_TRANS_TYPE = {
    PAYMENT: 'payment',
    DELEGATION: 'delegation'
}

export const TRANS_STATUS = {
    APPLIED: 'applied',
    FAILED: 'failed',
    PENDING: 'pending'
}

export const listen_notifies = async () => {
    const client = await globalThis.postgres.connect()

    client.query('LISTEN new_block')
    client.query('LISTEN new_user_tx_memo')

    client.on('notification', async (data) => {
        const payload = JSON.parse(data.payload)
        const channel = data.channel
        if (config.debug) debug("pg_notify: ", channel)
        if (channel === 'new_block') {
            globalThis.broadcast.new_block = payload
            on_new_block(payload)
        }
        if (channel === 'new_user_tx_memo') {
            on_new_user_tx_memo(payload)
        }
    })
}

export const db_save_ip = async (ip = "") => {
    if (ip.substring(0, 7) === "::ffff:") {
        ip = ip.substring(7)
    }

    const sql = `
        insert into ip (ip) values($1)
        on conflict (ip, date) 
        do update
            set hits = ip.hits + 1
    `
    return (await query(sql, [ip]))
}

export const db_get_epoch = async () => {
    const sql = `
        select * from v_epoch
    `
    return (await query(sql)).rows[0]
}

export const db_get_dispute = async () => {
    const sql = `
        select * from v_blocks b
        where b.chain_status = 'pending'
        order by height desc
    `
    return (await query(sql)).rows
}

export const db_get_blocks_short = async ({chainStatus = 'canonical', limit = 20, offset = 0} = {}) => {
    const sql = `
        select * from v_blocks b
        where b.chain_status = $1
        order by height desc
        limit $2 offset $3
    `
    return (await query(sql, [chainStatus, limit, offset])).rows
}

export const db_get_block_stats = async () => {
    const sql = `
        select * from v_block_stats
    `
    return (await query(sql)).rows
}

export const db_get_last_canonical_block = async () => {
    const sql = `
        select * from v_last_canonical_block
    `
    return (await query(sql)).rows[0]
}

export const db_get_block_stats_avg = async () => {
    const sql = `
        select * from v_block_stats_avg
    `
    return (await query(sql)).rows[0]
}

export const db_get_blocks = async ({
                                    type = CHAIN_STATUS.CANONICAL,
                                    limit = 50,
                                    offset = 0,
                                    currentEpoch = false,
                                    search = null
                                } = {}) => {
    let sql = `
        select * 
        from v_blocks b 
        where chain_status = ANY($1::chain_status_type[])
        %CURRENT_EPOCH%
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
        order by height desc
        limit $2 offset $3        
    `

    sql = sql.replace("%CURRENT_EPOCH%", currentEpoch ? `and epoch_since_genesis = (select epoch_since_genesis from v_epoch)` : "")
    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and (hash = '${search.hash}' or lower(creator_name) like '%${search.hash.toLowerCase()}%' or hash = '${search.hash}')` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && search.coinbase !== null ? `and coinbase = ${search.coinbase}` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], limit, offset])).rows
}

export const db_get_blocks_count = async ({
                                    type = CHAIN_STATUS.CANONICAL,
                                    currentEpoch = false,
                                    search = null
                                } = {}) => {
    let sql = `
        select count(*) as length
        from v_blocks b 
        where chain_status = ANY($1::chain_status_type[])
        %CURRENT_EPOCH%
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
    `

    sql = sql.replace("%CURRENT_EPOCH%", currentEpoch ? `and epoch_since_genesis = (select epoch_since_genesis from v_epoch)` : "")
    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and (creator_key = '${search.hash}' or lower(creator_name) like '%${search.hash.toLowerCase()}%' or hash = '${search.hash}')` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && !isNaN(search.coinbase) ? `and coinbase = ${search.coinbase}` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type]])).rows[0].length
}

export const db_get_blocks_crt = async (deep = 100) => {
    const sql = `
    WITH blocks_100 AS (SELECT b.id,
                           b.chain_status
                    FROM blocks b
                    WHERE b.height >= ((SELECT max(blocks.height) - $1
                                        FROM blocks))),
         blocks_total AS (SELECT count(1) AS value
                          FROM blocks_100),
         blocks_canonical AS (SELECT count(1) AS value
                              FROM blocks_100
                              WHERE blocks_100.chain_status = 'canonical'::chain_status_type),
         blocks_pending AS (SELECT count(1) AS value
                            FROM blocks_100
                            WHERE blocks_100.chain_status = 'pending'::chain_status_type)
    SELECT blocks_canonical.value * 100 / (blocks_total.value - blocks_pending.value) AS crt
    FROM blocks_total,
         blocks_canonical,
         blocks_pending
    `
    return (await query(sql, [deep])).rows[0].crt
}

export const db_get_block_info = async (hash) => {
    const sql = `
        select * from v_block_info
        where hash = $1
    `
    return (await query(sql, [hash])).rows[0]
}

export const db_get_block_trans = async block_id => {
    const sql = `
        select * from v_user_transactions
        where block_id = $1
        order by sender_id asc, nonce desc
    `
    const result = (await query(sql, [block_id])).rows
    result.map(row => {
        row.memo = decodeMemo(row.memo)
    })
    return result
}

export const db_get_block_internal_commands = async block_id => {
    const sql = `
        select * from v_internal_commands
        where block_id = $1
        order by receiver_id asc
    `
    return (await query(sql, [block_id])).rows
}

export const db_get_block_zkapp_commands = async block_id => {
    const sql = `
        select * from v_zkapp_commands
        where block_id = $1
        order by nonce desc
    `
    const result = (await query(sql, [block_id])).rows
    result.map (row => {
        row.memo = decodeMemo(row.memo)
    })
    return result
}

export const db_get_transactions = async ({
    type = [USER_TRANS_TYPE.PAYMENT, USER_TRANS_TYPE.DELEGATION],
    status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED],
    limit = 50,
    offset = 0,
    search = null
}) => {
    let sql = `
        select *
        from v_user_transactions t
        where chain_status = 'canonical' 
        and command_type = ANY($1::user_command_type[])
        and status = ANY($2::transaction_status[])
        %BLOCK_HEIGHT%
        %TRANS_PARTICIPANT%
        %TRANS_HASH%
        order by height desc, timestamp desc, nonce desc
        limit $3 offset $4
    `

    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%TRANS_PARTICIPANT%", search && search.participant ? `
    and (
        sender_key = '${search.participant}'
        or lower(sender_name) like '%${search.participant.toLowerCase()}%'
        or receiver_key = '${search.participant}'
        or lower(receiver_name) like '%${search.participant.toLowerCase()}%'
    )
    ` : "")

    const result = (await query(sql, [Array.isArray(type) ? type : [type], Array.isArray(status) ? status : [status], limit, offset])).rows

    for(let row of result) {
        row.memo = decodeMemo(row.memo)
    }

    return result
}

export const db_get_transactions_count = async ({
    type = [USER_TRANS_TYPE.PAYMENT, USER_TRANS_TYPE.DELEGATION],
    status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED],
    search = null
}) => {
    let sql = `
        select count(*) as length
        from v_user_transactions t
        where chain_status = 'canonical' 
        and command_type = ANY($1::user_command_type[])
        and status = ANY($2::transaction_status[])
        %BLOCK_HEIGHT%
        %TRANS_PARTICIPANT%
        %TRANS_HASH%
    `

    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%TRANS_PARTICIPANT%", search && search.participant ? `
    and (
        sender_key = '${search.participant}'
        or lower(sender_name) like '%${search.participant.toLowerCase()}%'
        or receiver_key = '${search.participant}'
        or lower(receiver_name) like '%${search.participant.toLowerCase()}%'
    )
    ` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], Array.isArray(status) ? status : [status]])).rows[0].length
}

export const db_get_transactions_for_account = async ({
                                              type = [USER_TRANS_TYPE.PAYMENT, USER_TRANS_TYPE.DELEGATION],
                                              status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED],
                                              limit = 50,
                                              offset = 0,
                                              account = null,
                                              search = null
                                          }) => {
    let sql = `
        select *
        from v_user_transactions t
        where chain_status = 'canonical' 
        and (sender_id = $3 or receiver_id = $3)  
        and command_type = ANY($1::user_command_type[])
        and status = ANY($2::transaction_status[])
        %BLOCK_HEIGHT%
        %TRANS_PARTICIPANT%
        %TRANS_HASH%
        order by height desc, timestamp desc, nonce desc
        limit $4 offset $5
    `

    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%TRANS_PARTICIPANT%", search && search.participant ? `
    and (
        sender_key = '${search.participant}'
        or lower(sender_name) like '%${search.participant.toLowerCase()}%'
        or receiver_key = '${search.participant}'
        or lower(receiver_name) like '%${search.participant.toLowerCase()}%'
    )
    ` : "")

    const result = (await query(sql, [Array.isArray(type) ? type : [type], Array.isArray(status) ? status : [status], account, limit, offset])).rows

    for(let row of result) {
        row.memo = decodeMemo(row.memo)
    }

    return result
}

export const db_get_transactions_count_for_account = async ({
                                                    type = [USER_TRANS_TYPE.PAYMENT, USER_TRANS_TYPE.DELEGATION],
                                                    status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED],
                                                    account = null,
                                                    search = null
                                                }) => {
    let sql = `
        select count(*) as length
        from v_user_transactions t
        where chain_status = 'canonical'
        and (sender_id = $3 or receiver_id = $3)  
        and command_type = ANY($1::user_command_type[])
        and status = ANY($2::transaction_status[])
        %BLOCK_HEIGHT%
        %TRANS_PARTICIPANT%
        %TRANS_HASH%
    `

    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%TRANS_PARTICIPANT%", search && search.participant ? `
    and (
        sender_key = '${search.participant}'
        or lower(sender_name) like '%${search.participant.toLowerCase()}%'
        or receiver_key = '${search.participant}'
        or lower(receiver_name) like '%${search.participant.toLowerCase()}%'
    )
    ` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], Array.isArray(status) ? status : [status], account])).rows[0].length
}

export const db_get_trans_info = async hash => {
    const sql = `
        select t.*, 
               b.height,
               b.version,
               b.hash as block_hash,
               b.timestamp as block_timestamp,
               b.chain_status
        from v_user_transactions t
        left join v_block_info b on b.id = t.block_id
        where (b.chain_status = 'canonical' or b.chain_status = 'pending') and t.hash = $1
    `
    const result = (await query(sql, [hash])).rows[0]
    result.memo = decodeMemo(result.memo)
    return result
}

export const db_get_accounts = async ({
    limit,
    offset,
    search
}) => {
    let sql = `
        select *
        from v_accounts a 
        where 1=1
        %ACCOUNT%
        order by id
        limit $1 offset $2
    `
    sql = sql.replace("%ACCOUNT%", search ? `
    and (
        key = '${search}'
        or lower(name) like '%${search}%'
        or delegate_key = '${search}'
        or lower(delegate_name) like '%${search}%'
    )
    ` : "")
    const rows = (await query(sql, [limit, offset])).rows

    for(let r of rows) {
        if (!+r.balance) {
            const bal = await ql_get_account_balance(r.key)
            if (bal) {
                r.balance = +bal.total
                r.locked = +bal.locked > 0
            }
        }
    }

    return rows
}

export const db_get_accounts_count = async ({
    search
}) => {
    let sql = `
        select count(*) as length
        from v_accounts
        where 1=1
        %ACCOUNT%
    `
    sql = sql.replace("%ACCOUNT%", search ? `
    and (
        key = '${search}'
        or lower(name) like '%${search}%'
        or delegate_key = '${search}'
        or lower(delegate_name) like '%${search}%'
    )
    ` : "")
    return (await query(sql)).rows[0].length
}

export const db_get_account_info = async key => {
    const sql = `
        select * 
        from v_account_info a 
        where a.key = $1         
    `
    return (await query(sql, [key])).rows[0]
}

export const db_get_account_ledger = async (account_id, ledger = 'staking') => {
    const sql = `
        select *
        from v_ledger_${ledger}
        where public_key_id = $1
    `
    return (await query(sql, [account_id])).rows[0]
}

export const db_get_account_stake = async (account_id, ledger = 'staking') => {
    const sql = `
        select 
            delegate_key_id as account_id, 
            sum(l.balance) as stake, 
            count(*) as delegators
        from v_ledger_${ledger} l
        where delegate_key_id = $1
        group by delegate_key_id
    `
    return (await query(sql, [account_id])).rows[0]
}

export const db_get_account_delegators = async ({
    account_id,
    ledger = 'staking',
    limit = 50,
    offset = 0,
    search = null
}) => {
    let sql = `
        select *
        from v_ledger_${ledger}
        where delegate_key_id = $1
        %HASH_SEARCH%
        order by balance desc
        limit $2 offset $3
    `

    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and account_key = '${search.hash}'` : "")

    return (await query(sql, [account_id, limit, offset])).rows
}

export const db_get_account_delegators_count = async ({
    account_id,
    ledger = 'staking',
    search = null
}) => {
    let sql = `
        select count(*) as length
        from v_ledger_${ledger}
        where delegate_key_id = $1
        %HASH_SEARCH%
    `

    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and account_key = '${search.hash}'` : "")

    return (await query(sql, [account_id])).rows[0].length
}

export const db_get_blocks_for_account = async ({
    type = [CHAIN_STATUS.CANONICAL, CHAIN_STATUS.PENDING, CHAIN_STATUS.ORPHANED],
    limit = 50,
    offset = 0,
    account = null,
    currentEpoch = false,
    search = null
}) => {
    let sql = `
        select * 
        from v_blocks b 
        where creator_id = $2 and chain_status = ANY($1::chain_status_type[])
        %CURRENT_EPOCH%
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
        order by height desc
        limit $3 offset $4        
    `

    sql = sql.replace("%CURRENT_EPOCH%", currentEpoch ? `and epoch_since_genesis = (select epoch_since_genesis from v_epoch)` : "")
    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && search.coinbase ? `and coinbase = ${search.coinbase}` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], account, limit, offset])).rows
}

export const db_get_blocks_count_for_account = async ({
    type = [CHAIN_STATUS.CANONICAL, CHAIN_STATUS.PENDING, CHAIN_STATUS.ORPHANED],
    account = null,
    currentEpoch = false,
    search = null
}) => {
    let sql = `
        select count(*) as length
        from v_blocks b 
        where creator_id = $2 and chain_status = ANY($1::chain_status_type[])
        %CURRENT_EPOCH%
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
    `

    sql = sql.replace("%CURRENT_EPOCH%", currentEpoch ? `and epoch_since_genesis = (select epoch_since_genesis from v_epoch)` : "")
    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && search.coinbase ? `and coinbase = ${search.coinbase}` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], account])).rows[0].length
}

export const db_get_zkapps = async ({
    limit = 50,
    offset = 0,
    search = null,
    status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED]
}) => {
    let sql = `
        select *
        from v_zkapp_commands z
        where chain_status = 'canonical' 
        and status = ANY($1::transaction_status[])
        %BLOCK_HEIGHT%
        %PAYER_HASH%
        %TRANS_HASH%
        order by height desc, timestamp desc, nonce desc
        limit $2 offset $3
    `
    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%PAYER_HASH%", search && search.payer ? `
    and (
        payer_key = '${search.payer}'
        or lower(payer_name) like '%${search.payer.toLowerCase()}%'
    )
    ` : "")

    const result = (await query(sql, [Array.isArray(status) ? status : [status], limit, offset])).rows

    for(let row of result) {
        row.memo = decodeMemo(row.memo)
    }

    return result
}

export const db_get_zkapps_count = async ({
    search = null,
    status = [TRANS_STATUS.APPLIED, TRANS_STATUS.FAILED]
}) => {
    let sql = `
        select count(*) as length
        from v_zkapp_commands z
        where chain_status = 'canonical' 
        and status = ANY($1::transaction_status[])
        %BLOCK_HEIGHT%
        %PAYER_HASH%
        %TRANS_HASH%
    `
    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and hash = '${search.hash}'` : "")
    sql = sql.replace("%PAYER_HASH%", search && search.payer ? `
    and (
        payer_key = '${search.payer}'
        or lower(payer_name) like '%${search.payer.toLowerCase()}%'
    )
    ` : "")

    return (await query(sql, [Array.isArray(status) ? status : [status]])).rows[0].length
}

export const db_get_coinbase = async ({
                                        limit = 50,
                                        offset = 0,
                                        search = null
                                    }) => {
    let sql = `
        select *
        from v_coinbase
        where 1=1
        %BLOCK_HEIGHT%
        %RECEIVER_HASH%
        %TRANS_HASH%
        limit $1 offset $2
    `
    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and (tx_hash = '${search.hash}' or block_hash = '${search.hash}')` : "")
    sql = sql.replace("%RECEIVER_HASH%", search && search.payer ? `
    and (
        receiver_key = '${search.payer}'
        or lower(receiver_name) like '%${search.payer.toLowerCase()}%'
    )
    ` : "")

    return (await query(sql, [limit, offset])).rows
}

export const db_get_coinbase_count = async ({
                                              search = null
                                          }) => {
    let sql = `
        select count(*) as length
        from v_coinbase
        where 1=1
        %BLOCK_HEIGHT%
        %RECEIVER_HASH%
        %TRANS_HASH%
    `
    sql = sql.replace("%BLOCK_HEIGHT%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%TRANS_HASH%", search && search.hash ? `and (tx_hash = '${search.hash}' or block_hash = '${search.hash}')` : "")
    sql = sql.replace("%RECEIVER_HASH%", search && search.payer ? `
    and (
        receiver_key = '${search.payer}'
        or lower(receiver_name) like '%${search.payer.toLowerCase()}%'
    )
    ` : "")

    return (await query(sql)).rows[0].length
}

export const db_get_account_stats = async (account_id) => {
    const sql = `
        select *
        from v_account_stats
        where account_id = $1
    `
    return (await query(sql, [account_id])).rows[0]
}