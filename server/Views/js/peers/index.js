;
const updatePeers = (data) => {
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

    let peers = data.peers
    peers.map( r => {
        r.loc = location[r.host]
    })

    peers.sort((a, b)=>{
        if (a.loc.isp > b.loc.isp) return 1
        if (a.loc.isp < b.loc.isp) return -1
        return 0
    })

    const target = $("#peers-table tbody").clear()
    const rows = drawPeersTable(data.peers, location)
    rows.map( r => target.append(r) )
}