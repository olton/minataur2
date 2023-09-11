;
globalThis.transOrder = ""
globalThis.transLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.transSearch = ""
globalThis.transPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500
globalThis.showError = false
globalThis.updateInterval = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createTransRequest = () => {
    const isTransHash = transSearch.substring(0, 2) === "5J"
    const isBlockHash = transSearch.substring(0, 2) === "3N"
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
        target: "#pagination-top",
        length: data.length,
        rows: transLimit,
        current: transPage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: transLimit,
        current: transPage
    })

    $("#found-trans").html(num2fmt(data.length))

    const target = $("#trans-table tbody").clear()
    const rows = drawTransTable(data.rows)
    rows.map( r => target.append(r) )
}

function refreshTransTable(){
    if (globalThis.webSocket) {
        console.log(`Reload trans data`)
        clearUpdateInterval()
        disableElements()
        request('user_transactions', createTransRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (transPage === val) return
    if (val === 'next') {
        transPage++
    } else if (val === 'prev') {
        transPage--
    } else {
        transPage = val
    }
    history.pushState('', '', `/transactions?page=${transPage}&size=${transLimit}`)
    refreshTransTable()
})

const disableElements = () => {
    $("#pagination-top, #pagination-bottom").addClass("disabled")
    $("#reload-button").addClass("disabled")
}

const enableElements = () => {
    $("#pagination-top, #pagination-bottom").removeClass("disabled")
    $("#reload-button").removeClass("disabled")
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