;
globalThis.transOrder = ""
globalThis.transLimit = 50
globalThis.transSearch = ""
globalThis.transPage = 1
globalThis.searchThreshold = 500
globalThis.showError = false
globalThis.updateInterval = null
globalThis.accountID = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createTransRequest = () => {
    const isTransHash = transSearch.startsWith(TRANS_HASH_MARKER)
    const isBlockHash = transSearch.startsWith(BLOCK_HASH_MARKER)
    const isBlockNumb = !isNaN(+transSearch)

    const status = []
    if ($("#trans-status-applied").is(":checked")) status.push('applied')
    if ($("#trans-status-failed").is(":checked")) status.push('failed')

    const type = []
    if ($("#trans-type-payment").is(":checked")) type.push('payment')
    if ($("#trans-type-delegation").is(":checked")) type.push('delegation')

    return {
        type,
        status,
        limit: transLimit,
        offset: transLimit * (transPage - 1),
        account: accountID,
        search: transSearch ? {
            block: isBlockNumb ? +transSearch : null,
            hash: isTransHash ? transSearch : null,
            participant: !isBlockNumb && !isTransHash && !isBlockHash ? transSearch : null
        } : null
    }
}

const updateTransTable = data => {
    if (!data) return

    Metro.pagination({
        target: "#transactions-pagination-top",
        length: data.length,
        rows: transLimit,
        current: transPage
    })

    Metro.pagination({
        target: "#transactions-pagination-bottom",
        length: data.length,
        rows: transLimit,
        current: transPage
    })

    $("#found-trans").html(num2fmt(data.length))

    const target = $("#trans-table tbody").clear()
    const rows = drawTransTable(data.rows)
    rows.map( r => target.append(r) )
    enableElements()
}

function refreshTransTable(){
    if (globalThis.webSocket) {
        clearUpdateInterval()
        disableElements()
        request('account_transactions', createTransRequest())
    }
}

$("#transactions-pagination-top, #transactions-pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (transPage === val) return
    if (val === 'next') {
        transPage++
    } else if (val === 'prev') {
        transPage--
    } else {
        transPage = val
    }
    refreshTransTable()
})

const disableElements = () => {
    $("#transactions-pagination-top, #transactions-pagination-bottom").addClass("disabled")
    $("#blocks-pagination-top, #blocks-pagination-bottom").addClass("disabled")
}

const enableElements = () => {
    $("#transactions-pagination-top, #transactions-pagination-bottom").removeClass("disabled")
    $("#blocks-pagination-top, #blocks-pagination-bottom").removeClass("disabled")
}

function transApplyRowsCount(selected){
    transLimit = +selected[0]
    refreshTransTable()
}

$("#trans-status-applied, #trans-status-failed, #trans-type-payment, #trans-type-delegation").on("click", () => {
    refreshTransTable()
})

let trans_search_input_interval = false

const clearTransSearchInterval = () => {
    clearInterval(trans_search_input_interval)
    trans_search_input_interval = false
}

$("#trans-search").on(Metro.events.inputchange, function(){
    transSearch = clearText(this.value.trim())

    clearTransSearchInterval()

    if (!trans_search_input_interval) trans_search_input_interval = setTimeout(function(){
        clearTransSearchInterval()
        transPage = 1
        refreshTransTable()
    }, searchThreshold)
})