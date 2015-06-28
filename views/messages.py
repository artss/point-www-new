from point.util.env import env
from geweb.http import Response
from geweb.route import route
from point.app import posts
from views.blog import get_posts
import settings

@route('/messages(?:/unread)?(?:/(?P<page>\d*))?/?', host=settings.domain)
def unread_messages(page=1):
    plist, page, has_next = get_posts(posts.private_unread, page)

    if not plist and page == 1:
        return Response(redirect='%s://%s/messages/incoming' % \
                        (env.request.protocol, settings.domain))

    return Response(template='/pages/messages/unread.html', menu='messages',
                    owner=env.owner,
                    posts=plist, page=page, has_next=has_next)

@route('/messages/incoming(?:/(?P<page>\d*))?/?', host=settings.domain)
def incoming_messages(page=1):
    plist, page, has_next = get_posts(posts.private_incoming, page)

    return Response(template='/pages/messages/incoming.html', menu='messages',
                    owner=env.owner,
                    posts=plist, page=page, has_next=has_next)
 
@route('/messages/outgoing(?:/(?P<page>\d*))?/?', host=settings.domain)
def incoming_messages(page=1):
    plist, page, has_next = get_posts(posts.private_outgoing, page)

    return Response(template='/pages/messages/outgoing.html', menu='messages',
                    owner=env.owner,
                    posts=plist, page=page, has_next=has_next)
