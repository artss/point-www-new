from geweb.middleware import Middleware
import geweb.db.pgsql as db
from point.util.env import env
from point.core.user import User, UserNotFound

import settings

def domain_owner(domain):
    if domain == settings.domain:
        return User.from_data(None, None)

    if domain.endswith(settings.domain):
        return User('login', domain[0:domain.find(settings.domain)-1])

    res = db.fetchone("SELECT id FROM users.domains WHERE domain=%s;",
                     [domain]) #, _cache=600)
    if res:
        return User(res[0])

    raise UserNotFound

class DomainOwnerMiddleware(Middleware):
    @staticmethod
    def process_request(request):
        try:
            env.owner = domain_owner(request.host)
        except UserNotFound:
            env.owner = None

