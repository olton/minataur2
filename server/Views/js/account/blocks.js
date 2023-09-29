;
globalThis.blocksOrder = ""
globalThis.blocksLimit = 50
globalThis.blocksSearch = ""
globalThis.blocksPage = 1

const createBlockRequest = () => {
    const status = []
    if ($("#block-status-pending").is(":checked")) status.push('pending')
    if ($("#block-status-canonical").is(":checked")) status.push('canonical')
    if ($("#block-status-orphaned").is(":checked")) status.push('orphaned')

    return {
        type: status,
        limit: blocksLimit,
        offset: blocksLimit * (blocksPage - 1),
        currentEpoch: $("#block-current-epoch").is(":checked"),
        account: accountID,
        search: blocksSearch ? {
            block: isNaN(+blocksSearch) ? null : +blocksSearch,
            hash: isNaN(+blocksSearch) ? blocksSearch : null,
            coinbase: !isNaN(+blocksSearch) ? +blocksSearch : null,
        } : null
    }
}

const updateBlocksTable = (data) => {
    if (!data) return

    Metro.pagination({
        target: "#blocks-pagination-top",
        length: data.length,
        rows: blocksLimit,
        current: blocksPage
    })

    Metro.pagination({
        target: "#blocks-pagination-bottom",
        length: data.length,
        rows: blocksLimit,
        current: blocksPage
    })

    $("#found-blocks").html(num2fmt(data.length))

    const target = $("#blocks-table tbody").clear()
    const rows = drawBlocksTable(data.rows)
    rows.map( r => target.append(r) )
    enableElements()
}

function refreshBlocksTable(){
    if (globalThis.webSocket) {
        disableElements()
        request('account_blocks', createBlockRequest())
    }
}

$("#blocks-pagination-top, #blocks-pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        blocksPage++
    } else if (val === 'prev') {
        blocksPage--
    } else {
        blocksPage = val
    }
    refreshBlocksTable()
})

function blocksApplyRowsCount(selected){
    blocksLimit = +selected[0]
    refreshBlocksTable()
}

$("#block-status-pending, #block-status-canonical, #block-status-orphaned, #block-current-epoch").on("click", () => {
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
