;
globalThis.accountsOrder = ""
globalThis.accountsLimit = +Metro.utils.getURIParameter(null, 'size') || 50
globalThis.accountsSearch = ""
globalThis.accountsPage = +Metro.utils.getURIParameter(null, 'page') || 1
globalThis.searchThreshold = 500

const createAccountsRequest = () => {
    return {
        limit: accountsLimit,
        offset: accountsLimit * (accountsPage - 1),
        search: accountsSearch
    }
}

const updateAccountsTable = data => {
    if (!data) {
        enableElements()
        return
    }

    Metro.pagination({
        target: "#pagination-top",
        length: data.length,
        rows: accountsLimit,
        current: accountsPage
    })

    Metro.pagination({
        target: "#pagination-bottom",
        length: data.length,
        rows: accountsLimit,
        current: accountsPage
    })

    $("#found-blocks").html(num2fmt(data.length))

    const target = $("#accounts-table tbody").clear()
    const rows = drawAccountsTable(data.rows)
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

function refreshAccountsTable(){
    if (globalThis.webSocket) {
        disableElements()
        request('accounts', createAccountsRequest())
    }
}

$("#pagination-top, #pagination-bottom").on("click", ".page-link", function(){
    const val = $(this).data("page")
    if (val === 'next') {
        accountsPage++
    } else if (val === 'prev') {
        accountsPage--
    } else {
        accountsPage = val
    }
    history.pushState('', '', `/accounts?page=${accountsPage}&size=${accountsLimit}`)
    refreshAccountsTable()
})

let accounts_search_input_interval = false

const clearAccountsSearchInterval = () => {
    clearInterval(accounts_search_input_interval)
    accounts_search_input_interval = false
}

$("#accounts-search").on(Metro.events.inputchange, function(){
    accountsSearch = clearText(this.value.trim())

    clearAccountsSearchInterval()

    if (!accounts_search_input_interval) accounts_search_input_interval = setTimeout(function(){
        clearAccountsSearchInterval()
        accountsPage = 1
        refreshAccountsTable()
    }, searchThreshold)
})

function changeRowsCount (selected) {
    accountsLimit = +selected[0]
    refreshAccountsTable()
}