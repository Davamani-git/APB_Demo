# APB Demo - Playwright Test Automation

## Overview
This repository contains Playwright automation tests for the APB Demo project, covering 76 test cases across multiple user stories.

## Test Coverage
- QE-5857: AI Budget Threshold Configuration (4 tests)
- QE-5856: Automated Overspend Alerts (3 tests)
- QE-5855: AI Integration Management (3 tests)
- QE-5833: Jira API Integration Validation (3 tests)
- Additional test suites for remaining user stories

## Setup
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run report
```

## Project Structure
```
├── tests/           # Test specification files
├── pages/           # Page Object Model classes
├── playwright.config.js
├── package.json
└── README.md
```

## Page Object Model
All tests follow the Page Object Model pattern for maintainability and reusability.

## CI/CD Integration
Tests are configured to run in CI/CD pipelines with automatic retries and comprehensive reporting.
