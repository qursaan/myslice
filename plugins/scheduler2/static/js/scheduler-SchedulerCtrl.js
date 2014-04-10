var myApp = angular.module('myApp', []);
myApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
myApp.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        if (exception.message.contains('leases')) {
            console.log(exception.message);
            angular.element(document.getElementById('SchedulerCtrl')).scope().initSlots(_schedulerCurrentCellPosition, _schedulerCurrentCellPosition + SchedulerTotalVisibleCells);
        }
            
    };
});

// Create a private execution space for our controller. When
// executing this function expression, we're going to pass in
// the Angular reference and our application module.
(function (ng, app) {


    // Define our Controller constructor.
    function Controller($scope) {

        // Store the scope so we can reference it in our
        // class methods
        this.scope = $scope;

        // Set up the default scope value.
        this.scope.errorMessage = null;
        this.scope.name = "";

        $scope.resources = SchedulerDataViewData;
        $scope.slots = SchedulerSlotsViewData;
        //$scope.msg = "hello";

        angular.element(document).ready(function() {
            //console.log('Hello World');
            //alert('Hello World');
            //afterAngularRendered();
        });

        $scope.moveFrontSlot = function(from, to) {
            //$scope.slots.shift();
            //$scope.slots.push(SchedulerSlots[to]);
            //for (var j = 0; j < $scope.resources.length; j++) {
            //    $scope.resources[j].leases.shift();
            //    $scope.resources[j].leases.push(SchedulerData[j].leases[to]);
            //}
            //try {
            //    $scope.$digest();
            //    //$scope.$apply();
            //} catch (err) {
            //    $scope.initSlots(from, to);
            //}
            $scope.initSlots(from, to);
        };

        $scope.moveBackSlot = function(from, to) {
            $scope.$apply(function() {
                //try {
                //    $scope.slots.pop();
                //    $scope.slots.unshift(SchedulerSlots[from]);
                //    for (var j = 0; j < $scope.resources.length; j++) {
                //        $scope.resources[j].leases.pop();
                //        $scope.resources[j].leases.unshift(SchedulerData[j].leases[from]);
                //    }
                //} catch (err) {
                //    alert("error");
                //}

                $scope.initSlots(from, to);
            });
        };

        $scope.initSlots = function(from, to) {
            //init
            $scope.slots = [];
            for (var k = 0; k < SchedulerData.length; k++) {
                if ($scope.resources.length < SchedulerData.length)
                    $scope.resources.push(jQuery.extend(true, {}, SchedulerData[k]));
                $scope.resources[k].leases = [];
            }
            //set
            for (var i = from; i < to; i++) {
                $scope.slots.push(SchedulerSlots[i]);
                for (var j = 0; j < $scope.resources.length; j++) {
                    $scope.resources[j].leases.push(SchedulerData[j].leases[i]);
                }
            }
            //apply
            $scope.$apply();
        };


        // Return this object reference.
        return (this);

    }


    // Define the Controller as the constructor function.
    app.controller("SchedulerCtrl", Controller);


})(angular, myApp);