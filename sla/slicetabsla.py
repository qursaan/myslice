from __future__ import print_function

# this somehow is not used anymore - should it not be ?
import ast
from datetime import datetime
import json
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

class SLAView(FreeAccessView, ThemeView):
    template_name = 'slice-tab-sla.html'

    def get(self, request, slicename):

        page = Page(request)

        agreement_id = None
        enforcements = {}
        violations = {}
        keys = ['provider', 'agreement',
                'date', 'status', 'result',
                'ok', 'slivers']
        ag_info = []

        agreements = _get_agreements_by_slice(slicename)

        for agreement in agreements:
            row = []
            provider = agreement.context.provider
            row.append(provider)  # Provider
            row.append(agreement)  # Agreement
            row.append(agreement.context.time_formatted())  # Date

            enf = _get_enforcement(agreement.agreement_id, provider)

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


class AgreementTemplates(FreeAccessView, ThemeView):
    def get(self, request, *args, **kwargs):
        c = restclient.Templates(SLA_COLLECTOR_URL)
        testbed = kwargs.get('testbed', None)

        #logger.debug("AAAAA testbed: {}".format(testbed))

        templates, response = c.getall(testbed)
        service_level_objectives = []

        #logger.debug("BBBBB templates: {}".format(templates))

        for template in templates:
            service_level_objectives.append(
                [v.servicelevelobjective for v in template.guaranteeterms.values()])

        logger.debug("CCCCC slo: {}".format(service_level_objectives))

        return HttpResponse(service_level_objectives, content_type="application/json", status=response.status_code)

class CreateAgreement(LoginRequiredView, ThemeView):
    def post(self, request, *args, **kwargs):

        c = restclient.Client(SLA_COLLECTOR_URL)
        data = request.POST.copy()

        testbed_urn_regex = r"\+(.*?)\+"
        pattern = re.compile(testbed_urn_regex)
        testbed_urn = pattern.search(data["SLIVER_INFO_AGGREGATE_URN"]).group(1)

        # Fix for django QueryDict list parameters
        slivers = data.getlist("SLIVER_INFO_URN[]")
        data["SLIVER_INFO_URN"] = slivers
        del data["SLIVER_INFO_URN[]"]

        # Timestamp to ISO date + timezone
        tstmp = data["SLIVER_INFO_EXPIRATION"]
        dt = datetime.fromtimestamp(float(tstmp))
        # gmt_2 = pytz.timezone("Etc/GMT-2")
        # dlocal = gmt_2.localize(dt).isoformat()
        dlocal = dt.isoformat() + "CET" # FIXME: hardcoded for demo purposes
        data["SLIVER_INFO_EXPIRATION"] = dlocal

        # logger.debug("SLA Agreement parameters: {}".format(data.dict()))
        # import pdb; pdb.set_trace()

        try:
            response = c.post("agreementslist/", data=json.dumps(data),
                              headers={"accept": "application/json",
                                 "content-type": "application/json"})
        except Exception as e:
            # import traceback, sys
            #
            # traceback.print_exc(file=sys.stdout)
            logger.debug("SLA Error: CreateAgreement {}".format(e.message))

        return HttpResponse(response.text, status=response.status_code)
