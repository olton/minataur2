globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("user_transactions", createTransRequest())
            request("block_stats")
            break
        }
        case "new_block": {
            request("block_stats")
            break
        }
        case "user_transactions": {
            updateTransTable(data)
            updateTransCharts(data.rows)
            enableElements()
            updateInterval = setTimeout(() => {
                clearUpdateInterval()
                request("user_transactions", createTransRequest())
            }, 60000)
            break
        }
        case "block_stats": {
            updateChartTransInBlock(data)
            break
        }
    }
}