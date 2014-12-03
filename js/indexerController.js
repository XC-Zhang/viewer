angular.module('Viewer')

.directive('indexer', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/indexer.html',
		controller: function ($scope, $timeout) {
			$scope.expand = function () {
				if ($scope.$root.current.section < 0)
					return;
				$scope.$root.expanded = true;
			};
			$scope.siteSelected = function (index) {
				if (index === $scope.$root.current.site)
					return;
				$timeout(function () {
					$scope.$root.current.site = index;
				}, 500);
			};
			$scope.$root.$watch('current.section', function (newValue) {
				if (newValue < 0)
					return;
				$scope.$root.expanded = true;
			});
			$scope.$root.$watch('current.site', function (newValue) {
				if (newValue < 0)
					return;
				$scope.$root.expanded = false;
			});
		}
	};
}])

;