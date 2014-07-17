var mCurrent = {
	Line : 0,
	Station : 0,
	Index : 0
};
var mHint;

$(document).ready(function () {
	mHint = $("<div></div>");
	mHint.css({
		"position": "fixed",
		"background": "black",
		"border": "1px ridge white",
		"text-align": "center"
	});
	mHint.hide();
	$('body').append(mHint);
	$("#viewer").width($(window).width() - 274);
	$("#viewer").height($(window).height() - 16);
	$("#canvas").width($(window).width() - 274);
	$("#canvas").height($(window).height() - 16);
	$("#buttons").width($(window).width() - 324);
	$("#next").click(function () {
		mCurrent.Index = mCurrent.Index + 1;
		loadImg(mCurrent.Line, mCurrent.Station, mCurrent.Index);
	});
	$("#prev").click(function () {
		mCurrent.Index = mCurrent.Index - 1;
		loadImg(mCurrent.Line, mCurrent.Station, mCurrent.Index);
	});
	$("li li").click(function () {
		mCurrent.Line = $(this).parent().parent().index();
		mCurrent.Station = $(this).index();
		$(this).siblings().attr("class", "");
		$(this).parent().parent().siblings().children().children().attr("class", "");
		$(this).attr("class", "selected");
		getStationInfo(mCurrent.Line, mCurrent.Station);
		if (!mMap) {
			return;
		}
		var view = [
			new TLngLat(mStationCoordinates[mCurrent.Line][mCurrent.Station][0], mStationCoordinates[mCurrent.Line][mCurrent.Station][1]),
			new TLngLat(mStationCoordinates[mCurrent.Line][mCurrent.Station + 1][0], mStationCoordinates[mCurrent.Line][mCurrent.Station + 1][1])
		];
		mMap.setViewport(view);
	});
});	

var mStationCoordinates = 
[
	[ // Line 12
		[121.54832, 31.28205], // Aiguo Rd
		[121.55696, 31.28295], // Fuxingdao Island
		[121.57472, 31.28466], // Donglu Rd
		[121.58561, 31.28225], // Jufeng Rd
		[121.59895, 31.28232], // North Yanggao Rd
		[121.61037, 31.28201], // Jinjing Rd
		[121.62281, 31.28235], // Shenjiang Rd
		[121.63448, 31.26562]  // Jinhai Rd
	],
	[ // Line 13
		[121.37701, 31.23427], // Zhenbei Rd
		[121.36301, 31.23945], // South Qilianshan Rd
		[121.35081, 31.24445], // Fengzhuang
		[121.33067, 31.24312], // West Jinshajiang Rd
		[121.31425, 31.24299]  // Jinyun Rd
	]
];