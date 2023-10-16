;

globalThis.peersSortBy = "isp"
globalThis.searchThreshold = 500
globalThis.peersSearch = ""

const createPeersRequest = () => {
    const isHash = peersSearch.startsWith("12D")

    return {
        search: peersSearch.trim()
    }
}

const updatePeers = (data) => {
    const location = {}
    const available = data.peers.filter(r => r.available).length

    $("#found-peers").html(`${num2fmt(data.peers.length)}`)
    $("#active-peers").html(`${num2fmt(available)}`)

    let peers = data.peers

    if (data.location) {
        for(let l of data.location) {
            location[l.query] = l
        }
    }

    if (location) peers.map( r => {
        r.loc = location[r.host]
    })

    peers.sort((a, b)=>{
        if (a.loc && b.loc) {
            if (a.loc[peersSortBy] > b.loc[peersSortBy]) return 1
            if (a.loc[peersSortBy] < b.loc[peersSortBy]) return -1
        }
        return 0
    })

    addMapMarkers(peers)

    const target = $("#peers-table tbody").clear()
    const rows = drawPeersTable(data.peers)
    rows.map( r => target.append(r) )
}

$("#peers-sort-by-country, #peers-sort-by-isp").on("click", function(){
    globalThis.peersSortBy = $(this).val()
    refreshPeersTable()
})

function refreshPeersTable(){
    if (globalThis.webSocket) {
        request('peers', createPeersRequest())
    }
}

let peers_search_input_interval = false

const clearPeersSearchInterval = () => {
    clearInterval(peers_search_input_interval)
    peers_search_input_interval = false
}

$("#peers-search").on(Metro.events.inputchange, function(){
    peersSearch = clearText(this.value.trim())

    clearPeersSearchInterval()

    if (!peers_search_input_interval) peers_search_input_interval = setTimeout(function(){
        clearPeersSearchInterval()
        refreshPeersTable()
    }, searchThreshold)
})