globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("zkapps", createZkappsRequest())
            break
        }
        case "zkapps": {
            updateZkappsTable(data)
            updateInterval = setTimeout(() => {
                clearUpdateInterval()
                request("zkapps", createZkappsRequest())
            }, 60000)
            break
        }
    }
}