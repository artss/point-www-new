workers = 8

libs = ['/home/point/core/lib']

apps = ['views', 'api']

# redis
cache_socket = 'unix:///var/run/redis/cache.sock'
storage_socket = 'unix:///var/run/redis/storage.sock'
pubsub_socket = 'unix:///var/run/redis/pubsub.sock'
queue_socket = 'unix:///var/run/redis/queue.sock'
imgproc_socket = 'unix:///var/run/redis/imgproc.sock'
queue_timeout = 5

feed_fetch_timeout = 30

feed_queue_socket = 'unix:///var/run/redis/feed.sock'
feed_queue_timeout = 5

feed_min_update_timeout = 60
feed_max_update_timeout = 86340

db = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'point',
    'user': 'point',
    'password': '',
    'maxsize': 10
}

server_host = '127.0.0.1'
server_port = 8088

websocket_host = '127.0.0.1'
websocket_port = 8089
websocket_url = '/ws'
websocket_timeout = 60 #540

domain = 'point.im'

lang = 'en'
timezone = 'Europe/Moscow'

template_path = '/home/point/www/templates'

avatars_path = '/home/point/img/a'
avatars_root = '://i.point.im/a'

thumbnail_path = '/home/point/img/t'
thumbnail_root = '://i.point.im/t'
thumbnail_size = [400, 300]

media_path = '/home/point/img/m'
media_root = '://i.point.im/m'

blogcss_path = '/home/point/www/static/css/blogcss'
blogcss_root = '://point.im/blogcss'

usercss_path = '/home/point/www/static/css/usercss'
usercss_root = '://point.im/usercss'

imgproc_sock = '/tmp/imgproc.sock'
upload_dir = '/home/point/upload'

session_cookie = 'user'
session_expire = 90 # 90 days
session_backend = 'geweb.session.redis.RedisBackend'
session_prefix = 'geweb-session-'
session_socket = storage_socket

middleware = [
    'geweb.session.SessionMiddleware',
    'user.UserMiddleware',
    'owner.DomainOwnerMiddleware',
    'ajaxresponse.AjaxResponseMiddleware'
]

page_limit = 20

actions_interval = 2

edit_expire = 120
edit_ratio = .95
edit_distance = 10

user_rename_timeout = 60 * 60 * 24

stoplist_file = '/home/point/core/stoplist.txt'
stoplist_expire = 600 # 10 minutes

doc_path = '/home/point/point-doc'

proctitle = 'point-www'

logger = 'www'
logfile = '/home/point/log/www.log'
loglevel = 'info'
logrotate = None
logcount = 7

debug = False

report_mail = 'arts@point.im'
smtp_host = 'smtp.googlemail.com'
smtp_port = 587
smtp_from = 'noreply@point.im'
smtp_auth_required = True
smtp_login = 'noreply@point.im'
smtp_password = ''

secret = 'my secret phrase'

recaptcha_public_key = ''
recaptcha_private_key = ''

cache_markdown = True

cache_expire_max = 86400

try:
    from settings_local import *
except ImportError:
    pass

