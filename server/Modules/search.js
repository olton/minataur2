import {query} from "./postgres.js";

export const search = async data => {
    const isAccount = data.startsWith("B62q")
    const isTxHash = data.startsWith("5J")
    const isBlockHash = data.startsWith("3N")
    const isBlockNumber = Number.isInteger(+data)
    const isOther = !isAccount && !isTxHash && !isBlockHash && !isBlockNumber

    let result

    console.log(isAccount, isTxHash, isBlockHash, isBlockNumber, isOther)

    if (isAccount || isOther) {
        result = await query(`
            select * 
            from v_accounts 
            where key = $1
            or lower(name) like '%' || $1 || '%'
            or site like '%' || $1 || '%'
            or telegram like '%' || $1 || '%'
            or twitter like '%' || $1 || '%'
            or github like '%' || $1 || '%'
            or discord like '%' || $1 || '%'
        `, [data])
        return {accounts: result.rows}
    }
    if (isBlockHash || isBlockNumber) {
        result = await query(`
            select *
            from v_blocks
            where height = $1
            or hash = $2
        `, [+data, ""+data])
        return {blocks: result.rows}
    }
    if (isTxHash) {
        result = await query(`
            select * 
            from v_user_transactions
            where hash = $1
        `, [data])
        return {transactions: result.rows}
    }
    return null
}