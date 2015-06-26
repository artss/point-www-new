import os

try:
    import re2 as re
except ImportError:
    import re

from point.util.env import env
from point.core.user import User

import settings

_urlre = re.compile('^(?P<proto>\w+)://(?:[\w\.\-%\:]*\@)?(?P<host>[\w\.\-%]+)(?P<port>::(\d+))?(?P<path>(?:/[\w\.\-%]*)*)(?:\?(?P<query>[^#]*))?')

def parse_url(url):
    if not url:
        return None
    m = re.search(_urlre, url)
    if m:
        return m.groupdict()

def check_referer(fn):
    def _fn(*args, **kwargs):
        referer = parse_url(env.request.referer)
        if not referer or not referer['host'].endswith(settings.domain):
            raise Forbidden
        return fn(*args, **kwargs)
    return _fn

def referer():
    try:
        referer = env.request.args('referer')
    except KeyError:
        referer = env.request.referer
    if not referer:
        referer = '%s://%s/' % (env.request.protocol, settings.domain)
    return referer

def userlink(user, path=''):
    if isinstance(user, User):
        user = user.login
    elif isinstance(user, dict):
        user = user['login']
    return os.path.join('/', 'u', user, unicode(path)).rstrip('/')

