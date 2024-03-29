import {
    db_get_block_stats,
    db_get_block_stats_avg,
    db_get_blocks_crt,
    db_get_blocks_short,
    db_get_dispute,
    db_get_epoch, db_get_hard_fork_block, db_get_last_canonical_block
} from "./db.js";
import {parseTime} from "../Helpers/parsers.js";
import {get_price_info} from "./price.js"
import {
    ql_get_peers,
    ql_get_runtime,
    ql_get_snark_pool,
    ql_get_transaction_in_pool,
    ql_get_version
} from "./graphql.js";
import {testPort} from "../Helpers/test-port.js";
import {ip_location_batch} from "../Helpers/ip-location.js";
import {exec_mina_client_status} from "./shell.js";
import {query} from "./postgres.js";

export const cache_graphql_state = async () => {
    cache.state = await ql_get_version()
    setTimeout(cache_graphql_state, 10000)
}

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

            const {last_updated, low_24h, high_24h, current_price, total_supply} = data[0]

            query(`
                insert into price (timestamp, low, high, value, total)
                values ($1, $2, $3, $4, $5) on conflict do nothing 
            `, [last_updated, low_24h, high_24h, current_price, total_supply])
        }
    } finally {
        setTimeout(cache_price_info, _updateInterval)
    }
}

export const cache_transaction_in_pool = async () => {
    try {
        cache.pool = await ql_get_transaction_in_pool()
    } finally {
        setTimeout(cache_transaction_in_pool, parseTime("30s"))
    }
}

export const cache_runtime = async () => {
    try {
        cache.runtime = await ql_get_runtime()
    } finally {
        setTimeout(cache_runtime, parseTime('30s'))
    }
}

export const cache_peers = async () => {
    try {
        const peers_request = await ql_get_peers()
        const peers = peers_request ? peers_request.getPeers : []
        const ips = new Set()

        peers.map(async p => {
            p.available = await testPort(p.libp2pPort, {host: p.host})
        })

        for (let p of peers) {
            ips.add(p.host)
        }

        const ips_array = [...ips], ips_parts = Math.ceil(ips_array.length / 100)
        let location = []
        for (let i = 0; i < ips_parts; i++) {
            const _loc = await ip_location_batch(ips_array.slice(i * 100, i * 100 + 100))
            location = [...location, ..._loc]
        }
        cache.peers = {
            peers,
            location
        }
    } finally {
        setTimeout(cache_peers, parseTime('1m'))
    }
}

export const cache_snark_pool = async () => {
    const snarkPool = (await ql_get_snark_pool()).snarkPool
    const pool = {}
    for(let r of snarkPool) {
        if (!pool[r.prover]) {
            pool[r.prover] = {
                workIds,
                fee,
            }
        }
    }
}

export const cache_mina_client_status = () => {
    exec_mina_client_status((res)=>{
        cache.daemon = res
    })
    setTimeout(cache_mina_client_status, parseTime('30s'))
}

export const cache_hard_fork_block = async () => {
    cache.hard_fork_block = await db_get_hard_fork_block()
}