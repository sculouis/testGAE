'use strict';

var App = angular.module('App', ['ngRoute']);

App.factory('myHttpInterceptor', function($rootScope, $q) {
    return {
        'requestError': function(config) {
            $rootScope.status = 'HTTP REQUEST ERROR ' + config;
            return config || $q.when(config);
        },
        'responseError': function(rejection) {
            $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
                rejection.data;
            return $q.reject(rejection);
        },
    };
});

App.factory('guestService', function($rootScope, $http, $q, $log) {
    $rootScope.status = 'Retrieving data...';
    var deferred = $q.defer();
    $http.get("/products/1/5")
        .success(function(data, status, headers, config) {
            $rootScope.products = data;
            deferred.resolve();
            $rootScope.status = '';
        });
    return deferred.promise;
});

App.config(function($routeProvider) {
    $routeProvider.when('/', {
        // controller:  'IndexCtrl',
        templateUrl: '/partials/home.html',
    });

    $routeProvider.when('/productmain', {
        controller: 'MainCtrl',
        templateUrl: '/partials/main.html',
        resolve: {
            'guestService': 'guestService'
        },
    });

    $routeProvider.when('/invite', {
        controller: 'InsertCtrl',
        templateUrl: '/partials/insert.html',
    });
    $routeProvider.when('/update/:id', {
        controller: 'UpdateCtrl',
        templateUrl: '/partials/update.html',
        resolve: {
            'guestService': 'guestService'
        },
    });
    $routeProvider.when('/todo', {
        controller: 'FilterCtrl',
        templateUrl: '/partials/todo.html',
    });
    $routeProvider.when('/steps', {
        templateUrl: '/partials/steps.html',
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

App.config(function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});

App.controller('IndexCtrl', function($scope, $location) {

    $(".nav li").on("click", function() {
        $(".nav li").removeClass("active");
        $(this).addClass("active");
    });

    $scope.todo = function() {
        $location.path('/todo');
    };

    $scope.pmain = function() {
        $location.path('/productmain');
    };

    $scope.steps = function() {
        $location.path('/steps');
    };

});

App.controller('MainCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {

    // $scope.setPrevNextEnabled();

    $scope.pageInit = function() {
        // body...

    $scope.pageCnt = 50;
    $scope.pagesIter = [];
    $scope.pageResult = 0;
    $scope.pageNo = 1;
    $scope.pageRecNo = 5;
    // $scope.getDatas();
    $("#Prev").addClass('disabled');
    $scope.setPages();
        $http.get("/products/count")
            .success(function(data, status, headers, config) {
                $scope.pageCnt = data[0].count;
                $log.info(data[0].count);
            });
    }

    $scope.pageView = function(oper) {
        $scope.setList(oper);
        $scope.setPages();
    }

    //設定各頁
    $scope.setPages = function() {
        // body...
        $rootScope.status = $scope.pageResult;
        $scope.pagesIter = [];
        if ($scope.pageCnt == 0) {
            $scope.pagesIter = [];
        } else {
            $scope.genPages();
        }
    }

    $scope.genPages = function() {
        // body...
        var recNo = $scope.pageRecNo;
        $scope.pagesIter = [];
        for (var i = 1; i <= 10; i++) {
            $scope.genalgo(i);
        }
    }

    $scope.genalgo = function(i) {
            // body...

            if (($scope.pageRecNo * i + ($scope.pageRecNo * $scope.pageResult * 10)) < ($scope.pageCnt + $scope.pageRecNo)) {
                $scope.pagesIter.push(($scope.pageResult * 10) + i);
            }

        }
        //設定每頁的筆數
    $scope.pageDef = function() {
        // body...
        if ($scope.r1checked == true) {
            $scope.pageRecNo = 5;
        } else if ($scope.r2checked == true) {
            $scope.pageRecNo = 10;
        }
    }

    //取得現在頁次的資料
    $scope.setPageRecNo = function() {
        $scope.pageNo = 1;
        $scope.setPrevNextEnabled();
        $scope.pageDef();
        $scope.genPages();
        $scope.getDatas();
    };


    //設定現在的頁數
    $scope.currpage = function(pageno) {
        // body...
        $scope.pageNo = pageno;
        $scope.setPrevNextEnabled();
        $scope.getDatas();
    }

    $scope.setPrevNextEnabled = function() {
        // body...
        if ($scope.pageNo == 1) {
            $("#Prev").addClass('disabled');
        } else {
            $("#Prev").removeClass();
        }
        if ((($scope.pageRecNo * $scope.pageNo) + $scope.pageRecNo) > $scope.pageCnt) {
            $("#Next").addClass('disabled');
        } else {
            $("#Next").removeClass();
        }
    }

    //設定現在頁次無法按
    $scope.setAct = function(pageno) {
        // body...
        if (pageno == $scope.pageNo) {
            return "active";
        }
    }

    //向後端取得資料
    $scope.getDatas = function() {
        $rootScope.status = 'Retrieving data...';
        var poffSet = ($scope.pageNo - 1) * $scope.pageRecNo;
        $http.get("/products/" + poffSet + "/" + $scope.pageRecNo)
            .success(function(data, status, headers, config) {
                $rootScope.products = data;
            });
        $rootScope.status = '';
    }

    //設定前10頁，後10頁的值
    $scope.setList = function(oper) {
        // body...
        // 1是Prev,2是Next
        if (oper == 1) {
            if ($scope.pageResult <= 0) { //小於0規0
                $scope.pageResult = 0;
            } else {
                $scope.pageResult -= 1;
            }
        } else {
            if (($scope.pageResult + 1) * 10 * $scope.pageRecNo < $scope.pageCnt) {
                $scope.pageResult += 1;
            }
        }
    }

    $scope.invite = function() {
        $location.path('/invite');
    };


    $scope.update = function(guest) {
        $location.path('/update/' + guest.id);
    };

    $scope.setGuest = function(argument) {
        // body...
        $rootScope.currentguest = argument;
        $log.info($rootScope.currentguest);

    };

    $scope.delete = function(guest) {
        $('#myModal').modal('hide')
        $scope.status = 'Deleting guest ';
        // $log.info($rootScope.currentguest);

        $rootScope.status = 'Deleting guest ' + $rootScope.currentguest.id + '...';
        $http.delete('/products', {
                'id': $rootScope.currentguest.id
            })
            .success(function(data, status, headers, config) {
                for (var i = 0; i < $rootScope.products.length; i++) {
                    if ($rootScope.products[i].id == $rootScope.currentguest.id) {
                        $rootScope.products.splice(i, 1);
                        break;
                    }
                }
                $rootScope.status = '';
            });
    };

    $scope.pclick = function(myid) {
        $rootScope.status = myid;
    };

});

App.controller('InsertCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {
    $scope.submitInsert = function() {
        var product = {
            Product_Id: $scope.Product_Id,
            Product_Name: $scope.Product_Name,
            Catalog_Id: $scope.Catalog_Id,
        };
        $rootScope.status = 'Creating...';
        $http.post('/products', product)
            .success(function(data, status, headers, config) {
                $rootScope.products.push(data);
                $rootScope.status = '';
            });
        history.back();
        // $location.path('/');
    };

    $scope.hback = function() {
        // body...
        history.back();
        // $log.info("back");
    };
});

App.controller('UpdateCtrl', function($routeParams, $rootScope, $scope, $log, $http, $location) {
    for (var i = 0; i < $rootScope.products.length; i++) {
        if ($rootScope.products[i].id == $routeParams.id) {
            $scope.product = angular.copy($rootScope.products[i]);
        }
    }
    $scope.submitUpdate = function() {
        $rootScope.status = 'Updating...';
        $http.put('/products', $scope.product)
            .success(function(data, status, headers, config) {
                for (var i = 0; i < $rootScope.products.length; i++) {
                    if ($rootScope.products[i].id == $scope.product.id) {
                        $rootScope.products.splice(i, 1);
                        break;
                    }
                }
                $rootScope.products.push(data);
                $rootScope.status = '';
            });
        // $location.path('/');
        history.back();
    };

    $scope.hback = function() {
        // body...
        history.back();
        // $log.info("back");
    };

});

App.controller('FilterCtrl', function($scope, $rootScope, $log) {
    $scope.num = 1234.56789;
});
