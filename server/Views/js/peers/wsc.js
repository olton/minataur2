globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("peers")
            break
        }
        case "peers": {
            updatePeers(data)
            setTimeout(request, 60000, "peers")
        }
    }
}