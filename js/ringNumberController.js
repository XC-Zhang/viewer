angular.module('Viewer')

.directive('ringnumber', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/ringnumber.html',
		controller: function ($scope, $mdToast) {
			var refresh = function (obj) {
				$scope.ringNumber = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Number;
				$scope.mileage = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Mileage;
				$scope.warning = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Warning;
				$scope.date = obj.date.replace(/\//g, '-');
			};
			$scope.warning = false;
			$scope.$root.$watch('current.site', function (newValue) {
				if (newValue < 0)
					return;
				else {
					refresh($scope.$root.current.information[newValue]);
				}
			});
			$scope.$root.$watch('current.information', function (newValue) {
				if (!newValue || $scope.$root.current.site < 0)
					return;
				else {
					refresh(newValue[$scope.$root.current.site]);
				}
			});
		}
	};
}])

;