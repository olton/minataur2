import {debug} from "../Helpers/log.js";
import WebSocket, {WebSocketServer} from "ws";
import {CHAIN_STATUS, db_get_block_info, db_get_blocks, db_get_blocks_count, db_save_ip} from "./db.js";

export const create_websocket_server = (httpServer) => {
    globalThis.wss = new WebSocketServer({ server: httpServer })

    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress

        db_save_ip(ip)

        ws.send(JSON.stringify({
            channel: "welcome",
            data: `Welcome to Minataur2 v${packageJson.version}`
        }))

        ws.on('message', async (msg) => {
            const {channel, data} = JSON.parse(msg)

            switch (channel) {
                case "ping": {
                    response(ws, "ping", "pong")
                    break
                }
                case "epoch": {
                    response(ws, "epoch", cache.epoch)
                    break
                }
                case "dispute": {
                    response(ws, "dispute", cache.dispute)
                    break
                }
                case "canonical": {
                    response(ws, "canonical", cache.canonical)
                    break
                }
                case "last_canonical_block": {
                    response(ws, "last_canonical_block", cache.last_canonical_block)
                    break
                }
                case "price": {
                    response(ws, "price", cache.price)
                    break
                }
                case "block_stats": {
                    response(ws, "block_stats", cache.block_stats)
                    break
                }
                case "blocks_crt": {
                    response(ws, "blocks_crt", cache.blocks_crt)
                    break
                }
                case "block_stats_avg": {
                    response(ws, "block_stats_avg", cache.block_stats_avg)
                    break
                }
                case "pool": {
                    response(ws, "pool", cache.pool)
                    break
                }
                case "blocks": {
                    const recordsCount = await db_get_blocks_count({ ...data })
                    const recordsData = await db_get_blocks({ ...data })
                    response(ws, "blocks", {rows: recordsData, length: recordsCount})
                    break
                }
                case "block_info": {
                    response(ws, "block_info", await db_get_block_info(data.hash))
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