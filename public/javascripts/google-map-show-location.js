let map;

async function initMap(locationData) {
  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(document.getElementById('gmap'), {
    center: locationData,
    zoom: 13,
  });
  const marker = new google.maps.Marker({
    position: locationData,
    map,
  });

  // For the zoom animation
  setTimeout(() => {
    map.setCenter(locationData);
    map.setZoom(15);
  }, 1000);
}
