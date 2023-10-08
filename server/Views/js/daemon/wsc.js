globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("daemon")
            break
        }
        case "daemon": {
            updateDaemonStatus(data)
            setTimeout(()=>{
                request("daemon")
            }, 60000)
            break
        }
    }
}