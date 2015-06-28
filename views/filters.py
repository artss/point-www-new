import os
from jinja2 import environmentfilter

from xml.sax.saxutils import escape
from random import shuffle
from wwwutil import json_serializer
from wwwutil.links import userlink
from wwwutil.md import markdown
import json

try:
    import re2 as re
except ImportError:
    import re

@environmentfilter
def markdown_filter(environ, text, img=False):
    return markdown(text, img)

_nl_re = re.compile(r'[\r\n]+')

@environmentfilter
def nl2br(environ, text):
    return ''.join(['<p>%s</p>' % escape(s) for s in re.split(_nl_re, text)])

@environmentfilter
def shuffle_filter(environ, array, limit=None):
    shuffle(array)
    if limit:
        return array[:limit]
    return array

@environmentfilter
def basename(environ, path):
    return os.path.basename(path)

@environmentfilter
def userlink_filter(environ, user, path=''):
    return userlink(user, path)

@environmentfilter
def json_filter(environ, obj):
    try:
        obj = obj.todict()
    except:
        pass
    return json.dumps(obj, default=json_serializer, ensure_ascii=False)

filters = {
    'markdown': markdown_filter,
    'nl2br': nl2br,
    'shuffle': shuffle_filter,
    'basename': basename,
    'userlink': userlink_filter,
    'json': json_filter,
}

