const app = angular.module("myApp", ["ngRoute"]);
app
  .config(["$routeProvider", "$locationProvider", RouteConfig])
  .controller("searchController", searchController)
  .controller("detailController", detailController)
  .controller("favorateController", favorateController)
  .controller("addRecipeController", addRecipeController)
  .controller("recipeViewController", recipeViewController);

function RouteConfig($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./views/home.html",
    })
    .when("/search", {
      templateUrl: "./views/recipeSearch.html",
      controller: searchController,
    })
    .when("/detail/:url", {
      templateUrl: "./views/recipeDetail.html",
      controller: detailController,
    })
    .when("/add", {
      templateUrl: "./views/recipeAdd.html",
      controller: addRecipeController,
    })
    .when("/yourRecipes", {
      templateUrl: "./views/recipeView.html",
      controller: recipeViewController,
    })
    .when("/favorates", {
      templateUrl: "./views/favorates.html",
      controller: favorateController,
    })
    .otherwise({
      redirectTo: "/",
    });
  // $locationProvider.html5Mode(true);
}

app.directive("directiveWhenScrolled", function () {
  return function (scope, elm, attr) {
    var raw = elm[0];

    elm.bind("scroll", function () {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.directiveWhenScrolled);
      }
    });
  };
});

function favorateController($scope, $http) {
  const url = "http://localhost:3000/favorates";
  $http.get(url).then((response) => {
    $scope.recipes = response.data;
  });

  $scope.removeFromFavorate = (id) => {
    $http({
      url: `http://localhost:3000/favorates/${id}`,
      method: "DELETE",
    }).then((response) => {
      $http.get(url).then((response) => {
        $scope.recipes = response.data;
      });
    });
  };
}

function addRecipeController($scope, $http) {
  $scope.addRecipe = () => {
    $http({
      url: "http://localhost:3000/recipes",
      method: "POST",
      data: $scope.recipe,
    }).then((response) => {
      Swal.fire("New Recipe Added!!", "success");
      $scope.recipe.title = "";
      $scope.recipe.cuisine = "";
      $scope.recipe.dishType = "";
      $scope.recipe.calorie = "";
    });
  };
}

function searchController($scope, $http) {
  const APP_ID = "d8c55356";
  const API_ID = "d6116be590dc355c9fdd3824299c54fd";
  $scope.query = "";
  $scope.nextPageFlag = false;
  $scope.gridFlag = false;

  let counter = 0;
  $scope.loadMore = function () {
    $scope.limit += 5;
    console.log("load more");
  };

  $scope.loadMore();

  $scope.searchRecipe = function (query) {
    const url = `https://api.edamam.com/api/recipes/v2?app_id=${APP_ID}&app_key=${API_ID}&q=${query}&type=public`;
    $http
      .get(url)
      .then((response) => {
        $scope.recipes = response.data.hits;
        $scope.nextPageUrl = response.data._links.next.href;
        $scope.nextPageFlag = true;
        $scope.prevPageUrl = url;
        console.log("prevpageurl", $scope.prevPageUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  $scope.addToFavorate = (recipe) => {
    $http({
      url: "http://localhost:3000/favorates",
      method: "POST",
      data: recipe,
    }).then((response) => {
      console.log("Added to favorate");
      Swal.fire("Added to Favorate", "success");
    });
  };
  $scope.nextPage = (url) => {
    $http.get(url).then((response) => {
      $scope.recipes = response.data.hits;
      $scope.nextPageUrl = response.data._links.next.href;
      $scope.nextPageFlag = true;
      $scope.prevPageUrl = url;
    });
  };
  $scope.prevPage = (url) => {
    console.log("url", url);
    $http.get(url).then((response) => {
      console.log("in http", response.data.hits[19]);
      $scope.recipes = response.data.hits;
      $scope.nextPageUrl = response.data._links.next.href;
      $scope.nextPageFlag = true;
      $scope.prevPageUrl = url;
    });
  };
}

function detailController($scope, $http, $routeParams) {
  const APP_ID = "d8c55356";
  const API_ID = "d6116be590dc355c9fdd3824299c54fd";

  // $scope.searchSpecificRecipe = (query) {

  const url = `https://api.edamam.com/api/recipes/v2/${$routeParams.url}?app_id=${APP_ID}&app_key=${API_ID}&type=public`;

  $http
    .get(url)
    .then((response) => {
      $scope.recipe = response.data.recipe;
    })
    .catch((error) => {});
  // };
}

function recipeViewController($scope, $http) {
  $scope.recipes = "";
  $scope.editFlag = false;
  const url = "http://localhost:3000/recipes";
  $http.get(url).then((response) => {
    $scope.recipes = response.data;
  });

  $scope.deleteRecipe = (recipe) => {
    const url = `http://localhost:3000/recipes/${recipe.id}`;
    $http({
      url,
      method: "DELETE",
    }).then((response) => {
      console.log("DELETED");
      Swal.fire("DELETED");
      const url = "http://localhost:3000/recipes";

      $http.get(url).then((response) => {
        $scope.recipes = response.data;
      });
    });
  };

  $scope.editRecipe = (recipe) => {
    $http({
      url: `http://localhost:3000/recipes/${recipe.id}`,
      method: "PATCH",
      data: recipe,
    }).then((response) => {
      Swal.fire("EDITED");
      const url = "http://localhost:3000/recipes";
      $http.get(url).then((response) => {
        $scope.recipes = response.data;
      });
    });
  };
}

//json-server --watch db.json
