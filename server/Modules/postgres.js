import pg from 'pg'
import {log, debug} from "../Helpers/log.js"
import {timestamp} from "../Helpers/timestamp.js"

const { Pool } = pg

const create_pool = () => {
    const {host: archive = 'localhost:5432', user, database, password} = config.archive
    const [host, port] = archive.split(":")

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

    return pool
}

export const create_db_connection = () => {
    globalThis.postgres = create_pool()

    const pool = globalThis.postgres

    pool.query('select now()', (err, res) => {
        if (err) {
            throw err
        }
        log(`DB clients pool created at ${timestamp(res.rows[0].now)}`)
    })
}

export const query = async (q, p) => {
    const client = await globalThis.postgres.connect()
    let result = null

    try {
        const start = Date.now()
        const res = await client.query(q, p)
        const duration = Date.now() - start
        if (config.debug) {
            debug('Executed query', { q, duration: duration + 'ms', rows: res.rowCount })
        }
        result = res
    } catch (e) {
        log(e.message, 'error', config.debug ? e : null)
    } finally {
        client.release()
    }

    return result
}

export const batch = async (a = []) => {
    if (!a.length) return
    const client = await globalThis.postgres.connect()
    let result
    try {
        const start = Date.now()
        client.query("BEGIN")
        for (let q of a) {
            const [sql, par] = q
            await client.query(sql, par)
        }
        client.query("COMMIT")
        const duration = Date.now() - start
        if (config.debug) {
            debug('Executed batch', { duration: duration + 'ms' })
        }
        result = true
    } catch (e) {
        result = false
        client.query("ROLLBACK")
        log(e.message, 'error', config.debug ? e : null)
    } finally {
        client.release()
    }
    return result
}

export const get_client = async () => {
    return await globalThis.postgres.connect()
}
