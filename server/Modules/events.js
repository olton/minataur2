import {cache_block_stats, cache_block_stats_avg, cache_canonical_chain, cache_dispute, cache_epoch} from "./cache.js";

export const on_new_block = () => {
    cache_epoch()
    cache_dispute()
    cache_canonical_chain()
    cache_block_stats()
    cache_block_stats_avg()
}