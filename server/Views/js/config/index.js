;
const updateRuntime = data => {
    $("#version").html(data.version)
    $("#genesis-time").html(datetime(data.genesisConstants.genesisTimestamp).format(config.format.datetime))
    $("#coinbase").html(normMina(data.genesisConstants.coinbase) + '<span class="ml-2 reduce-4">mina</span>')
    $("#account-creation-fee").html(normMina(data.genesisConstants.accountCreationFee) + '<span class="ml-2 reduce-4">mina</span>')

    $("#runtime-ledger-name").html(data.runtimeConfig.ledger.name)

    $("#runtime-genesis-delta").html(data.runtimeConfig.genesis.delta)
    $("#runtime-genesis-timestamp").html(datetime(data.runtimeConfig.genesis.genesis_state_timestamp).format(config.format.datetime))
    $("#runtime-genesis-k").html(data.runtimeConfig.genesis.k)
    $("#runtime-genesis-slots-per-epoch").html(data.runtimeConfig.genesis.slots_per_epoch)
    $("#runtime-genesis-slots-per-sub-window").html(data.runtimeConfig.genesis.slots_per_sub_window)

    $("#runtime-proof-account-creation-fee").html(data.runtimeConfig.proof.account_creation_fee + '<span class="ml-2 reduce-2">mina</span>')
    $("#runtime-proof-block-window-duration").html(data.runtimeConfig.proof.block_window_duration_ms + '<span class="ml-2 reduce-2">ms</span>')
    $("#runtime-proof-coinbase-amount").html(data.runtimeConfig.proof.coinbase_amount + '<span class="ml-2 reduce-2">mina</span>')
    $("#runtime-proof-ledger-depth").html(data.runtimeConfig.proof.ledger_depth)
    $("#runtime-proof-level").html(data.runtimeConfig.proof.level)
    $("#runtime-proof-sub-windows-per-window").html(data.runtimeConfig.proof.sub_windows_per_window)
    $("#runtime-proof-supercharged-factor").html(`${data.runtimeConfig.proof.coinbase_amount} x ${data.runtimeConfig.proof.supercharged_coinbase_factor} = ${data.runtimeConfig.proof.coinbase_amount * data.runtimeConfig.proof.supercharged_coinbase_factor}`+ '<span class="ml-2 reduce-2">mina</span>')
    $("#runtime-proof-work-delay").html(data.runtimeConfig.proof.work_delay)
}