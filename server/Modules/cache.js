import {
    db_get_block_stats,
    db_get_block_stats_avg,
    db_get_blocks_crt,
    db_get_blocks_short,
    db_get_dispute,
    db_get_epoch, db_get_last_canonical_block
} from "./db.js";
import {parseTime} from "../Helpers/parsers.js";
import {get_price_info} from "./price.js"
import {ql_get_transaction_in_pool} from "./graphql.js";

export const cache_epoch = async () => {
    cache.epoch = await db_get_epoch()
}

export const cache_dispute = async () => {
    cache.dispute = await db_get_dispute()
}

export const cache_canonical_chain = async () => {
    cache.canonical = await db_get_blocks_short({limit: 20})
}

export const cache_last_canonical_block = async () => {
    cache.last_canonical_block = await db_get_last_canonical_block()
}

export const cache_block_stats = async () => {
    cache.block_stats = await db_get_block_stats()
}

export const cache_blocks_crt = async () => {
    cache.blocks_crt = await db_get_blocks_crt()
}

export const cache_block_stats_avg = async () => {
    cache.block_stats_avg = await db_get_block_stats_avg()
}

export const cache_price_info = async () => {
    const {currency, updateInterval, saveToDB = false} = config.price
    const _updateInterval = parseTime(updateInterval)

    try {
        let data = await get_price_info(currency)

        if (Array.isArray(data)) {
            data[0].currency = currency
            data[0].delta = data[0].current_price - (cache.price ? cache.price.current_price : 0)
            cache.price = data[0]
            //broadcast.price = data[0]

            // if (saveToDB) query(`
            //     insert into price (currency, value, timestamp, provider)
            //     values ($1, $2, $3, $4)
            // `, [currency, data[0].current_price, data[0].last_updated, 'coingecko.com'])
        }
    } finally {
        setTimeout(cache_price_info, _updateInterval)
    }
}

export const cache_transaction_in_pool = async () => {
    cache.pool = await ql_get_transaction_in_pool()
    setTimeout(cache_transaction_in_pool, parseTime("30s"))
}