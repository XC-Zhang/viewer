angular.module('Viewer')

.directive('toggle', [function () {
	return {
		restrict: 'EA',
		templateUrl: 'partials/toggle.html',
		controller: function ($scope) {
			$scope.switchable = false;
			$scope.$root.$watch('current.site', function (newValue) {
				if (newValue < 0)
					$scope.switchable = false;
				else
					$scope.switchable = true;
			});
			$scope.toggle = function () {
				if ($scope.$root.focus === 'map')
					$scope.$root.focus = 'canvas';
				else
					$scope.$root.focus = 'map';
			};
		}
	};
}])

;