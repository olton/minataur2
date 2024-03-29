;

const updateRuntime = data => {
    if (data) {
        $("#version").html(shorten(data.version, 7) + `<span class="ml-auto text-muted reduce-2">${data.runtimeConfig.ledger.name}</span>`)
        $("#genesis-timestamp").html(datetime(data.genesisConstants.genesisTimestamp).format(config.format.datetime))
        $("#coinbase").html(normMina(data.genesisConstants.coinbase))
        $("#supercharge").html(normMina(data.genesisConstants.coinbase * data.runtimeConfig.proof.supercharged_coinbase_factor))
    }
}

const updateHardForkBlock = data => {
    if (data) {
        $("#hard_fork_block_height").html(`<a class="link" href="/block/${data.state_hash}">${num2fmt(data.height)}</a>`)
        $("#hard_fork_block_timestamp").html(datetime(+data.timestamp).format(config.format.datetime))
    }
}

const updateEpoch = ({active_producers, block_time, epoch_blocks, height, epoch_since_genesis, epoch_since_hard_fork, epoch_start_block, current_slot, global_slot_since_genesis, global_slot_since_hard_fork} = {}) => {
    if (typeof height === "undefined") return
    const epochTimer = $("#epoch-timer")
    const epochEnd = datetime(HARD_FORK_START).addSecond(EPOCH_DURATION/1000 * (+epoch_since_hard_fork + 1))
    const epochEndFormatted = epochEnd.format("MM/DD/YYYY HH:mm")

    $("#current-epoch-number").html(`${epoch_since_genesis}<span class="">/${epoch_since_hard_fork}</span>`)
    $("#epoch-stop").html(epochEnd.format(config.format.datetime))

    if (epochTimer.attr("data-date") !== epochEndFormatted) {
        const countdown = Metro.getPlugin("#epoch-timer", "countdown")
        countdown.resetWith(epochEndFormatted)
    }

    $("#height").html(num2fmt(height))
    $("#start_block").html(num2fmt(epoch_start_block))
    $("#global-slot-genesis").html(num2fmt(global_slot_since_genesis))
    $("#global-slot-hard-fork").html(num2fmt(global_slot_since_hard_fork))
    $("#current-slot").html(num2fmt(current_slot))
    $("#blocks-produced").html(num2fmt(epoch_blocks))
    $("#height-time").html(datetime(+block_time).format(config.format.datetime))
    $("#active-producers").html(num2fmt(active_producers))
    $("#epoch-slot").html(`${current_slot} of 7140`)
    $("#global-slot").html(`${num2fmt(global_slot_since_genesis)} / ${num2fmt(global_slot_since_hard_fork)}`)

    const epochDurationProgress = Math.round((+current_slot * SLOT_DURATION * 100) / EPOCH_DURATION)
    const progress = Metro.getPlugin('#epoch-progress', 'progress')

    progress.val(epochDurationProgress)
}

const updateDispute = data => {
    if (!data) return

    const target = $("#dispute-blocks-table tbody").clear()
    const rows = drawBlocksTable(data, 'dispute')
    rows.map( r => target.append(r) )
    $("#dispute-block-participants").html(rows.length)
}

const updateChain = data => {
    if (!data) return

    const target = $("#canonical-blocks-table tbody").clear()
    const rows = drawBlocksTable(data, 'canonical')
    rows.map( r => target.append(r) )
    $("#canonical-chain-length").html(rows.length)
}

const updatePrice = (data) => {
    if (!data) return

    const {current_price, currency, last_updated, total_supply, delta} = data

    $("#mina-price").html(current_price.toFixed(4))
    $("#mina-price-currency").html(currency)
    $("#mina-price-update").html(datetime(last_updated).format(config.format.datetime))
    $("#mina-total-supply").html(Math.round(total_supply).format(0, null, " ", "."))
}

const updatePool = data => {
    if (!data) return
    $("#pool-size").html(num2fmt(data.length))
}

const updateBlockStatsAvg = data => {
    if (!data) return
    const {avg_slots, avg_user_trans_count, avg_trans_fee, avg_time} = data
    $("#avg-slots").html((+avg_slots).toFixed(2))
    $("#avg-time").html((+avg_time).toFixed(2))
    $("#avg-trans").html((+avg_user_trans_count).toFixed(2))
    $("#avg-fee").html(normMina(+avg_trans_fee))
}

const updateBlocksCrt = data => {
    if (!data) return
    $("#blocks-crt").html(num2fmt(data) + "%")
}

const updateLastCanonicalBlock = data => {
    if (!data) return
    $("#height-slot").html(num2fmt(data.slot))
    $("#height-slot-global").html("("+num2fmt(data.global_slot_since_genesis) + " / " + num2fmt(data.global_slot_since_hard_fork)+")")
}