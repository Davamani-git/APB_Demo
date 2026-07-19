(function () {
  'use strict';

  angular.module('app')
    .constant('ENV_CONFIG_KEY', 'env.config')
    .constant('DEFAULT_API_TIMEOUT_MS', 15000)
    .constant('MAX_LOOKBACK_MONTHS', 6)
    .constant('ENV_DEFAULT_PATH', 'src/app/config/env.default.json')
    .constant('ENV_DEV_PATH', 'src/app/config/env.dev.json')
    .constant('ENV_PROD_PATH', 'src/app/config/env.prod.json');
})();
