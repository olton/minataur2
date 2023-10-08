;

globalThis.ledger = {
    staking: null,
    next: null
}

function showWhoisHelp(){
    Metro.dialog.create({
        title: "<span class='mif-help'></span> Whois Help",
        content: `
            <div class="text-small">
            Minataur 2 [For Mina Berkeley] contains a table whois with additional data for accounts such as name, site, discord, etc. 
            To set these fields, you must send a transaction (with a small amount) to the special address 
            <strong>B62qrGrWgsHRp1GuHbz2YSdk7DgXTBYwaov7TwWVP58f36ubAQGJg2E</strong> with a memo where the specified field and value are separated <kbd>:</kbd>. 
            You should take into account that the length of the memo field should not exceed 32 characters.  
            For example: 
            <pre class="mt-2"><code class="bg-light">
mina client send-payment -amount 0.001 -receiver B62q...AQGJg2E -fee 0.08 -memo 'site:domain.com' -sender B62q...
            </code></pre> 
            This command set field site for address <strong>B62q...</strong> to value <strong>domain.com</strong>
            </div>
        `
    })
}

const updateAccount = data => {
    const {db, ql} = data
    const [mina = 0, dec_mina = 0] = (""+normMina(ql ? ql.balance.total : db.balance)).split(".")
    const [usd = 0, dec_usd = 0] = (""+(normMina(ql ? ql.balance.total : db.balance) * globalThis.price.current_price).toFixed(4)).split(".")

    $("#account-hash").html(shorten(db && db.key || ql.publicKey, 12) + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db && db.key || ql.publicKey}"></span> <span data-value="${db && db.key || ql.publicKey}" class="mif-qrcode ml-2 c-pointer"></span>`)
    $("#account-block").html(db.block_hash ? `<a href="${db.block_hash ? '/block/'+db.block_hash : '#'}">${shorten(db.block_hash, 12)}</a>` + `<span class="reduce-1 ml-1 mif-copy c-pointer copy-data-to-clipboard" data-value="${db.block_hash}"></span>` : UNKNOWN)
    $("#block-date").html(db && db.timestamp ? datetime(+db.timestamp).format(config.format.datetime) : UNKNOWN)
    $("#account-balance").html(num2fmt(mina, ",") + `<span class="reduce-2 text-muted">.${dec_mina}</span>`)
    $("#account-balance-usd").html("~ $" + num2fmt(usd, ",") + `<span class="reduce-2 text-muted">.${dec_usd}</span>`)
    $("#account-rate-usd").html(globalThis.price.current_price)

    const [liquid = 0, liquid_dec = 0] = normMina(ql ? ql.balance.liquid : 0, "string").split(".")
    const [locked = 0, locked_dec = 0] = normMina(ql ? ql.balance.locked : 0, "string").split(".")
    $("#balance-liquid").html(`${num2fmt(liquid, ",")}.<span class="reduce-3">${liquid_dec}</span>`)
    $("#balance-locked").html(`${num2fmt(locked, ",")}.<span class="reduce-3">${locked_dec}</span>`)

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
    const nextTime = datetime(HARD_FORK_START).addSecond(cliff_time * (SLOT_DURATION/1000))

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
    $("#account-voting-for2").html(data.staking ? shorten(data.staking.voting_for, 12) + `<span class="ml-2 mif-copy c-pointer copy-to-clipboard" data-value="${data.staking.voting_for}"></span>` : UNKNOWN)

    const staking = data.staking
    const next = data.next

    if (staking) {
        $("#staking-ledger").css("opacity", 1)

        const cliffTimeStaking = datetime(HARD_FORK_START).addSecond(staking.cliff_time * (SLOT_DURATION / 1000))

        $("#ledger-staking-balance").html(num2fmt(normMina(nvl(staking.balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-staking-initial-minimum-balance").html(num2fmt(normMina(nvl(staking.initial_minimum_balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-staking-initial-balance").html(num2fmt(normMina(nvl(staking.initial_balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-staking-delegate-key").html(staking.delegate_key === accountHash ? `<span>TO SELF</span>` : `<a href="/account/${staking.delegate_key}">${shorten(staking.delegate_key, 12)}</a><span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${staking.delegate_key}"></span>`)
        $("#ledger-staking-receipt-chain-hash").html(staking.receipt_chain_hash ? shorten(staking.receipt_chain_hash, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${staking.receipt_chain_hash}"></span>` : '')
        $("#ledger-staking-voting-for").html(staking.voting_for ? shorten(staking.voting_for, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${staking.voting_for}"></span>` : '')
        $("#ledger-staking-token").html(staking.token ? shorten(staking.token, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${staking.token}"></span>` : '')
        $("#ledger-staking-nonce").html(num2fmt(nvl(staking.nonce, 0), ","))
        $("#ledger-staking-cliff-amount").html(num2fmt(normMina(nvl(staking.cliff_amount, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-staking-cliff-time").html(staking.cliff_time ? cliffTimeStaking.format(config.format.datetime) : 'NONE')
        $("#ledger-staking-vesting-period").html(staking.vesting_period || 'NONE')
        $("#ledger-staking-vesting-increment").html(staking.vesting_increment || 'NONE')
    } else {
        $("#staking-ledger").css("opacity", .3)
    }

    if (next) {
        $("#next-ledger").css("opacity", 1)

        const cliffTimeNext = datetime(HARD_FORK_START).addSecond(next.cliff_time * (SLOT_DURATION / 1000))

        $("#ledger-next-balance").html(num2fmt(normMina(nvl(next.balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-next-initial-minimum-balance").html(num2fmt(normMina(nvl(next.initial_minimum_balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-next-initial-balance").html(num2fmt(normMina(nvl(next.initial_balance, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-next-delegate-key").html(next.delegate_key === accountHash ? `<span>TO SELF</span>` : `<a href="/account/${next.delegate_key}">${shorten(next.delegate_key, 12)}</a><span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${next.delegate_key}"></span>`)
        $("#ledger-next-receipt-chain-hash").html(next.receipt_chain_hash ? shorten(next.receipt_chain_hash, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${next.receipt_chain_hash}"></span>` : '')
        $("#ledger-next-voting-for").html(next.voting_for ? shorten(next.voting_for, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${next.voting_for}"></span>` : '')
        $("#ledger-next-token").html(next.token ? shorten(next.token, 12) + `<span class="mif-copy ml-1 copy-data-to-clipboard" data-value="${next.token}"></span>` : '')
        $("#ledger-next-nonce").html(num2fmt(nvl(next.nonce, 0), ","))
        $("#ledger-next-cliff-amount").html(num2fmt(normMina(nvl(next.cliff_amount, 0)), ",") + `<span class="text-muted text-small ml-1">mina</span>`)
        $("#ledger-next-cliff-time").html(next.cliff_time ? cliffTimeNext.format(config.format.datetime) : 'NONE')
        $("#ledger-next-vesting-period").html(next.vesting_period || 'NONE')
        $("#ledger-next-vesting-increment").html(next.vesting_increment || 'NONE')
    } else {
        $("#next-ledger").css("opacity", .3)
    }
}

const updateAccountStats = data => {
    const {blocks_canonical, blocks_canonical_epoch, blocks_total, blocks_win, tx_failed, tx_try, tx_sent, tx_received} = data
    $("#account-tx-try").html(num2fmt(tx_try))
    $("#account-tx-fails").html(num2fmt(tx_failed))
    $("#account-tx-sent").html(num2fmt(tx_sent))
    $("#account-tx-received").html(num2fmt(tx_received))
    $("#account-blocks-total").html(num2fmt(blocks_total))
    $("#account-blocks-produced").html("<span class='reduce-6 text-muted'>ALL:</span>"+num2fmt(blocks_canonical))
    $("#account-blocks-produced-epoch").html("<span class='reduce-6 text-muted'>EPOCH:</span>"+num2fmt(blocks_canonical_epoch))
    $("#account-blocks-win").html(num2fmt(blocks_win))
}