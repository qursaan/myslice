var myApp = angular.module('myApp', []);
myApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
myApp.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        if (exception.message.contains('leases')) {
            console.log(exception.message);
            
            var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
            //tmpScope.initSlots(_schedulerCurrentCellPosition, _schedulerCurrentCellPosition + SchedulerTotalVisibleCells);
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
        $scope.totalPages = 4;
        $scope.curPage = 0;
        this.scope.pageSize = 25;

        $scope.resources = new Array();
        $scope.slots = SchedulerSlotsViewData;
        //$scope.msg = "hello";

        angular.element(document).ready(function() {
            //console.log('Hello World');
            //alert('Hello World');
            //afterAngularRendered();
        });

        $scope.clearStuff = function() {
            $scope.resources = new Array();
            $scope.$apply();
        }

        $scope.initSchedulerResources = function (pageSize) {
            $scope.resources = new Array();

            for (var k = 0; k < pageSize; k++) {
                $scope.resources.push(jQuery.extend(true, {}, SchedulerDataViewData[k]));
                $scope.resources[k].leases = [];
            }
            $scope.pageSize = pageSize;
            $scope.curPage = 0;
            $scope.totalPages = parseInt(Math.ceil(SchedulerDataViewData.length / $scope.pageSize));
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };

        $scope.setPage = function(page) {
            var tmpFrm = $scope.pageSize * page;
            var tmpTo = tmpFrm + $scope.pageSize;
            tmpTo = SchedulerDataViewData.length < tmpTo ? SchedulerDataViewData.length : tmpTo;
            $scope.curPage = page;
            $scope.resources = [];
            var j = 0;
            for (var k = tmpFrm; k < tmpTo; k++) {
                $scope.resources.push(jQuery.extend(true, {}, SchedulerDataViewData[k]));
                $scope.resources[j].leases = [];
                j++;
            }
            //fix slider
            $('#tblSlider').slider('value', 0);
            //init Slots
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };

        $scope.initSlots = function (from, to) {
            //init
            $scope.slots = [];

            var resourceIndex; //gia to paging
            //set
            for (var i = from; i < to; i++) {
                $scope.slots.push(SchedulerSlots[i]);
                resourceIndex = $scope.pageSize * $scope.curPage;
                for (var j = 0; j < $scope.resources.length; j++) {
                    if (i == from) {
                        $scope.resources[j].leases = [];
                    }
                    $scope.resources[j].leases.push(SchedulerDataViewData[resourceIndex].leases[i]);
                    resourceIndex++;
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
            //$scope.$apply(function() {
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
            //});
        };

        $scope.getPageNumbers = function () {
            var totalNumbersShowned = ($scope.totalPages > 10 ? 10 : $scope.totalPages + 1 );
            var tmtNumDiv = totalNumbersShowned / 2;
            //local
            var numFrom = 1;
            var numTo = totalNumbersShowned;
            var rtrnArr = new Array();

            if (totalNumbersShowned > 1) {
                //set from - to
                if ($scope.totalPages > totalNumbersShowned) {
                    if ($scope.curPage <= tmtNumDiv) {
                        //nothing
                    } else if ($scope.curPage >= $scope.totalPages - tmtNumDiv) {
                        numTo = $scope.totalPages;
                        numFrom = numTo - totalNumbersShowned;
                    } else {
                        numFrom = $scope.curPage - tmtNumDiv;
                        numTo = numFrom + totalNumbersShowned;
                    }
                }

                for (var i = numFrom; i < numTo; i++)
                    rtrnArr.push(i);
            } else {
                rtrnArr.push(1);
            }
            return rtrnArr;
        };

        // Return this object reference.
        return (this);

    }


    // Define the Controller as the constructor function.
    app.controller("SchedulerCtrl", Controller);


})(angular, myApp);