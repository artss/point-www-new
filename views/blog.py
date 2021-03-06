from point.util.env import env
from geweb.http import Response
from geweb.route import route
from geweb.exceptions import Forbidden
from point.core.user import User
from point.core.post import PostAuthorError
from point.app import posts

import settings

class BlogForbidden(Forbidden):
    pass

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

@route('/u/(?P<login>[a-zA-Z0-9]+)/info/?', host=settings.domain)
def userinfo(login):
    env.owner = User('login', login)
    if env.user.is_authorized() and env.user == env.owner:
        menu = 'blog'
    else:
        menu = ''

    return Response(template='/pages/userinfo.html', menu=menu, owner=env.owner)

@route('/recent(?P<unread>/unread)?(?:/(?P<page>\d*))?/?', host=settings.domain)
def recent(page=1, unread=False):
    unread=bool(unread)
    if unread:
        page = 1

    plist, page, has_next = get_posts(posts.recent_posts, page, unread=unread)

    unread_posts = env.user.unread_posts_count('post')
    #unread_comments = env.user.unread_comments_count('post')

    return Response(template='/pages/recent.html', menu='recent',
                    owner=env.user, unread=unread,
                    posts=plist, page=page, has_next=has_next,
                    unread_posts=unread_posts)

@route('/u/(?P<login>[a-zA-Z0-9-]+)(?:/(?P<page>\d*)/?)?', host=settings.domain)
def blog(login, page=1):
    env.owner = User('login', login)

    try:
        plist, page, has_next = get_posts(posts.recent_blog_posts, page, env.owner)
    except PostAuthorError:
        raise BlogForbidden

    if env.user.is_authorized() and env.user == env.owner:
        menu = 'blog'
    else:
        menu = ''

    return Response(template='/pages/blog.html', menu=menu, owner=env.owner,
                    posts=plist, page=page, has_next=has_next)

@route('/comments(?P<unread>/unread)?(?:/(?P<page>\d*))?/?', host=settings.domain)
def comments(page=1, unread=False):
    unread=bool(unread)
    if unread:
        page = 1

    plist, page, has_next = get_posts(posts.recent_commented_posts, page, unread=unread)

    unread_comments = env.user.unread_comments_count('post')

    return Response(template='/pages/comments.html', menu='comments',
                    owner=env.user, unread=unread,
                    posts=plist, page=page, has_next=has_next,
                    unread_comments=unread_comments)

