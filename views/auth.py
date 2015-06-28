from point.core.user import User, UserNotFound, UserExists, \
                            NotAuthorized, AlreadyAuthorized, \
                            AddressNotFound
from point.app import users
from point.util.env import env
from point.util.redispool import RedisPool
from geweb.http import Response
from geweb.session import Session
from geweb.exceptions import NotFound, Forbidden
from geweb.template import render
from geweb.route import route
from geweb.util import csrf
from point.util import parse_date, validate_nickname
from user import WebUser
from point.util.imgproc import make_avatar
from random import randint
import json
import urllib2
from datetime import datetime, timedelta
from recaptcha.client import captcha

from wwwutil import check_referer, referer
from wwwutil.links import userlink

try:
    import re2 as re
except ImportError:
    import re

import settings

ULOGIN_FIELDS = ['email', 'nickname', 'bdate', 'sex', 'city', 'country', 'photo_big']

@route('/login', methods=['GET'])
def login_form():
    return Response(template='/auth/login.html', referer=referer(),
                                                 fields=ULOGIN_FIELDS)

@csrf
@check_referer
@route('/login', methods=['POST'])
def login():
    if env.user.id:
        if env.request.is_xhr:
            raise AlreadyAuthorized

        return Response(redirect='%s:%s' % (env.request.protocol, userlink(env.user)))

    ref = referer()

    try:
        login = env.request.args('login')
        password = env.request.args('password')
        if not login or not password:
            raise NotAuthorized
        env.user.authenticate(login, password)
        if env.request.is_xhr:
            return Response(ok=True)
        else:
            return Response(redirect=ref)
    except (KeyError, NotAuthorized):
        return Response(template='/auth/login.html',
                        code=NotAuthorized.code,
                        message=NotAuthorized.message,
                        errors={'password': 'invalid'},
                        referer=ref, fields=ULOGIN_FIELDS)

@route(r'/login/(?P<key>[0-9a-f]{40})')
def login_key(key):
    if env.user.id:
        env.user.logout()

    redis = RedisPool(settings.storage_socket)
    try:
        user_id = int(redis.get('login:%s' % key))
    except (TypeError, ValueError):
        raise NotFound
    redis.delete('login:%s' % key)

    env.user = WebUser(user_id)
    env.user.authenticate()

    return Response(redirect='%s://%s/' % \
                    (env.request.protocol, settings.domain))

@csrf
@check_referer
@route('/logout', methods=['POST'])
def logout():
    env.user.logout()
    return Response(redirect=referer())

def remember():
    if env.request.method != 'POST':
        if env.request.args('sent'):
            return render('/auth/remember-sent.html')
        if env.request.args('fail'):
            return render('/auth/remember-fail.html')
        return render('/auth/remember.html')

    errors = []

    if env.user.id:
        user = env.user
    else:
        login = env.request.args('login')
        if not login:
            errors.append('login')
        else:
            try:
                user = User('login', login)
            except UserNotFound:
                errors.append('login')

    if not errors:
        try:
            text = env.request.args('recaptcha_response_field')
            challenge = env.request.args('recaptcha_challenge_field')

            resp = captcha.submit(challenge, text,
                                  settings.recaptcha_private_key,
                                  env.request.remote_host)

            if resp.is_valid:
                users.request_password(user)
                return Response(redirect='%s://%s/remember?sent=1' % \
                        (env.request.protocol, settings.domain))

            errors.append('captcha')

        except urllib2.URLError:
            errors.append('recaptcha-fail')
        except AddressNotFound:
            return Response(redirect='%s://%s/remember?fail=1' % \
                        (env.request.protocol, settings.domain))

    return render('/auth/remember.html', errors=errors)

def reset_password(code):
    if env.request.method != 'POST':
        if env.request.args('changed'):
            return render('/auth/new-password-changed.html')
        if env.request.args('fail'):
            return render('/auth/new-password-fail.html')
        return render('/auth/new-password.html')

    errors = []

    password = env.request.args('password')
    confirm = env.request.args('confirm')

    if not password:
        errors.append('password')
    if password != confirm:
        errors.append('confirm')

    if errors:
        return render('/auth/new-password.html', errors=errors)

    if env.user.id:
        env.user.logout()

    try:
        user = users.reset_password(code, password)
    except UserNotFound:
        return Response(redirect='%s://%s/remember/%s?fail=1' % \
                        (env.request.protocol, settings.domain, code))
    WebUser(user.id).authenticate()
    return Response(redirect='%s://%s/remember/%s?changed=1' % \
                        (env.request.protocol, settings.domain, code))

def _gender(value):
    if value == 'm':
        return True
    if value == 'f':
        return False
    return None

@route('/check-login')
def check_login():
    try:
        User('login', env.request.args('login', ''))
        return Response(error='inuse')
    except UserNotFound:
        return Response(ok=1)

@route('/check-email')
def check_login():
    user = User('email', env.request.args('email', ''))
    if user.id:
        return Response(error='inuse')
    else:
        return Response(ok=1)

