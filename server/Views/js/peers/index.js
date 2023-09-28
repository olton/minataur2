;
const updatePeers = (data) => {
    console.log(data)
    const location = {}
    const available = data.peers.filter(r => r.available).length

    if (data.location) {
        for (let l of data.location) {
            location[l.query] = l
        }

        addMapMarkers(location)
    }

    $("#found-peers").html(`${num2fmt(data.peers.length)}`)
    $("#active-peers").html(`${num2fmt(available)}`)

    const target = $("#peers-table tbody").clear()
    const rows = drawPeersTable(data.peers, location)
    rows.map( r => target.append(r) )
}