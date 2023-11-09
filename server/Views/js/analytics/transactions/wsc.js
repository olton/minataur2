globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("block_analytics", {distance})
            break
        }
        case "block_analytics": {
            drawCharts(data)
            break
        }
        case "new_block": {
            request("block_analytics", {distance})
        }
    }
}