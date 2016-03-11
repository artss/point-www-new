/* global env */

'use strict';

import Backbone from 'backbone';
import _ from 'lodash';
import request from 'lib/request';
import dom from 'lib/dom';
import UserModel from 'lib/user-model';
import BaseView from 'lib/base-view';
import SidebarView from 'sidebar';
//import ErrorView from 'lib/error-view';
import PostListView from 'post-list';
import {PostView} from 'post';
import NewPostFormView from 'new-post-form';
import util from 'util/util';

var _initial = true;

const mainDiv = dom.select('.js-main');
const content = dom.select('.js-content');
const footer = dom.select(content, '.js-footer');

export default class App extends Backbone.Router {
    constructor(options) {
        super(options);

        this.routes = {
            'recent(/unread)(/:page)(/)': () => this.postsList('/recent(/unread)?'),

            'u/:login/info(/)': 'pageView',

            'profile(/:section)(/)': 'pageView',

            'u/:login(/:page)(/)': () => this.postsList('/u/[a-zA-Z0-9]+'),

            'comments(/unread)(/:page)(/)': () => this.postsList('/comments(/unread)?'),

            'messages(/:page)(/)': () => this.postsList('/messages'),

            'messages/unread(/:page)(/)': () => this.postsList('/messages/unread'),

            'messages/incoming(/:page)(/)': () => this.postsList('/messages/incoming'),

            'messages/outgoing(/:page)(/)': () => this.postsList('/messages/outgoing'),

            'bookmarks(/:page)(/)': () => this.postsList('/bookmarks'),

            'bookmarks/:page(/)': () => this.postsList(/\/bookmarks/),

            'p/:post': 'postView'
        };

        this._bindRoutes();

        this.user = env.user = new UserModel(env.user);

        this.sidebar = new SidebarView({
            el: '.sidebar'
        });
        this.sidebar.toggle(false);

        if (!('ontouchstart' in document.documentElement)) {
            document.body.classList.remove('touch-device');
        } else if (!localStorage.getItem('sidebar-screen-hint')) {
            localStorage.setItem('sidebar-screen-hint', 1);
            dom.select('.screen-hint').style.display = 'block';
        }

        dom.on(document, 'click', '.js-navigate', function (evt) {
            var href = evt.target.getAttribute('href');

            var loc = util.parseUrl(href);

            if (loc.protocol === location.protocol && loc.host === loc.host) {
                evt.preventDefault();
                this.navigate(href, {
                    trigger: true
                });
            } else {
                Backbone.history.stop();
                location.href = loc.href;
            }
        }.bind(this));

        var newPostForm;

        Backbone.on('new-post', function () {
            if (!newPostForm) {
                newPostForm = new NewPostFormView({
                    el: dom.select('.popup-newpost')
                });
            }

            newPostForm.show();
        });

        Backbone.on('new-post-cancel', function () {
            mainDiv.classList.remove('newpost');
        });
    }

    loadView(View, data, urlPattern) {
        this.sidebar.toggle(false);

        if (!urlPattern) {
            urlPattern = /.*/;
        }

        var el;

        if (_initial) {
            el = dom.select('.js-view');
            this._currentView = new View({
                el: el,
                app: this,
                urlPattern: urlPattern
            });
            _initial = false;
            this._currentView.trigger('rendered');
            mainDiv.classList.remove('loading');
            return;
        }

        mainDiv.classList.add('loading');

        if (this._request && _.isFunction(this._request.cancel)) {
            this._request.cancel();
        }

        if (_.isString(data) && data.match(/^http|\//)) {
            this._request = request.get(data);
        } else {
            this._request = new Promise(resolve => resolve(data));
        }

        this._request.then(resp => {
            if (this._currentView) {
                this._currentView.el.remove();
                this._currentView.destroy();
            }

            el = dom.create('<div class="js-view"></div>');

            if (_.isObject(resp.data) && !_.isEmpty(resp.data.menu)) {
                this.sidebar.setMenu(resp.data.menu);
                resp.className = resp.data.menu + '-view';
            }

            this._currentView = new View(_.extend(resp, {
                el: el,
                app: this,
                urlPattern: urlPattern
            }));

            this._currentView.render();
            content.insertBefore(el, footer);
            this._currentView.trigger('rendered');

            mainDiv.classList.remove('loading');

            delete this._request;
        })
        .catch((resp, status) => {
            console.log('this.loadView(ErrorView, resp)', status);
            console.dir(resp);
            mainDiv.classList.remove('loading');
        });
    }

    postsList(urlPattern) {
        this.loadView(PostListView, location.href, new RegExp('^' + urlPattern));
    }

    postView() {
        this.loadView(PostView, location.href);
    }

    pageView() {
        this.loadView(BaseView, location.href);
    }
}

if (!env.user.id) {
    require('auth/login-register');
}

