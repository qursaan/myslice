# -*- coding: utf-8 -*-
"""Builds templates/agreements based on input data (in json format), submitting
to sla manager.

It is intended as backend service for a rest interface.

The json input must work together with the templates to form a valid template
 or agreement for fed4fire (be careful!)

This (very simple) service is coupled to the way fed4fire is interpreting
ws-agreement.


"""
import json
import jsonparser
from sla.slaclient import wsag_model
from sla.slaclient import restclient
from sla.slaclient.templates.fed4fire.django.factory import Factory as TemplateFactory
import sla.slaclient.templates.fed4fire as fed4fire
#from time import localtime, strftime
import uuid
import dateutil.parser


class ServiceContext(object):
    def __init__(self, restfactory=None, templatefactory=None):
        """
        :type restfactory: restclient.Factory
        """
        self.restfactory = restfactory
        self.templatefactory = templatefactory


def createprovider(json_data, context):
    """Creates a provider in the SlaManager.
    :type json_data:str
    :type context: ServiceContext

    An example input is:
    {
        "uuid": "f4c993580-03fe-41eb-8a21-a56709f9370f",
        "name": "provider"
    }
    """
    json_obj = json.loads(json_data)
    p = wsag_model.Provider.from_dict(json_obj)
    provider_client = context.restfactory.providers()
    provider_client.create(p)


def createtemplate(json_data, context):
    """Creates a template in the SlaManager

    An example input is:
    {
        "template_id" : "template-id",
        "template_name" : "template-name",
        "provider" : "provider-1",
        "service_id" : "service-id",
        "expiration_time" : "2014-03-28T13:55:00Z",
        "service_properties" : [
            {
                "name" : "uptime",
                "servicename" : "service-a",
                "metric" : "xs:double",
                "location" : "//service-a/uptime"
            }
        ]
    }

    :type json_data:str
    :type context: ServiceContext
    """
    data = jsonparser.templateinput_from_json(json_data)
    slatemplate = sla.slaclient.templates.fed4fire.render_slatemplate(data)
    client = context.restfactory.templates()
    client.create(slatemplate)


def createagreement(json_data, context):
    """Creates an agreement in the SlaManager.

    The template with template_id is retrieved and the properties and some
    context info is copied to the agreement.

    An example input is:
    {
        "template_id" : "template-id",
        "agreement_id" : "agreement-id",
        "expiration_time" : "2014-03-28T13:55:00Z",
        "consumer" : "consumer-a",
        "guarantees" : [
            {
                "name" : "uptime",
                "bounds" : [ "0", "1" ]
            }
        ]
    }
    :type json_data:str
    :type context: ServiceContext
    """
    client_templates = context.restfactory.templates()

    # Builds AgreementInput from json
    data = jsonparser.agreementinput_from_json(json_data)

    # Read template from manager
    # client_templates.getbyid(provider_id, testbed)
    slatemplate, request = client_templates.getbyid(data.template_id)
    # Copy (overriding if necessary) from template to AgreementInput
    final_data = data.from_template(slatemplate)

    slaagreement = fed4fire.render_slaagreement(final_data)

    client_agreements = context.restfactory.agreements()
    return client_agreements.create(slaagreement, data.template_id)


def createagreementsimplified(template_id, user, expiration_time, resources):
    context = ServiceContext(
        restclient.Factory(),
        TemplateFactory()
    )

    agreement = {
        "agreement_id": str(uuid.uuid4()),
        "template_id": template_id,
        "expiration_time": expiration_time.strftime('%Y-%m-%dT%H:%M:%S%Z'),
        "consumer": user,
        "guarantees": [
            {
                "name": "uptime",
                "bounds": ["0", "1"],
                "scope": {
                    "service_name": "",
                    "scope": resources[template_id]
                }
            }
        ]
    }

    json_data = json.dumps(agreement)

    return createagreement(json_data, context)
