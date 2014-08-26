(function ($) {

	function viewerMaps(el, params) {
		// Properties
		el.setLineInfo = function (value) {
			lineInfo = value;
			showLine();
		}
		// Events
		el.sectionSelected = null;
		// Methods
		el.onResize = function () {
			map.invalidateSize(true);
			setTimeout(showSection, 500, currentIndex);
		}
		el.showSection = function (index, data) {
			currentIndex = index;
			showSection(index, data);
		}

		var map = L.map(
			el.get(0),
			{
				center: [31.22, 121.48],
				doubleClickZoom: false,
				zoom: 13,
				zoomControl: false
			}
		);
		map.attributionControl.setPrefix("<a href='http://www.sgidi.com'>上勘院</a>");

		var layerGroup1 = L.layerGroup([
			L.tileLayer(
				"http://{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}", 
				{ 
					attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
					subdomains: ["t2", "t3", "t4", "t5", "t6"], 
					detectRetina: true, 
					reuseTiles: true 
				}
			), 
			L.tileLayer(
				"http://{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}", 
				{ 
					attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
					subdomains: ["t2", "t3", "t4", "t5", "t6"], 
					detectRetina: true, 
					reuseTiles: true
				}
			)
		]);
		var layerGroup2 = L.layerGroup([
			L.tileLayer(
				"http://{s}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}", 
				{ 
					attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
					detectRetina: true, 
					reuseTiles: true,
					subdomains: ["t2", "t3", "t4", "t5", "t6"] 
				}
			),
			L.tileLayer(
				"http://{s}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}", 
				{ 
					attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
					detectRetina: !0, 
					reuseTiles: !0, 
					subdomains: ["t2", "t3", "t4", "t5", "t6"] 
				}
			)
		]);
		L.control.layers({
			"天地图": layerGroup1,
			"天地图影像": layerGroup2
		}).addTo(map);
		layerGroup1.addTo(map);

		var lineInfo = undefined;
		var polylines = undefined;
		var currentIndex = -1;
		var markers = new Array();
		var icon = L.divIcon();
		var showLine = function () {
			if (typeof lineInfo == "undefined") return;
			polylines = new Array(lineInfo.length);
			for (var i = 0; i < lineInfo.length - 1; i++) {
				polylines[i] = L.polyline(
					[ lineInfo[i], lineInfo[i + 1] ],
					{ color: "red", opacity: 0.8 }
				);
				polylines[i].addTo(map);
				polylines[i].on("click", polylineClick);
			}
			map.fitBounds(L.latLngBounds(lineInfo));
		}
		var showSection = function (index, data) {
			if (typeof lineInfo == "undefined") return;
			map.fitBounds(L.latLngBounds([
				lineInfo[index], 
				lineInfo[index + 1]
			]));
			if (typeof data == "undefined") return;
			var j = 0;
			if (data.length > markers.length) {
				for (var i = 0; i < markers.length; i++) {
					data[i].lat = data[i].lat ? data[i].lat : 0.0;
					data[i].lng = data[i].lng ? data[i].lng : 0.0;
					markers[i].setLatLng(data[i]).setOpacity(1.0);
				}
				for (var i = markers.length; i < data.length; i++) {
					data[i].lat = data[i].lat ? data[i].lat : 0.0;
					data[i].lng = data[i].lng ? data[i].lng : 0.0;
					markers.push(
						L.marker(
							data[i], 
							{
								icon: L.divIcon({
									iconSize: [18, 18],
									iconAnchor: [-9, -9],
									className: "divIcon",
									html: (i + 1)
								}), 
								riseOnHover: true,
								title: (i + 1) + ""
							}
						).addTo(map)
					);
				}
			} else {
				for (var i = 0; i < data.length; i++) {
					data[i].lat = data[i].lat ? data[i].lat : 0.0;
					data[i].lng = data[i].lng ? data[i].lng : 0.0;
					markers[i].setLatLng(data[i]).setOpacity(1.0);
				}
				for (var i = data.length; i < markers.length; i++)
					markers[i].setOpacity(0.0);
			}
		}
		var polylineClick = function (e) {
			if (el.sectionSelected) 
				el.sectionSelected(polylines.indexOf(e.target));
		}

	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewerMaps = function (params) {
		viewerMaps(this, params);
		return this;
	}
})(jQuery);