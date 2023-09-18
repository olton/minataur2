;

const updateAccount = data => {
    console.log(data)
    const {db, ql} = data
    const [mina, dec_mina] = (""+normMina(db.balance)).split(".")
    const [usd, dec_usd] = (""+(normMina(db.balance) * globalThis.price.current_price).toFixed(4)).split(".")

    $("#account-hash").html(shorten(db.key, 12) + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db.key}"></span>`)
    $("#account-block").html(db.block_hash ? `<a href="${db.block_hash ? '/block/'+db.block_hash : '#'}">${shorten(db.block_hash, 12)}</a>` + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db.block_hash}"></span>` : UNKNOWN)
    $("#block-date").html(db.timestamp ? datetime(+db.timestamp).format(config.format.datetime) : 'UNKNOWN')
    $("#account-balance").html(num2fmt(mina, ",") + `<span class="reduce-2 text-muted">.${dec_mina}</span>`)
    $("#account-balance-usd").html("~ $" + num2fmt(usd, ",") + `<span class="reduce-2 text-muted">.${dec_usd}</span>`)
    $("#account-rate-usd").html(globalThis.price.current_price)
    $("#balance-liquid").html(num2fmt(normMina(ql.balance.liquid), ","))
    $("#balance-locked").html(num2fmt(normMina(ql.balance.locked), ","))

    $("#account-name").html(db.name)
    $("#account-site").html(db.site || UNKNOWN)
    $("#account-telegram").html(db.telegram || UNKNOWN)
    $("#account-twitter").html(db.twitter || UNKNOWN)
    $("#account-github").html(db.github || UNKNOWN)
    $("#account-discord").html(db.discord || UNKNOWN)

    if (+ql.balance.locked !== 0) {
        $("#account-balance-locked").show()
    }

    $("#account-nonce").html(num2fmt(ql.nonce))
    $("#account-inferred-nonce").html(num2fmt(ql.inferredNonce))
    $("#account-receipt-chain-hash").html(shorten(ql.receiptChainHash, 12) + `<span class="ml-2 mif-copy c-pointer copy-to-clipboard" data-value="${ql.receiptChainHash}"></span>`)
    $("#account-voting-for").html(shorten(ql.votingFor, 12) + `<span class="ml-2 mif-copy c-pointer copy-to-clipboard" data-value="${ql.votingFor}"></span>`)



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