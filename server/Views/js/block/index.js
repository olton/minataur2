;
const updateBlockTransactions = data => {
    const target = $("#block-trans-table tbody").clear()
    const rows = drawBlockTransTable(data)
    rows.map( r => target.append(r) )
    $("#user-trans-tab").removeClass("disabled").addClass(data.length ? "" : "disabled")
}

const updateBlockInternalCommands = data => {
    const target = $("#block-internal-commands-table tbody").clear()
    const rows = drawBlockInternalCommandsTable(data)
    rows.map( r => target.append(r) )
    $("#internal-trans-tab").removeClass("disabled").addClass(data.length ? "" : "disabled")
}

const updateBlockZkAppCommands = data => {
    const target = $("#block-zkapp-commands-table tbody").clear()
    const rows = drawBlockZkAppCommandsTable(data)
    rows.map( r => target.append(r) )
    $("#zkapp-trans-tab").removeClass("disabled").addClass(data.length ? "" : "disabled")
}


const updateBlockInfo = data => {
    const {
        height,
        hash,
        timestamp,
        chain_status,
        coinbase,
        epoch_since_genesis,
        epoch_since_hard_fork,
        global_slot_since_genesis,
        global_slot_since_hard_fork,
        slot_in_epoch,
        participants_count,
        block_slots,
        user_trans_count,
        internal_trans_count,
        zkapp_trans_count,
        creator_key,
        creator_name,
        block_winner_key,
        block_winner_name,
        coinbase_receiver_key,
        coinbase_receiver_name,
        version,
        staking_epoch_length,
        staking_epoch_seed,
        staking_epoch_start_checkpoint,
        staking_epoch_lock_checkpoint,
        staking_epoch_total_currency,
        next_epoch_length,
        next_epoch_seed,
        next_epoch_start_checkpoint,
        next_epoch_lock_checkpoint,
        next_epoch_total_currency,
        vrf_output,
        snarked_ledger_hash,
        parent_hash,
        distance,
        block_total_currency
    } = data

    $("#block-height").html(num2fmt(height))
    $("#block-version").html(`v${version}`)
    $("#block-hash").html(`${shorten(hash, 10)} <span title="Copy hash to clipboard" data-value="${hash}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-date").html(datetime(+timestamp).format(config.format.datetime))
    $("#chain-status").html(chain_status)
    $("#block-coinbase").html(coinbase/10**9)
    $("#block-epoch-genesis").html(epoch_since_genesis)
    $("#block-epoch-hard-fork").html(epoch_since_hard_fork)
    $("#block-slot-genesis").html(global_slot_since_genesis)
    $("#block-slot-hard-fork").html(global_slot_since_hard_fork)
    $("#block-slot").html(slot_in_epoch)
    $("#block-participants").html(participants_count)
    $("#block-timelapse").html(block_slots * 3 + '<span class="ml-1 reduce-4">min</span>')
    $("#block-slots").html(`SLOTS: ${block_slots}`)
    $("#block-user-trans").html(user_trans_count)
    $("#block-internal-trans").html(internal_trans_count)
    $("#block-zkapp-trans").html(zkapp_trans_count)
    $("#block-producer").html(`<a href="/account/${creator_key}">${shorten(creator_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${creator_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-producer-name").html(creator_name)
    $("#block-winner").html(`<a href="/account/${block_winner_key}">${shorten(block_winner_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${block_winner_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-winner-name").html(block_winner_name)
    $("#block-coinbase-receiver").html(`<a href="/account/${coinbase_receiver_key}">${shorten(coinbase_receiver_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${coinbase_receiver_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-coinbase-receiver-name").html(coinbase_receiver_name)
    $("#staking-epoch-length").html(num2fmt(staking_epoch_length))
    $("#staking-epoch-seed").html(shorten(staking_epoch_seed, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${staking_epoch_seed}"></span>`)
    $("#staking-epoch-start-checkpoint").html(shorten(staking_epoch_start_checkpoint, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${staking_epoch_start_checkpoint}"></span>`)
    $("#staking-epoch-lock-checkpoint").html(shorten(staking_epoch_lock_checkpoint, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${staking_epoch_lock_checkpoint}"></span>`)
    $("#staking-epoch-total-currency").html(num2fmt(normMina(staking_epoch_total_currency).toFixed(0), ",") + `<small class="ml-2 text-muted">mina</small>`)
    $("#next-epoch-length").html(num2fmt(next_epoch_length))
    $("#next-epoch-seed").html(shorten(next_epoch_seed, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${next_epoch_seed}"></span>`)
    $("#next-epoch-start-checkpoint").html(shorten(next_epoch_start_checkpoint, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${next_epoch_start_checkpoint}"></span>`)
    $("#next-epoch-lock-checkpoint").html(shorten(next_epoch_lock_checkpoint, 10) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${next_epoch_lock_checkpoint}"></span>`)
    $("#next-epoch-total-currency").html(num2fmt(normMina(next_epoch_total_currency).toFixed(0), ",") + `<small class="ml-2 text-muted">mina</small>`)
    $("#vrf-output").html(shorten(vrf_output, 14) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${vrf_output}"></span>`)
    $("#snarked-ledger-hash").html(shorten(snarked_ledger_hash, 14) + `<span class="mif-copy copy-data-to-clipboard ml-2" data-value="${snarked_ledger_hash}"></span>`)
    $("#parent-hash").html(`<a href="/block/${parent_hash}">${shorten(parent_hash, 10)}</a> <span title="Copy hash to clipboard" data-value="${parent_hash}" class="mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#blockchain-distance").html(distance + `<span class="ml-1 reduce-4 text-muted">block(s)</span>`)
    $("#blockchain-total-currency").html(num2fmt(normMina(block_total_currency), ",") + ` <span class="text-muted reduce-2">mina</span>`)

    const chainStatus = $("#chain-status-icon").removeClass("fg-red fg-green fg-cyan")
    let chainStatusClass = "fg-cyan"
    if (chain_status === 'canonical') {
        chainStatusClass = "fg-green"
    } else if (chain_status === 'orphaned') {
        chainStatusClass = "fg-red"
    }
    chainStatus.addClass(chainStatusClass)

    $("#qrcode").clear()
    new QRCode("qrcode", {
        text: window.location.href,
        width: 64,
        height: 64,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    })
}