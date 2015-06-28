import os
from point.core.user import User

def userlink(user, path=''):
    if isinstance(user, User):
        user = user.login
    elif isinstance(user, dict):
        user = user['login']
    return os.path.join('/u', user, unicode(path)).rstrip('/')

