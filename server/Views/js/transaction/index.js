;

const updateTransData = data => {
    let {
        hash, command_type,
        amount, fee, memo, status, failure_reason, confirm,
        sender_key, sender_name, receiver_key, receiver_name, fee_payer_key, fee_payer_name,
        height, version, block_hash, block_timestamp, chain_status,
    } = data

    if (!failure_reason) failure_reason = ""

    $("#block-height").html(num2fmt(height))
    $("#block-version").html(`v${version}`)
    $("#block-hash").html(`<a href="/block/${block_hash}">${shorten(block_hash, 10)}</a> <span title="Copy hash to clipboard" data-value="${block_hash}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#block-date").html(datetime(+block_timestamp).format(config.format.datetime))
    $("#chain-status").html(chain_status)

    $("#trans-type").html(command_type)
    $("#trans-hash").html(`${shorten(hash, 10)} <span title="Copy hash to clipboard" data-value="${hash}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#trans-sender").html(`<a href="/address/${sender_key}">${shorten(sender_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${sender_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#trans-sender-name").html(sender_name)
    $("#trans-receiver").html(`<a href="/address/${receiver_key}">${shorten(receiver_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${receiver_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#trans-receiver-name").html(receiver_name)
    $("#trans-fee-payer").html(`<a href="/address/${fee_payer_key}">${shorten(fee_payer_key, 10)}</a> <span title="Copy hash to clipboard" data-value="${fee_payer_key}" class="ml-2 mif-copy copy-data-to-clipboard c-pointer"></span>`)
    $("#trans-fee-payer-name").html(fee_payer_name)
    $("#trans-amount").html(normMina(amount))
    $("#trans-fee").html(normMina(fee))
    $("#trans-memo").html(`${memo}`)
    $("#trans-alert").html(`${failure_reason.replaceAll('_', ' ')}`)
    $("#trans-status").html(`${status}`)
    $("#trans-confirm").html(`${confirm} <span class="reduce-4 ml-auto">blocks</span>`)
    $("#trans-amount-usd").html(`${(normMina(amount) * globalThis.price.current_price).toFixed(4)} <span class="text-muted reduce-2">USD</span>`)
    $("#trans-fee-usd").html(`${(normMina(fee) * globalThis.price.current_price).toFixed(4)} <span class="text-muted reduce-2">USD</span>`)

    const chainStatus = $("#chain-status-icon").removeClass("fg-red fg-green fg-cyan")
    let chainStatusClass = "fg-cyan"
    if (chain_status === 'canonical') {
        chainStatusClass = "fg-green"
    } else if (chain_status === 'orphaned') {
        chainStatusClass = "fg-red"
    }
    chainStatus.addClass(chainStatusClass)

    $("#trans-status").removeClass("fg-red fg-green fg-cyan")
    const transStatus = $("#trans-status-icon").removeClass("fg-red fg-green fg-cyan")
    let transStatusClass = "fg-cyan"
    if (status === 'applied') {
        transStatusClass = "fg-green"
    } else if (status === 'failed') {
        transStatusClass = "fg-red"
    }
    transStatus.addClass(transStatusClass)
    $("#trans-status").addClass(transStatusClass)


    $("#trans-alert").parents(".container-fluid").show()
    if (status !== 'failed') {
        $("#trans-alert").parents(".container-fluid").hide()
    }

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