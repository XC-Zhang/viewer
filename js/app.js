angular.module('Viewer', [])

.value('current', {
	line: 12,
	section: 0,
})

.run(function ($http, $rootScope, current) {
	$http
		.get('image/' + (current.line - 12) + '/lineinfo.json')
		.success(function (data) {
			$rootScope.line = data;
		})
		.error(function () {
			console.log("error retrieving line information");
		});
})

;