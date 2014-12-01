angular.module('Viewer')

.directive('map', [function () {
	return {
		restrict: 'E',
		controller: function ($scope) {
			var markers = [];
			var map = L.map(
				'map',
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
						reuseTiles: true,
						zIndex: 0
					}
				), 
				L.tileLayer(
					"http://{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}", 
					{ 
						attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
						subdomains: ["t2", "t3", "t4", "t5", "t6"], 
						detectRetina: true, 
						reuseTiles: true,
						zIndex: 0
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
						subdomains: ["t2", "t3", "t4", "t5", "t6"],
						zIndex: 0
					}
				),
				L.tileLayer(
					"http://{s}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}", 
					{ 
						attribution: "&copy; <a href='http://www.tianditu.com/map/index.html'>天地图</a>", 
						detectRetina: !0, 
						reuseTiles: !0, 
						subdomains: ["t2", "t3", "t4", "t5", "t6"],
						zIndex: 0
					}
				)
			]);
			L.control.layers({
				"天地图": layerGroup1,
				"天地图影像": layerGroup2
			}).addTo(map);
			layerGroup1.addTo(map);

			$scope.$root.$watch('line', function (newValue) {
				if (!newValue) 
					return;
				map.fitBounds(L.latLngBounds(newValue));
			});

			$scope.$root.$watch('current.information', function (newValue) {
				if (!newValue)
					return;
				map.fitBounds(L.latLngBounds([
					$scope.$root.line[$scope.$root.current.section], 
					$scope.$root.line[$scope.$root.current.section + 1]
				]));
				if (markers.length !== 0) {
					for (var i = 0; i < markers.length; i++)
						map.removeLayer(markers[i]);
				}
				markers = [];
				for (var i = 0; i < newValue.length; i++) {
					newValue[i].lat = newValue[i].lat || 0;
					newValue[i].lng = newValue[i].lng || 0;
					markers.push(
						L.marker(
							newValue[i], 
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
					markers[i].on('click', function (e) {
						var index = markers.indexOf(e.target);
						$scope.$apply(function () {
							$scope.$root.current.site = index;
						});
					});
				}
			});

			$scope.$root.$watch('current.site', function (newValue, oldValue) {
				if (newValue >= 0 && markers[newValue]) {
					markers[newValue].setZIndexOffset(1000);
				}
				if (oldValue >= 0 && markers[oldValue])
					markers[oldValue].setZIndexOffset(0);
			});
		}
	};
}])

;