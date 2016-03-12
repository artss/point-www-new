import _ from 'lodash';
import dom from 'lib/dom';
import renderTemplate from 'lib/template';
import BaseView from 'lib/base-view';

export default class TemplatedView extends BaseView {
    render() {
        var content = this.template
            ? renderTemplate(this.template, this.data)
            : _.isObject(this.data)
                ? JSON.stringify(this.data) : this.data;

        dom.append(this.el, content);

        super.render();
    }
}

