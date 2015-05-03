import os
from point.util.env import env
from geweb.route import route
from geweb.http import Response
from geweb.exceptions import NotFound
from geweb.template import render, TemplateNotFound
from point.util.imgproc import make_thumbnail
from hashlib import md5

#from views import blog

import settings

@route(r'/', host=settings.domain)
def index():
    if env.user.is_authorized():
        return Response(redirect='%s://%.%s' % (env.request.protocol,
                                                env.user.login,
                                                settings.domain))
    return render("/landing.html")

def doc(path):
    if path.endswith('/'):
        path = path[:-1]
    try:
        return render('%s.html' % path)
    except TemplateNotFound:
        try:
            return render(os.path.join(path, 'index.html'))
        except TemplateNotFound:
            raise NotFound

def thumbnail(hash):
    url = env.request.args('u')
    if not url:
        raise NotFound
    if hash != md5(url).hexdigest():
        raise NotFound
    make_thumbnail(url)
    return Response(redirect=url)

def mdoc(path):
    if path.find('..') > -1:
        raise NotFound

    docpath = os.path.join(settings.doc_path, '%s.md' % path.strip('/ '))

    try:
        fd = open(docpath)
    except IOError:
        raise NotFound

    text = fd.read().decode('utf8')
    fd.close()

    return render('/doc.html', prefix='', path=path, text=text)
