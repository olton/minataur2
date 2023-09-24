;

globalThis.ledger = {
    staking: null,
    next: null
}

const updateAccount = data => {
    const {db, ql} = data
    const [mina = 0, dec_mina = 0] = (""+normMina(ql ? ql.balance.total : db.balance)).split(".")
    const [usd = 0, dec_usd = 0] = (""+(normMina(ql ? ql.balance.total : db.balance) * globalThis.price.current_price).toFixed(4)).split(".")

    $("#account-hash").html(shorten(db && db.key || ql.publicKey, 12) + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db && db.key || ql.publicKey}"></span>`)
    $("#account-block").html(db.block_hash ? `<a href="${db.block_hash ? '/block/'+db.block_hash : '#'}">${shorten(db.block_hash, 12)}</a>` + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db.block_hash}"></span>` : UNKNOWN)
    $("#block-date").html(db && db.timestamp ? datetime(+db.timestamp).format(config.format.datetime) : UNKNOWN)
    $("#account-balance").html(num2fmt(mina, ",") + `<span class="reduce-2 text-muted">.${dec_mina}</span>`)
    $("#account-balance-usd").html("~ $" + num2fmt(usd, ",") + `<span class="reduce-2 text-muted">.${dec_usd}</span>`)
    $("#account-rate-usd").html(globalThis.price.current_price)
    $("#balance-liquid").html(normMina(ql ? ql.balance.liquid : 0), ",")
    $("#balance-locked").html(normMina(ql ? ql.balance.locked : 0), ",")

    $("#account-name").html(db && db.name || UNKNOWN)
    $("#account-site").html(db && db.site || UNKNOWN)
    $("#account-telegram").html(db && db.telegram || UNKNOWN)
    $("#account-twitter").html(db && db.twitter || UNKNOWN)
    $("#account-github").html(db && db.github || UNKNOWN)
    $("#account-discord").html(db && db.discord || UNKNOWN)
    $("#account-description").html(db && db.description || UNKNOWN)

    if (ql && +ql.balance.locked !== 0) {
        $("#account-balance-locked").show()
    } else {
        $("#account-balance-locked").hide()
    }

    $("#account-nonce").html(num2fmt(ql ? ql.nonce : 0))
    $("#account-inferred-nonce").html(num2fmt(ql ? ql.inferredNonce : 0))
    $("#account-receipt-chain-hash").html(ql ? shorten(ql.receiptChainHash, 12) + `<span class="ml-2 mif-copy c-pointer copy-to-clipboard" data-value="${ql.receiptChainHash}"></span>` : UNKNOWN)
    $("#account-voting-for").html(ql ? shorten(ql.votingFor, 12) + `<span class="ml-2 mif-copy c-pointer copy-to-clipboard" data-value="${ql.votingFor}"></span>` : UNKNOWN)

    if (!ql) {
        $("#account-blockchain-alert").show()
    } else {
        $("#account-blockchain-alert").hide()
    }

    $("#blocks-produced").html(db ? num2fmt(db.blocks_produced, ",") : 0)
    $("#blocks-produced-in-current-epoch").html(db ? num2fmt(db.blocks_produced_in_epoch, ",") : 0)
    $("#account-delegators").html(ql ? num2fmt(ql.delegators.length, ",") : 0)

    if (ql && ql.delegate === ql.publicKey) {
        $("#delegate-account").hide()
        $("#stake-size").show()
    } else {
        $("#delegate-account").show()
        $("#stake-size").hide()
        $("#stake-delegated-to").html(ql ? ql.delegate === ql.publicKey ? "TO SELF" : `<a href="/account/${ql.delegate}">${shorten(ql.delegate, 12)}</a><span class="mif-copy ml-2 copy-date-to-clipboard" data-value="${ql.delegate}"></span>` : UNKNOWN)
    }

    const {cliff_time, cliff_amount, vesting_increment, vesting_period} = db
    const genStart = datetime(HARD_FORK_START)
    const nextTime = genStart.addSecond(cliff_time * (SLOT_DURATION/1000))

    if (nextTime.time() > datetime().time()) {
        $("#vesting").hide()
        $("#cliff").show()
        $(`#cliff-amount`).html(num2fmt(cliff_amount / 10 ** 9, ",") + '<span class="ml-1 text-muted text-small">mina</span>')
        $(`#cliff-time`).html(nextTime.format(config.format.datetime))
    } else {
        $("#vesting").show()
        $("#cliff").hide()
        if (+vesting_increment) {
            $("#balance-unlock").html(`
                <span>Unlock <strong>${vesting_increment/10**9}</strong> each <strong>${vesting_period}</strong> slot(s)</span>
            `)
        } else {
            $("#balance-unlock").html(`Nothing to unlock`)
        }
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

const updateAccountLedger = data => {
    $("#account-delegators-staking").html(data.current_stake ? num2fmt(data.current_stake.delegators, ",") : 0)
    $("#account-delegators-next").html(data.next_stake ? num2fmt(data.next_stake.delegators, ",") : 0)
    $("#stake-size-current").html(data.current_stake ? num2fmt(normMina(data.current_stake.stake), ",") : 0)
    $("#stake-size-next").html(data.next_stake ? num2fmt(normMina(data.next_stake.stake), ",") : 0)
}

const updateAccountDelegators = data => {
    console.log(data)
}