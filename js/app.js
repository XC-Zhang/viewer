angular.module('Viewer', [])

.run(function ($http, $rootScope) {
	$rootScope.line = undefined;
	$rootScope.current = {
		line: 12,
		section: -2,
		site: 0,
		information: undefined
	};
	$rootScope.$watch('current.section', function (newValue) {
		if (newValue < 0)
			return;
		$rootScope.current.site = 0;
		$http
			.get('image/' + ($rootScope.current.line - 12) + '/' + newValue + '/data.json')
			.success(function (data) {
				$rootScope.current.information = data;
			});
	});
	$http
		.get('image/' + ($rootScope.current.line - 12) + '/lineinfo.json')
		.success(function (data) {
			$rootScope.line = data;
		})
		.error(function () {
			console.log("error retrieving line information");
		});
})

;