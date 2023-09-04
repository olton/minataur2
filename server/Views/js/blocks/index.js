;
globalThis.blocksOrder = ""
globalThis.blocksLimit = 50
globalThis.blocksChainStatus = ['pending', 'orphaned', 'canonical']
globalThis.blocksSearch = ""
globalThis.blocksPage = 1
globalThis.searchThreshold = 500

const createBlockRequest = () => {
    return {
        type: blocksChainStatus,
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
        target: "#pagination",
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

$("#pagination").on("click", ".page-link", function(){
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

const disableElements = () => {
    $("#pagination").addClass("disabled")
    $("#reload-button").addClass("disabled")
}

const enableElements = () => {
    $("#pagination").removeClass("disabled")
    $("#reload-button").removeClass("disabled")
}

function blocksApplyRowsCount(selected){
    blocksLimit = +selected[0]
    refreshBlocksTable()
}

function blocksApplyFilter(el, state) {
    if (!el.checked) {
        Metro.utils.arrayDelete(blocksChainStatus, state)
    } else {
        if (!blocksChainStatus.includes(state)) blocksChainStatus.push(state)
    }
    refreshBlocksTable()
}

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