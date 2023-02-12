console.log("script map.js");

//variable declarations
const tile = `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;
const tile2 = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
const colors = ["#008800", "#FFFF00", "#BB0000"];
const MAX_ZOOM = 17;
const MIN_MAX_COLLISION_THRESHOLD = 0.15;
const TOOLTIP_THRESHOLD_ZOOM = 12;
// let myRenderer = L.canvas({ padding: 0.5 });
// const myCircleMarker = (lat_lng, weight) => {
// 	// const color = gradient(weight, ...colors);
// 	return L.circleMarker(lat_lng, {
// 		renderer: myRenderer,
// 		// color: color,
// 		fillOpacity: 0.75,
// 		stroke: false,
// 		bubblingMouseEvents: true,
// 	});
// };
// const myMap = new L.Map("myMap", {
// 	gestureHandling: true,
// 	fullscreenControl: {
// 		pseudoFullscreen: true, // if true, fullscreen to page width and height
// 	},
// }).on("click", function (ev) {
// 	// updateTooltips();
// });

// const tileLayerGroup = L.tileLayer(tile, {
// 	markerZoomAnimation: true,
// 	maxZoom: MAX_ZOOM,
// 	dragging: true,
// 	touchZoom: true,
// 	scrollWheelZoom: true,
// 	boxZoom: false,
// 	keyboard: true,
// 	zoomControl: true,
// 	doubleClickZoom: true,
// 	attributionControl: true,
// 	closePopupOnClick: false,
// 	trackResize: true,
// 	attribution:
// 		'&copy; <a href="http://openstreetmap' +
// 		'.org">OpenStreetMap</a> contributors',
// });

// tileLayerGroup.addTo(myMap);

let map = L.map("map").setView([51.505, -0.09], 13);

const tileLayerGroup = L.tileLayer(tile, {
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

// L.marker([51.5, -0.09]).addTo(map).bindPopup("Hi!").openPopup();

// Create additional Control placeholders
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
			maxZoom: MAX_ZOOM,
			enableHighAccuracy: true,
		},
	})
	.setPosition("verticalcenterright")
	.addTo(map);

navigator.geolocation.getCurrentPosition(showPosition);

async function showPosition(position) {
	console.log(position.coords);
	L.marker([position.coords.latitude, position.coords.longitude], 13)
		.addTo(map)
		.bindPopup("Hi!")
		.openPopup();

	const province = await getUserProvince(
		position.coords.latitude, //-45.92401275457338, //
		position.coords.longitude //-67.55585276343744 //
	);
	console.log({ province });
	// document.getElementById("provincia").value = province;
}

async function getUserProvince(lat, lon) {
	// navigator.geolocation.getCurrentPosition()
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

//things that aren't in use
const normalizeText = (str) => {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase();
};
