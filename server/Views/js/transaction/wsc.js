globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("price")
            break
        }
        case "new_block": {
            request("price")
            break
        }
        case "trans_info": {
            updateTransData(data)
            break
        }
        case "price": {
            globalThis.price = data
            request("trans_info", {hash: transHash})
            break
        }
    }
}