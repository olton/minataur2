globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("runtime")
            break
        }
        case "runtime": {
            if (data) {
                updateRuntime(data)
            } else {
                setTimeout(() => {
                    request(channel)
                }, 30000)
            }
            break
        }
    }
}