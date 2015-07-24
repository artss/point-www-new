from point.util.env import env
from geweb.http import Response
from geweb.route import route
from point.app import posts

import settings

@route('/p/(?P<id>[a-z]+)/?', host=settings.domain, methods=['GET'])
def show_post(id):
    post = posts.show_post(id)

    comments = post.comments(cuser=env.user)

    if env.user.is_authorized():
        posts.clear_unread_posts(id)
        if comments:
            posts.clear_unread_comments(id)

    menu = 'messages' if post.private else ''

    return Response(template='/pages/post.html', menu=menu, owner=post.author,
                    p={
                        'post': post,
                        'comments_count': post.comments_count(),
                        'subscribed': post.check_subscriber(env.user),
                        'bookmarked': post.check_bookmarked(env.user),
                        'recommended': post.check_recommended(env.user),
                        'rec_users': post.recommended_users()
                    }, comments=comments)

