# VK004Demo - Credentialing Readiness Engine Automation

## Project Overview
Production-ready Playwright JavaScript automation suite for the VK004Demo Rule-Based Credentialing Readiness Engine, implementing comprehensive test coverage for all 18 test cases across 6 user stories.

## Test Coverage

### Epic QE-6002: Rule-Based Credentialing Readiness Engine
- **User Story QE-6005**: Deterministic Readiness Classification Engine
  - TC-001: Verify Ready to Submit status when all documents are valid
  - TC-002: Verify Incomplete status when required documents are missing
  - TC-003: Verify Expiring Soon status when documents expire within 90 days

- **User Story QE-6006**: Traceable Rule-Based Explanations
  - TC-004: Verify explanation includes rule set version and justification
  - TC-005: Verify payer-specific explanations trace to exact rule and version
  - TC-006: Verify system preserves historical explanations when rules are updated

### Epic QE-6003: Document Metadata Capture and Expiration Management
- **User Story QE-6007**: Structured Document Metadata Capture
  - TC-007: Verify system stores document metadata and makes it available for evaluation
  - TC-008: Verify system associates multiple documents with correct application ID
  - TC-009: Verify system accepts expired document and flags it in evaluations

- **User Story QE-6008**: Expiration Tracking and Alerting
  - TC-010: Verify expiration engine identifies documents expiring within 90 days
  - TC-011: Verify expiration engine flags expired documents and marks applications Incomplete
  - TC-012: Verify system recalculates Expiring Soon status when threshold changes

### Epic QE-6004: Credentialing Coordinator and Manager Readiness Workflows
- **User Story QE-6009**: Coordinator Readiness Work Queue
  - TC-013: Verify work queue displays applications with all required columns
  - TC-014: Verify application details show payer-by-payer breakdown with requirement status
  - TC-015: Verify work queue filtering by Incomplete status for 50 applications

- **User Story QE-6010**: Manager Pipeline Dashboard Reporting
  - TC-016: Verify manager dashboard displays aggregate metrics and at-risk applications
  - TC-017: Verify manager dashboard displays KPIs and payer breakdown for reporting
  - TC-018: Verify dashboard highlights high-risk applications with actionable insights

## Architecture

### Page Object Model Structure
```
src/
├── automationScripts/
│   ├── credentialingReadiness.spec.js    # Main test suite (18 test cases)
│   └── pages/
│       ├── workQueue.page.js              # Work Queue page object
│       ├── documentMetadata.page.js       # Document Metadata page object
│       ├── readinessEngine.page.js        # Readiness Engine page object
│       ├── managerDashboard.page.js       # Manager Dashboard page object
│       └── explanationView.page.js        # Explanation View page object
├── data/
│   └── testData.json                      # Centralized test data
└── utils/
    └── logger.js                          # Logging utility
```

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode
npm run test:ui

# View test report
npm run report
```

## Framework Compliance

✅ **Page Object Model**: All locators and actions encapsulated in page classes
✅ **No Locators in Tests**: Test files contain only business logic and assertions
✅ **Shared Page Objects**: Multiple test cases reuse the same page objects
✅ **Playwright Native Waits**: Auto-waiting leveraged throughout
✅ **Centralized Test Data**: All URLs and test data in testData.json
✅ **Logging Utility**: Custom logger for all test actions
✅ **Playwright Expect**: All assertions use Playwright's expect
✅ **No Hardcoded Waits**: No page.waitForTimeout used
✅ **Zero Syntax Errors**: Production-ready code
✅ **Complete Coverage**: All 18 test cases implemented

## Support

For issues or questions, contact the automation team.

## Version History

- **v1.0.0** (2024-01-20): Initial release with 18 test cases covering all 6 user stories
