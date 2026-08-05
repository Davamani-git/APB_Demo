# Low-Level Design (LLD) for Epic QE-3553 – Validation & QA Engine UI

## 1. Architecture

- AngularJS module `app.validation` providing UI to manage and monitor validation rules and results.

## 2. Components

### 2.1 Services

- `ValidationRuleService` – CRUD for rules.
- `ValidationRunService` – view validation runs.

### 2.2 Controllers

- `ValidationRuleListController`
- `ValidationRuleDetailController`
- `ValidationRunListController`
- `ValidationRunDetailController`

### 2.3 Directives

- `ruleConditionBuilder` – UI for building rule conditions.
- `validationResultTable` – show validation errors.

## 3. Data Models

- `ValidationRule` – id, name, type, condition, severity, version.
- `ValidationRun` – id, batchId, status, startTime, endTime, recordCounts.

## 4. Sequence Diagrams

### 4.1 Rule Update

```mermaid
sequenceDiagram
  participant QA as QA User
  participant UI as AngularJS UI
  participant RS as ValidationRuleService
  participant API as Rule API

  QA->>UI: Edit rule
  UI->>RS: updateRule(rule)
  RS->>API: PUT /api/validation/rules/{id}
  API-->>RS: Updated rule
  RS-->>UI: Updated rule
  UI->>QA: Show success
```
