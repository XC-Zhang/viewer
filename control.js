// Control movement among photos in sections.

var stationlist = [
    [0, "曲阜路"],
    [0, "天潼路"],
    [0, "国际客运中心"],
    [0, "提篮桥"],
    [0, "大连路"],
    [0, "江湾公园"],
    [0, "宁国路"],
    [0, "隆昌路"],
    [0, "爱国路"],
    [0, "复兴岛"],
    [0, "东陆路"],
    [0, "巨峰路"],
    [0, "杨高北路"],
    [35, "金京路"],
    [30, "申江路"],
    [0, "金海路"]
];

var i = 1;
var j = 1;
var mStop;

// Initialize
function PhotoInit() {
    Station(14);
}

// Change station to the specified one
// index : starts from 1
// first : a boolean variable which indicates whether start from the first photo or the last photo
function Station(index, first) {
    if (index < 14 || index > 15)
        return false;
    i = index;
    $("#sectionname").text(stationlist[i - 1][1] + " - " + stationlist[i][1]);
    if (arguments.length < 2)
        j = 1;
    else if (first)
        j = 1;
    else
        j = stationlist[i - 1][0];
    LoadImg();
    //LoadJS();
    return true;
}

// Forward
function Forward() {
    if (j == stationlist[i - 1][0])
        return Station(i + 1, true);
    else {
        j++;
        LoadImg();
        return true;
    }
}

// Backward
function Backward() {
    if (j == 1) 
        return Station(i - 1, false);
    else {
        j--;
        LoadImg();
        return true;
    }
}

// Move to center of the photo
function MoveToCenter() {
    $("div.pv-inner.pv-animating").css('background-position', '7200px 0px');
}

// Load photo specified by j
function LoadImg() {
    $(".panorama img").attr(
        "src" , "img/" + ToString(i) + "/" + ToString(j) + ".jpg"
    );
    $("#photoname").text(ToString(j) + ".jpg");
    
    LoadMapAt(coordinates[j - 1][1], coordinates[j - 1][0]);
}

// Start playing photos as video
function Play() {
    $("#forward").hide();
    $("#backward").hide();
    $("#play").hide();
    $("#stop").show();
    mStop = false;
    setTimeout(PlayNext, 500);
}

// Stop playing photos
function Stop() {
    mStop = true;
    $("#forward").show();
    $("#backward").show();
    $("#play").show();
    $("#stop").hide();
}

// Switch to next photo
function PlayNext() {
    if (Forward() && !mStop)
        setTimeout(PlayNext, 500);
    else
        Stop();
}

// Convert interger to string
function ToString(num) {
    if (num < 10)
        return "0" + num.toString();
    else
        return num.toString();
}

// Load Javascript
function LoadJS() {
    $("<script></script>").attr({
        src : "img/" + ToString(i) + "/coordinates.js",
        type: "text/javascript",
        id  : "load"
    }).appendTo($("head").remove("#loadscript"));
}

var coordinates = [
[ 31.2818300, 121.6118578],
[ 31.2818850, 121.6121450],
[ 31.2817900, 121.6122319],
[ 31.2818458, 121.6125928],
[ 31.2819050, 121.6126878],
[ 31.2818028, 121.6130519],
[ 31.2819178, 121.6130928],
[ 31.2817939, 121.6134519],
[ 31.2819228, 121.6136878],
[ 31.2819550, 121.6139350],
[ 31.2819689, 121.6141939],
[ 31.2819028, 121.6144989],
[ 31.2819339, 121.6147378],
[ 31.2819089, 121.6149958],
[ 31.2818900, 121.6154308],
[ 31.2819158, 121.6161328],
[ 31.2818678, 121.6164058],
[ 31.2819650, 121.6166550],
[ 31.2820300, 121.6172000],
[ 31.2820289, 121.6172319],
[ 31.2821578, 121.6173258],
[ 31.2820650, 121.6176928],
[ 31.2820839, 121.6179858],
[ 31.2820858, 121.6182400],
[ 31.2820750, 121.6185058],
[ 31.2821478, 121.6187169],
[ 31.2820578, 121.6190600],
[ 31.2820778, 121.6192808],
[ 31.2821439, 121.6194769],
[ 31.2822228, 121.6198378],
[ 31.2821500, 121.6201358],
[ 31.2821369, 121.6204028],
[ 31.2821508, 121.6207969],
[ 31.2822119, 121.6209400],
[ 31.2823419, 121.6212250],
];
