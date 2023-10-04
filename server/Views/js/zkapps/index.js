;
globalThis.zkappsOrder = ""
globalThis.zkappsLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.zkappsSearch = ""
globalThis.zkappsPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500
globalThis.showError = false
globalThis.showBlockNumber = false
globalThis.updateInterval = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createZkappsRequest = () => {
    const isZkappHash = zkappsSearch.startsWith("5J")
    const isBlockHash = zkappsSearch.startsWith("3N")
    const isBlockNumb = !isNaN(+zkappsSearch)

    const status = []
    if ($("#zkapp-status-applied").is(":checked")) status.push('applied')
    if ($("#zkapp-status-failed").is(":checked")) status.push('failed')

    return {
        status,
        limit: zkappsLimit,
        offset: zkappsLimit * (zkappsPage - 1),
        search: zkappsSearch ? {
            block: isBlockNumb ? +zkappsSearch : null,
            hash: isZkappHash ? zkappsSearch : null,
            payer: !isBlockNumb && !isZkappHash && !isBlockHash ? zkappsSearch : null
        } : null
    }
}
const updateZkappsTable = data => {
    console.log(data)
    if (!data) return

    Metro.pagination({
        target: "#pagination-top",
        length: data.length,
        rows: zkappsLimit,
        current: zkappsPage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: zkappsLimit,
        current: zkappsPage
    })

    $("#found-zkapps").html(num2fmt(data.length))

    const target = $("#zkapps-table tbody").clear()
    const rows = drawZkAppsTable(data.rows)
    rows.map( r => target.append(r) )

    enableElements()
}

function refreshZkappsTable(){
    if (globalThis.webSocket) {
        clearUpdateInterval()
        disableElements()
        request('zkapps', createZkappsRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (zkappsPage === val) return
    if (val === 'next') {
        zkappsPage++
    } else if (val === 'prev') {
        zkappsPage--
    } else {
        zkappsPage = val
    }
    history.pushState('', '', `/zkapps?page=${zkappsPage}&size=${zkappsLimit}`)
    refreshZkappsTable()
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

function zkappsApplyRowsCount(selected){
    zkappsLimit = +selected[0]
    refreshZkappsTable()
}

$("#zkapp-status-applied, #zkapp-status-failed").on("click", () => {
    refreshZkappsTable()
})

$("#zkapp-show-block").on("click", function() {
    globalThis.showBlockNumber = this.checked
    refreshZkappsTable()
})

let zkapps_search_input_interval = false

const clearZkappsSearchInterval = () => {
    clearInterval(zkapps_search_input_interval)
    zkapps_search_input_interval = false
}

$("#zkapps-search").on(Metro.events.inputchange, function(){
    zkappsSearch = clearText(this.value.trim())

    clearZkappsSearchInterval()

    if (!zkapps_search_input_interval) zkapps_search_input_interval = setTimeout(function(){
        clearZkappsSearchInterval()
        zkappsPage = 1
        refreshZkappsTable()
    }, searchThreshold)
})