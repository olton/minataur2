;
globalThis.delegatorsOrder = ""
globalThis.delegatorsLimit = 50
globalThis.delegatorsSearch = ""
globalThis.delegatorsPage = 1
globalThis.delegatorsLedger = "staking"

const createDelegatorsRequest = () => {
    return {
        account_id: accountID,
        ledger: delegatorsLedger,
        limit: delegatorsLimit,
        offset: delegatorsLimit * (delegatorsPage - 1),
        search: delegatorsSearch ? {
            hash: delegatorsSearch
        } : null
    }
}

function refreshDelegatorsTable(){
    if (globalThis.webSocket) {
        disableElements()
        request('account_delegators', createDelegatorsRequest())
    }
}

const updateDelegatorsTable = (data) => {
    if (!data) return

    Metro.pagination({
        target: "#delegators-pagination-top",
        length: data.length,
        rows: delegatorsLimit,
        current: delegatorsPage
    })

    Metro.pagination({
        target: "#delegators-pagination-bottom",
        length: data.length,
        rows: delegatorsLimit,
        current: delegatorsPage
    })

    $("#found-delegators").html(num2fmt(data.length))

    const target = $("#delegators-table tbody").clear()
    const rows = drawDelegatorsTable(data.rows)
    rows.map( r => target.append(r) )
    enableElements()
}

$("#delegators-pagination-top, #delegators-pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        delegatorsPage++
    } else if (val === 'prev') {
        delegatorsPage--
    } else {
        delegatorsPage = val
    }
    refreshDelegatorsTable()
})

function delegatorsApplyRowsCount(selected){
    delegatorsLimit = +selected[0]
    refreshDelegatorsTable()
}

$("[name=delegators-ledger]").on("click", function() {
    delegatorsLedger = $(this).val()
    refreshDelegatorsTable()
})

let delegators_search_input_interval = false

const clearDelegatorsSearchInterval = () => {
    clearInterval(delegators_search_input_interval)
    delegators_search_input_interval = false
}

$("#blocks-search").on(Metro.events.inputchange, function(){
    globalThis.delegatorsSearch = clearText(this.value.trim())

    clearDelegatorsSearchInterval()

    if (!delegators_search_input_interval) delegators_search_input_interval = setTimeout(function(){
        clearDelegatorsSearchInterval()
        globalThis.delegatorsPage = 1
        refreshDelegatorsTable()
    }, searchThreshold)
})