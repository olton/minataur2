globalThis.UNKNOWN = `<span class="text-muted">UNKNOWN</span>`
globalThis.SLOT_DURATION = 180000
globalThis.EPOCH_DURATION = 1285200000
globalThis.GENESIS_START = "2024-02-29T13:00:00.000000-08:00"
globalThis.HARD_FORK_START = "2024-02-29T13:00:00.000000-08:00"
globalThis.TRANS_HASH_MARKER = "5J"
globalThis.BLOCK_HASH_MARKER = "3N"
globalThis.ACCOUNT_HASH_MARKER = "B62q"

let loader

const showLoader = () => {
    loader =  Metro.activity.open({
        type: 'simple',
        style: 'color',
        overlayColor: '#fff',
        overlayAlpha: .2
    });
}

const closeLoader = () => {
    if (loader) Metro.activity.close(loader)
}