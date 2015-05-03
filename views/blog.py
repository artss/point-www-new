from point.util.env import env
from geweb.route import route
from point.core.user import UserNotFound

import settings

@route('/', host='*.%s' % settings.domain)
def blog(page=1):
    if env.owner:
        return '%s\'s blog' % env.owner.login
    else:
        raise UserNotFound
