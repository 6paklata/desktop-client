myApp.factory('SettingFactory', function($window) {
	return {
		setLang : function(lang) {
			$window.localStorage['lang'] = lang;
		},
		getLang : function() {
			if ($window.localStorage['lang']) {
				return $window.localStorage['lang'];
			} else {
				if (nw.global.navigator.language.indexOf('zh') >= 0) {
					return 'cn';
				} else {
					return 'en';
				}
			}
		},
		setProxy : function(proxy) {
			if ("undefined" == proxy) { 
				proxy = "";
			}
			$window.localStorage['proxy'] = proxy;
		},
		getProxy : function() {
			return $window.localStorage['proxy'] || "";
		},
		setStellarUrl : function(url) {
			$window.localStorage['stellar_url'] = url;
		},
		getStellarUrl : function(url) {
			if ($window.localStorage['stellar_url']) {
				return $window.localStorage['stellar_url'];
			}
			return this.getLang() == 'cn' ? "https://api.chinastellar.com" : 'https://horizon.stellar.org';
		},
		
		setFedNetwork : function(domain) {
			$window.localStorage['fed_network'] = domain;
		},
		getFedNetwork : function(url) {
			return $window.localStorage['fed_network'] || 'fed.network';
		},
		setFedRipple : function(domain) {
			$window.localStorage['fed_ripple'] = domain;
		},
		getFedRipple : function(url) {
			return $window.localStorage['fed_ripple'] || 'ripplefox.com';
		},
		setFedBitcoin : function(domain) {
			$window.localStorage['fed_bitcoin'] = domain;
		},
		getFedBitcoin : function(url) {
			return $window.localStorage['fed_bitcoin'] || 'naobtc.com';
		},
		
		getTradepair : function() {
			if ($window.localStorage['tradepair']) {
				return JSON.parse($window.localStorage['tradepair']);
			} else {
				return {
					base_code   : 'XLM',
					base_issuer : '',
					counter_code   : 'CNY',
					counter_issuer : 'GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX'
				}
			}
		},
		setTradepair : function(base_code, base_issuer, counter_code, counter_issuer) {
			var trade_pair = {
				base_code   : base_code,
				base_issuer : base_issuer,
				counter_code   : counter_code,
				counter_issuer : counter_issuer
			}
			$window.localStorage['tradepair'] = JSON.stringify(trade_pair);
		},
		
		getBridgeService : function() {
			return $window.localStorage['bridge_service'] || 'ripplefox.com';
		},
		setBridgeService : function(anchor_name) {
			$window.localStorage['bridge_service'] = anchor_name;
		}
	};
});

myApp.factory('FedNameFactory', function(SettingFactory, StellarApi) {
	var fed = {
		map : {}
	};
	
	fed.isCached = function(address) {
		return this.map[address] ? true : false;
	};
	
	fed.getName = function(address) {
		return this.map[address].nick;
	};
	
	fed.resolve = function(address, callback) {
		var self = this;
		
		if (!self.map[address]) {
			self.map[address] = {
				address : address,
				nick    : ""
			}
		} else {
			return callback(new Error("resolving " + address), null);
		}
		
		StellarApi.getFedName(SettingFactory.getFedNetwork(), address, function(err, name){
			if (err) {
				console.error(address, err);
			} else {
				self.map[address].nick = name;
			}
			return callback(null, self.map[address])
		});
	};
	
	return fed;
});

myApp.factory('RemoteFactory', function($http) {
	var remote = {};
	
	function getResource(url, callback){
		console.debug('GET: ' + url);
		$http({
			method: 'GET',
			url: url
		}).then(function(res) {
			if (res.status != "200") {
				callback(res, null);
			} else {
				callback(null, res.data);
			}
		}).catch(function(err) {
			callback(err, null);
		});
	}
	
	// Poor network in China, need a backup data source
	remote.getIcoAnchors = function(callback) {
		var self = this;
		var url = 'https://stellarchat.github.io/ico/data/anchor.json';
		var backup = 'https://ico.stellar.chat/data/anchor.json';
		
		getResource(url, function(err, data) {
			if (err) {
				console.error(err);
				getResource(backup, function(err, data){
					return callback(err, data);
				});
			} else {
				return callback(null, data);
			}
		});
	};
	
	return remote;
});