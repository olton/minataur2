;
globalThis.transOrder = ""
globalThis.transLimit = 50
globalThis.transType = ['payment', 'delegation']
globalThis.transStatus = ['applied', 'failed']
globalThis.transSearch = ""
globalThis.transPage = 1
globalThis.searchThreshold = 500
globalThis.showError = false

const createTransRequest = () => {
    const isTransHash = transSearch.substring(0, 2) === "Ckp"
    const isBlockHash = transSearch.substring(0, 2) === "3N"
    const isBlockNumb = !isNaN(+transSearch)

    return {
        type: transType,
        status: transStatus,
        limit: transLimit,
        offset: transLimit * (transPage - 1),
        search: transSearch ? {
            block: isBlockNumb ? +transSearch : null,
            block_hash: isBlockHash ? transSearch : null,
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
        disableElements()
        request('user_transactions', createTransRequest())
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

function applyFilter(el, state) {
    const [filter, value] = state.split(":")

    if (!el.checked) {
        if (filter === 'type') {
            Metro.utils.arrayDelete(transType, value)
        } else {
            Metro.utils.arrayDelete(transStatus, value)
        }
    } else {
        if (filter === 'type') {
            if (!transType.includes(state)) transType.push(value)
        } else {
            if (!transStatus.includes(state)) transStatus.push(value)
        }
    }

    refreshTransTable()
}