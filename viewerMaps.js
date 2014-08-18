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
			map.fire('resize');
		}
		el.changeSize = function () {

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