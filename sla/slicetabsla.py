from __future__ import print_function

# this somehow is not used anymore - should it not be ?
import ast
from datetime import datetime
import pytz
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render
from django import forms
import re

from unfold.loginrequired import LoginRequiredView, FreeAccessView
from unfold.page import Page
from sla.slaclient import restclient
from sla.slaclient import wsag_model
import wsag_helper
from myslice.theme import ThemeView
# from sla import SLAPlugin
from django.core.urlresolvers import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import slaclient.service.fed4fire.fed4fireservice as fed4fireservice
from django.http import HttpResponse

from myslice.settings import logger, SLA_COLLECTOR_URL


# class AgreementsFilter(object):
# def __init__(self, status=None, provider=None, consumer=None):
#         self.status = status
#         self.provider = provider
#         self.consumer = consumer
#
#     def __repr__(self):
#         return "<AgreementsFilter(status={}, provider={}, consumer={})>".format(
#             self.status, self.provider, self.consumer
#         )
#
#     @staticmethod
#     def _check(expectedvalue, actualvalue):
#         if expectedvalue is None or expectedvalue == '':
#             return True
#         else:
#             return actualvalue == expectedvalue
#
#     def check(self, agreement):
#         """Check if this agreement satisfy the filter.
#
#         The agreement must be previously annotated
#         """
#         guaranteestatus = agreement.guaranteestatus
#         provider = agreement.context.provider
#         consumer = agreement.context.consumer
#         return (
#             AgreementsFilter._check(self.status, guaranteestatus) and
#             AgreementsFilter._check(self.provider, provider) and
#             AgreementsFilter._check(self.consumer, consumer)
#         )


# class FilterForm(forms.Form):
#     _attrs = {'class': 'form-control'}
#     exclude = ()
#     status = forms.ChoiceField(
#         choices=[
#             ('', 'All'),
#             (wsag_model.AgreementStatus.StatusEnum.FULFILLED, 'Fulfilled'),
#             (wsag_model.AgreementStatus.StatusEnum.VIOLATED, 'Violated'),
#             (wsag_model.AgreementStatus.StatusEnum.NON_DETERMINED, 'Non determined')],
#         widget=forms.Select(attrs=_attrs),
#         required=False
#     )
#     provider = forms.CharField(
#         widget=forms.TextInput(attrs=_attrs),
#         required=False
#     )
#     consumer = forms.CharField(
#         widget=forms.TextInput(attrs=_attrs),
#         required=False
#     )


class SLAView(FreeAccessView, ThemeView):
    template_name = 'slice-tab-sla.html'

    def get(self, request, slicename):

        page = Page(request)

        # logger.debug("SLA slice name: {}".format(slicename))

        # consumer_id = None
        agreement_id = None
        enforcements = {}
        violations = {}
        keys = ['provider', 'agreement',
                'date', 'status', 'result',
                'ok', 'slivers']
        ag_info = []

        # filter_ = None
        # form = FilterForm(request.GET)
        # if form.is_valid():
        #     filter_ = _get_filter_from_form(form)

        # consumer_id = _get_consumer_id(request)

        # agreements = _get_agreements(agreement_id, consumer_id=consumer_id, filter_=filter_)
        agreements = _get_agreements_by_slice(slicename)

        for agreement in agreements:
            row = []
            provider = agreement.context.provider
            row.append(provider)  # Provider
            row.append(agreement)  # Agreement
            row.append(agreement.context.time_formatted())  # Date

            enf = _get_enforcement(agreement.agreement_id, provider)
            logger.debug("SLA AAAAA: {}".format(agreement.guaranteestatus))

            if enf.enabled == 'true':
                row.append('Evaluating')  # Status
                row.append('')  # Result
                row.append('')  # Ok
            else:
                if agreement.guaranteestatus == "NON_DETERMINED":
                    row.append('Provisioned')  # Status
                    row.append('')  # Result
                    row.append('')  # Ok

                else:
                    row.append('Finished')  # Status

                    violations_list = _get_agreement_violations(agreement.agreement_id, provider, "GT_Performance")

                    if len(violations_list) > 0:
                        value = '%.2f' % float(violations_list[0].actual_value)
                        row.append('%d' % (float(value) * 100))  # Result
                    else:
                        row.append('100')  # Result

                    if agreement.guaranteestatus == "VIOLATED":
                        row.append('false')  # Ok

                    if agreement.guaranteestatus == "FULFILLED":
                        row.append('true')  # Ok

            for _, terms in agreement.guaranteeterms.items():
                try:
                    s = ast.literal_eval(terms.scopes[0].scope.lstrip())
                    logger.debug('SLA scope: {}'.format(s))
                    row.append(s)
                    break
                except Exception as e:
                    logger.debug("SLA EXCEPTION: {}".format(e.message))

            ag_info.append(dict(zip(keys, row)))

        template_env = {}
        # write something of our own instead
        # more general variables expected in the template
        template_env['title'] = 'SLA Agreements'
        template_env['agreements'] = agreements
        template_env['username'] = request.user
        template_env['slicename'] = slicename
        template_env['enforcements'] = enforcements
        template_env['last_violation_list'] = violations
        template_env['ag_info'] = ag_info

        # the prelude object in page contains a summary of the requirements() for all plugins
        # define {js,css}_{files,chunks}
        prelude_env = page.prelude_env()
        template_env.update(prelude_env)

        return render_to_response(self.template_name, template_env, context_instance=RequestContext(request))


