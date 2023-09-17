;
globalThis.requestSent = false
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
            request("accounts", createAccountsRequest())
            break
        }
        case "accounts": {
            updateAccountsTable(data)
            enableElements()
            setTimeout(request, 60000, "price")
            break
        }
    }
}