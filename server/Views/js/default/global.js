globalThis.UNKNOWN = `<span class="text-muted">UNKNOWN</span>`
globalThis.SLOT_DURATION = 180000
globalThis.EPOCH_DURATION = 1285200000
globalThis.GENESIS_START = "2021-03-17 02:00:00.000000+02:00"
globalThis.HARD_FORK_START = "2023-09-13T05:01:01.000000-08:00"
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
    Metro.activity.close(loader)
}