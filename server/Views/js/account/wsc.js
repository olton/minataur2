globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("account_info", {hash: accountHash})
            break
        }
        case "accounts": {
            updateAccount(data)
            setTimeout(() => {
                request("account_info", {hash: accountHash})
            }, 60000)
            break
        }
    }
}