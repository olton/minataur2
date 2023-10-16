;

globalThis.markers = []

globalThis.map = L.map('map', {
    minZoom: 1,
}).fitWorld()

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)


const clearMarkers = () => {
    for(let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i])
    }
    markers.length = 0
}

const addMapMarkers = peers => {
    clearMarkers()
    for(let l of peers) {
        if(l.loc) {
            const marker = L.marker([l.loc.lat, l.loc.lon]).addTo(map)
            markers.push(marker)
        }
    }
}