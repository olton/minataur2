;
const updatePeers = (data) => {
    console.log(data)
    const location = {}

    for(let l of data.location) {
        location[l.query] = l
    }

    addMapMarkers(location)

    $("#found-peers").html(num2fmt(data.peers.length))

    const target = $("#peers-table tbody").clear()
    const rows = drawPeersTable(data.peers, location)
    rows.map( r => target.append(r) )
}