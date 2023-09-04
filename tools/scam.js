import pg from 'pg'
import {log} from "../server/Helpers/log.js"
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import fetch from "node-fetch";
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

;(async () => {
    const client = await pool.connect()
    const providersLink = `https://api.staketab.com/mina/scam`

    log(`Postgres client created successful.`)
    log(`Process started...`)

    try {
        const request = await fetch(providersLink)
        if (!request.ok) {
            client.release()
            log(`Process finished with error! Bad request to Repo!`)
            process.exit(-1)
        }

        const providers = await request.json()
        await client.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED")
        await client.query("update providers set scammer = 0")
        for(let p of providers.scam_addresses) {
            let res = await client.query(`select id from public_keys where value = $1`, [p.address])
            let key_id = !res.rows.length || !isset(res.rows[0].id, true) ? false : res.rows[0].id
            if (!key_id) {
                res = await client.query(`insert into public_keys (value) values ($1) returning id`, [p.address])
                key_id = res.rows[0].id
            }
            await client.query(`update providers set scammer = 1 where public_key_id = $1`, [key_id])
            log(`Address processed: ${p.address}`)
        }

        await client.query("COMMIT")

        log("Providers loaded successfully!")
    } catch (e) {
        await client.query("ROLLBACK")
        log("Error, transaction was rolled back!")
        log(e.message)
        log(e.stack)
    } finally {
        client.release()
        log(`Process finished! Enjoy...`)
    }
})().catch( e => log(e.message, 'error', e.stack) )
