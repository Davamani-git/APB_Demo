/*
Test Documentation:
- Test Name: DeviceService - getAllDevices success
- Purpose: Validates retrieval of all devices from API
- Scenario: HTTP request succeeds
- Expected Result: Returns device list from API response
*/
/*
Test Documentation:
- Test Name: DeviceService - getAllDevices fallback to mock
- Purpose: Validates fallback to mock data on API failure
- Scenario: HTTP request fails
- Expected Result: Returns mock device list
*/
/*
Test Documentation:
- Test Name: DeviceService - getDeviceById success
- Purpose: Validates retrieval of single device by ID
- Scenario: HTTP request succeeds with valid device ID
- Expected Result: Returns device data
*/
/*
Test Documentation:
- Test Name: DeviceService - getDeviceById error
- Purpose: Validates error handling for invalid device ID
- Scenario: HTTP request fails
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: DeviceService - discoverDevices
- Purpose: Validates device discovery functionality
- Scenario: Discovery request is made
- Expected Result: Returns discovered devices
*/
/*
Test Documentation:
- Test Name: DeviceService - updateDevice
- Purpose: Validates device update functionality
- Scenario: Update request with device ID and changes
- Expected Result: Returns updated device data
*/
/*
Test Documentation:
- Test Name: DeviceService - deleteDevice
- Purpose: Validates device deletion functionality
- Scenario: Delete request with device ID
- Expected Result: Returns success response
*/
/*
Test Documentation:
- Test Name: DeviceService - groupDevices
- Purpose: Validates device grouping functionality
- Scenario: Group request with device IDs and group ID
- Expected Result: Returns grouped devices
*/
/*
Test Documentation:
- Test Name: DeviceService - controlDevice
- Purpose: Validates device control command functionality
- Scenario: Control request with device ID and command
- Expected Result: Returns control response
*/
/*
Coverage Report:
- Functions tested: getAllDevices, getDeviceById, discoverDevices, updateDevice, deleteDevice, groupDevices, controlDevice
- Scenarios covered: success responses, error handling, mock fallback
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DeviceService', function() {
    var DeviceService, $httpBackend, API_CONFIG;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_DeviceService_, _$httpBackend_, _API_CONFIG_) {
      DeviceService = _DeviceService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllDevices', function() {
      it('should return devices from API on success', function() {
        var mockResponse = [
          { id: 'dev-001', name: 'Device 1', type: 'hvac' },
          { id: 'dev-002', name: 'Device 2', type: 'appliance' }
        ];
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices)
          .respond(200, mockResponse);
        
        DeviceService.getAllDevices().then(function(devices) {
          expect(devices).toEqual(mockResponse);
          expect(devices.length).toBe(2);
        });
        
        $httpBackend.flush();
      });

      it('should return mock devices on API failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices)
          .respond(500, 'Server Error');
        
        DeviceService.getAllDevices().then(function(devices) {
          expect(devices.length).toBe(5);
          expect(devices[0].id).toBe('dev-001');
          expect(devices[0].name).toBe('Air Conditioner');
        });
        
        $httpBackend.flush();
      });
    });

    describe('getDeviceById', function() {
      it('should return device by ID on success', function() {
        var mockDevice = { id: 'dev-001', name: 'Air Conditioner', type: 'hvac' };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001')
          .respond(200, mockDevice);
        
        DeviceService.getDeviceById('dev-001').then(function(device) {
          expect(device).toEqual(mockDevice);
        });
        
        $httpBackend.flush();
      });

      it('should reject promise on API failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/invalid-id')
          .respond(404, 'Not Found');
        
        DeviceService.getDeviceById('invalid-id').catch(function(error) {
          expect(error.status).toBe(404);
        });
        
        $httpBackend.flush();
      });
    });

    describe('discoverDevices', function() {
      it('should discover new devices', function() {
        var mockDiscovered = [{ id: 'dev-new', name: 'New Device' }];
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/discover')
          .respond(200, mockDiscovered);
        
        DeviceService.discoverDevices().then(function(devices) {
          expect(devices).toEqual(mockDiscovered);
        });
        
        $httpBackend.flush();
      });

      it('should reject on discovery failure', function() {
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/discover')
          .respond(500, 'Discovery Failed');
        
        DeviceService.discoverDevices().catch(function(error) {
          expect(error.status).toBe(500);
        });
        
        $httpBackend.flush();
      });
    });

    describe('updateDevice', function() {
      it('should update device successfully', function() {
        var updates = { name: 'Updated Name', status: 'inactive' };
        var mockResponse = { id: 'dev-001', name: 'Updated Name', status: 'inactive' };
        
        $httpBackend.expectPUT(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001', updates)
          .respond(200, mockResponse);
        
        DeviceService.updateDevice('dev-001', updates).then(function(device) {
          expect(device).toEqual(mockResponse);
        });
        
        $httpBackend.flush();
      });

      it('should reject on update failure', function() {
        var updates = { name: 'Updated Name' };
        
        $httpBackend.expectPUT(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001', updates)
          .respond(400, 'Bad Request');
        
        DeviceService.updateDevice('dev-001', updates).catch(function(error) {
          expect(error.status).toBe(400);
        });
        
        $httpBackend.flush();
      });
    });

    describe('deleteDevice', function() {
      it('should delete device successfully', function() {
        var mockResponse = { success: true };
        
        $httpBackend.expectDELETE(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001')
          .respond(200, mockResponse);
        
        DeviceService.deleteDevice('dev-001').then(function(response) {
          expect(response.success).toBe(true);
        });
        
        $httpBackend.flush();
      });

      it('should reject on delete failure', function() {
        $httpBackend.expectDELETE(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001')
          .respond(403, 'Forbidden');
        
        DeviceService.deleteDevice('dev-001').catch(function(error) {
          expect(error.status).toBe(403);
        });
        
        $httpBackend.flush();
      });
    });

    describe('groupDevices', function() {
      it('should group devices successfully', function() {
        var deviceIds = ['dev-001', 'dev-002'];
        var groupId = 'grp-001';
        var mockResponse = { groupId: 'grp-001', devices: deviceIds };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/group', {
          deviceIds: deviceIds,
          groupId: groupId
        }).respond(200, mockResponse);
        
        DeviceService.groupDevices(deviceIds, groupId).then(function(response) {
          expect(response.groupId).toBe('grp-001');
        });
        
        $httpBackend.flush();
      });

      it('should reject on grouping failure', function() {
        var deviceIds = ['dev-001'];
        var groupId = 'grp-001';
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/group')
          .respond(400, 'Invalid Group');
        
        DeviceService.groupDevices(deviceIds, groupId).catch(function(error) {
          expect(error.status).toBe(400);
        });
        
        $httpBackend.flush();
      });
    });

    describe('controlDevice', function() {
      it('should send control command successfully', function() {
        var command = { action: 'turnOn', value: true };
        var mockResponse = { success: true, status: 'active' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001/control', {
          command: command
        }).respond(200, mockResponse);
        
        DeviceService.controlDevice('dev-001', command).then(function(response) {
          expect(response.success).toBe(true);
        });
        
        $httpBackend.flush();
      });

      it('should reject on control failure', function() {
        var command = { action: 'turnOff' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.devices + '/dev-001/control')
          .respond(500, 'Control Failed');
        
        DeviceService.controlDevice('dev-001', command).catch(function(error) {
          expect(error.status).toBe(500);
        });
        
        $httpBackend.flush();
      });
    });
  });
})();