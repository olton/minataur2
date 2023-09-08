globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("block_info", {hash: blockHash})
            break
        }
        case "new_block": {
            request("block_info", {hash: blockHash})
            break
        }
        case "block_info": {
            updateBlockInfo(data)
            request("block_trans", {block_id: data.id})
            request("block_internal_commands", {block_id: data.id})
            request("block_zkapp_commands", {block_id: data.id})
            break
        }
        case "block_trans": {
            updateBlockTransactions(data)
            break
        }
        case "block_internal_commands": {
            updateBlockInternalCommands(data)
            break
        }
        case "block_zkapp_commands": {
            updateBlockZkAppCommands(data)
            break
        }
    }
}