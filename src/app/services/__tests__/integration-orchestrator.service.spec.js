/*
Test Documentation:
- Test Name: IntegrationOrchestratorService - approveMappings SUCCESS status
- Purpose: Verify approveMappings calls syncToCozone and triggers success notification
- Scenario: syncToCozone resolves with status SUCCESS
- Expected Result: NotificationService.success is called with correct message

- Test Name: IntegrationOrchestratorService - approveMappings PARTIAL status
- Purpose: Verify approveMappings handles partial success with warning notification
- Scenario: syncToCozone resolves with status PARTIAL
- Expected Result: NotificationService.warning is called

- Test Name: IntegrationOrchestratorService - approveMappings FAILURE status
- Purpose: Verify approveMappings handles failure with error notification
- Scenario: syncToCozone resolves with status FAILURE
- Expected Result: NotificationService.error is called

- Test Name: IntegrationOrchestratorService - approveMappings rejection
- Purpose: Verify approveMappings handles promise rejection
- Scenario: syncToCozone rejects
- Expected Result: NotificationService.error is called, promise rejects

Coverage Report:
- Functions tested: approveMappings
- Scenarios covered: SUCCESS, PARTIAL, FAILURE, rejection
- Uncovered scenarios: network timeout, concurrent approvals
*/