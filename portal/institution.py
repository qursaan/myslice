import json

from django.core.context_processors import csrf
from django.http                    import HttpResponseRedirect
from django.contrib.auth            import authenticate, login, logout
from django.template                import RequestContext
from django.shortcuts               import render_to_response
from django.shortcuts               import render

from unfold.page                    import Page
from unfold.loginrequired           import LoginRequiredAutoLogoutView

from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query
from manifoldapi.manifoldresult     import ManifoldResult
from ui.topmenu                     import topmenu_items, the_user
from myslice.configengine           import ConfigEngine

from portal.actions                 import is_pi, authority_check_pis
from myslice.theme                  import ThemeView
from myslice.settings               import logger


class InstitutionView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'institution.html'
        
    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        return { 
                 'MANIFOLD_URL':ConfigEngine().manifold_url(),
                 }

    def post (self,request):
        env = self.default_env()
        env['theme'] = self.theme
        env['request'] = request
        return render_to_response(self.template, env, context_instance=RequestContext(request))

    def get (self, request, authority_hrn=None, state=None):
        env = self.default_env()
        if request.user.is_authenticated(): 
            env['person'] = self.request.user
            if authority_hrn is None: 
                # CACHE PB with fields
                page = Page(request)
                metadata = page.get_metadata()
                user_md = metadata.details_by_object('user')
                user_fields = [column['name'] for column in user_md['column']]
                
                # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
                user_query  = Query().get('myslice:user').select(user_fields).filter_by('user_hrn','==','$user_hrn')
                #user_query  = Query().get('myslice:user').select('user_hrn','parent_authority').filter_by('user_hrn','==','$user_hrn')
                user_details = execute_query(self.request, user_query)
                try:
                    env['user_details'] = user_details[0]
                except Exception,e:
                    # If the Query fails, check in local DB 
                    try:
                        user_local_query  = Query().get('local:user').select('config').filter_by('email','==',str(env['person']))
                        user_local_details = execute_query(self.request, user_local_query)
                        user_local = user_local_details[0]            
                        user_local_config = user_local['config']
                        user_local_config = json.loads(user_local_config)
                        user_local_authority = user_local_config.get('authority')
                        if 'user_details' not in env or 'parent_authority' not in env['user_details'] or env['user_details']['parent_authority'] is None:
                            env['user_details'] = {'parent_authority': user_local_authority}
                    except Exception,e:
                        env['error'] = "Please check your Credentials"
            else:
                env['project'] = True
                env['user_details'] = {'parent_authority': authority_hrn}

            logger.debug("BEFORE  ####------####  is_pi")
            logger.debug("is_pi = {}".format(is_pi))
            pi = is_pi(self.request, '$user_hrn', env['user_details']['parent_authority']) 
        else: 
            env['person'] = None
            pi = False
        env['theme'] = self.theme
        env['section'] = "Institution"
        env['pi'] = pi 
        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        env['layout_1_or_2']="layout-unfold2.html" if not env['username'] else "layout-unfold1.html"
        
        env['request'] = request
        return render_to_response(self.template, env, context_instance=RequestContext(request))

