globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("trans_info", {hash: transHash})
            break
        }
        case "new_block": {
            request("trans_info", {hash: transHash})
            break
        }
        case "trans_info": {
            updateTransData(data)
            break
        }
    }
}