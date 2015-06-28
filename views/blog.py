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

@route('/recent(?P<unread>/unread)?(?:/(?P<page>\d*))?/?', host=settings.domain)
def recent(page=1, unread=False):
    unread=bool(unread)
    if unread:
        page = 1

    plist, page, has_next = get_posts(posts.recent_posts, page, unread=unread)

    unread_posts = env.user.unread_posts_count('post')
    unread_comments = env.user.unread_comments_count('post')

    return Response(template='/pages/recent.html', menu='recent',
                    owner=env.user, unread=unread,
                    posts=plist, page=page, has_next=has_next,
                    unread_posts=unread_posts, unread_comments=unread_comments)

@route('/u/(?P<login>[a-zA-Z0-9]+)(?:/(?P<page>\d*)/?)?', host=settings.domain)
def blog(login, page=1):
    env.owner = User('login', login)

    plist, page, has_next = get_posts(posts.recent_blog_posts, page, env.owner)

    if env.user.is_authorized() and env.user == env.owner:
        menu = 'blog'
    else:
        menu = ''

    return Response(template='/pages/blog.html', menu=menu, owner=env.owner,
                    posts=plist, page=page, has_next=has_next)

