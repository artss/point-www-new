'use strict';

import App from 'app';
import Backbone from 'backbone';
import nativeajax from 'backbone.nativeajax';
import 'backbone-model-file-upload';

Backbone.ajax = nativeajax;

export default new App();

Backbone.history.start({pushState: true, root: '/'});

