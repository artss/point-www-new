from point.util.env import env
from geweb.route import route
from geweb.http import Response

import settings

@route('/', host=settings.domain)
def index():
    if env.user.is_authorized():
        return Response(redirect='%s://%s/recent' % (env.request.protocol,
                                                     settings.domain))
    return Response(template='/landing.html')

