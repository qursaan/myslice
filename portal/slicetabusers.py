from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http import HttpResponse
from django.shortcuts import render

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from myslice.theme import ThemeView
import json

class SliceUserView (LoginRequiredView, ThemeView):
    template_name = "slice-tab-users-view.html"
    
    def get(self, request, slicename):
        if request.user.is_authenticated():
           # user_query  = Query().get('user').select('user_hrn','parent_authority').filter_by('user_hrn','==','$user_hrn')
            #user_details = execute_query(self.request, user_query)
            # if sfa returns None
            #if user_details[0]['parent_authority'] is None:
                # find in local DB 
                user_query  = Query().get('local:user').select('config')
                user_details = execute_query(request, user_query)
                for user_config in user_details:
                        config = json.loads(user_config['config'])
                        config['authority'] = config.get('authority')
                        user_details[0]['parent_authority'] = config['authority']

        ## check user is pi or not
        platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        platform_details = execute_query(self.request, platform_query)
        account_details = execute_query(self.request, account_query)
        for platform_detail in platform_details:
            for account_detail in account_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    if 'config' in account_detail and account_detail['config'] is not '':
                        account_config = json.loads(account_detail['config'])
                        if 'myslice' in platform_detail['platform']:
                            acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')

        # assigning values
        if acc_auth_cred == {}:
            pi = "is_not_pi"
        else:
            pi = "is_pi"

        return render_to_response(self.template, {"slice": slicename, "user_details":user_details[0], "pi":pi, "theme": self.theme, "username": request.user, "section":"users"}, context_instance=RequestContext(request))
