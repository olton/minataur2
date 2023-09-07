globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("block_info")
            request("block_trans")
            break
        }
        case "new_block": {
            break
        }
        case "block_info": {
            updateBlockInfo(data)
            break
        }
        case "block_trans": {
            updateBlockTransactions(data)
            break
        }
    }
}