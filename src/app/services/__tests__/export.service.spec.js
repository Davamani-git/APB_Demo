/*
Test Documentation:
- Test Name: exportService - generateReport PDF
- Purpose: Validates PDF report generation
- Scenario: Generate and download PDF report
- Expected Result: Should generate PDF and trigger download

Test Documentation:
- Test Name: exportService - generateReport EXCEL
- Purpose: Validates Excel report generation
- Scenario: Generate and download Excel report
- Expected Result: Should generate Excel and trigger download

Test Documentation:
- Test Name: exportService - generateReport unsupported format
- Purpose: Validates error handling for unsupported format
- Scenario: Request report in unsupported format
- Expected Result: Should reject with error

Test Documentation:
- Test Name: exportService - generatePDF
- Purpose: Validates PDF generation
- Scenario: Generate PDF blob from data
- Expected Result: Should return PDF blob

Test Documentation:
- Test Name: exportService - generateExcel
- Purpose: Validates Excel generation
- Scenario: Generate Excel blob from data
- Expected Result: Should return Excel blob

Test Documentation:
- Test Name: exportService - downloadFile
- Purpose: Validates file download functionality
- Scenario: Download blob as file
- Expected Result: Should trigger browser download

Test Documentation:
- Test Name: exportService - exportToCSV
- Purpose: Validates CSV export
- Scenario: Export data to CSV file
- Expected Result: Should convert and download CSV

Test Documentation:
- Test Name: exportService - convertToCSV
- Purpose: Validates CSV conversion
- Scenario: Convert data array to CSV string
- Expected Result: Should return properly formatted CSV

Coverage Report:
- Functions tested: generateReport, generatePDF, generateExcel, downloadFile, exportToCSV, convertToCSV
- Scenarios covered: PDF generation, Excel generation, CSV export, download handling, format validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('exportService', function() {
    var exportService, $httpBackend, $q;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_exportService_, _$httpBackend_, _$q_) {
      exportService = _exportService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('generateReport', function() {
      it('should generate PDF report', function() {
        var data = {companies: [{name: 'Company A'}]};
        spyOn(exportService, 'downloadFile');
        $httpBackend.expectPOST('/api/reports/generate/pdf', data).respond(200, new Blob(['pdf content'], {type: 'application/pdf'}));
        exportService.generateReport(data, 'PDF');
        $httpBackend.flush();
        expect(exportService.downloadFile).toHaveBeenCalled();
      });

      it('should generate EXCEL report', function() {
        var data = {companies: [{name: 'Company A'}]};
        spyOn(exportService, 'downloadFile');
        $httpBackend.expectPOST('/api/reports/generate/excel', data).respond(200, new Blob(['excel content']));
        exportService.generateReport(data, 'EXCEL');
        $httpBackend.flush();
        expect(exportService.downloadFile).toHaveBeenCalled();
      });

      it('should reject unsupported format', function() {
        var data = {companies: []};
        var errorCaught = false;
        exportService.generateReport(data, 'UNSUPPORTED').catch(function(err) {
          errorCaught = true;
        });
        expect(errorCaught).toBe(true);
      });

      it('should handle PDF generation error', function() {
        var data = {companies: []};
        $httpBackend.expectPOST('/api/reports/generate/pdf', data).respond(500, 'Error');
        var errorCaught = false;
        exportService.generateReport(data, 'PDF').catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('generatePDF', function() {
      it('should generate PDF blob', function() {
        var data = {title: 'Report'};
        $httpBackend.expectPOST('/api/reports/generate/pdf', data).respond(200, new Blob(['pdf'], {type: 'application/pdf'}));
        var result;
        exportService.generatePDF(data).then(function(blob) {
          result = blob;
        });
        $httpBackend.flush();
        expect(result instanceof Blob).toBe(true);
      });
    });

    describe('generateExcel', function() {
      it('should generate Excel blob', function() {
        var data = {title: 'Report'};
        $httpBackend.expectPOST('/api/reports/generate/excel', data).respond(200, new Blob(['excel']));
        var result;
        exportService.generateExcel(data).then(function(blob) {
          result = blob;
        });
        $httpBackend.flush();
        expect(result instanceof Blob).toBe(true);
      });
    });

    describe('downloadFile', function() {
      it('should create download link and trigger download', function() {
        var blob = new Blob(['test content'], {type: 'text/plain'});
        var filename = 'test.txt';
        spyOn(document, 'createElement').and.callThrough();
        exportService.downloadFile(blob, filename);
        expect(document.createElement).toHaveBeenCalledWith('a');
      });
    });

    describe('exportToCSV', function() {
      it('should export data to CSV', function() {
        var data = [
          {name: 'Company A', cost: 5000},
          {name: 'Company B', cost: 3000}
        ];
        spyOn(exportService, 'downloadFile');
        exportService.exportToCSV(data, 'export.csv');
        expect(exportService.downloadFile).toHaveBeenCalled();
      });

      it('should use default filename', function() {
        var data = [{name: 'Test'}];
        spyOn(exportService, 'downloadFile');
        exportService.exportToCSV(data);
        expect(exportService.downloadFile).toHaveBeenCalledWith(jasmine.any(Blob), 'export.csv');
      });
    });

    describe('convertToCSV', function() {
      it('should convert data to CSV format', function() {
        var data = [
          {name: 'Company A', cost: 5000},
          {name: 'Company B', cost: 3000}
        ];
        var csv = exportService.convertToCSV(data);
        expect(csv).toContain('name,cost');
        expect(csv).toContain('Company A');
        expect(csv).toContain('5000');
      });

      it('should handle empty data', function() {
        var csv = exportService.convertToCSV([]);
        expect(csv).toBe('');
      });

      it('should handle null data', function() {
        var csv = exportService.convertToCSV(null);
        expect(csv).toBe('');
      });

      it('should escape quotes in values', function() {
        var data = [{name: 'Company "A"', cost: 5000}];
        var csv = exportService.convertToCSV(data);
        expect(csv).toContain('""');
      });
    });
  });
})();