;
const updateBlockTransactions = data => {

}

const updateBlockInfo = data => {
    console.log(data)
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
    } = data

    $("#block-height").html(num2fmt(height))
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
    $("#block-producer").html(`<a href="/address/${creator_key}">${shorten(creator_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${creator_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-producer-name").html(creator_name)
    $("#block-winner").html(`<a href="/address/${block_winner_key}">${shorten(block_winner_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${block_winner_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-winner-name").html(block_winner_name)
    $("#block-coinbase-receiver").html(`<a href="/address/${coinbase_receiver_key}">${shorten(coinbase_receiver_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${coinbase_receiver_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-coinbase-receiver-name").html(coinbase_receiver_name)

    const chainStatus = $("#chain-status-icon").removeClass("fg-red fg-green fg-cyan")
    let chainStatusClass = "fg-cyan"
    if (chain_status === 'canonical') {
        chainStatusClass = "fg-green"
    } else if (chain_status === 'orphaned') {
        chainStatusClass = "fg-red"
    }
    chainStatus.addClass(chainStatusClass)
}