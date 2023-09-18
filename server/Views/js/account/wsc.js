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
            updateAccount(data)
            setTimeout(request, 60000, "price")
            break
        }
    }
}