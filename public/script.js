mapboxgl.accessToken = 'pk.eyJ1IjoieWVzaHdhbnRoLTIwMDIiLCJhIjoiY2x5ZzR0MW5yMDV2MzJqc2Q4bzJ6b3BmcCJ9.XTSGWy-RZXGe62M9EFzPTQ';
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0], 
  zoom: 2 
});

map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true
}));
navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords;
  map.setCenter([longitude, latitude]);
  map.setZoom(15);
  console.log({longitude, latitude});

  const marker = new mapboxgl.Marker({ color: 'red', draggable: true })
    .setLngLat([longitude, latitude])
    .addTo(map);

  function onDragEnd() {
    const lngLat = marker.getLngLat();
    document.getElementById('location').value = `${lngLat.lat}, ${lngLat.lng}`;
  }

  marker.on('dragend', onDragEnd);

  // Set the initial value of the location input field
  document.getElementById('location').value = `${latitude}, ${longitude}`;
}, err => {
  console.error(err);
});

document.getElementById('mapStyle').addEventListener('change', function() {
  const style = this.value;
  map.setStyle(`mapbox://styles/${style}`);
});
