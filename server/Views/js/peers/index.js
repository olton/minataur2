;
const updatePeers = (data) => {
    $("#found-peers").html(num2fmt(data.length))

    const target = $("#peers-table tbody").clear()
    const rows = drawPeersTable(data)
    rows.map( r => target.append(r) )
}