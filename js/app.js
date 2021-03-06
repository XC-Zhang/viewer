angular.module('Viewer', ['ngMaterial'])

.run(function ($http, $rootScope, $mdBottomSheet, $mdToast, $mdDialog, $window) {
	$rootScope.line = undefined;
	$rootScope.ringNumbers = undefined;
	$rootScope.current = {
		line: -1,
		section: -2,
		site: -1,
		information: undefined
	};
	$rootScope.focus = 'map';
	$rootScope.expanded = false;
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
		$http
			.get('image/' + ($rootScope.current.line - 12) + '/ringnumbers.json')
			.success(function (data) {
				$rootScope.ringNumbers = data;
			})
			.error(function () {
				console.log("error retrieving ringnumbers");
			})
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
	if ($window.innerWidth < 960)
		$mdDialog.show(
			$mdDialog.alert()
				.title('提示')
				.content('在手机上按左上角的菜单键可切换区间')
				.ariaLabel('在手机上按左上角的菜单键可切换区间')
				.ok('好')
		);
})

;