# -*- coding: utf-8 -*-

from point.util.env import env
from geweb.route import route
from geweb.http import Response
from point.core.user import User

import settings

@route('/profile(?:/info)?/?', host=settings.domain)
def profile_info():
    return Response(template='/pages/profile/info.html', section='info', profile={})

@route('/profile/settings/?', host=settings.domain)
def profile_settings():
    languages = [
        [u'ru', u'Русский'],
        [u'en', u'English'],
        [u'uk', u'Українська'],
        [u'by', u'Беларуская']
    ]
    return Response(template='/pages/profile/settings.html', section='settings',
                    profile={}, languages=languages)

@route('/profile/im/?', host=settings.domain)
def profile_im():
    return Response(template='/pages/profile/im.html', section='im',profile={})

@route('/profile/www/?', host=settings.domain)
def profile_www():
    return Response(template='/pages/profile/www.html', section='www',profile={})

@route('/profile/password/?', host=settings.domain)
def profile_password():
    return Response(template='/pages/profile/password.html', section='password',profile={})
