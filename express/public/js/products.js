angular.module('productsApp', ['ngRoute'])

	.config(['$routeProvider',
		function ($routeProvider) {
			$routeProvider.
				when('/', {
					templateUrl: 'partials/product_list.html',
					controller: 'ProductListController'
				}).
				when('/products/:ProductID', {
					templateUrl: 'partials/product_page.html',
					controller: 'ProductPageController'
				}).
				otherwise({
					redirectTo: '/'
				});
		}])

	.controller('ProductListController', function ($scope, $http) {
		var _this = this;
		$scope.products = _this;

		$http.get('http://zidaroiu.com:3000/api/products').success(function (data) {
			$scope.list = data.map(function (product) {
				product.price = product.price.formatMoney(2, '.', ',');
				return product;
			})
		});

		$scope.list = [];

		_this.delete = function (ProductID) {
			$http.delete('http://zidaroiu.com:3000/api/products/' + ProductID).success(function () {
				$scope.list = $scope.list.filter(function (product) {
					if (product.ProductID == ProductID) return false;
					else return true;
				});
			});
		};

		_this.add = function () {
			$http.put('http://zidaroiu.com:3000/api/products', {
				name: _this.name,
				description: _this.description,
				price: _this.price
			}).success(function (data) {
				$scope.list.push({
					ProductID: data.ProductID,
					name: _this.name,
					price: parseFloat(_this.price).formatMoney(2, '.', ',')
				});
				_this.name = '';
				_this.price = '';
				_this.description = '';
			});
		};
	})

	.controller('ProductPageController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
		var _this = this;
		$scope.comments = _this;
		$scope.list = [];

		$http.get('http://zidaroiu.com:3000/api/comments?filter[where][ProductID]=' + $routeParams.ProductID).success(function (data) {
			$scope.list = data;
			$http.get('http://zidaroiu.com:3000/api/products/' + $routeParams.ProductID).success(function (data) {
				data.price = parseFloat(data.price).formatMoney(2, '.', ',')
				_this.product = data;
			});
		});

		var history = [];
		$scope.$on('$routeChangeSuccess', function () {
			history.push($location.$$path);
		});

		_this.back = function () {
			var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
			$location.path(prevUrl);
		};

		_this.add = function () {
			$http.put('http://zidaroiu.com:3000/api/comments', {
				content: _this.content,
				ProductID: _this.product.ProductID
			}).success(function (data) {
				$scope.list.push({
					content: _this.content
				});
				_this.content = '';
			});
		};

		_this.delete = function (CommentID) {
			$http.delete('http://zidaroiu.com:3000/api/comments/' + CommentID).success(function () {
				$scope.list = $scope.list.filter(function (comment) {
					if (comment.CommentID == CommentID) return false;
					else return true;
				});
			});
		};
	}]);

Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};