# class AgreementsFilter(object):
#     def __init__(self, status=None, provider=None, consumer=None):
#         self.status = status
#         self.provider = provider
#         self.consumer = consumer
#
#     def __repr__(self):
#         return "<AgreementsFilter(status={}, provider={}, consumer={})>".format(
#             self.status, self.provider, self.consumer
#         )
#
#     @staticmethod
#     def _check(expectedvalue, actualvalue):
#         if expectedvalue is None or expectedvalue == '':
#             return True
#         else:
#             return actualvalue == expectedvalue
#
#     def check(self, agreement):
#         """Check if this agreement satisfy the filter.
#
#         The agreement must be previously annotated
#         """
#         guaranteestatus = agreement.guaranteestatus
#         provider = agreement.context.provider
#         consumer = agreement.context.consumer
#         return (
#             AgreementsFilter._check(self.status, guaranteestatus) and
#             AgreementsFilter._check(self.provider, provider) and
#             AgreementsFilter._check(self.consumer, consumer)
#         )


# class ContactForm(forms.Form):
#     subject = forms.CharField(max_length=100)
#     message = forms.CharField()
#     sender = forms.EmailField()
#     cc_myself = forms.BooleanField(required=False)


def _get_agreements_client():
    return restclient.Factory.agreements()


def _get_violations_client():
    return restclient.Factory.violations()


def _get_enforcements_client():
    return restclient.Factory.enforcements()


def _get_consumer_id(request):
    return request.user


def _get_agreement(agreement_id):
    agreements_client = _get_agreements_client()
    agreement, response = agreements_client.getbyid(agreement_id)
    return agreement


def _get_enforcement(agreement_id, testbed):
    enforcements_client = _get_enforcements_client()
    enforcement, response = enforcements_client.getbyagreement(agreement_id, testbed)
    return enforcement


# def _get_filter_from_form(form):
#
#     data = form.cleaned_data
#     result = AgreementsFilter(
#         data["status"], data["provider"], data["consumer"])
#     return result

def agreement_term_violations(request, agreement_id, guarantee_name):
    page = Page(request)
    prelude_env = page.prelude_env()

    annotator = wsag_helper.AgreementAnnotator()
    agreement = _get_agreement(agreement_id)
    violations = _get_agreement_violations(agreement_id, guarantee_name)
    annotator.annotate_agreement(agreement)

    slicename = request.POST.get('slicename')

    paginator = Paginator(violations, 25)  # Show 25 violations per page
    page_num = request.GET.get('page')

    try:
        violation_page = paginator.page(page_num)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        violation_page = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver first page.
        violation_page = paginator.page(1)

    context = {
        'agreement_id': agreement_id,
        'guarantee_term': agreement.guaranteeterms[guarantee_name],
        'violations': violation_page,
        'agreement': agreement,
        'slicename': slicename,
        'last_violation': violations[-1].actual_value
    }

    context.update(prelude_env)

    return render_to_response('violations_template.html', context, context_instance=RequestContext(request))


#     return render(request, 'violations_template.html', context)


