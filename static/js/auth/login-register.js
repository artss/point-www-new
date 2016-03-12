'use strict';

import RegForm from 'auth/reg-form';
import LoginForm from 'auth/login-form';
import dom from 'lib/dom';

const wrap = dom.select('.login-wrap');

if (wrap) {
    dom.on(dom.select(wrap, '.reg-link'), 'click', evt => {
        evt.preventDefault();
        wrap.classList.remove('login');
        setTimeout(() => regForm.focus('login'), 501);
    });

    dom.on(dom.select(wrap, '.login-link'), 'click', evt => {
        evt.preventDefault();
        wrap.classList.add('login');
        setTimeout(() => loginForm.focus('login'), 501);
    });

    var regForm = new RegForm({
        el: dom.select(wrap, '.reg-form')
    });
    regForm.render();

    var loginForm = new LoginForm({
        el: dom.select(wrap, '.login-form')
    });
    loginForm.render();

    loginForm.on('success', () => { window.location = window.location; });
}

