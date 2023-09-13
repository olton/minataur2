import pg from 'pg'
import {log} from "../server/Helpers/log.js"
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {datetime} from "@olton/datetime";
import {parseTime} from "../server/Helpers/parsers.js";
import {uptime, UPTIME_SIDECAR, UPTIME_SNARKWORK} from "../server/Modules/uptime.js";
import {isset} from "../server/Helpers/isset.js";

const {Pool} = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.dirname(__dirname)
const config = JSON.parse(fs.readFileSync(path.resolve(root, "server", 'config.json'), 'utf-8'))
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
    // process.exit(-1)
})

const sidecar_update_interval = parseTime("10m")
const snark_update_interval = parseTime("20m")

const processUpdateSidecarUptime = async () => {
    log(`Start uptime snapshot by Sidecar...`)

    const client = await pool.connect()
    const timestamp = datetime().format("MM/DD/YYYY HH:mm")

    try {
        const result = await uptime(UPTIME_SIDECAR)

        if (result.length) {
            client.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED")
            const sql = `insert into uptime_sidecar(public_key_id, timestamp, position, score, score_percent) values ($1, to_timestamp($2, 'MM/DD/YYYY HH24:MI'), $3, $4, $5)`
            for(let r of result) {
                let res = await client.query(`select id from public_keys where value = $1`, [r.block_producer_key])
                let key_id = !res.rows.length || !isset(res.rows[0].id, true) ? false : res.rows[0].id
                if (!key_id) {
                    res = await client.query(`insert into public_keys (value) values ($1) returning id`, [r.block_producer_key])
                    key_id = res.rows[0].id
                }
                await client.query(sql, [key_id, timestamp, r.position, r.score, r.score_percent])
            }
            client.query("COMMIT")
        } else {
            log(`Empty result for Sidecar`)
        }
        log(`Uptime snapshot by sidecar complete. ${result.length} addresses stored to DB.`)
    } catch (e) {
        log(e.message, "error", e.stack)
        client.query("ROLLBACK")
    } finally {
        await client.release()
        setTimeout(processUpdateSidecarUptime, sidecar_update_interval)
    }
}

const processUpdateSnarkUptime = async () => {
    log(`Start uptime snapshot by Snark..`)

    const client = await pool.connect()
    const timestamp = datetime().format("MM/DD/YYYY HH:mm")

    try {
        const result = await uptime(UPTIME_SNARKWORK)

        if (result.length) {
            client.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED")
            const sql = `insert into uptime_snark(public_key_id, timestamp, position, score, score_percent) values ($1, to_timestamp($2, 'MM/DD/YYYY HH24:MI'), $3, $4, $5)`
            for(let r of result) {
                let res = await client.query(`select id from public_keys where value = $1`, [r.block_producer_key])
                let key_id = !res.rows.length || !isset(res.rows[0].id, true) ? false : res.rows[0].id
                if (!key_id) {
                    res = await client.query(`insert into public_keys (value) values ($1) returning id`, [r.block_producer_key])
                    key_id = res.rows[0].id
                }
                await client.query(sql, [key_id, timestamp, r.position, r.score, r.score_percent])
            }
            client.query("COMMIT")
        } else {
            log(`Empty result for Snark`)
        }
        log(`Uptime snapshot by snark complete. ${result.length} addresses stored to DB.`)
    } catch (e) {
        log(e.message, "error", e.stack)
        client.query("ROLLBACK")
    } finally {
        await client.release()
        setTimeout(processUpdateSnarkUptime, snark_update_interval)
    }
}

const processUptime = async () => {
    setImmediate(processUpdateSidecarUptime)
    setImmediate(processUpdateSnarkUptime)
}

;(async () => {
    try {
        await processUptime()
    } catch (e) {
        log(`Uptime leaderboard update failed!`, `error`, e.stack)
    }
})().catch( e => log(e.message, 'error', e.stack) )
