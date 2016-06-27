'use strict';

window.debug('Started admin')

require('../config/admin_tags.js')
const admin = require('coect-admin')
admin.defaultInit({route: Site.page, url: Site.urls.admin})

window.debug('Finished admin')
