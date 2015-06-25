import json
from geweb.http import Response
from geweb.middleware import Middleware
from point.util.env import env

class AjaxResponseMiddleware(Middleware):
    class AjaxResponse(Response):
        def render_headers(self):
            if env.request.is_xhr:
                self.mimetype = 'application/json'
            return super(AjaxResponseMiddleware.AjaxResponse, self).render_headers()

        def render(self):
            if env.request.is_xhr:
                resp = {'data': self.data}
                if self.template:
                    resp['template'] = self.template
                return json.dumps(resp)

            return super(AjaxResponseMiddleware.AjaxResponse, self).render()

    @staticmethod
    def process_response(response):
        response.__class__ = AjaxResponseMiddleware.AjaxResponse

