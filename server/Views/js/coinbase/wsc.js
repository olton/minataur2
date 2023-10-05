globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("coinbase", createCoinbaseRequest())
            break
        }
        case "new_block": {
            request("coinbase", createCoinbaseRequest())
            break
        }
        case "coinbase": {
            updateCoinbaseTable(data)
            break
        }
    }
}