import {log} from "../Helpers/log.js";
import {decodeMemo} from "../Helpers/memo.js";

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
query ($publicKey: String!, $token: String!) {
  account(publicKey: $publicKey, token: $token) {
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
query ($publicKey: String!, $token: String!) {
  account(publicKey: $publicKey, token: $token) {
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

const qSnarkPool = `
query MyQuery {
  snarkPool {
    workIds
    prover
    fee
  }
}
`

const qZkappPool = `
query MyQuery {
  pooledZkappCommands {
    id
    hash
    zkappCommand {
      memo
      feePayer {
        authorization
        body {
          fee
          nonce
          publicKey
          validUntil
        }
      }
      accountUpdates {
        body {
          actions
          publicKey
          tokenId
          incrementNonce
          implicitAccountCreationFee
          events
          callDepth
          callData
          useFullCommitment
          authorizationKind {
            isProved
            isSigned
            verificationKeyHash
          }
          balanceChange {
            magnitude
            sgn
          }
        }
      }
    }
    failureReason {
      failures
      index
    }
  }
}
`

const qSnarkJobs = `
query ($height: Int!) {
  block(height: $height) {
    snarkJobs {
      fee
      prover
      workIds
    }
  }
}
`

const qMinaVersion = `
query MyQuery {
  version
}
`

export const ql_get_version = async () => {
    try {
        let result = await fetchGraphQL(qMinaVersion)
        if (!result.data) {
            new Error(`No data!`)
        }
        return result.data.version
    } catch (e) {
        return null
    }
}
export const ql_get_snark_jobs = async (height = 1) => {
    try {
        let result = await fetchGraphQL(qSnarkJobs, {height})
        if (!result.data) {
            new Error(`No jobs!`)
        }
        return result.data.block.snarkJobs
    } catch (e) {
        return null
    }
}

export const ql_get_account_info = async (publicKey, token = 'wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf') => {
    try {
        let result = await fetchGraphQL(qAccountInfo, {publicKey, token})
        if (!result.data) {
            new Error(`No account data!`)
        }
        return result.data.account
    } catch (e) {
        return null
    }
}

export const ql_get_snark_pool = async () => {
    try {
        let result = await fetchGraphQL(qSnarkPool)
        if (!result.data) {
            new Error(`No data!`)
        }
        return result.data
    } catch (e) {
        return null
    }
}

export const ql_get_zkapp_pool = async () => {
    try {
        let result = await fetchGraphQL(qZkappPool)
        if (!result.data) {
            new Error(`No data!`)
        }
        return result.data.pooledZkappCommands
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



export const ql_get_account_balance = async (publicKey, token = 'wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf') => {
    try {
        let result = await fetchGraphQL(qBalance, {publicKey, token})
        return result.data.account.balance
    } catch (e) {
        return null
    }
}

export const ql_check_payment_status = async (payment) => {
    try {
        let result = await fetchGraphQL(qPaymentStatus, {payment})
        return result.data ? result.data.transactionStatus : false
    } catch (e) {
        return false
    }
}

export const ql_get_transaction_in_pool = async (publicKey) => {
    try {
        let sql = publicKey ? qTransactionInPoolForAddress : qTransactionInPool
        let result = await fetchGraphQL(sql, {publicKey})

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