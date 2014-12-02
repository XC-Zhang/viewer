angular.module('Viewer', [])

.run(function ($http, $rootScope) {
	$rootScope.line = undefined;
	$rootScope.current = {
		line: -1,
		section: -2,
		site: -1,
		information: undefined
	};
	$rootScope.focus = 'map';
	$rootScope.$watch('current.line', function (newValue) {
		if (newValue < 0)
			return;
		$http
			.get('image/' + ($rootScope.current.line - 12) + '/lineinfo.json')
			.success(function (data) {
				$rootScope.line = data;
			})
			.error(function () {
				console.log("error retrieving line information");
			});
	});
	$rootScope.$watch('current.section', function (newValue) {
		if (newValue < 0 || $rootScope.current.line < 0)
			return;
		$rootScope.current.site = -1;
		$http
			.get('image/' + ($rootScope.current.line - 12) + '/' + newValue + '/data.json')
			.success(function (data) {
				$rootScope.current.information = data;
			});
	});
})

;