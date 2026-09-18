# Provider Enrollment Application Readiness Checker - Automation Framework

## Overview
This is a production-ready Playwright JavaScript automation framework for the Provider Enrollment Application Readiness Checker system. The framework follows the Page Object Model (POM) design pattern and implements comprehensive test coverage for all user stories across three epics (QE-5927, QE-5928, QE-5929).

## Framework Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── readiness-classification.spec.js
│   │   ├── payer-rule-admin.spec.js
│   │   ├── coordinator-workflows.spec.js
│   │   ├── manager-dashboard.spec.js
│   │   ├── document-management.spec.js
│   │   ├── ocr-document-processing.spec.js
│   │   └── pages/
│   │       ├── login.page.js
│   │       ├── application-list.page.js
│   │       ├── application-detail.page.js
│   │       ├── document-upload.page.js
│   │       ├── payer-rule-admin.page.js
│   │       ├── manager-dashboard.page.js
│   │       └── audit-log.page.js
│   └── utils/
│       └── logger.js
├── data/
│   ├── test-config.json
│   └── documents/
├── test-results/
├── logs/
├── playwright.config.js
├── package.json
└── README.md
```

## Test Coverage

### Epic QE-5927: Readiness Classification Engine & Payer Rule Management
- **TS-001 TC-001**: Verify Ready to Submit status when all requirements valid
- **TS-002 TC-001**: Verify Incomplete status when documents missing
- **TS-003 TC-001**: Verify Expiring Soon status within threshold

### Epic QE-5928: Coordinator & Manager Workflows
- **TS-001 TC-001**: Filter and view applications with performance within 3 seconds
- **TS-002 TC-001**: Sort 500 applications by Days Until Start within 3 seconds
- **TS-003 TC-001**: Deny access to unassigned applications with audit logging

### Epic QE-5939: Manager Dashboard And Pipeline Reporting
- **TS-001 TC-001**: Dashboard displays metrics within 5 seconds with drill-down
- **TS-002 TC-001**: Export filtered CSV report within 30 seconds excluding ePHI
- **TS-003 TC-001**: Handle export exceeding 1000 record limit

### Epic QE-5940: Secure Document Upload And Metadata
- **TS-001 TC-001**: Upload valid document with metadata and status update within 5 seconds
- **TS-002 TC-001**: Block expired document upload with error message
- **TS-003 TC-001**: Reject oversized document with error and audit logging

### Epic QE-5941: OCR-Assisted Expiration Extraction
- **TS-001 TC-001**: OCR extracts date successfully with confirmation and audit
- **TS-002 TC-001**: Coordinator overrides OCR date with audit of both values
- **TS-003 TC-001**: OCR failure handled gracefully with manual entry and logging

## Installation

```bash
npm install
```

## Configuration

Set the base URL as an environment variable:
```bash
export BASE_URL=https://app.providerenrollment.com
```

Or update `data/test-config.json` with your environment-specific values.

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:readiness
npm run test:admin
npm run test:coordinator
npm run test:manager
npm run test:documents
npm run test:ocr
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Page Object Model

All locators are encapsulated within Page Object classes located in `src/automationScripts/pages/`. Test spec files contain only test logic and assertions, with no direct locator references.

## Logging

The framework uses Winston for logging. All test execution logs are written to:
- Console output (real-time)
- `logs/automation.log` (persistent file)

## Test Data

Test data and configuration are stored in the `data/` directory:
- `test-config.json`: User credentials, thresholds, and environment settings
- `documents/`: Sample documents for upload testing

## Assertions

All assertions use Playwright's native `expect` API for reliability and auto-waiting capabilities.

## Performance Validation

The framework includes built-in performance validation for:
- Application list load time (≤3 seconds)
- Dashboard load time (≤5 seconds)
- Status recalculation (≤5 seconds)
- Report export (≤30 seconds)

## Compliance

Tests validate HIPAA compliance requirements including:
- Exclusion of unnecessary ePHI from exports
- Audit logging of all sensitive operations
- Role-based access control enforcement
- Document encryption verification

## Maintenance

To add new tests:
1. Create or update the appropriate Page Object class in `src/automationScripts/pages/`
2. Add test methods to the Page Object for new interactions
3. Create or update the spec file in `src/automationScripts/`
4. Follow existing patterns for logging, assertions, and error handling

## Support

For issues or questions, contact the Senior Automation Framework Engineer team.
