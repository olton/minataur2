import {query} from "./postgres.js";
import {debug} from "../Helpers/log.js";
import {on_new_block} from "./events.js";

export const CHAIN_STATUS = {
    PENDING: "pending",
    ORPHANED: "orphaned",
    CANONICAL: "canonical",
    ALL: "all",
}

export const listen_notifies = async () => {
    const client = await globalThis.postgres.connect()

    client.query('LISTEN new_block')
    client.on('notification', async (data) => {
        if (config.debug) {
            debug(`${data.channel} notification:`, 'info', data.payload)
        }
        if (data.channel === 'new_block') {
            globalThis.broadcast.new_block = JSON.parse(data.payload)

            on_new_block()
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
                                    search = null
                                } = {}) => {
    let sql = `
        select * 
        from v_blocks b 
        where chain_status = ANY($1::chain_status_type[])
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
        order by height desc
        limit $2 offset $3        
    `

    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and (creator_key = '${search.hash}' or lower(creator_name) like '%${search.hash.toLowerCase()}%' or hash = '${search.hash}')` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && !isNaN(search.coinbase) ? `and coinbase = ${search.coinbase}` : "")

    return (await query(sql, [Array.isArray(type) ? type : [type], limit, offset])).rows
}

export const db_get_blocks_count = async ({
                                    type = CHAIN_STATUS.CANONICAL,
                                    search = null
                                } = {}) => {
    let sql = `
        select count(*) as length
        from v_blocks b 
        where chain_status = ANY($1::chain_status_type[])
        %BLOCK_SEARCH%
        %HASH_SEARCH%
        %COINBASE_SEARCH%
    `

    sql = sql.replace("%BLOCK_SEARCH%", search && search.block ? `and height = ${search.block}` : "")
    sql = sql.replace("%HASH_SEARCH%", search && search.hash ? `and (creator_key = '${search.hash}' or lower(creator_name) like '%${search.hash.toLowerCase()}%' or hash = '${search.hash}')` : "")
    sql = sql.replace("%COINBASE_SEARCH%", search && !isNaN(search.coinbase) ? `and coinbase = ${search.coinbase}` : "")

    console.log(sql)

    return (await query(sql, [Array.isArray(type) ? type : [type]])).rows[0].length
}
