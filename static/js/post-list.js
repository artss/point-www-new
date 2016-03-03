'use strict';

import _ from 'lodash';
import BaseView from 'lib/base-view';
import request from 'lib/request';
import dom from 'lib/dom';
import util from 'util/util';

import postsPageTemplate from '../../templates/pages/_posts-page.html';

export default class PostListView extends BaseView {
    initialize(options) {
        //BaseView.prototype.initialize.call(this, options);
        super.initialize(options);

        this.content = dom.select('.content');

        this._postsScrollHandler = _.throttle(() => {
            var ch = this.content.offsetHeight;

            _.each(this.$('.js-page'), function (page) {
                var pagenum = parseInt(page.getAttribute('data-page'), 10) || 1;
                var pos = page.offsetTop - self.content.scrollTop;

                if (pos >= 0 && pos < ch) {
                    this.app.navigate(this.pageLink(pagenum), {
                        trigger: false,
                        replace: true
                    });
                    return false;
                }
            });
        }, 1000);

        dom.on(this.content, 'scroll', this._postsScrollHandler);

        this.on('rendered', this.onRender);
    }

    get events() {
        return {
            'click .js-more': 'loadNext'
        };
    }

    onRender() {
        if (_.isEmpty(this.data)) {
            return;
        }
        this.updatePager(this.data.page, this.data.has_next);
    }

    loadNext(evt) {
        evt.preventDefault();

        var pager = evt.target;
        var showPager = !pager.classList.contains('hidden');
        pager.classList.add('hidden');

        request.get(pager.getAttribute('href'))
            .then(resp => {
                var posts = postsPageTemplate(resp.data);

                dom.append(this.$('.js-posts-list')[0], posts.trim());
                var unread = this.$('.js-unread-posts');
                if (unread.length > 0) {
                    unread[0].setAttribute('data-unread', resp.data.unread_posts || 0);
                }

                this.updatePager(resp.data.page, resp.data.has_next);
            })

            .catch(() => {
                if (showPager) {
                    pager.classList.add('hidden');
                } else {
                    pager.classList.remove('hidden');
                }
                //console.log(arguments);
            });
    }

    pageLink(page) {
        var loc = util.parseUrl(location.pathname.match(this.urlPattern)[0]);
        var dirs = loc.pathname.replace(/\/+$/, '').split(/\/+/);

        if (page > 1) {
            dirs.push(page);
        }

        return dirs.join('/') + loc.search;
    }

    updatePager(page, has_next) {
        var pager = this.$('.js-more')[0];
        if (!pager) {
            return;
        }
        pager.classList.toggle('hidden', !has_next);

        pager.setAttribute('href', this.pageLink(page + 1));
    }

    destroy() {
        //BaseView.prototype.destroy.apply(this, arguments);
        super.destroy();
        dom.off(this.content, 'scroll', this._postsScrollHandler);
    }
}

