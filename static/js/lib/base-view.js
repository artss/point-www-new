'use strict';

import Backbone from 'backbone';
import 'backbone.nativeview';
import _ from 'lodash';
import dom from 'lib/dom';
import Promise from 'lib/promise';

export default class BaseView extends Backbone.NativeView {
    // FIXME: className
    //className: '',

    initialize(options) {
        //Backbone.NativeView.prototype.initialize.call(this, options);
        super.initialize(options);

        this.app = options.app;

        this.template = options.template;
        this.data = options.data;
        this.urlPattern = options.urlPattern;

        _.each([this.className, options.className], cls => {
            if (!_.isEmpty(cls)) {
                this.el.classList.add(cls);
            }
        });

        this.on('rendered', () => {
            this._rendered = true;
            this.subscribeScroll();
            this.initTabs();
        });
    }

    render() {
        var self = this;

        if (_.isArray(this.template)) {
            this.template = this.template[0];
        }

        // FIXME: rewrite without requirejs!
        return new Promise(function (resolve, reject) {
            require(['tpl!' + self.template], function (template) {
                if (!self.urlPattern.test(location.pathname)) {
                    reject();
                    return;
                }
                dom.append(self.el, template(self.data));
                resolve();
            });
        });
    }

    initTabs() {
        var tabs = this.$('.js-tabs');

        if (!tabs) {
            return;
        }

        _.each(tabs, container => {
            var nav = dom.select(container, '.tabs-nav');
            var active = dom.select(nav, '.active');

            if (active) {
                if (active.offsetWidth >= container.offsetWidth) {
                    container.scrollLeft = active.offsetLeft;
                } else {
                    var right = container.scrollLeft + container.offsetWidth - active.offsetLeft - active.offsetWidth;
                    if (right < 0) {
                        container.scrollLeft = -right;
                    }
                }
            }

            var swipe = false;
            var startX;
            var startScroll;

            dom.on(container, 'touchstart', evt => {
                if (evt.touches.length > 1) {
                    swipe = false;
                    return;
                }

                if (container.offsetWidth >= nav.offsetWidth) {
                    swipe = false;
                    return;
                }

                swipe = true;

                startX = evt.touches[0].clientX;
                startScroll = container.scrollLeft;
            });

            dom.on(container, 'touchmove', evt => {
                if (!swipe) {
                    return;
                }

                evt.stopPropagation();

                container.scrollLeft = startScroll + startX - evt.touches[0].clientX;
            });
        });
    }

    subscribeScroll() {
        this.header = dom.select('.header');

        if (!this.header) {
            return;
        }

        this.content = dom.select('.content');
        this._scrollTop = this.content.scrollTop;

        this._headerScrollHandler = this._headerScrollHandler.bind(this);

        dom.on(this.content, 'scroll', this._headerScrollHandler);
        this._headerScrollHandler();
    }

    _headerScrollHandler() {
        var pos = this.content.scrollTop;

        if (pos > this._scrollTop) {
            this.header.classList.add('hidden');
        } else if (pos <= this._scrollTop - 3) {
            this.header.classList.remove('hidden');
        }

        if (pos > 0) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this._scrollTop = pos;
    }

    destroy() {
        this.undelegateEvents();
        dom.off(this.content, 'scroll', this._headerScrollHandler);
        //Backbone.NativeView.prototype.remove.call(this);
        super.destroy();
    }
};

