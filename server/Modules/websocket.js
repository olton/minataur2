import WebSocket, {WebSocketServer} from "ws";
import {
    db_get_account_delegators,
    db_get_account_delegators_count,
    db_get_account_info,
    db_get_account_ledger,
    db_get_account_stake,
    db_get_accounts,
    db_get_accounts_count,
    db_get_block_info,
    db_get_block_internal_commands,
    db_get_block_trans,
    db_get_block_zkapp_commands,
    db_get_blocks,
    db_get_blocks_count,
    db_get_blocks_count_for_account,
    db_get_blocks_for_account,
    db_get_coinbase,
    db_get_coinbase_count,
    db_get_trans_info,
    db_get_transactions,
    db_get_transactions_count,
    db_get_transactions_count_for_account,
    db_get_transactions_for_account,
    db_get_zkapps,
    db_get_zkapps_count,
    db_save_ip
} from "./db.js";
import {ql_get_account_info, ql_get_pool} from "./graphql.js";

export const create_websocket_server = (httpServer) => {
    globalThis.wss = new WebSocketServer({ server: httpServer })

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        db_save_ip(ip)

        ws.send(JSON.stringify({
            channel: "welcome",
            data: `Welcome to Minataur2 v${packageJson.version}`
        }))

        ws.on('message', async (msg) => {
            const {channel, data} = JSON.parse(msg)

            switch (channel) {
                case "ping": {
                    response(ws, channel, "pong")
                    break
                }
                case "runtime": {
                    response(ws, channel, cache.runtime)
                    break
                }
                case "epoch": {
                    response(ws, channel, cache.epoch)
                    break
                }
                case "dispute": {
                    response(ws, channel, cache.dispute)
                    break
                }
                case "canonical": {
                    response(ws, "canonical", cache.canonical)
                    break
                }
                case "last_canonical_block": {
                    response(ws, channel, cache.last_canonical_block)
                    break
                }
                case "price": {
                    response(ws, channel, cache.price)
                    break
                }
                case "block_stats": {
                    response(ws, channel, cache.block_stats)
                    break
                }
                case "blocks_crt": {
                    response(ws, "blocks_crt", cache.blocks_crt)
                    break
                }
                case "block_stats_avg": {
                    response(ws, channel, cache.block_stats_avg)
                    break
                }
                case "pool": {
                    response(ws, channel, cache.pool)
                    break
                }
                case "transactions_pool": {
                    response(ws, channel, ql_get_pool({...data}))
                    break
                }
                case "blocks": {
                    const recordsCount = await db_get_blocks_count({ ...data })
                    const recordsData = await db_get_blocks({ ...data })
                    response(ws, channel, {rows: recordsData, length: recordsCount})
                    break
                }
                case "block_info": {
                    response(ws, channel, await db_get_block_info(data.hash))
                    break
                }
                case "block_trans": {
                    response(ws, channel, await db_get_block_trans(data.block_id))
                    break
                }
                case "block_internal_commands": {
                    response(ws, channel, await db_get_block_internal_commands(data.block_id))
                    break
                }
                case "block_zkapp_commands": {
                    response(ws, channel, await db_get_block_zkapp_commands(data.block_id))
                    break
                }
                case "user_transactions": {
                    const recordsData = await db_get_transactions({...data})
                    const recordsCount = await db_get_transactions_count({...data})
                    response(ws, channel, {rows: recordsData, length: recordsCount})
                    break
                }
                case "trans_info": {
                    response(ws, channel, await db_get_trans_info(data.hash))
                    break
                }
                case "accounts": {
                    const recordsCount = await db_get_accounts_count({...data})
                    const recordsData = await db_get_accounts({...data})
                    response(ws, channel, {rows: recordsData, length: recordsCount})
                    break
                }
                case "account_info": {
                    const db = await db_get_account_info(data.hash)
                    const ql = await ql_get_account_info(data.hash)
                    response(ws, channel, {db, ql})
                    break
                }
                case "account_transactions": {
                    const recordsData = await db_get_transactions_for_account({...data})
                    const recordsCount = await db_get_transactions_count_for_account({...data})
                    response(ws, channel, {rows: recordsData, length: recordsCount})
                    break
                }
                case "account_blocks": {
                    const recordsData = await db_get_blocks_for_account({...data})
                    const recordsCount = await db_get_blocks_count_for_account({...data})
                    response(ws, channel, {rows: recordsData, length: recordsCount})
                    break
                }
                case "account_ledger": {
                    const staking = await db_get_account_ledger(data.account_id, 'staking')
                    const next = await db_get_account_ledger(data.account_id, 'next')
                    const current_stake = await db_get_account_stake(data.account_id, 'staking')
                    const next_stake = await db_get_account_stake(data.account_id, 'next')
                    response(ws, channel, {staking, next, current_stake, next_stake})
                    break
                }
                case "account_delegators": {
                    const rows = await db_get_account_delegators({...data})
                    const length = await db_get_account_delegators_count({...data})
                    response(ws, channel, {rows, length})
                    break
                }
                case "peers": {
                    response(ws, channel, cache.peers)
                    break
                }
                case "zkapps": {
                    const rows = await db_get_zkapps({...data})
                    const length = await db_get_zkapps_count({...data})
                    response(ws, channel, {rows, length})
                    break
                }
                case "coinbase": {
                    const rows = await db_get_coinbase({...data})
                    const length = await db_get_coinbase_count({...data})
                    response(ws, channel, {rows, length})
                    break
                }
            }
        })
    })
}

export const response = (ws, channel, data) => {
    ws.send(JSON.stringify({
        channel,
        data
    }))
}

export const send_broadcast = (data) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}