angular.module('executiveDashboard').factory('ContrastValidatorFactory', [function() {
function hexToRgb(hex) {
const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
return result ? {
r: parseInt(result[1], 16),
g: parseInt(result[2], 16),
b: parseInt(result[3], 16)
} : null;
}
function getRelativeLuminance(rgb) {
const rsRGB = rgb.r / 255;
const gsRGB = rgb.g / 255;
const bsRGB = rgb.b / 255;
const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
return {
calculateContrastRatio: function(color1, color2) {
const rgb1 = hexToRgb(color1);
const rgb2 = hexToRgb(color2);
if (!rgb1 || !rgb2) return 0;
const l1 = getRelativeLuminance(rgb1);
const l2 = getRelativeLuminance(rgb2);
const lighter = Math.max(l1, l2);
const darker = Math.min(l1, l2);
return (lighter + 0.05) / (darker + 0.05);
},
validateContrast: function(foreground, background, level) {
const ratio = this.calculateContrastRatio(foreground, background);
const threshold = level === 'AAA' ? 7 : 4.5;
return ratio >= threshold;
}
};
}]);
