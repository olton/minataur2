;
globalThis.coinbaseOrder = ""
globalThis.coinbaseLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.coinbaseSearch = ""
globalThis.coinbasePage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500
globalThis.showError = false
globalThis.showBlockNumber = false
globalThis.updateInterval = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createCoinbaseRequest = () => {
    const isTxHash = coinbaseSearch.startsWith("5J")
    const isBlockHash = coinbaseSearch.startsWith("3N")
    const isBlockNumb = !isNaN(+coinbaseSearch)

    return {
        limit: coinbaseLimit,
        offset: coinbaseLimit * (coinbasePage - 1),
        search: coinbaseSearch ? {
            block: isBlockNumb ? +coinbaseSearch : null,
            hash: isTxHash || isBlockHash ? coinbaseSearch : null,
            payer: !isBlockNumb && !isTxHash && !isBlockHash ? coinbaseSearch : null
        } : null
    }
}
const updateCoinbaseTable = data => {
    console.log(data)
    if (!data) return

    Metro.pagination({
        target: "#pagination-top",
        length: data.length,
        rows: coinbaseLimit,
        current: coinbasePage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: coinbaseLimit,
        current: coinbasePage
    })

    $("#found-coinbase").html(num2fmt(data.length))

    const target = $("#coinbase-table tbody").clear()
    const rows = drawInternalTable(data.rows)
    rows.map( r => target.append(r) )

    enableElements()
}

function refreshCoinbaseTable(){
    if (globalThis.webSocket) {
        clearUpdateInterval()
        disableElements()
        request('coinbase', createCoinbaseRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (coinbasePage === val) return
    if (val === 'next') {
        coinbasePage++
    } else if (val === 'prev') {
        coinbasePage--
    } else {
        coinbasePage = val
    }
    history.pushState('', '', `/coinbase?page=${coinbasePage}&size=${coinbaseLimit}`)
    refreshCoinbaseTable()
})

const disableElements = () => {
    $("#pagination-top, #pagination-bottom").addClass("disabled")
    $("#reload-button").addClass("disabled")
    showLoader()
}

const enableElements = () => {
    $("#pagination-top, #pagination-bottom").removeClass("disabled")
    $("#reload-button").removeClass("disabled")
    closeLoader()
}

function coinbaseApplyRowsCount(selected){
    coinbaseLimit = +selected[0]
    refreshCoinbaseTable()
}

$("#coinbase-status-applied, #zkapp-status-failed").on("click", () => {
    refreshCoinbaseTable()
})

$("#coinbase-show-block").on("click", function() {
    globalThis.showBlockNumber = this.checked
    refreshCoinbaseTable()
})

let coinbase_search_input_interval = false

const clearCoinbaseSearchInterval = () => {
    clearInterval(coinbase_search_input_interval)
    coinbase_search_input_interval = false
}

$("#coinbase-search").on(Metro.events.inputchange, function(){
    coinbaseSearch = clearText(this.value.trim())

    clearCoinbaseSearchInterval()

    if (!coinbase_search_input_interval) coinbase_search_input_interval = setTimeout(function(){
        clearCoinbaseSearchInterval()
        coinbasePage = 1
        refreshCoinbaseTable()
    }, searchThreshold)
})