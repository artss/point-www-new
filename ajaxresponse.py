import json
from geweb.http import Response
from geweb.middleware import Middleware
from point.util.env import env
from views.filters import markdown_filter
from datetime import datetime
import calendar

class AjaxResponseMiddleware(Middleware):
    class AjaxResponse(Response):
        def render_headers(self):
            if env.request.is_xhr:
                self.mimetype = 'application/json'
            return super(AjaxResponseMiddleware.AjaxResponse, self).render_headers()

        def serialize(self, obj):
            if isinstance(obj, datetime):
                if obj.utcoffset() is not None:
                    obj = obj - obj.utcoffset()
                millis = int(
                    calendar.timegm(obj.timetuple()) * 1000 +
                    obj.microsecond / 1000
                )
                return millis

            try:
                obj = obj.todict()
                if 'text' in obj:
                    obj['text'] = markdown_filter(None, obj['text'])
                return obj

            except AttributeError:
                return obj

        def render(self):
            if env.request.is_xhr:
                resp = {'data': self.data}
                if self.template:
                    resp['template'] = self.template
                return json.dumps(resp, default=self.serialize)

            return super(AjaxResponseMiddleware.AjaxResponse, self).render()

    @staticmethod
    def process_response(response):
        response.__class__ = AjaxResponseMiddleware.AjaxResponse

