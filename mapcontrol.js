// Control of Baidu Map

var BaiduMap;
var Marker;

// Initialize Baidu Map
function MapInit() {
    if (BMap.Map == null)
        return;
    BaiduMap = new BMap.Map("baidumaps");
    BaiduMap.enableScrollWheelZoom();
    $("#baidumaps").css("z-index", 1);
    $("#baidumaps").css("position", "fixed");
}

// Load map at a specified point
function LoadMapAt(longitude, latitude) {
    if (BMap.Point == null)
        return;
    original = new BMap.Point(longitude, latitude);
    BMap.Convertor.translate(original, 0, convertorCallback);
}

// Callback used in BMap.Convertor.translate
function convertorCallback(point)
{
    UpdateMap(point);
}

// Update map in ImgElement
function UpdateMap(point)
{
    BaiduMap.centerAndZoom(point, 18);
    // Hide last marker if it exists
    if (Marker)
        Marker.hide();
    // Add new marker
    Marker = new BMap.Marker(point);
    BaiduMap.addOverlay(Marker);
}
