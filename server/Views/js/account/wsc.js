globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("price")
            break
        }
        case "price": {
            globalThis.price = data
            request("account_info", {hash: accountHash})
            break
        }
        case "account_info": {
            globalThis.accountID = data.db.id
            updateAccount(data)
            request("account_transactions", createTransRequest())
            request("account_blocks", createBlockRequest())
            request("account_ledger", {account_id: accountID})
            request("account_stats", {account_id: accountID})
            request("account_delegators", createDelegatorsRequest())
            setTimeout(request, 60000, "price")
            break
        }
        case "account_transactions": {
            updateTransTable(data)
            break
        }
        case "account_blocks": {
            updateBlocksTable(data)
            break
        }
        case "account_ledger": {
            updateAccountLedger(data)
            break
        }
        case "account_delegators": {
            updateDelegatorsTable(data)
            break
        }
        case "account_stats": {
            updateAccountStats(data)
            break
        }
    }
}