globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("blocks", createBlockRequest())
            break
        }
        case "new_block": {
            if (+blocksPage === 1) request("blocks", createBlockRequest())
            break
        }
        case "blocks": {
            updateBlocksTable(data)
            updateBlockchainCharts(data)
            enableElements()
            break
        }
    }
}