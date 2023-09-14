;
globalThis.transLimit = 50
globalThis.transPage = 1
globalThis.showError = true
globalThis.updateInterval = null

const clearUpdateInterval = () => {
    clearTimeout(updateInterval)
    updateInterval = null
}

const createPoolRequest = () => {
    return {
        limit: transLimit,
        offset: transLimit * (transPage - 1)
    }
}

const updateTransTable = data => {
    console.log(data)
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

    const target = $("#pool-table tbody").clear()
    const rows = drawTransTable(data)
    rows.map( r => target.append(r) )
}