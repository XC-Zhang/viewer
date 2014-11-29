angular.module('Viewer', [])

.run(function ($http, $rootScope) {
	$rootScope.current = {
		line: 12,
		section: 0
	};
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