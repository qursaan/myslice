var myApp = angular.module('myApp', []);
myApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
myApp.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        if (exception.message.contains('leases')) {
            console.log(exception.message);
            
            var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
            tmpScope.initSlots(_schedulerCurrentCellPosition, _schedulerCurrentCellPosition + SchedulerTotalVisibleCells);
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
        //Pagin
        this.scope.totalPages = 4;
        this.scope.curPage = 0;
        this.scope.pageSize = 25;

        $scope.resources = SchedulerDataViewData;
        $scope.slots = SchedulerSlotsViewData;
        //$scope.msg = "hello";

        angular.element(document).ready(function() {
            //console.log('Hello World');
            //alert('Hello World');
            //afterAngularRendered();
        });

        $scope.initSchedulerResources = function (pageSize, filter) {
            for (var k = 0; k < pageSize; k++) {
                if ($scope.resources.length < SchedulerData.length)
                    $scope.resources.push(jQuery.extend(true, {}, SchedulerData[k]));
                $scope.resources[k].leases = [];
            }
            $scope.pageSize = pageSize;
            $scope.curPage = 0;
            $scope.totalPages = parseInt(Math.ceil(SchedulerData.length / $scope.pageSize));
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };

        $scope.setPage = function(page) {
            var tmpFrm = $scope.pageSize * page;
            var tmpTo = tmpFrm + $scope.pageSize;
            $scope.curPage = page;
            $scope.resources = [];
            for (var k = tmpFrm; k < tmpTo; k++) {
                if ($scope.resources.length < SchedulerData.length)
                    $scope.resources.push(jQuery.extend(true, {}, SchedulerData[k]));
                $scope.resources[k].leases = [];
            }
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };

        $scope.initSlots = function (from, to) {
            //init
            $scope.slots = [];
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

        $scope.getTimes = function (n) {
            return new Array(n);
        };

        // Return this object reference.
        return (this);

    }


    // Define the Controller as the constructor function.
    app.controller("SchedulerCtrl", Controller);


})(angular, myApp);