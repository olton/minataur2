import pg from 'pg'
import {log} from "../server/Helpers/log.js"
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

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
    process.exit(-1)
})

const chainSql = `
WITH RECURSIVE chain AS (
    SELECT id, state_hash, parent_id, height
    FROM blocks
    WHERE state_hash =
          (
              select state_hash
              from blocks
              where height = (select max(height) from blocks)
              limit 1
          )

    UNION ALL

    SELECT b.id, b.state_hash, b.parent_id, b.height
    FROM blocks b
             INNER JOIN chain
                        ON b.id = chain.parent_id AND chain.height <> (select max(height) from blocks where chain_status = 'canonical')
)

SELECT state_hash, height
FROM chain
where height < (select max(height) from blocks)
ORDER BY height asc
`

;(async () => {
    const client = await pool.connect()

    log(`Postgres client created successful.`)
    log(`Process started...`)

    try {
        await client.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED")
        const res = await client.query(chainSql)
        for (let r of res.rows) {
            await client.query(`update blocks set chain_status = 'canonical' where state_hash = $1`, [r.state_hash])
            await client.query(`update blocks set chain_status = 'orphaned' where height = $1 and state_hash != $2`, [r.height, r.state_hash])
            log(`Processed height: ${r.height} for ${r.state_hash}`)
        }
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        log("Error, transaction was rolled back!")
        log(e.message)
        log(e.stack)
    } finally {
        client.release()
    }
})().catch( e => log(e.message, 'error', e.stack) )
