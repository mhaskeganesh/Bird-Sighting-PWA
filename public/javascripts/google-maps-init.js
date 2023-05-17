// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map; let
  infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('gmap'), {
    center: { lat: 53.38, lng: -1.4691 },
    zoom: 11,
  });

  const locationButton = document.createElement('div');

  locationButton.textContent = 'Pan to Current Location';
  locationButton.classList.add('custom-map-control-button');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const hiddenInput = document.getElementById('location_data');
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          hiddenInput.value = `${pos.lat};${pos.lng}`;

          const marker = new google.maps.Marker({
            position: pos,
            map,
          });

          map.setZoom(15);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
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

window.initMap = initMap;
