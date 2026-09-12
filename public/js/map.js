mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates, //  dynamic center
    zoom: 9
});

const marker = new mapboxgl.Marker({color:"black"})
    .setLngLat(coordinates)
    .addTo(map);