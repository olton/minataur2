import {
    cache_block_stats,
    cache_block_stats_avg,
    cache_blocks_crt,
    cache_canonical_chain,
    cache_dispute,
    cache_epoch, cache_last_canonical_block
} from "./cache.js";
import {updateWhois} from "./whois.js";
import {db_get_block_trans} from "./db.js";
import {ql_get_account_balance} from "./graphql.js";
import {query} from "./postgres.js";

export const on_new_block = (data) => {
    // console.log(data)
    cache_epoch()
    cache_dispute()
    cache_canonical_chain()
    cache_block_stats()
    cache_block_stats_avg()
    cache_blocks_crt()
    cache_last_canonical_block()
}

export const on_new_user_tx_memo = (data) => {
    updateWhois(data)
}

export const on_canonical_block = async (data) => {
    const block_id = data.id
    const tx = await db_get_block_trans(block_id)
    for(let row of tx) {
        const {sender_id, receiver_id, sender_key, receiver_key} = row

        const sender_balance = await ql_get_account_balance(sender_key)
        if (sender_balance) {
            query(`
                insert into balances (public_key_id, block_id, total, liquid, locked, unknown)
                values ($1, $2, $3, $4, $5, $6)
                on conflict do nothing
            `, [sender_id, block_id, sender_balance.total, sender_balance.liquid, sender_balance.locked, sender_balance.unknown])
        }
        const receiver_balance = await ql_get_account_balance(receiver_key)
        if (receiver_balance) {
            query(`
                insert into balances (public_key_id, block_id, total, liquid, locked, unknown)
                values ($1, $2, $3, $4, $5, $6)
                on conflict do nothing
            `, [receiver_id, block_id, receiver_balance.total, receiver_balance.liquid, receiver_balance.locked, receiver_balance.unknown])
        }
    }
}