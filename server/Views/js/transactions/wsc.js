globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("user_transactions", createTransRequest())
            break
        }
        case "user_transactions": {
            updateTransTable(data)
            enableElements()
            updateInterval = setTimeout(() => {
                clearUpdateInterval()
                request("user_transactions", createTransRequest())
            }, 60000)
            break
        }
    }
}