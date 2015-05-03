workers = 1

server_host = '0.0.0.0'
server_port = 8188

libs = ['../core/lib']

apps = ['views']

cache_socket = 'tcp://127.0.0.1:6379'
storage_socket = 'tcp://127.0.0.1:6379'
pubsub_socket = 'tcp://127.0.0.1:6379'
queue_socket = 'tcp://127.0.0.1:6379'
feed_queue_socket = 'tcp://127.0.0.1:6379'
imgproc_socket = 'tcp://127.0.0.1:6379'
session_socket = 'tcp://127.0.0.1:6379'

db = {
    #'host': 'point.im',
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'point',
    'user': 'point',
    #'password': 'ahShol5Cheefahso',
    'password': 'point',
    'maxsize': 10
}

domain = 'n.local.point.im'

template_path = '/home/arts/projects/point.im/point/www-new/templates'

upload_dir = '/home/arts/projects/point.im/upload'

avatars_path = '/home/arts/projects/point.im/img/a'
avatars_root = '://i.local.point.im/a'

thumbnail_path = '/home/arts/projects/point.im/point/www-new/static/img/t'
thumbnail_root = '://i.local.point.im/t'

media_path = '/home/arts/projects/point.im/img/m'
media_root = '://i.local.point.im/m'

blogcss_path = '/home/arts/projects/point.im/point/www-new/static/css/blogcss'
blogcss_root = '://local.point.im/css/blogcss'

usercss_path = '/home/arts/projects/point.im/point/www-new/static/css/usercss'
usercss_root = '://local.point.im/usercss'

doc_path = '/home/arts/projects/point.im/point-doc'

edit_expire = 7200
edit_ratio = 0
edit_distance = 0

user_rename_timeout = 1200

stoplist_file = '/home/arts/projects/point.im/point/core/stoplist.txt'
stoplist_expire = 10

imgproc_workers = 1

proctitle = 'geweb_test'

logfile = None
#logfile = '/tmp/point.log'
loglevel = 'debug'

debug = True

smtp_password = 'ahShol5Cheefahso'

secret = 'eiquoe0eiph4Ic1Imahjohgah8el6ayieM6xoh1air0chohjouYaiY9ohphae1ei'

recaptcha_public_key = '6Ld3FfYSAAAAAP0_0bJgnsQW42gfzpVpYkvimiXs'
recaptcha_private_key = '6Ld3FfYSAAAAACgyTsFO6y0Zso9tatVYNP-YKhZf'

cache_markdown = False
