;
globalThis.transLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.transPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.showError = true
globalThis.updateInterval = null
globalThis.searchThreshold = 500
globalThis.searchString = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createPoolRequest = () => {
    return {
        limit: transLimit,
        offset: transLimit * (transPage - 1),
        search: searchString
    }
}

const updateTransTable = data => {
    const target = $("#pool-table tbody").clear()

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

    const rows = drawTransTable(data)
    rows.map( r => target.append(r) )
}

function refreshTransTable(){
    if (globalThis.webSocket) {
        request('transactions_pool', createPoolRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        transPage++
    } else if (val === 'prev') {
        transPage--
    } else {
        transPage = val
    }
    history.pushState('', '', `/pool?page=${transPage}&size=${transLimit}`)
    refreshTransTable()
})

let trans_search_input_interval = false

const clearTransSearchInterval = () => {
    clearInterval(trans_search_input_interval)
    trans_search_input_interval = false
}

$("#trans-search").on(Metro.events.inputchange, function(){
    searchString = clearText(this.value.trim())

    clearTransSearchInterval()

    if (!trans_search_input_interval) trans_search_input_interval = setTimeout(function(){
        clearTransSearchInterval()
        transPage = 1
        refreshTransTable()
    }, searchThreshold)
})