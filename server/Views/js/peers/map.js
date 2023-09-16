;

globalThis.markers = []

globalThis.map = L.map('map', {
    minZoom: 1,
}).fitWorld()

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

const addMapMarkers = loc => {
    for(let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i])
    }
    for(let l of Object.values(loc)) {
        markers.push(new L.marker([l.lat, l.lon]).addTo(map))
    }
}