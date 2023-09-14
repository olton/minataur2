globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("transactions_pool", createPoolRequest())
            break
        }
        case "transactions_pool": {
            updateTransTable(data)
            //enableElements()
            updateInterval = setTimeout(() => {
                clearUpdateInterval()
                request(channel, createPoolRequest())
            }, 30000)
            break
        }
    }
}