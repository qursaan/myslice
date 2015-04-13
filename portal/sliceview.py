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
import json
from myslice.theme import ThemeView

class SliceView (LoginRequiredView, ThemeView):
    template_name = "slice-view.html"
    
    def get(self, request, slicename):
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
        if acc_auth_cred == {} or acc_auth_cred == 'N/A':
            pi = "is_not_pi"
        else:
            pi = "is_pi"
        return render_to_response(self.template,
                                  {"slice" : slicename,
                                   "theme" : self.theme,
                                   "username" : request.user,
                                   "pi" : pi,
                                   "section" : "Slice {}".format(slicename) },
                                  context_instance=RequestContext(request))
