# -*- coding: utf-8 -*-

import uuid
import json

from unittest import TestCase
from slaclient.service.fed4fire import fed4fireservice
from slaclient import restclient
from slaclient.templates.fed4fire.django.factory import Factory as TemplateFactory


class Fed4FireServiceTestCase(TestCase):

    def setUp(self):
        self.context = fed4fireservice.ServiceContext(
            restclient.Factory("http://localhost:8080/sla-service"),
            TemplateFactory()
        )
        self.provider_id = str(uuid.uuid4())
        self.template_id = str(uuid.uuid4())
        self.provider = {
            "uuid": self.provider_id,
            "name": "provider-" + self.provider_id[0:4]
        }
        self.template = {
            "template_id": self.template_id,
            "template_name": "template-name",
            "provider": self.provider_id,
            "service_id": "service-test",
            "expiration_time": "2014-03-28T13:55:00Z",
            "service_properties": [
                {"name": "uptime"},
                {"name": "responsetime"}
            ]
        }
        self.agreement = {
            "agreement_id": str(uuid.uuid4()),
            "template_id": self.template_id,
            "expiration_time": "2014-03-28T13:55:00Z",
            "consumer": "consumer-a",
            "guarantees": [
                {
                    "name": "uptime",
                    "bounds": ["0.9", "1"]
                }
            ]
        }

    def test(self):
        self._test_provider()
        self._test_template()
        self._test_agreement()

    def _test_provider(self):
        json_data = json.dumps(self.provider)
        fed4fireservice.createprovider(json_data, self.context)

    def _test_template(self):
        json_data = json.dumps(self.template)
        fed4fireservice.createtemplate(json_data, self.context)

    def _test_agreement(self):
        json_data = json.dumps(self.agreement)
        fed4fireservice.createagreement(json_data, self.context)
        
def main():
        context = fed4fireservice.ServiceContext(
            restclient.Factory(),
            TemplateFactory()
        )
        provider_id = "trento"
        template_id = "template_vm-Trento:193.205.211.xx"
        provider = {
            "uuid": provider_id,
            "name": "provider-" + provider_id[0:4]
        }
        template = {
            "template_id": template_id,
            "template_name": "template-name",
            "provider": provider_id,
            "service_id": "service-test",
            "expiration_time": "2014-03-28T13:55:00Z",
            "service_properties": [
                {"name": "uptime"},
                {"name": "responsetime"}
            ]
        }
        agreement = {
            "agreement_id": str(uuid.uuid4()),
            "template_id": template_id,
            "expiration_time": "2014-03-28T13:55:00Z",
            "consumer": "consumer-a",
            # the provider id must be repeated
            "provider": provider_id,
            "guarantees": [
                {
                    "name": "uptime",
                    "bounds": ["0.9", "1"]
                }
            ]
        }
    
        json_data = json.dumps(agreement)
        fed4fireservice.createagreement(json_data, context)


if __name__ == "__main__":
    main()
      
        
