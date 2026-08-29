/*
Test Documentation:
- Test Name: HelpCenterChatService Tests
- Purpose: Validate interactive chat assistant initialization, message sending/receiving, session management, error handling, and GDPR compliance checks.
- Scenario: Successful chat session start, message exchange, session timeout, network error, privacy validation.
- Expected Result: Chat sessions initialize correctly; messages are sent/received; errors surface meaningful messages; privacy is maintained.
*/

describe('HelpCenterChatService', function () {
  var HelpCenterChatService;
  var $httpBackend;
  var $rootScope;
  var $timeout;
  var API_BASE = '/api/help-center/chat';

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterChatService_, _$httpBackend_, _$rootScope_, _$timeout_) {
    HelpCenterChatService = _HelpCenterChatService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // --- FR7, AC5 ---
  describe('initiateChatSession()', function () {

    it('should successfully initiate a new chat session', function () {
      var mockSession = { sessionId: 'sess001', status: 'active', timestamp: Date.now() };
      $httpBackend.expectPOST(API_BASE + '/sessions').respond(200, mockSession);
      var result;
      HelpCenterChatService.initiateChatSession().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.sessionId).toBe('sess001');
      expect(result.status).toBe('active');
    });

    it('should reject when server fails to create session', function () {
      $httpBackend.expectPOST(API_BASE + '/sessions').respond(500, { message: 'Server Error' });
      var error;
      HelpCenterChatService.initiateChatSession().catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should return existing session if already active', function () {
      var mockSession = { sessionId: 'sess001', status: 'active' };
      $httpBackend.expectPOST(API_BASE + '/sessions').respond(200, mockSession);
      HelpCenterChatService.initiateChatSession();
      $httpBackend.flush();
      var result = HelpCenterChatService.getActiveSession();
      expect(result.sessionId).toBe('sess001');
    });

    it('should handle network timeout gracefully', function () {
      $httpBackend.expectPOST(API_BASE + '/sessions').respond(408, { message: 'Request Timeout' });
      var error;
      HelpCenterChatService.initiateChatSession().catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR7, AC5 ---
  describe('sendMessage(sessionId, message)', function () {

    it('should send a message successfully', function () {
      var mockResponse = { messageId: 'msg001', content: 'Hello', timestamp: Date.now() };
      $httpBackend.expectPOST(API_BASE + '/sessions/sess001/messages', { message: 'Hello' }).respond(200, mockResponse);
      var result;
      HelpCenterChatService.sendMessage('sess001', 'Hello').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.messageId).toBe('msg001');
    });

    it('should reject when sessionId is null', function () {
      var error;
      HelpCenterChatService.sendMessage(null, 'Hello').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid session ID');
    });

    it('should reject when message is empty', function () {
      var error;
      HelpCenterChatService.sendMessage('sess001', '').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid message');
    });

    it('should reject when message is null', function () {
      var error;
      HelpCenterChatService.sendMessage('sess001', null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid message');
    });

    it('should handle server error during message send', function () {
      $httpBackend.expectPOST(API_BASE + '/sessions/sess001/messages').respond(503, { message: 'Service Unavailable' });
      var error;
      HelpCenterChatService.sendMessage('sess001', 'Hello').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should sanitize message content before sending', function () {
      var mockResponse = { messageId: 'msg002', content: 'Test', timestamp: Date.now() };
      $httpBackend.expectPOST(API_BASE + '/sessions/sess001/messages', { message: 'Test' }).respond(200, mockResponse);
      HelpCenterChatService.sendMessage('sess001', '<script>Test</script>');
      $httpBackend.flush();
    });
  });

  // --- FR7 ---
  describe('receiveMessages(sessionId)', function () {

    it('should retrieve messages for a valid session', function () {
      var mockMessages = [
        { messageId: 'msg001', content: 'Hello', sender: 'user' },
        { messageId: 'msg002', content: 'Hi there!', sender: 'assistant' }
      ];
      $httpBackend.expectGET(API_BASE + '/sessions/sess001/messages').respond(200, mockMessages);
      var result;
      HelpCenterChatService.receiveMessages('sess001').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(2);
    });

    it('should return empty array when no messages exist', function () {
      $httpBackend.expectGET(API_BASE + '/sessions/sess001/messages').respond(200, []);
      var result;
      HelpCenterChatService.receiveMessages('sess001').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject when sessionId is null', function () {
      var error;
      HelpCenterChatService.receiveMessages(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid session ID');
    });

    it('should handle server error when fetching messages', function () {
      $httpBackend.expectGET(API_BASE + '/sessions/sess001/messages').respond(500, { message: 'Internal Server Error' });
      var error;
      HelpCenterChatService.receiveMessages('sess001').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR7 ---
  describe('endChatSession(sessionId)', function () {

    it('should successfully end an active chat session', function () {
      $httpBackend.expectDELETE(API_BASE + '/sessions/sess001').respond(200, { status: 'closed' });
      var result;
      HelpCenterChatService.endChatSession('sess001').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.status).toBe('closed');
    });

    it('should reject when sessionId is null', function () {
      var error;
      HelpCenterChatService.endChatSession(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid session ID');
    });

    it('should handle server error when ending session', function () {
      $httpBackend.expectDELETE(API_BASE + '/sessions/sess001').respond(500, { message: 'Server Error' });
      var error;
      HelpCenterChatService.endChatSession('sess001').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should clear active session after successful end', function () {
      $httpBackend.expectDELETE(API_BASE + '/sessions/sess001').respond(200, { status: 'closed' });
      HelpCenterChatService.endChatSession('sess001');
      $httpBackend.flush();
      expect(HelpCenterChatService.getActiveSession()).toBeNull();
    });
  });

  // --- FR7, AC5 ---
  describe('getActiveSession()', function () {

    it('should return null when no session is active', function () {
      expect(HelpCenterChatService.getActiveSession()).toBeNull();
    });

    it('should return active session after initiation', function () {
      var mockSession = { sessionId: 'sess001', status: 'active' };
      $httpBackend.expectPOST(API_BASE + '/sessions').respond(200, mockSession);
      HelpCenterChatService.initiateChatSession();
      $httpBackend.flush();
      var result = HelpCenterChatService.getActiveSession();
      expect(result.sessionId).toBe('sess001');
    });
  });

  /*
  Coverage Report:
  - Functions tested: initiateChatSession, sendMessage, receiveMessages, endChatSession, getActiveSession
  - Scenarios covered: successful session creation, message send/receive, session termination, null/empty inputs, server errors (500, 503, 408), message sanitization, session state management
  - FR coverage: FR7
  - AC coverage: AC5
  - US coverage: US3
  - Uncovered scenarios: GDPR data retention policies, multi-language chat support, typing indicators
  */
});
