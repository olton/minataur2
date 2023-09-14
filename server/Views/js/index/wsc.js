globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("runtime")
            request("epoch")
            request("dispute")
            request("canonical")
            request("price")
            request("block_stats")
            request("block_stats_avg")
            request("pool")
            request("blocks_crt")
            request("last_canonical_block")
            break
        }
        case "runtime": {
            updateRuntime(data)
            if (!data) setTimeout(request, 60000, "runtime")
            break
        }
        case "epoch": {
            updateEpoch(data)
            setTimeout(request, 60000, "epoch")
            break
        }
        case "new_block": {
            request("epoch")
            request("dispute")
            request("canonical")
            request("block_stats")
            request("block_stats_avg")
            request("blocks_crt")
            request("last_canonical_block")
            break
        }
        case "dispute": {
            updateDispute(data)
            setTimeout(request, 60000, "dispute")
            break
        }
        case "canonical": {
            updateChain(data)
            setTimeout(request, 60000, "canonical")
            break
        }
        case "price": {
            updatePrice(data)
            setTimeout(request, 60000, "price")
            break
        }
        case "block_stats": {
            updateCharts(data)
            setTimeout(request, 60000, "block_stats")
            break
        }
        case "pool": {
            updatePool(data)
            setTimeout(request, 30000, "pool")
            break
        }
        case "block_stats_avg": {
            updateBlockStatsAvg(data)
            setTimeout(request, 60000, "block_stats_avg")
            break
        }
        case "blocks_crt": {
            updateBlocksCrt(data)
            setTimeout(request, 60000, "blocks_crt")
            break
        }
        case "last_canonical_block": {
            updateLastCanonicalBlock(data)
            setTimeout(request, 60000, "last_canonical_block")
            break
        }
    }
}