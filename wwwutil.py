try:
    import re2 as re
except ImportError:
    import re

import json
from geweb.http import Response
from geweb.middleware import Middleware
from geweb.exceptions import Forbidden
import geweb.db.pgsql as db
from point.util.env import env
from point.core.user import User, UserNotFound

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

def domain_owner(domain):
    if domain == settings.domain:
        return User.from_data(None, None)

    if domain.endswith(settings.domain):
        return User('login', domain[0:domain.find(settings.domain)-1])

    res = db.fetchone("SELECT id FROM users.domains WHERE domain=%s;",
                     [domain]) #, _cache=600)
    if res:
        return User(res[0])

    raise UserNotFound

class DomainOwnerMiddleware(Middleware):
    @staticmethod
    def process_request(request):
        try:
            env.owner = domain_owner(request.host)
        except UserNotFound:
            env.owner = None

class AjaxResponseMiddleware(Middleware):
    class AjaxResponse(Response):
        def render(self):
            if env.request.is_xhr and self.template:
                return json.dumps({
                    'template': self.template,
                    'data': self.data
                })

            return super(AjaxResponseMiddleware.AjaxResponse, self).render()

    @staticmethod
    def process_response(response):
        response.__class__ = AjaxResponseMiddleware.AjaxResponse

