import json
from django.shortcuts               import render_to_response
from django.views.decorators.csrf   import csrf_exempt
from django.http                    import HttpResponse, HttpResponseNotFound, HttpResponseForbidden, HttpResponseServerError, HttpResponseBadRequest
from django.contrib.auth            import authenticate, login
from manifoldapi.manifoldresult     import ManifoldResult

import activity.user

@csrf_exempt
def dispatch(request):
    if request.method == 'POST':
       data = json.loads(request.body)
    else:
        return HttpResponseBadRequest(json.dumps({"error":"Bad request use POST"}), content_type="application/json")

    result = None
    username = None
    password = None
    if 'email' in data:
        username = data['email']
    if 'password' in data:
        password = data['password']

    if not username or not password:
        return HttpResponseBadRequest(json.dumps({"error":"Bad request"}), content_type="application/json")
    else:
        token = {'username': username, 'password': password, 'request': request}
        auth_result = authenticate(token=token)
        # our authenticate function returns either
        # . a ManifoldResult - when something has gone wrong, like e.g. backend is unreachable
        # . a django User in case of success
        # . or None if the backend could be reached but the authentication failed
        if isinstance (auth_result, ManifoldResult):
            manifoldresult = auth_result
            # let's use ManifoldResult.__repr__
            msg="%s"%manifoldresult
            return HttpResponseServerError(json.dumps({"error":msg}), content_type="application/json")
        # user was authenticated at the backend
        elif auth_result is not None:
            user=auth_result
            if user is not None and user.is_active:
                login(request, user)

                if request.user.is_authenticated():
                    try:
                        result = {'email':username}
                        # log user activity
                        activity.user.login(request)
                    except Exception as e:
                        import traceback
                        traceback.print_exc()
                        msg = "Your session has expired"
                        return HttpResponseServerError(json.dumps({"error":msg}), content_type="application/json")
            else:
                msg = "Your account is not active, please contact the site admin."
                return HttpResponseForbidden(json.dumps({"error":msg}), content_type="application/json")
        # otherwise
        else:
            msg = "Your username and/or password were incorrect."
            return HttpResponseNotFound(json.dumps({"error":msg}), content_type="application/json")
    return HttpResponse(json.dumps(result))

