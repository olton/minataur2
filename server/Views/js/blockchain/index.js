;
globalThis.blocksOrder = ""
globalThis.blocksLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.blocksSearch = ""
globalThis.blocksPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500

const createBlockRequest = () => {
    const status = []
    if ($("#block-status-pending").is(":checked")) status.push('pending')
    if ($("#block-status-canonical").is(":checked")) status.push('canonical')
    if ($("#block-status-orphaned").is(":checked")) status.push('orphaned')

    return {
        type: status,
        limit: blocksLimit,
        offset: blocksLimit * (blocksPage - 1),
        search: blocksSearch ? {
            block: isNaN(+blocksSearch) ? null : +blocksSearch,
            producer: isNaN(+blocksSearch) ? blocksSearch : null,
            hash: isNaN(+blocksSearch) ? blocksSearch : null,
        } : null
    }
}

const updateBlocksTable = (data) => {
    if (!data) return

    Metro.pagination({
        target: "#pagination-top",
        length: data.length,
        rows: blocksLimit,
        current: blocksPage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: blocksLimit,
        current: blocksPage
    })

    $("#found-blocks").html(num2fmt(data.length))

    const target = $("#blocks-table tbody").clear()
    const rows = drawBlocksTable(data.rows)
    rows.map( r => target.append(r) )
}

function refreshBlocksTable(){
    if (globalThis.webSocket) {
        console.log(`Reload blocks data`)
        disableElements()
        request('blocks', createBlockRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        blocksPage++
    } else if (val === 'prev') {
        blocksPage--
    } else {
        blocksPage = val
    }
    history.pushState('', '', `/blockchain?page=${blocksPage}&size=${blocksLimit}`)
    refreshBlocksTable()
})

const disableElements = () => {
    $("#pagination-top, #pagination-bottom").addClass("disabled")
    $("#reload-button").addClass("disabled")
}

const enableElements = () => {
    $("#pagination-top, #pagination-bottom").removeClass("disabled")
    $("#reload-button").removeClass("disabled")
}

function blocksApplyRowsCount(selected){
    blocksLimit = +selected[0]
    refreshBlocksTable()
}

$("#block-status-pending, #block-status-canonical, #block-status-orphaned").on("click", () => {
    refreshBlocksTable()
})

let block_search_input_interval = false

const clearBlockSearchInterval = () => {
    clearInterval(block_search_input_interval)
    block_search_input_interval = false
}

$("#blocks-search").on(Metro.events.inputchange, function(){
    blocksSearch = clearText(this.value.trim())

    clearBlockSearchInterval()

    if (!block_search_input_interval) block_search_input_interval = setTimeout(function(){
        clearBlockSearchInterval()
        blocksPage = 1
        refreshBlocksTable()
    }, searchThreshold)
})