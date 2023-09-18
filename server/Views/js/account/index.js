;

const updateAccount = data => {
    console.log(data)
    const {db, ql} = data
    const [mina, dec_mina] = (""+normMina(db.balance)).split(".")
    const [usd, dec_usd] = (""+(normMina(db.balance) * globalThis.price.current_price).toFixed(4)).split(".")

    $("#account-hash").html(shorten(db.key, 12))
    $("#account-block").html(shorten(db.block_hash, 12) || 'UNKNOWN')
    $("#block-date").html(db.timestamp ? datetime(db.timestamp).format(config.format.datetime) : 'UNKNOWN')
    $("#account-balance").html(num2fmt(mina, ",") + `<span class="reduce-2 text-muted">.${dec_mina}</span>`)
    $("#account-balance-usd").html("~ $" + num2fmt(usd, ",") + `<span class="reduce-2 text-muted">.${dec_usd}</span>`)
    $("#account-rate-usd").html(globalThis.price.current_price)

    $("#account-name").html(db.name)
    $("#account-site").html(db.site)
    $("#account-telegram").html(db.telegram)
    $("#account-twitter").html(db.twitter)
    $("#account-github").html(db.github)
    $("#account-discord").html(db.discord)

    if (+ql.balance.locked !== 0) {
        $("#account-balance-locked").show()
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