;
globalThis.requestSent = false
globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("producers", createProducersRequest())
            break
        }
        case "producers": {
            updateProducersTable(data)
            setTimeout(()=>{
                request("producers", createProducersRequest())
            }, 60000)
            break
        }
    }
}