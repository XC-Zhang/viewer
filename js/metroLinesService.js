angular.module("Viewer")

.factory("metroLines", ["$http", "$q", function ($http, $q) {
    return $q
        .all([
            $http
                .get("data/lines.json")
                .then(function (response) {
                    return response.data;
                }),
            $http
                .get("data/stations.json")
                .then(function (response) {
                    return response.data;
                })
        ])
        .then(function (data) {
            L.control.addOverlay(L.geoJson(null, {
                style: function (feature) {
                    return {
                        color: feature.properties.Color,
                        fillOpacity: 1,
                        opacity: 0.9
                    };
                },
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 2,
                        fillColor: "#157873",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                onEachFeature: function(feature, layer) {
                    if (feature.geometry.type === "Point" && feature.properties.Name)
                        layer.bindPopup(feature.properties.Name);
                }
            }).addData(data[0]).addData(data[1]).addTo(map), "线路图");
        });
}])

;