# TODO Change function to class
def agreement_details(request, agreement_id):
    page = Page(request)
    prelude_env = page.prelude_env()

    annotator = wsag_helper.AgreementAnnotator()
    agreement = _get_agreement(agreement_id)
    violations = _get_agreement_violations(agreement_id)
    status = _get_agreement_status(agreement_id)
    annotator.annotate_agreement(agreement, status, violations)

    violations_by_date = wsag_helper.get_violations_bydate(violations)
    context = {
        'agreement_id': agreement_id,
        'agreement': agreement,
        'status': status,
        'violations_by_date': violations_by_date
    }

    context.update(prelude_env)

    return render_to_response('violations_template.html', context, context_instance=RequestContext(request))
    #return render(request, 'agreement_detail.html', context)


# def _get_agreements(agreement_id, slice=None, provider_id=None, consumer_id=None, filter_=None):
#
#     agreements_client = _get_agreements_client()
#     if agreement_id is None:
#         if consumer_id is not None:
#             agreements, response = agreements_client.getbyconsumer(consumer_id)
#         elif provider_id is not None:
#             agreements, response = agreements_client.getbyprovider(provider_id)
#         elif slice is not None:
#             agreements_client = _get_agreements_client("slice")
#             agreements, response = agreements_client.getbyslice(slice)
#         else:
#             raise ValueError(
#                 "Invalid values: consumer_id and provider_id are None")
#     else:
#         agreement, response = agreements_client.getbyid(agreement_id)
#         agreements = [agreement]
#
#     annotator = wsag_helper.AgreementAnnotator()
#     for agreement in agreements:
#         id_ = agreement.agreement_id
#         testbed = agreement.context.provider
#         status = _get_agreement_status(id_, testbed)
#         annotator.annotate_agreement(agreement, status)
#
#     if filter_ is not None:
#         print "FILTERING ", repr(filter_)
#         agreements = filter(filter_.check, agreements)
#     else:
#         print "NOT FILTERING"
#     return agreements

def _get_agreements_by_slice(slice):
    agreements_client = _get_agreements_client()
    agreements, response = agreements_client.getbyslice(slice)

    annotator = wsag_helper.AgreementAnnotator()
    for agreement in agreements:
        id_ = agreement.agreement_id
        testbed = agreement.context.provider
        status = _get_agreement_status(id_, testbed)
        annotator.annotate_agreement(agreement, status)

    return agreements


# def _get_agreements_by_consumer(consumer_id):
#
#     agreements_client = _get_agreements_client()
#     agreements, response = agreements_client.getbyconsumer(consumer_id)
#     return agreements

def _get_agreement_status(agreement_id, testbed):
    agreements_client = _get_agreements_client()
    status, response = agreements_client.getstatus(agreement_id, testbed)
    return status


def _get_agreement_violations(agreement_id, testbed, term=None):
    violations_client = _get_violations_client()
    violations, response = violations_client.getbyagreement(agreement_id, testbed, term)
    return violations


class Testbeds(FreeAccessView, ThemeView):
    def get(self, request, *args, **kwargs):
        c = restclient.Client(SLA_COLLECTOR_URL)
        #url = settings.SLA_MANAGER_URL.replace("/sla","")
        #c = restclient.Client(url)
        # print "**** URL ******", url
        SLAtestbeds = c.get("testbeds/")
        # Future work: get SLA description for each testbed

        return HttpResponse(SLAtestbeds.text, content_type="application/json", status=SLAtestbeds.status_code)


class CreateAgreement(LoginRequiredView, ThemeView):
    def post(self, request, *args, **kwargs):

        c = restclient.Client(SLA_COLLECTOR_URL)
        data = request.POST.copy()

        testbed_urn_regex = r"\+(.*?)\+"
        pattern = re.compile(testbed_urn_regex)
        testbed_urn = pattern.search(data["SLIVER_INFO_AGGREGATE_URN"]).group(1)

        tstmp = data["SLIVER_INFO_EXPIRATION"]

        dt = datetime.fromtimestamp(float(tstmp))
        gmt_2 = pytz.timezone("Etc/GMT-2") # FIXME: hardcoded for demo purposes
        dlocal = gmt_2.localize(dt).isoformat()

        data["SLIVER_INFO_EXPIRATION"] = dlocal

        logger.debug("SLA Agreement parameters: {}".format(data))

        try:
            response = c.post("agreements/create/", data=data, testbed=testbed_urn)
        except Exception as e:
            import traceback, sys

            traceback.print_exc(file=sys.stdout)
            logger.debug("SLA ERROR {}".format(e.message))

        return HttpResponse(response.text, status=response.status_code)
