from point.util.env import env
from geweb.http import Response
from geweb.route import route
from point.core.user import User, UserNotFound
from point.app import posts

import settings

def get_posts(fn, page=1, *args, **kwargs):
    if not isinstance(page, (int, long)):
        try:
            page = int(page) or 1
        except (TypeError, ValueError):
            page = 1
    if not page:
        page = 1

    kwargs['limit'] = settings.page_limit + 1
    kwargs['offset'] = (page - 1) * settings.page_limit

    plist = fn(*args, **kwargs)
    has_next = len(plist) > settings.page_limit

    plist = plist[:settings.page_limit]

    return plist, page, has_next

@route('/u/(?P<login>[a-z0-9]+)(?:/(?P<page>\d*)/?)?', host=settings.domain)
def blog(login, page=1):
    env.owner = User('login', login)

    plist, page, has_next = get_posts(posts.recent_blog_posts, page, env.owner)

    return Response(template='/blog.html', owner=env.owner.todict(),
                    posts=plist, page=page, has_next=has_next)

