from wwwutil.md import markdown
from datetime import datetime
import calendar

try:
    import re2 as re
except ImportError:
    import re

from point.util.env import env

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

def json_serializer(obj):
    if isinstance(obj, datetime):
        if obj.utcoffset() is not None:
            obj = obj - obj.utcoffset()
        millis = int(
            calendar.timegm(obj.timetuple()) * 1000 +
            obj.microsecond / 1000
        )
        return millis

    try:
        obj = obj.todict()
        if 'text' in obj:
            obj['text'] = markdown(obj['text'])
        return obj

    except AttributeError:
        return obj
