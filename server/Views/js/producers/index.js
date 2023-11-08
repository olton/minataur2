;
globalThis.producersOrder = ""
globalThis.producersLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.producersSearch = ""
globalThis.producersPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500

const createProducersRequest = () => {
    return {
        limit: producersLimit,
        offset: producersLimit * (producersPage - 1),
        filter: {
            currentEpoch: $("#current-epoch-only").is(":checked"),
        },
        search: producersSearch
    }
}

const updateProducersTable = data => {
    if (!data) {
        enableElements()
        return
    }

    Metro.pagination({
        target: "#pagination-top",
        length: data.length,
        rows: producersLimit,
        current: producersPage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: producersLimit,
        current: producersPage
    })

    $("#found-blocks").html(num2fmt(data.length))

    const target = $("#producers-table tbody").clear()
    const rows = drawProducersTable(data.rows)
    rows.map( r => target.append(r) )
    enableElements()
}

const disableElements = () => {
    $("#pagination-top, #pagination-bottom").addClass("disabled")
    showLoader()
}

const enableElements = () => {
    $("#pagination-top, #pagination-bottom").removeClass("disabled")
    closeLoader()
}

function refreshProducersTable(){
    if (globalThis.webSocket) {
        disableElements()
        request('producers', createProducersRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        producersPage++
    } else if (val === 'prev') {
        producersPage--
    } else {
        producersPage = val
    }
    history.pushState('', '', `/producers?page=${producersPage}&size=${producersLimit}`)
    refreshProducersTable()
})

$("#current-epoch-only").on("click", () => {
    refreshProducersTable()
})

let producers_search_input_interval = false

const clearProducersSearchInterval = () => {
    clearInterval(producers_search_input_interval)
    producers_search_input_interval = false
}

$("#producers-search").on(Metro.events.inputchange, function(){
    producersSearch = clearText(this.value.trim())

    clearProducersSearchInterval()

    if (!producers_search_input_interval) producers_search_input_interval = setTimeout(function(){
        clearProducersSearchInterval()
        producersPage = 1
        refreshProducersTable()
    }, searchThreshold)
})

function changeRowsCount (selected) {
    producersLimit = +selected[0]
    refreshProducersTable()
}