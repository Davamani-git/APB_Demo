describe('HttpErrorFactory', function() {
    var HttpErrorFactory;
    var ErrorModelMock;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        ErrorModelMock = function(dto) {
            this.dto = dto;
        };
        $provide.value('ErrorModel', ErrorModelMock);
    }));

    beforeEach(inject(function(_HttpErrorFactory_) {
        HttpErrorFactory = _HttpErrorFactory_;
    }));

    it('should create ErrorModel with status-based default message when data missing', function() {
        // Arrange
        var response = { status: 400 };

        // Act
        var result = HttpErrorFactory.fromHttpResponse(response);

        // Assert
        expect(result.dto.code).toBe(400);
        expect(result.dto.message).toBe('The request was invalid.');
        expect(result.dto.correlationId).toBe('');
        expect(result.dto.details).toBe('');
    });

    it('should use data.code and data.message when provided', function() {
        // Arrange
        var response = {
            status: 500,
            data: {
                code: 'CUSTOM_CODE',
                message: 'Custom message',
                correlationId: 'abc123',
                details: 'details here'
            }
        };

        // Act
        var result = HttpErrorFactory.fromHttpResponse(response);

        // Assert
        expect(result.dto.code).toBe('CUSTOM_CODE');
        expect(result.dto.message).toBe('Custom message');
        expect(result.dto.correlationId).toBe('abc123');
        expect(result.dto.details).toBe('details here');
    });

    it('should set UNKNOWN when neither status nor code are available', function() {
        // Arrange
        var response = {};

        // Act
        var result = HttpErrorFactory.fromHttpResponse(response);

        // Assert
        expect(result.dto.code).toBe('UNKNOWN');
        expect(result.dto.message).toBe('An unexpected error occurred.');
    });

    it('should map specific status codes to default messages', function() {
        // Arrange
        var statusesAndMessages = {
            401: 'You are not authorized to perform this action.',
            403: 'You do not have permission to view this information.',
            404: 'No data was found for the selected parameters.',
            429: 'Too many requests. Please try again later.',
            500: 'An unexpected server error occurred.',
            503: 'The service is temporarily unavailable.'
        };

        // Act / Assert
        Object.keys(statusesAndMessages).forEach(function(status) {
            var result = HttpErrorFactory.fromHttpResponse({ status: parseInt(status, 10) });
            expect(result.dto.message).toBe(statusesAndMessages[status]);
        });
    });
});

/*
Test Documentation:
- Test Name: Default message with status only
- Purpose: Ensure factory maps HTTP status to default message when data missing.
- Scenario: Response with status=400 and no data.
- Expected Result: ErrorModel has code=400, appropriate default message, empty correlationId and details.

- Test Name: Custom code and message usage
- Purpose: Verify that provided data.code and data.message override defaults.
- Scenario: Response with status=500 and custom data payload.
- Expected Result: ErrorModel reflects custom code, message, correlationId, and details.

- Test Name: UNKNOWN code when status and code missing
- Purpose: Ensure robust behavior for empty response object.
- Scenario: Response {}.
- Expected Result: ErrorModel.code='UNKNOWN', generic error message.

- Test Name: Mapping of standard HTTP status codes
- Purpose: Confirm each known status maps to expected default message.
- Scenario: Responses with statuses 401, 403, 404, 429, 500, 503.
- Expected Result: Messages match getDefaultMessage mapping.
*/

/*
Coverage Report:
- Functions tested:
  - HttpErrorFactory.fromHttpResponse
  - getDefaultMessage (indirectly via fromHttpResponse)
- Statements covered:
  - Status and data extraction
  - Code, message, correlationId, and details derivation
  - Construction of ErrorModel
  - All status-specific branches in getDefaultMessage
- Branches covered:
  - response with data vs without data
  - Each status-specific branch (400, 401, 403, 404, 429, 500, 503, default)
- Error scenarios covered:
  - Empty response object
- Uncovered scenarios:
  - Non-numeric status values
*/