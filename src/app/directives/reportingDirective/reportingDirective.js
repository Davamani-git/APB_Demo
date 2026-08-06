(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .directive('reportingDirective', [function() {
      return {
        restrict: 'E',
        scope: {
          reportData: '=',
          reportTitle: '@'
        },
        templateUrl: 'src/app/directives/reportingDirective/reportingDirective.html',
        link: function(scope) {
          scope.exportPDF = function() {
            try {
              var doc = new jspdf.jsPDF();
              doc.text(scope.reportTitle || 'Report', 10, 10);
              var yPos = 20;
              if (scope.reportData && Array.isArray(scope.reportData)) {
                scope.reportData.forEach(function(item, index) {
                  doc.text(JSON.stringify(item), 10, yPos);
                  yPos += 10;
                  if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                  }
                });
              }
              doc.save((scope.reportTitle || 'report') + '.pdf');
            } catch (error) {
              console.error('PDF generation failed:', error);
              alert('Failed to generate PDF report');
            }
          };
          scope.exportExcel = function() {
            try {
              var ws = XLSX.utils.json_to_sheet(scope.reportData || []);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Report');
              XLSX.writeFile(wb, (scope.reportTitle || 'report') + '.xlsx');
            } catch (error) {
              console.error('Excel generation failed:', error);
              alert('Failed to generate Excel report');
            }
          };
        }
      };
    }]);
})();