angular.module('boat', [])
    .controller('boatController',['$scope', function ($scope){

        $scope.power = false;

        /* 1 = forward */
        $scope.direction = 1;
        $scope.directionText = 'Forward';

        $scope.speed = 0;
        $scope.turn = 90;

        $scope.togglePower = function () {
            console.log('switching power');
            $scope.power = ($scope.power === false) ? true: false;
        };

        $scope.toggleDirection = function () {

            if ($scope.direction === 1) {
                $scope.direction = 0;
                $scope.directionText = 'Reverse';
            } else {
                $scope.direction = 1;
                $scope.directionText = 'Forward';
            }
        };
}]);
