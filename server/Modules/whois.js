import {decodeMemo} from "../Helpers/memo.js";
import {filters} from "pug";
import {query} from "./postgres.js";

export const MINATAUR_ADDRESS = 'B62qrGrWgsHRp1GuHbz2YSdk7DgXTBYwaov7TwWVP58f36ubAQGJg2E'

/**
 * Update whois account data
 * f1 - sender key
 * f2 - receiver key
 * f3 - memo
 * f4 - amount
 */
export const updateWhois = async ({f1: sender_id, f2: receiver_key, f3, f4: amount}) => {
    try {
        //if (+amount < 1) return
        if (receiver_key !== MINATAUR_ADDRESS) return
        const memo = decodeMemo(f3)
        const fields = ['name', 'site', 'telegram', 'discord', 'email', 'twitter', 'github', 'logo', 'desc']
        const data = memo.split(";")
        const query_fields = []
        for (let part of data) {
            const [field, value] = part.split(":")
            if (!fields.includes(field)) continue
            query_fields.push(`"${field}" = '${value}'`)
        }
        if (query_fields.length === 0) return
        const sender_exists = (await query(`select count(*) as length from whois where public_key_id = $1`, [sender_id])).rows[0].length > 0
        if (!sender_exists) {
            await query(`insert into whois (public_key_id) values ($1)`, [sender_id])
        }
        const sql = `
            update whois
            set ${query_fields.join(", ")}
            where public_key_id = $1
        `
        query(sql, [sender_id])
    } catch (e) {
        return null
    }
}