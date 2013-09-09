from portal.templateviews            import LoginRequiredAutoLogoutView
#
from manifold.core.query             import Query
from manifold.manifoldapi            import execute_query
from portal.actions                  import manifold_update_user
#
from myslice.viewutils               import topmenu_items, the_user
#
from django.http                     import HttpResponse
from django.contrib.auth.decorators  import login_required
import json

# requires login
class AccountView(LoginRequiredAutoLogoutView):
    template_name = "account-view.html"
    
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


@login_required
#my_acc form value processing
def account_process(request):
    user_query  = Query().get('local:user').select('password','config')
    user_details = execute_query(request, user_query)

    if 'submit_name' in request.POST:
        edited_first_name =  request.POST['fname']
        edited_last_name =  request.POST['lname']
        
        config={}
        for user_config in user_details:
        #email = user_detail['email']
            if user_config['config']:
                config = json.loads(user_config['config'])
                config['firstname'] = edited_first_name
                config['lastname'] = edited_last_name
                config['authority'] = config.get('authority','Unknown Authority')
                updated_config = json.dumps(config)
        
        # updating config local:user in manifold       
        user_params = { 'config': updated_config}
        manifold_update_user(request,user_params)
        # this will be depricated, we will show the success msg in same page
        return HttpResponse('Sucess: First Name and Last Name Updated!')       
    elif 'submit_pass' in request.POST:
        edited_password = request.POST['password']
        
        for user_pass in user_details:
            user_pass['password'] = edited_password
        #updating password in local:user
        user_params = { 'password': user_pass['password']}
        manifold_update_user(request,user_params)

        return HttpResponse('Success: Password Changed!!')
    elif 'generate' in request.POST:
        # Generate public and private keys using SFA Library
        from sfa.trust.certificate  import Keypair
        k = Keypair(create=True)
        public_key = k.get_pubkey_string()
        private_key = k.as_pem()
        private_key = ''.join(private_key.split())
        public_key = "ssh-rsa " + public_key
        # Saving to DB
        keypair = '{"user_public_key":"'+ public_key + '", "user_private_key":"'+ private_key + '"}'
#        keypair = re.sub("\r", "", keypair)
#        keypair = re.sub("\n", "\\n", keypair)
#        #keypair = keypair.rstrip('\r\n')
#        keypair = ''.join(keypair.split())
        get_user.keypair = keypair
        get_user.save()
        return HttpResponse('Success: New Keypair Generated! %s' % keypair)

    elif 'upload_key' in request.POST:
        up_file = request.FILES['pubkey']
        file_content =  up_file.read()
        file_name = up_file.name
        file_extension = os.path.splitext(file_name)[1] 
        allowed_extension =  ['.pub','.txt']
        if file_extension in allowed_extension and re.search(r'ssh-rsa',file_content):
            file_content = '{"user_public_key":"'+ file_content +'"}'
            file_content = re.sub("\r", "", file_content)
            file_content = re.sub("\n", "\\n",file_content)
            file_content = ''.join(file_content.split())
            get_user.keypair = file_content
            get_user.save()
            return HttpResponse('Success: Publickey uploaded! Old records overwritten')
        else:
            return HttpResponse('Please upload a valid RSA public key [.txt or .pub].')    
        
    else:
        message = 'You submitted an empty form.'
        return HttpResponse(message)
