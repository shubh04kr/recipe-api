const myApp = angular
  .module("myApp", ["ng-route"])
  .config("$routeProvider", function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix(""); // add configuration
    $routeProvider
      .when("/search", {
        templateUrl: "recipe-api-main/views/recipeSearch.html",
        controller: "searchController",
      })
      .when("/detail", {
        templateUrl: "recipe-api-main/views/recipeDetail.html",
        controller: "myController",
      })
      .when("/login", {
        templateUrl: "recipe-api-main/views/login.html",
        controller: "./components/login/login.js",
      })
      .otherwise({
        redirectTo: "/search",
      });
  })
  .controller("searchController", function ($scope, $http) {
    const APP_ID = "d8c55356";
    const API_ID = "d6116be590dc355c9fdd3824299c54fd";
    $scope.query = "";
    $scope.searchRecipe = function (query) {
      console.log("searchRecipe");

      const url = `https://api.edamam.com/api/recipes/v2?app_id=${APP_ID}&app_key=${API_ID}&q=${query}&type=public`;
      $http
        .get(url)
        .then((response) => {
          console.log(response.data.hits[0].image);
          // console.log(response.data.hits[0].images.THUMBNAIL);
          console.log(response.data.hits);
          $scope.recipes = response.data.hits;
        })
        .catch();
    };
  })
  .controller("detailController", function ($scope, $http) {
    console.log("detailController");
    const APP_ID = "d8c55356";
    const API_ID = "d6116be590dc355c9fdd3824299c54fd";
    $scope.query = "";
    $scope.searchRecipe = function (query) {
      console.log("searchRecipe");

      const url = `https://api.edamam.com/api/recipes/v2?app_id=${APP_ID}&app_key=${API_ID}&q=${query}&type=public`;
      $http
        .get(url)
        .then((response) => {
          console.log(response.data.hits[0].image);
          // console.log(response.data.hits[0].images.THUMBNAIL);
          console.log(response.data.hits);
          $scope.recipes = response.data.hits;
        })
        .catch();
    };
  });
