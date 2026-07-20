describe('SpendBreakdownModel', function () {
  var SpendBreakdownModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_SpendBreakdownModel_) {
    SpendBreakdownModel = _SpendBreakdownModel_;
  }));

  it('should map valid breakdown data and items', function () {
    // Arrange
    var data = {
      month: '2026-01',
      currency: 'EUR',
      items: [
        { categoryCode: 'FOOD', categoryName: 'Food', amount: 100, percentage: 10 },
        { categoryCode: 'TRAVEL', categoryName: 'Travel', amount: 200, percentage: 20 }
      ]
    };

    // Act
    var model = new SpendBreakdownModel(data);

    // Assert
    expect(model.month).toBe('2026-01');
    expect(model.currency).toBe('EUR');
    expect(model.items.length).toBe(2);
    expect(model.items[0]).toEqual({
      categoryCode: 'FOOD',
      categoryName: 'Food',
      amount: 100,
      percentage: 10
    });
  });

  it('should default invalid items fields and currency', function () {
    // Arrange
    var data = {
      month: 2026,
      currency: 123,
      items: [
        { categoryCode: 1, categoryName: null, amount: -100, percentage: -5 },
        { categoryCode: 'CODE', categoryName: 'Name', amount: 'not num', percentage: 150 }
      ]
    };

    // Act
    var model = new SpendBreakdownModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.currency).toBe('USD');
    expect(model.items.length).toBe(2);
    expect(model.items[0]).toEqual({
      categoryCode: '',
      categoryName: '',
      amount: 0,
      percentage: 0
    });
    expect(model.items[1]).toEqual({
      categoryCode: 'CODE',
      categoryName: 'Name',
      amount: 0,
      percentage: 0
    });
  });

  it('should handle non-array items by defaulting to empty array', function () {
    // Arrange
    var data = {
      month: '2026-01',
      currency: 'USD',
      items: 'not array'
    };

    // Act
    var model = new SpendBreakdownModel(data);

    // Assert
    expect(model.items).toEqual([]);
  });

  it('should handle undefined data by defaulting all properties', function () {
    // Arrange
    var data;

    // Act
    var model = new SpendBreakdownModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.currency).toBe('USD');
    expect(model.items).toEqual([]);
  });
});

/*
Test Documentation:
- Test Name: SpendBreakdownModel mapping and defaults
- Purpose: Verify that spend breakdown model correctly maps and sanitizes items and fields.
- Scenario: Instantiate SpendBreakdownModel with valid data, invalid items, non-array items, and undefined data.
- Expected Result: Items are normalized; invalid data is defaulted; currency defaults to USD.
*/

/*
Coverage Report:
- Functions tested: SpendBreakdownModel constructor
- Statements covered: All assignments, items mapping, and type guards.
- Branches covered: Valid vs invalid month and currency; valid array vs non-array items; valid vs invalid item properties.
- Error scenarios covered: Handling of invalid item structures and negative/overflow percentage values.
- Uncovered scenarios: None.
*/