import {
    cache_block_stats,
    cache_block_stats_avg,
    cache_blocks_crt,
    cache_canonical_chain,
    cache_dispute,
    cache_epoch, cache_last_canonical_block
} from "./cache.js";
import {updateWhois} from "./whois.js";

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