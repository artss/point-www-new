'use strict';

import Backbone from 'backbone';
import _ from 'lodash';
import BaseView from 'lib/base-view';
import dom from 'lib/dom';

const mainDiv = dom.select('.main');
var winWidth;

var startX, startY, lastX, lastY, swipe;

export default class SidebarView extends BaseView {
    initialize() {
        super.initialize(arguments);

        dom.on(window, 'resize', this._updateSize.bind(this));
        this._updateSize();

        dom.on(document, 'touchstart', evt => {
            if (!evt.touches || evt.touches.length !== 1) {
                return;
            }

            startX = evt.touches[0].clientX;
            startY = evt.touches[0].clientY;
            lastX = startX;
            lastY = startY;

            if (!mainDiv.classList.contains('sidebar-open') && startX > winWidth / 4) {
                this.resetSwipe();
            }

            var hint = dom.select('.screen-hint');
            if (hint) {
                hint.remove(hint);
            }
        });

        dom.on(document, 'touchmove', evt => {
            if (!evt.touches || evt.touches.length !== 1) {
                return;
            }
            lastX = evt.touches[0].clientX;
            lastY = evt.touches[0].clientY;

            var dX = Math.abs(startX - lastX);
            var dY = Math.abs(startY - lastY);

            if (dX >= dY * 2) {
                swipe = true;
                evt.stopPropagation();
                evt.preventDefault();
            } else {
                this.resetSwipe();
            }
        });

        dom.on(document, 'touchend', () => {
            //evt.stopPropagation();
            //evt.preventDefault();

            if (swipe) {
                this.checkPos();
                return;
            }
            this.resetSwipe();
        });

        dom.on(document, 'touchcancel', this.resetSwipe.bind(this));

        dom.on(dom.select('.sidebar-handle'), 'click', this.toggle.bind(this));
    }

    // FIXME: events
    /*events: {
        'click .btn-newpost': 'newPost'
    }*/

    toggle(state) {
        if (typeof state === 'undefined') {
            state = !mainDiv.classList.contains('sidebar-open');
        }

        if (state) {
            mainDiv.classList.add('locked');
            mainDiv.classList.add('sidebar-open');
        } else {
            mainDiv.classList.remove('locked');
            mainDiv.classList.remove('sidebar-open');
        }
    }

    checkPos() {
        var right = startX <= lastX;

        if (Math.abs(lastX - startX) >= this._width * 0.5) {
            this.toggle(Boolean(right));
        }
    }

    resetSwipe() {
        swipe = false;
        startX = null;
        startY = null;
        lastX = null;
        lastY = null;
    }

    setMenu(id) {
        _.each(this.$('.menu-item'), item => {
            if (id && item.classList.contains(id)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    _updateSize() {
        winWidth = window.offsetWidth;
        this._width = this.el.offsetWidth;
    }

    newPost() {
        this.toggle(false);
        Backbone.trigger('new-post');
    }
}

