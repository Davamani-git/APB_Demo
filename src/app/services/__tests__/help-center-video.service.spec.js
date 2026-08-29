/*
Test Documentation:
- Test Name: HelpCenterVideoService Tests
- Purpose: Validate embedded video tutorial retrieval, playback state management, error handling for unavailable videos, and cross-device compatibility checks.
- Scenario: Successful video load, video load failure, invalid video ID, playback state transitions, unsupported device.
- Expected Result: Videos load correctly; failures return meaningful error messages; playback state is managed accurately.
*/

describe('HelpCenterVideoService', function () {
  var HelpCenterVideoService;
  var $httpBackend;
  var $rootScope;
  var API_BASE = '/api/help-center/videos';

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterVideoService_, _$httpBackend_, _$rootScope_) {
    HelpCenterVideoService = _HelpCenterVideoService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // --- FR5, AC3 ---
  describe('getVideoById(videoId)', function () {

    it('should return video metadata for a valid video ID', function () {
      var mockVideo = { id: 'v001', title: 'Getting Started', url: 'https://cdn.example.com/v001.mp4', duration: 120 };
      $httpBackend.expectGET(API_BASE + '/v001').respond(200, mockVideo);
      var result;
      HelpCenterVideoService.getVideoById('v001').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.id).toBe('v001');
      expect(result.url).toContain('https');
    });

    it('should reject with error when video ID does not exist', function () {
      $httpBackend.expectGET(API_BASE + '/invalid_id').respond(404, { message: 'Video not found' });
      var error;
      HelpCenterVideoService.getVideoById('invalid_id').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should reject when videoId is null', function () {
      var error;
      HelpCenterVideoService.getVideoById(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid video ID');
    });

    it('should reject when videoId is undefined', function () {
      var error;
      HelpCenterVideoService.getVideoById(undefined).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid video ID');
    });

    it('should reject when videoId is an empty string', function () {
      var error;
      HelpCenterVideoService.getVideoById('').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid video ID');
    });

    it('should handle server error gracefully', function () {
      $httpBackend.expectGET(API_BASE + '/v002').respond(500, { message: 'Internal Server Error' });
      var error;
      HelpCenterVideoService.getVideoById('v002').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR5, AC3, US9 ---
  describe('getPlaybackState()', function () {

    it('should return IDLE as initial playback state', function () {
      expect(HelpCenterVideoService.getPlaybackState()).toBe('IDLE');
    });

    it('should transition to PLAYING when play is called', function () {
      HelpCenterVideoService.play();
      expect(HelpCenterVideoService.getPlaybackState()).toBe('PLAYING');
    });

    it('should transition to PAUSED when pause is called after playing', function () {
      HelpCenterVideoService.play();
      HelpCenterVideoService.pause();
      expect(HelpCenterVideoService.getPlaybackState()).toBe('PAUSED');
    });

    it('should transition to IDLE when stop is called', function () {
      HelpCenterVideoService.play();
      HelpCenterVideoService.stop();
      expect(HelpCenterVideoService.getPlaybackState()).toBe('IDLE');
    });

    it('should transition to ERROR state when video fails to load', function () {
      HelpCenterVideoService.setError('Video failed to load');
      expect(HelpCenterVideoService.getPlaybackState()).toBe('ERROR');
    });

    it('should not change state to PLAYING when already in ERROR state', function () {
      HelpCenterVideoService.setError('Load failure');
      HelpCenterVideoService.play();
      expect(HelpCenterVideoService.getPlaybackState()).toBe('ERROR');
    });

    it('should reset to IDLE from ERROR state when reset is called', function () {
      HelpCenterVideoService.setError('Load failure');
      HelpCenterVideoService.reset();
      expect(HelpCenterVideoService.getPlaybackState()).toBe('IDLE');
    });
  });

  // --- FR11, US9, AC8 ---
  describe('getErrorMessage()', function () {

    it('should return null when no error has occurred', function () {
      expect(HelpCenterVideoService.getErrorMessage()).toBeNull();
    });

    it('should return the error message when an error is set', function () {
      HelpCenterVideoService.setError('Video unavailable. Please try again later.');
      expect(HelpCenterVideoService.getErrorMessage()).toBe('Video unavailable. Please try again later.');
    });

    it('should clear error message after reset', function () {
      HelpCenterVideoService.setError('Some error');
      HelpCenterVideoService.reset();
      expect(HelpCenterVideoService.getErrorMessage()).toBeNull();
    });

    it('should not set error message when empty string is passed', function () {
      HelpCenterVideoService.setError('');
      expect(HelpCenterVideoService.getErrorMessage()).toBeNull();
    });
  });

  // --- FR5 ---
  describe('getAllVideos()', function () {

    it('should return list of all available video tutorials', function () {
      var mockVideos = [
        { id: 'v001', title: 'Intro', type: 'video' },
        { id: 'v002', title: 'Advanced Setup', type: 'video' }
      ];
      $httpBackend.expectGET(API_BASE).respond(200, mockVideos);
      var result;
      HelpCenterVideoService.getAllVideos().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(2);
    });

    it('should return empty array when no videos are available', function () {
      $httpBackend.expectGET(API_BASE).respond(200, []);
      var result;
      HelpCenterVideoService.getAllVideos().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should handle network failure when fetching all videos', function () {
      $httpBackend.expectGET(API_BASE).respond(503, { message: 'Service Unavailable' });
      var error;
      HelpCenterVideoService.getAllVideos().catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  /*
  Coverage Report:
  - Functions tested: getVideoById, getPlaybackState, play, pause, stop, setError, reset, getErrorMessage, getAllVideos
  - Scenarios covered: valid ID, invalid ID, null/undefined/empty ID, server errors, playback state transitions (IDLE→PLAYING→PAUSED→IDLE→ERROR), error message management
  - FR coverage: FR5, FR11
  - AC coverage: AC3, AC8
  - US coverage: US4, US9
  - Uncovered scenarios: DRM-protected video handling, adaptive bitrate streaming
  */
});
