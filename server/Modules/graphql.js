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

const qRuntime = `
query {
  version
  genesisConstants {
    genesisTimestamp
    coinbase
    accountCreationFee
  }
  runtimeConfig
}
`

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

const qPeers = `
query MyQuery {
  getPeers {
    host
    libp2pPort
    peerId
  }
}
`;

const qAccountInfo = `
query MyQuery {
  account(publicKey: "B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM") {
    nonce
    inferredNonce
    receiptChainHash
    delegate
    votingFor
    locked
    index
    zkappUri
    provedState
    tokenSymbol
    leafHash
    actionState
    balance {
      blockHeight
      liquid
      locked
      stateHash
      total
      unknown
    }
    tokenId
    token
    stakingActive
    verificationKey {
      hash
      verificationKey
    }
    zkappState
    timing {
      vestingPeriod
      vestingIncrement
      initialMinimumBalance
      cliffTime
      cliffAmount
    }
    publicKey
    permissions {
      setZkappUri
      setVotingFor
      setVerificationKey
      setTokenSymbol
      setTiming
      setPermissions
      setDelegate
      send
      receive
      incrementNonce
      editState
      editActionState
      access
    }
    delegators {
      publicKey
      balance {
        blockHeight
        liquid
        locked
        stateHash
        total
        unknown
      }
    }
  }
}
`

export const ql_get_account_info = async key => {
    try {
        let result = await fetchGraphQL(qAccountInfo, {publicKey: key})
        if (!result.data) {
            new Error(`No peers!`)
        }
        return result.data.account
    } catch (e) {
        return null
    }
}

export const ql_get_peers = async () => {
    try {
        let result = await fetchGraphQL(qPeers)
        if (!result.data) {
            new Error(`No peers!`)
        }
        return result.data
    } catch (e) {
        return null
    }
}

export const ql_get_runtime = async () => {
    try {
        let result = await fetchGraphQL(qRuntime)
        if (!result.data) {
            new Error(`No runtime data!`)
        }
        result.data.runtimeConfig.ledger.accounts = null
        return result.data
    } catch (e) {
        return null
    }
}



export const ql_get_address_balance = async (address) => {
    try {
        let result = await fetchGraphQL(qBalance, {publicKey: address})
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
    try {
        let result = await fetchGraphQL(qPaymentStatus, {payment: id})
        return result.data ? result.data.transactionStatus : false
    } catch (e) {
        return false
    }
}

export const ql_get_transaction_in_pool = async (address) => {
    try {
        let sql = address ? qTransactionInPoolForAddress : qTransactionInPool
        let result = await fetchGraphQL(sql, {publicKey: address})

        result = result.data.pooledUserCommands

        result.map((r) => {
            r.memo = decodeMemo(r.memo)
        })

        return result
    } catch (e) {
        return []
    }
}

export const ql_get_pool = ({
    limit,
    offset,
    search
}) => {
    let pool = cache.pool
    if (search) {
        pool = pool.filter( (row) => {
            return row.id.includes(search) || row.hash.includes(search) || row.from.includes(search) || row.to.includes(search)
        })
    }
    const length = pool.length
    return {rows: pool.slice(offset, limit), length}
}