def register():
    #raise Forbidden
    if env.user.id:
        raise AlreadyAuthorized

    sess = Session()
    info = sess['reg_info'] or {}

    print 'INFO', info

    if env.request.method == 'GET':
        try:
            del info['network']
            del info['uid']
        except (KeyError, TypeError):
            pass
        sess['reg_info'] = info
        sess.save()

        try:
            info['birthdate'] = parse_date(info['birthdate']) \
                                or datetime.now() - timedelta(days=365*16+4)
        except (KeyError, TypeError):
            info['birthdate'] = None

        return render('/auth/register.html', fields=ULOGIN_FIELDS, info=info)

    try:
        network = info['network'] if 'network' in info else None
        uid = info['uid'] if 'uid' in info else None
    except TypeError:
        network = None
        uid = None

    errors = []

    for p in ['login', 'name', 'email', 'birthdate', 'location', 'about', 'homepage']:
        info[p] = env.request.args(p, '').decode('utf-8')

    info['gender'] = _gender(env.request.args('gender'))

    login = env.request.args('login', '').strip()
    if login and validate_nickname(login):
        try:
            u = User('login', login)
            if u.id:
                errors.append('login-in-use')
        except UserNotFound:
            pass
    elif login:
        errors.append('login-invalid')
    else:
        errors.append('login-empty')

    password = env.request.args('password')
    confirm = env.request.args('confirm')
    if not (network and uid):
        if not password:
            errors.append('password')
        elif password != confirm:
            errors.append('confirm')

    info['birthdate'] = parse_date(info['birthdate']) \
                            or datetime.now() - timedelta(days=365*16+4)

    if not network and not errors:
        try:
            text = env.request.args('recaptcha_response_field')
            challenge = env.request.args('recaptcha_challenge_field')

            resp = captcha.submit(challenge, text,
                                  settings.recaptcha_private_key,
                                  env.request.remote_host)

            if not resp.is_valid:
                errors.append('captcha')

        except urllib2.URLError:
            errors.append('recaptcha-fail')
        except AddressNotFound:
            return Response(redirect='%s://%s/remember?fail=1' % \
                        (env.request.protocol, settings.domain))

    if errors:
        if network and uid:
            tmpl = '/auth/register_ulogin.html'
        else:
            tmpl = '/auth/register.html'

        return render(tmpl, fields=ULOGIN_FIELDS, info=info, errors=errors)

    users.register(login)

    for p in ['name', 'email', 'birthdate', 'gender', 'location', 'about', 'homepage']:
        env.user.set_info(p, info[p])

    if password:
        env.user.set_password(password)

    if network and uid:
        _nickname = info['_nickname'] if '_nickname' in info else None
        _name = info['_name'] if '_name' in info else None
        _profile = info['_profile'] if '_profile' in info else None
        try:
            env.user.bind_ulogin(network, uid, _nickname, _name, _profile)
        except UserExists:
            raise Forbidden

    if env.request.args('avatar'):
        ext = env.request.args('avatar', '').split('.').pop().lower()
        if ext not in ['jpg', 'gif', 'png']:
            errors.append('filetype')
        else:
            filename = ('%s.%s' % (env.user.login, ext)).lower()

            make_avatar(env.request.files('avatar'), filename)

            env.user.set_info('avatar',
                        '%s?r=%d' % (filename, randint(1000, 9999)))

    elif 'avatar' in info and info['avatar']:
        filename = ('%s.%s' % (env.user.login, 'jpg')).lower()

        make_avatar(info['avatar'], filename)

        env.user.set_info('avatar', '%s?r=%d' % (filename, randint(1000, 9999)))

    env.user.save()

    env.user.authenticate()

    return Response(redirect=get_referer())

@route('/ulogin')
def ulogin():
    if env.user.id:
        raise AlreadyAuthorized

    sess = Session()

    if env.request.method == 'POST':
        url = "http://ulogin.ru/token.php?token=%s&host=%s" % \
                (env.request.args('token'), settings.domain)
        try:
            resp = urllib2.urlopen(url)
            data = dict.fromkeys(ULOGIN_FIELDS)
            data.update(json.loads(resp.read()))
            resp.close()
        except urllib2.URLError:
            return render('/auth/login.html', fields=ULOGIN_FIELDS,
                          errors=['ulogin-fail'])

        try:
            env.user.authenticate_ulogin(data['network'], data['uid'])
            if env.user.id:
                return Response(redirect=referer())
        except NotAuthorized:
            pass

        login = data['nickname'].strip(u' -+.')
        if login:
            login = re.sub(r'[\._\-\+]+', '-', login)

        info = {
            'login': login,
            'network': data['network'],
            'uid': data['uid'],
            'name': ('%s %s' % (data['first_name'], data['last_name'])).strip(),
            'email': data['email'],
            'avatar': data['photo_big'],
            'birthdate': data['bdate'],
            'gender': True if data['sex'] == '2' else False if data['sex'] == '1' else None,
            'location': "%s, %s" % (data['city'], data['country']) \
                        if data['city'] and data['country'] else \
                        data['city'] or data['country'],

            '_nickname': data['nickname'],
            '_name': ('%s %s' % (data['first_name'], data['last_name'])).strip(),
            '_profile': data['profile'],
        }

        sess['reg_info'] = info
        sess.save()

    else:
        info = sess['reg_info']

        if not info or not 'network' in info or not 'uid' in info:
            return Response(redirect='%s://%s/register' % \
                    (env.request.protocol, settings.domain))

    info['birthdate'] = parse_date(info['birthdate']) \
                        or datetime.now() - timedelta(days=365*16+4)

    return render('/auth/register_ulogin.html', info=info)

