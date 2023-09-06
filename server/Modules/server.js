import {send_broadcast} from "./websocket.js";
import {create_db_connection} from "./postgres.js";
import {create_api_server} from "./api.js";
import {create_web_server} from "./webserver.js";
import {
    cache_block_stats, cache_block_stats_avg, cache_blocks_crt,
    cache_canonical_chain,
    cache_dispute,
    cache_epoch, cache_last_canonical_block,
    cache_price_info,
    cache_transaction_in_pool
} from "./cache.js";
import {listen_notifies} from "./db.js";

const init = () => {
    globalThis.broadcast = new Proxy({
    }, {
        set(target, p, value, receiver) {
            const data = {
                data: value,
                channel: p
            }

            send_broadcast(data)

            target[p] = value
            return true
        }
    })

    globalThis.cache = new Proxy({
        price: null,
        pool: [],
        lastBlock: null
    }, {
        set(target, p, value, receiver) {
            target[p] = value
            return true
        }
    })
}

export const run = () => {
    init()

    create_db_connection()
    create_web_server()
    create_api_server()

    cache_price_info()
    cache_epoch()
    cache_dispute()
    cache_canonical_chain()
    cache_block_stats()
    cache_block_stats_avg()
    cache_transaction_in_pool()
    cache_blocks_crt()
    cache_last_canonical_block()

    listen_notifies()
}