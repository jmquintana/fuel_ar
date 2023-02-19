console.log("script map.js");

const tile = `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;
const tile2 = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

const MAX_ZOOM = 17;
let coords = [-34.56723, -58.451452];

let map = L.map("map").setView(coords, 15);

const showPos = (position) => {
	coords = [position.coords.latitude, position.coords.longitude];
	console.log(coords);
	let marker = L.marker(coords).addTo(map);
	map.panTo(marker.getLatLng());
};

const getUserLocation = () => {
	return navigator.geolocation.getCurrentPosition(showPos);
};

const tileLayerGroup = L.tileLayer(tile2, {
	markerZoomAnimation: true,
	maxZoom: MAX_ZOOM,
	dragging: true,
	touchZoom: true,
	scrollWheelZoom: true,
	boxZoom: false,
	keyboard: true,
	zoomControl: true,
	doubleClickZoom: true,
	attributionControl: true,
	closePopupOnClick: false,
	trackResize: true,
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

tileLayerGroup.addTo(map);

function addControlPlaceholders(map) {
	var corners = map._controlCorners,
		l = "leaflet-",
		container = map._controlContainer;

	function createCorner(vSide, hSide) {
		var className = l + vSide + " " + l + hSide;

		corners[vSide + hSide] = L.DomUtil.create("div", className, container);
	}

	createCorner("verticalcenter", "left");
	createCorner("verticalcenter", "right");
	createCorner("verticalbottom", "center");
}
addControlPlaceholders(map);

// Change the position of the Zoom Control to a newly created placeholder.
map.zoomControl.setPosition("verticalcenterright");

L.control.scale({ position: "verticalcenterleft" }).addTo(map);

L.control
	.locate({
		locateOptions: {
			// setView: true,
			watch: true,
			layer: tileLayerGroup,
			maxZoom: MAX_ZOOM - 1,
			enableHighAccuracy: true,
		},
	})
	.setPosition("verticalcenterright")
	.addTo(map);

async function showPosition(position) {
	console.log(position.coords);

	let coords = [position.coords.latitude, position.coords.longitude];
	var markers = L.marker(coords).addTo(map).openPopup();
	map.panTo(markers.getLatLng());
	const province = await getUserProvince(...coords);
	console.log({ province });
}

async function getUserProvince(lat, lon) {
	let response = await fetch(
		`https://apis.datos.gob.ar/georef/api/ubicacion?lat=${lat}&lon=${lon}`
	);
	const result = await response.json();
	let province = normalizeText(result.ubicacion.provincia.nombre);
	province =
		province == "CIUDAD AUTONOMA DE BUENOS AIRES"
			? "CAPITAL FEDERAL"
			: province;
	return province;
}

const normalizeText = (str) => {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase();
};

getUserLocation();
