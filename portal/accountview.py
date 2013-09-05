from portal.templateviews            import LoginRequiredAutoLogoutView
#
from manifold.core.query             import Query
#
from myslice.viewutils               import topmenu_items, the_user
#

# requires login
class AccountView(LoginRequiredAutoLogoutView):
    template_name = "my_account.html"
    
    def dispatch(self, *args, **kwargs):
        return super(AccountView, self).dispatch(*args, **kwargs)


    def get_context_data(self, **kwargs):

        user_query  = Query().get('local:user').select('config','email')
        user_details = execute_query(self.request, user_query)
        
        # not always found in user_details...
        config={}
        for user_detail in user_details:
            #email = user_detail['email']
            if user_detail['config']:
                config = json.loads(user_detail['config'])

        platform_query  = Query().get('local:platform').select('platform_id','platform')
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        platform_details = execute_query(self.request, platform_query)
        account_details = execute_query(self.request, account_query)
       
        # initial assignment needed for users having no account  
        platform_name = ''
        account_type = ''
        account_usr_hrn = ''
        account_pub_key = ''
        platform_name_list = []
        account_type_list = []
        usr_hrn_list = []
        pub_key_list = []          
        for account_detail in account_details:
            for platform_detail in platform_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    platform_name = platform_detail['platform']
                    account_type = account_detail['auth_type']
                    account_config = json.loads(account_detail['config'])
                    # a bit more pythonic
                    account_usr_hrn = account_config.get('user_hrn','N/A')
                    account_pub_key = account_config.get('user_public_key','N/A')
                    
                    platform_name_list.append(platform_name)
                    account_type_list.append(account_type)
                    usr_hrn_list.append(account_usr_hrn)
                    pub_key_list.append(account_pub_key)
        
        # combining 4 lists into 1 [to render in the template] 
        lst = [{'platform_name': t[0], 'account_type': t[1], 'usr_hrn':t[2], 'usr_pubkey':t[3]} 
               for t in zip(platform_name_list, account_type_list, usr_hrn_list, pub_key_list)]
        #print "test"
        #print lst

        context = super(AccountView, self).get_context_data(**kwargs)
        context['data'] = lst
        context['person']   = self.request.user
        context ['firstname'] = config.get('firstname',"?")
        context ['lastname'] = config.get('lastname',"?")
        context ['fullname'] = context['firstname'] +' '+ context['lastname']
        context ['authority'] = config.get('authority',"Unknown Authority")
        #context['users'] = userlist.render(self.request)
        
        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('My Account', self.request)
        # so we can sho who is logged
        context['username'] = the_user(self.request)
#        context ['firstname'] = config['firstname']
        #context.update(page.prelude_env())
        return context

