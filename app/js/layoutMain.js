/// <reference path="../plugins/ng-grid-reorderable.js" />
/// <reference path="../ng-grid-1.0.0.debug.js" />
var plugins = {};
function userController($scope,$http) {
    var self = this;	
    $('body').layout({
        applyDemoStyles: true,
        center__onresize: function (x, ui) {
            // may be called EITHER from layout-pane.onresize OR tabs.show
            plugins.ngGridLayoutPlugin.updateGridLayout();
        }
    });
	plugins.ngGridLayoutPlugin = new ngGridLayoutPlugin();
    $scope.mySelections = [];
    $scope.mySelections2 = [];
    $scope.myData = [];
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: false,
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100], //page Sizes
        pageSize: 10, //Size of Paging data
        currentPage: 1 //what page they are currently on
    };
    self.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $scope.data = $scope.loadData().filter(function (item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
            } else {
//            	$scope.loadData();
                $http.get("/products/getdata")
                .success(function(data, status) {
                	$scope.data = data;
                });

            }
            var pagedData = $scope.data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = $scope.data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, 100);
    };

    $scope.loadData = function(){
        $http.get("/products/getdata")
        .success(function(data, status) {
        	$scope.data = data;
        });
        }
    
    $scope.$watch('pagingOptions', function () {
        self.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }, true);
    $scope.$watch('filterOptions', function () {
        self.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }, true);
    self.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = {
		data: 'myData',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
        selectedItems: $scope.mySelections,
        showSelectionCheckbox: true,
        multiSelect: true,
        showGroupPanel: false,
        showColumnMenu: true,
        enableCellSelection: true,
        enableCellEditOnFocus: true,
		plugins: [plugins.ngGridLayoutPlugin],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        filterOptions: $scope.filterOptions,
        pagingOptions: $scope.pagingOptions,
        columnDefs: [{ field: 'Product_Id', displayName: 'Very Long Name Title', sortable: false},
                     { field: 'Product_Name', width: 120, },
                     { field: 'Catalog_Id', width: '120px', resizable: false }]
    };    
};