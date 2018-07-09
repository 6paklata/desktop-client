/* global myApp */
myApp.controller('simpleNetworkCtrl', ['$rootScope', '$scope', '$route', '$window', '$location', '$timeout', 'SettingFactory', 'StellarApi', function( $rootScope,  $scope, $route, $window, $location, $timeout, SettingFactory ,  StellarApi ) {

  if($window.localStorage['launched']) {
    $location.path("/");
  }

  $scope.active_network = SettingFactory.getNetworkType();
  $scope.active_horizon = SettingFactory.getStellarUrl();
  $scope.active_passphrase = SettingFactory.getNetPassphrase();
  $scope.active_coin = SettingFactory.getCoin();
  $scope.network_type = SettingFactory.getNetworkType();
  $scope.network_horizon = SettingFactory.getStellarUrl();
  $scope.network_passphrase = SettingFactory.getNetPassphrase();
  $scope.network_coin = SettingFactory.getCoin();
  $scope.all_networks = SettingFactory.NETWORKS;

  $scope.fed_network = SettingFactory.getFedNetwork();
  $scope.fed_ripple  = SettingFactory.getFedRipple();
  $scope.fed_bitcoin = SettingFactory.getFedBitcoin();

  $scope.set = function(type) {
    $scope.network_type = type;
    $scope.network_horizon = SettingFactory.getStellarUrl(type);
    $scope.network = SettingFactory.NETWORKS[type];
    if(type === 'other') {
      $scope.network_passphrase = SettingFactory.getNetPassphrase(type);
      $scope.network_coin = SettingFactory.getCoin(type);
    }
  }

  $scope.save = function() {
    $window.localStorage['launched'] = true;
    try {
      SettingFactory.setNetworkType($scope.network_type);
      SettingFactory.setStellarUrl($scope.network_horizon);
      SettingFactory.setNetPassphrase($scope.network_passphrase);
      SettingFactory.setCoin($scope.network_coin);

      $scope.active_network = SettingFactory.getNetworkType()
      $scope.active_horizon = SettingFactory.getStellarUrl()
      $scope.active_passphrase = SettingFactory.getNetPassphrase()
      $scope.active_coin = SettingFactory.getCoin()

      StellarApi.setServer($scope.active_horizon, $scope.active_passphrase, SettingFactory.getAllowHttp());
      StellarApi.logout();
      $rootScope.reset();
      $rootScope.$broadcast('$authUpdate');  // workaround to refresh and get changes into effect.
      location.reload();

    } catch (e) {
      console.error(e);
      $scope.network_error = e.message;
    }
  };

}]);
