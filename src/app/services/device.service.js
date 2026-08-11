(function() {
  'use strict';
  angular.module('energyDashboard')
    .service('DeviceService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getAllDevices = function() {
        const deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          const mockDevices = [
            { id: 'dev-001', name: 'Air Conditioner', type: 'hvac', protocol: 'Wi-Fi', status: 'active', groupId: 'grp-001', isConnected: true },
            { id: 'dev-002', name: 'Refrigerator', type: 'appliance', protocol: 'Matter', status: 'active', groupId: 'grp-002', isConnected: true },
            { id: 'dev-003', name: 'Living Room Lights', type: 'lighting', protocol: 'Zigbee', status: 'active', groupId: 'grp-003', isConnected: true },
            { id: 'dev-004', name: 'Water Heater', type: 'appliance', protocol: 'Wi-Fi', status: 'idle', groupId: 'grp-002', isConnected: true },
            { id: 'dev-005', name: 'Washing Machine', type: 'appliance', protocol: 'Matter', status: 'offline', groupId: 'grp-002', isConnected: false }
          ];
          deferred.resolve(mockDevices);
        });
        return deferred.promise;
      };
      this.getDeviceById = function(deviceId) {
        const deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/' + deviceId, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.discoverDevices = function() {
        const deferred = $q.defer();
        $http.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/discover', {}, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.updateDevice = function(deviceId, updates) {
        const deferred = $q.defer();
        $http.put(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/' + deviceId, updates, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.deleteDevice = function(deviceId) {
        const deferred = $q.defer();
        $http.delete(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/' + deviceId, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.groupDevices = function(deviceIds, groupId) {
        const deferred = $q.defer();
        $http.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/group', {
          deviceIds: deviceIds,
          groupId: groupId
        }, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.controlDevice = function(deviceId, command) {
        const deferred = $q.defer();
        $http.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/' + deviceId + '/control', {
          command: command
        }, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();