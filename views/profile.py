# -*- coding: utf-8 -*-

from point.util.env import env
from geweb.route import route
from geweb.http import Response
from point.core.user import User

import settings

@route('/profile(?:/info)?/?', host=settings.domain)
def profile_info():
    return Response(template='/pages/profile/info.html', section='info',
                    login=env.user.login, info=env.user.get_info())

@route('/profile/settings/?', host=settings.domain)
def profile_settings():
    languages = [
        {'value': u'ru', 'title': u'Русский'},
        {'value': u'en', 'title': u'English'},
        {'value': u'uk', 'title': u'Українська'},
        {'value': u'by', 'title': u'Беларуская'}
    ]
    return Response(template='/pages/profile/settings.html', section='settings',
        languages=languages, profile={
            'lang': env.user.get_profile('lang'),
            'tz': env.user.get_profile('tz'),
            'deny_anonymous': env.user.get_profile('deny_anonymous'),
            'private': env.user.get_profile('private')
        })

@route('/profile/im/?', host=settings.domain)
def profile_im():
    return Response(template='/pages/profile/im.html', section='im',profile={})

@route('/profile/www/?', host=settings.domain)
def profile_www():
    return Response(template='/pages/profile/www.html', section='www',profile={})

@route('/profile/password/?', host=settings.domain)
def profile_password():
    return Response(template='/pages/profile/password.html', section='password',profile={})
