import pg from 'pg'
import fs from 'fs'
import path from "path"
import {log} from "../server/Helpers/log.js"
import {isset} from "../server/Helpers/isset.js"
import {panic} from "../server/Helpers/panic.js"
import {get_arguments} from "../server/Helpers/arguments.js"
import {fileURLToPath} from "url";

globalThis.args = get_arguments()

if (args.help) {
    log(`Ledger loader v0.1.0. Copyright 2022 by Serhii Pimenov`)
    log(`Use argument --file to specify ledger file name`)
    log(`Use argument --epoch to specify epoch number`)
}

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

;(async () => {
    let processed = 0
    const client = await pool.connect()
    log(`Postgres client created successful.`)
    log(`Process started...`)

    const save = async (data) => {
        try {
            let res, key_id, delegate_key_id, sqlInsertLedger, insertLedgerData, token_id
            const {
                pk,
                balance = 0,
                delegate,
                timing,
                token,
                receipt_chain_hash,
                voting_for,
                permissions,
                token_symbol,
                nonce = 0
            } = data
            log(`Processed key ${data.pk}`)
            res = await client.query(`select id from public_keys where value = $1`, [pk])
            key_id = !res.rows.length || !isset(res.rows[0].id, true) ? false : res.rows[0].id
            if (!key_id) {
                res = await client.query(`insert into public_keys (value) values ($1) returning id`, [pk])
                key_id = res.rows[0].id
            }

            if (pk !== delegate) {
                res = await client.query(`select id from public_keys where value = $1`, [delegate])
                delegate_key_id = !res.rows.length || !isset(res.rows[0].id, true) ? false : res.rows[0].id
                if (!delegate_key_id) {
                    res = await client.query(`insert into public_keys (value) values ($1) returning id`, [delegate])
                    delegate_key_id = res.rows[0].id
                }
            } else {
                delegate_key_id = key_id
            }

            res = await client.query(`select id from tokens where value = $1`, [token])
            token_id = res.rows[0].id

            sqlInsertLedger = `
                insert into ledger (
                    public_key_id,
                    balance, 
                    delegate_key_id,
                    nonce,
                    receipt_chain_hash,
                    voting_for,
                    token_id,
                    initial_balance,
                    initial_minimum_balance,
                    cliff_time,
                    cliff_amount,
                    vesting_period,
                    vesting_increment,
                    epoch_since_genesis,
                    epoch_since_hard_fork
                ) 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `

            insertLedgerData = [
                key_id,
                balance * 10**9,
                delegate_key_id,
                +(nonce || 0),
                receipt_chain_hash,
                voting_for,
                token_id,
                !timing ? null : timing.initial_balance ? timing.initial_balance * 10**9 : timing.initial_minimum_balance * 10**9,
                !timing ? null : timing.initial_minimum_balance * 10**9,
                !timing ? null : timing.cliff_time,
                !timing ? null : timing.cliff_amount * 10**9,
                !timing ? null : timing.vesting_period,
                !timing ? null : timing.vesting_increment,
                args.epoch,
                args.epoch,
            ]

            await client.query(sqlInsertLedger, insertLedgerData)
        } catch (e) {
            await client.release()
            log(`Process ${processed} Error import for key ${data.pk}`, 'error', e.stack)
            process.exit(-1)
        }
    }

    try {
        if (args.clear) {
            await client.query(`TRUNCATE table ledger RESTART IDENTITY CASCADE`)
            await client.release()
            log(`Ledger table was cleared.`)
            log(`Postgres client released successful.`)
            process.exit()
        }

        if (!isset(args.epoch)) {
            panic(`You must define a epoch number with argument --epoch`)
        }

        if (args["clear-epoch"] && +args["clear-epoch"] >= 0) {
            await client.query('BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED')
            await client.query(`delete from ledger where epoch_since_genesis = $1`, [args["clear-epoch"]])
            await client.query('COMMIT')
            await client.release()
            log(`Data for epoch ${args["clear-epoch"]} deleted from ledger.`)
            log(`Postgres client released successful.`)
            process.exit()
        }

        if (!isset(args.file)) {
            panic(`You must define a ledger file name with the parameter --file file_name`)
        }

        const ledgerFile = args.file[0] === '.' ? path.resolve(__dirname, args.file) : args.file

        if (!fs.existsSync(ledgerFile)) {
            panic(`Ledger file with name ${ledgerFile()} not exists!`)
        }

        const ledger = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'))

        await client.query('BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED')
        await client.query(`delete from ledger where epoch_since_genesis = $1`, [args.epoch])
        for (let o of ledger) {
            await save(o)
            processed++
        }
        // await saveTiming(ledger[0])
        await client.query('COMMIT')
        log(`Ledger data for epoch ${args.epoch} loaded successful! Processed ${processed} accounts.`)
    } catch (e) {
        await client.query('ROLLBACK')
        log(`Error`, 'error', e.stack)
    } finally {
        await client.release()
        log(`Postgres client released successful.`)
    }

})().catch( e => log(e.message, 'error', e.stack) )
