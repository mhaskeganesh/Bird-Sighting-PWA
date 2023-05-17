// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map; let
  infoWindow;

async function initMap(locationData) {
  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(document.getElementById('gmap'), {
    center: locationData,
    zoom: 11,
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

// window.initMap = initMap;
