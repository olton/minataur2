import pg from 'pg'
import {log} from "../server/Helpers/log.js"
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {query} from "../server/Modules/postgres.js";
import {ql_get_account_balance} from "../server/Modules/graphql.js";

const {Pool} = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.dirname(__dirname)
globalThis.config = JSON.parse(fs.readFileSync(path.resolve(root, "server", 'config.json'), 'utf-8'))
const {host: archiveHost = 'localhost:5432', user, database, password} = config.archive
const [host, port] = archiveHost.split(":")

const pool = new Pool({
    user,
    host,
    database,
    password,
    port,
})

pool.on('error', (err, client) => {
    log(`Unexpected error on idle client ${err.message}`, true)
    process.exit(-1)
})

;(async () => {
    const client = await pool.connect()

    log(`Postgres client created successful.`)
    log(`Process started...`)

    try {
        const accounts = (await client.query('select * from public_keys')).rows
        for(let a of accounts) {
            const balance = await ql_get_account_balance(a.value)
            if (balance) {
                const blocks = (await client.query(`select id from blocks where height = $1 and chain_status = 'canonical'`, [+balance.blockHeight - 1])).rows
                if (Array.isArray(blocks) && blocks.length) {
                    log(`Block: ${+balance.blockHeight - 1} :: ${blocks[0].id}, Processed: ${a.value}`)
                    await client.query(`
                        insert into balances (public_key_id, block_id, total, liquid, locked, unknown)
                        values ($1, $2, $3, $4, $5, $6)
                        on conflict do nothing
                    `, [a.id, blocks[0].id, balance.total, balance.liquid, balance.locked, balance.unknown])
                }
            }
        }
    } catch (e) {
        log(e.message)
        log(e.stack)
    } finally {
        client.release()
    }
})().catch( e => log(e.message, 'error', e.stack) )
