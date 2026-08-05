(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .factory('UserProfile', UserProfileFactory);

  function UserProfileFactory() {
    function UserProfile(opts) {
      opts = opts || {};
      this.userId = opts.userId || null;
      this.locale = opts.locale || 'en-US';
      this.preferredCurrency = opts.preferredCurrency || 'USD';
      this.consentFlags = opts.consentFlags || {};
    }

    return UserProfile;
  }
})();
