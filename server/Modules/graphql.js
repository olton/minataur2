import {log} from "../Helpers/log.js";
import {checkMemoForScam, decodeMemo} from "../Helpers/memo.js";

const fetchGraphQL = async (query, variables = {}) => {
    try {
        const result = await fetch(
            `http://${config.mina.graphql}/graphql`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables,
                })
            }
        )

        return result.ok ? await result.json() : null
    } catch (e) {
        log(`The Request to GraphQL was aborted! ${e.message}`, 'error', e.stack)
        return null
    }
}

const qBalance = `
query ($publicKey: String!) {
  account(publicKey: $publicKey) {
    balance {
      total
      blockHeight
      liquid
      locked
      stateHash
      unknown
    }
  }
}
`;

const qPaymentStatus = `
query ($payment: String!) {
  version
  transactionStatus(payment: $payment)
}
`;

const qTransactionInPool = `
query {
  version
  pooledUserCommands {
    id
    amount
    failureReason
    fee
    from
    hash
    isDelegation
    kind
    memo
    nonce
    to
  }
}
`;

const qTransactionInPoolForAddress = `
query ($publicKey: String!) {
  version
  pooledUserCommands(publicKey: $publicKey) {
    id
    amount
    failureReason
    fee
    from
    hash
    isDelegation
    kind
    memo
    nonce
    to
  }
}
`;

export const ql_get_address_balance = async (address) => {
    let result = await fetchGraphQL(qBalance, {publicKey: address})
    try {
        return result.data.account.balance
    } catch (e) {
        return {
            total: 0,
            blockHeight: 0,
            liquid: 0,
            locked: 0,
            stateHash: "",
            unknown: 0,
            error: e.message
        }
    }
}

export const ql_check_payment_status = async (id) => {
    let result = await fetchGraphQL(qPaymentStatus, {payment: id})
    try {
        return result.data ? result.data.transactionStatus : false
    } catch (e) {
        return false
    }
}

export const ql_get_transaction_in_pool = async (address) => {
    let sql = address ? qTransactionInPoolForAddress : qTransactionInPool
    let result = await fetchGraphQL(sql, {publicKey: address})

    try {

        result = result.data.pooledUserCommands

        result.map((r) => {
            r.memo = decodeMemo(r.memo)
        })

        return result
    } catch (e) {
        return []
    }
}
