import time
import json

# this somehow is not used anymore - should it not be ?
from django.core.context_processors     import csrf
from django.http                        import HttpResponseRedirect
from django.contrib.auth                import authenticate, login, logout
from django.template                    import RequestContext
from django.shortcuts                   import render_to_response
from django.shortcuts                   import render

from unfold.loginrequired               import FreeAccessView
from ui.topmenu                         import topmenu_items, the_user

from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query
from manifoldapi.manifoldresult         import ManifoldResult

from myslice.configengine               import ConfigEngine
from myslice.theme                      import ThemeView

from portal.account                     import Account, get_expiration
from portal.models                      import PendingSlice
from portal.actions                     import authority_check_pis, get_jfed_identity, get_myslice_account

import activity.user

class HomeView (FreeAccessView, ThemeView):
    template_name = 'home-view.html'

    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        return {
                 'MANIFOLD_URL':ConfigEngine().manifold_url(),
                 }

    def post (self,request):
        env = self.default_env()
        env['theme'] = self.theme
        env['section'] = "Dashboard"

        username = request.POST.get('username')
        password = request.POST.get('password')

        # pass request within the token, so manifold session key can be attached to the request session.
        token = {'username': username, 'password': password, 'request': request}

        # our authenticate function returns either
        # . a ManifoldResult - when something has gone wrong, like e.g. backend is unreachable
        # . a django User in case of success
        # . or None if the backend could be reached but the authentication failed
        auth_result = authenticate(token=token)
        # use one or two columns for the layout - not logged in users will see the login prompt
        # high-level errors, like connection refused or the like
        if isinstance (auth_result, ManifoldResult):
            manifoldresult = auth_result
            # let's use ManifoldResult.__repr__
            env['state']="%s"%manifoldresult

        # user was authenticated at the backend
        elif auth_result is not None:
            user=auth_result
            if user is not None and user.is_active:
                login(request, user)

                if request.user.is_authenticated():
                    try:
                        env['person'] = self.request.user
                        env['username'] = self.request.user

                        # log user activity
                        activity.user.login(self.request)

                        ## check user is pi or not
                        acc_auth_cred = {}
                        acc_user_cred = {}

                        account_detail = get_myslice_account(self.request)
                        if 'config' in account_detail and account_detail['config'] is not '':
                            account_config = json.loads(account_detail['config'])
                            acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
                            acc_user_cred = account_config.get('delegated_user_credential','N/A')
                        # assigning values
                        #if acc_auth_cred=={} or acc_auth_cred=='N/A':
                        #    pi = "is_not_pi"
                        #else:
                        #    pi = "is_pi"
                        user_email = str(self.request.user)
                        #pi = authority_check_pis(self.request, user_email)

                        # check if the user has creds or not
                        if acc_user_cred == {} or acc_user_cred == 'N/A':
                            user_cred = 'no_creds'
                        else:
                            exp_date = get_expiration(acc_user_cred, 'timestamp')
                            if exp_date < time.time():
                                user_cred = 'creds_expired'
                            else:
                                user_cred = 'has_creds'

                        # list the pending slices of this user
                        pending_slices = []
                        for slices in PendingSlice.objects.filter(type_of_nodes__iexact=self.request.user).all():
                            pending_slices.append(slices.slice_name)

                        env['pending_slices'] = pending_slices
                        #env['pi'] = pi
                        env['user_cred'] = user_cred
                    except Exception as e:
                        print e
                        env['person'] = None
                        env['state'] = "Your session has expired"
                else:
                    env['person'] = None
            else:
                # log user activity
                activity.user.login(self.request, "notactive")
                env['state'] = "Your account is not active, please contact the site admin."
                env['layout_1_or_2']="layout-unfold2.html"

            jfed_identity = get_jfed_identity(request)
            if jfed_identity is not None:
                import base64
                encoded_jfed_identity = base64.b64encode(jfed_identity)
                env['jfed_identity'] = encoded_jfed_identity 
            else:
                env['jfed_identity'] = None

        # otherwise
        else:
            # log user activity
            activity.user.login(self.request, "error")
            env['state'] = "Your username and/or password were incorrect."
        env['request'] = request
        return render_to_response(self.template,env, context_instance=RequestContext(request))

    def get (self, request, state=None):
        env = self.default_env()
        acc_auth_cred={}

        try:
            if request.user.is_authenticated():
                jfed_identity = get_jfed_identity(request)
                if jfed_identity is not None:
                    import base64
                    encoded_jfed_identity = base64.b64encode(jfed_identity)
                    env['jfed_identity'] = encoded_jfed_identity 
                else:
                    env['jfed_identity'] = None

                ## check user is pi or not
                platform_details = {}
                account_details = {}
                acc_auth_cred = {}
                acc_user_cred = {}
                platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
                account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
                # XXX Something like an invalid session seems to make the execute fail sometimes, and thus gives an error on the main page

                account_detail = get_myslice_account(self.request)
                if 'config' in account_detail and account_detail['config'] is not '':
                    account_config = json.loads(account_detail['config'])
                    acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
                    acc_user_cred = account_config.get('delegated_user_credential','N/A')
                # assigning values
                #if acc_auth_cred=={} or acc_auth_cred=='N/A':
                #    pi = "is_not_pi"
                #else:
                #    pi = "is_pi"
                user_email = str(self.request.user)
                #pi = authority_check_pis(self.request, user_email)
                # check if the user has creds or not
                if acc_user_cred == {} or acc_user_cred == 'N/A':
                    user_cred = 'no_creds'
                else:
                    exp_date = get_expiration(acc_user_cred, 'timestamp')
                    if exp_date < time.time():
                        user_cred = 'creds_expired'
                    else:
                        user_cred = 'has_creds'

                # list the pending slices of this user
                pending_slices = []
                for slices in PendingSlice.objects.filter(type_of_nodes__iexact=self.request.user).all():
                    pending_slices.append(slices.slice_name)

                env['pending_slices'] = pending_slices
                #env['pi'] = pi
                env['user_cred'] = user_cred
                env['person'] = self.request.user
            else:
                env['person'] = None
        except Exception as e:
            print e
            env['person'] = None
            env['state'] = "Your session has expired"

        env['theme'] = self.theme
        env['section'] = "Dashboard"

        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        env['request'] = request
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        return render_to_response(self.template, env, context_instance=RequestContext(request))

