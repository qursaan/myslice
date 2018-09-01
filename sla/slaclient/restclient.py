# -*- coding: utf-8 -*-

import requests

from requests.auth import HTTPBasicAuth
from myslice.settings import logger

import xmlconverter
import wsag_model

from django.conf import settings


"""REST client to SLA Manager.

Contains a generic rest client and wrappers over this generic client
for each resource.

Each resource client implements business-like() functions, but
returns a tuple (output, requests.Response)

The resource clients are initialized with the rooturl and a path, which
are combined to build the resource url. The path is defaulted to the known
resource path. So, for example, to create a agreements client:

c = Agreements("http://localhost/slagui-service")

A Factory facility is provided to create resource client instances. The
Factory uses "rooturl" module variable to use as rooturl parameter.

restclient.rooturl = "http://localhost/slagui-service"
c = restclient.Factory.agreements()

"""

_PROVIDERS_PATH = "providers"
_AGREEMENTS_PATH = "agreements"
_TEMPLATES_PATH = "templates"
_VIOLATIONS_PATH = "violations"
_ENFORCEMENTJOBS_PATH = "enforcements"

rooturl = settings.SLA_COLLECTOR_URL


class Factory(object):
    @staticmethod
    def agreements():
        """Returns a REST client for Agreements

        :rtype : Agreements
         """
        return Agreements(rooturl)

    @staticmethod
    def providers():
        """Returns a REST client for Providers

        :rtype : Providers
        """
        return Providers(rooturl)

    @staticmethod
    def violations():
        """Returns a REST client for Violations

        :rtype : Violations
        """
        return Violations(rooturl)

    @staticmethod
    def templates():
        """Returns a REST client for Violations

        :rtype : Violations
        """
        return Templates(rooturl)

    @staticmethod
    def enforcements():
        """Returns a REST client for Enforcements jobs

        :rtype : Enforcements
        """
        return Enforcements(rooturl)


class Client(object):

    def __init__(self, root_url):

        """Generic rest client using requests library

        Each operation mimics the corresponding "requests" operation (arguments
        and return)

        :param str root_url: this url is used as prefix in all subsequent
            requests
        """
        self.rooturl = root_url

    def get(self, path, **kwargs):
        """Just a wrapper over request.get, just in case.

        Returns a requests.Response

        :rtype : request.Response
        :param str path: remaining path from root url;
            empty if desired path equal to rooturl.
        :param kwargs: arguments to requests.get

        Example:
            c = Client("http://localhost:8080/service")
            c.get("/resource", headers = { "accept": "application/json" })
        """
        url = _buildpath(self.rooturl, path)
        if "testbed" in kwargs:
            url = url + "?testbed=" + kwargs["testbed"]

        if "headers" not in kwargs:
            kwargs["headers"] = {"accept": "application/xml"}


        kwargs["auth"] = HTTPBasicAuth(settings.SLA_COLLECTOR_USER,
                                       settings.SLA_COLLECTOR_PASSWORD)

        # for key, values in kwargs.iteritems():
        #     print key, values

        result = requests.get(url, verify=False, **kwargs)
        logger.debug('SLA GET {} - result: {}'.format(result.url, result.status_code))
        # print "GET {} {} {}".format(
        #     result.url, result.status_code, result.text[0:70])
        # print result.encoding

        return result

    def post(self, path, data=None, **kwargs):
        """Just a wrapper over request.post, just in case

        :rtype : request.Response
        :param str path: remaining path from root url;
            empty if desired path equal to rooturl.
        :param dict[str, str] kwargs: arguments to requests.post

        Example:
            c = Client("http://localhost:8080/service")
            c.post(
                '/resource',
                '{ "id": "1", "name": "provider-a" }',
                headers = {
                    "content-type": "application/json",
                    "accept": "application/xml"
                }
            )
        """
        url = _buildpath(self.rooturl, path)

        if "testbed" in kwargs:
            url = url + "?testbed=" + kwargs["testbed"]
            del kwargs["testbed"]

        if "headers" not in kwargs:
            kwargs["headers"] = {"accept": "application/xml",
                                 "content-type": "application/xml"}

        kwargs["auth"] = HTTPBasicAuth(settings.SLA_COLLECTOR_USER,
                                      settings.SLA_COLLECTOR_PASSWORD)

        result = requests.post(url, data, verify=False, **kwargs)
        location = result.headers["location"] \
            if "location" in result.headers else "<null>"
        print "POST {} {} - Location: {}".format(
            result.url, result.status_code, location)
        return result


class _Resource(object):

    def __init__(self, url, converter):
        """Provides some common operations over resources.

        The operations return a structured representation of the resource.

        :param str url: url to the resource
        :param Converter converter: resouce xml converter

        Some attributes are initialized to be used from the owner if needed:
        * client: Client instance
        * converter: resource xml converter
        * listconverter: list of resources xml converter
        """
        self.client = Client(url)
        self.converter = converter
        self.listconverter = xmlconverter.ListConverter(self.converter)

    @staticmethod
    def _processresult(r, converter):

        """Generic processing of the REST call.

         If no errors, tries to convert the result to a destination entity.

        :param r requests:
        :param converter Converter:
        """
        if r.status_code == 404:
            return None

        content_type = r.headers.get('content-type', '')

        #print("content-type = " + content_type)
        if content_type == 'application/json':
            result = r.json()
        elif content_type == 'application/xml':
            xml = r.text
            result = xmlconverter.convertstring(converter, xml)
        else:
            result = r.text
        return result

    def getall(self):
        """Get all resources

        """
        r = self.client.get("")
        resources = self._processresult(r, self.listconverter)
        return resources, r

    def getbyid(self, id, params):
        """Get resource 'id'"""
        r = self.client.get(id, params=params)
        resource = _Resource._processresult(r, self.converter)
        return resource, r

    def get(self, path="", params={}):
        """Generic query over resource: GET /resource?q1=v1&q2=v2...

        :param dict[str,str] params: values to pass as get parameters
        """

        r = self.client.get(path, params=params)
        resources = self._processresult(r, self.listconverter)
        return resources, r

    def create(self, body, **kwargs):
        """Creates (POST method) a resource.

        It should be convenient to set content-type header.

        Usage:
            resource.create(body, headers={'content-type': 'application/xml'})
        """
        r = self.client.post("", body, **kwargs)
        r.raise_for_status()
        return r


class Agreements(object):

    def __init__(self, root_url, path=_AGREEMENTS_PATH):
        """Business methods for Agreement resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        self.resourceurl = _buildpath(root_url, path)
        self.converter = xmlconverter.AgreementConverter()
        self.res = _Resource(self.resourceurl, self.converter)

    def getall(self):
        """
        Get all agreements

        :rtype : list[wsag_model.Agreement]
        """
        return self.res.getall()

    def getbyid(self, agreementid):
        """Get an agreement

        :rtype : wsag_model.Agreement
        """
        return self.res.getbyid(agreementid)

    def getbyconsumer(self, consumerid):
        """Get a consumer's agreements

        :rtype : list[wsag_model.Agreement]
        """
        return self.res.get(dict(consumerId=consumerid))

    def getbyprovider(self, providerid):
        """Get the agreements served by a provider

        :rtype : list[wsag_model.Agreement]
        """
        return self.res.get(dict(providerId=providerid))

    def getstatus(self, agreementid, testbed):
        """Get guarantee status of an agreement

        :param str agreementid :
        :rtype : wsag_model.AgreementStatus
        """
        # path = _buildpath(_AGREEMENTS_PATH, agreementid, "guaranteestatus")
        path = _buildpath(agreementid, "guaranteestatus")
        r = self.res.client.get(path, headers={'accept': 'application/json'},
                                params={'testbed': testbed})

        json_obj = r.json()
        status = wsag_model.AgreementStatus.json_decode(json_obj)

        return status, r

    def getbyslice(self, slicename):
        """Get the agreements corresponding to a slice

        :rtype : list[wsag_model.Agreement]
        """
        self.resourceurl = _buildpath(rooturl, 'slice')
        self.res = _Resource(self.resourceurl, self.converter)
        return self.res.get(slicename)

    def create(self, agreement, testbed):
        """Create a new agreement

        :param str agreement: sla template in ws-agreement format.
        """
        return self.res.create(agreement, params={'testbed': testbed})


class Templates(object):

    def __init__(self, root_url, path=_TEMPLATES_PATH):
        """Business methods for Templates resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath(root_url, path)
        converter = xmlconverter.AgreementConverter()
        self.res = _Resource(resourceurl, converter)

    def getall(self, provider_id):
        """ Get all templates

        :rtype : list[wsag_model.Template]
        """
        return self.res.get(path="", params={"testbed": provider_id})

    def getbyid(self, provider_id):
        """Get a template

        :rtype: wsag_model.Template
        """
        return self.res.getbyid(provider_id, {"testbed": provider_id})

    def create(self, template):
        """Create a new template

        :param str template: sla template in ws-agreement format.
        """
        self.res.create(template)


class Providers(object):

    def __init__(self, root_url, path=_PROVIDERS_PATH):
        """Business methods for Providers resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath(root_url, path)
        converter = xmlconverter.ProviderConverter()
        self.res = _Resource(resourceurl, converter)

    def getall(self):
        """ Get all providers

        :rtype : list[wsag_model.Provider]
        """
        return self.res.getall()

    def getbyid(self, provider_id):
        """Get a provider

        :rtype: wsag_model.Provider
        """
        return self.res.getbyid(provider_id)

    def create(self, provider):
        """Create a new provider

        :type provider: wsag_model.Provider
        """
        body = provider.to_xml()
        return self.res.create(body)


class Violations(object):

    def __init__(self, root_url, path=_VIOLATIONS_PATH):
        """Business methods for Violation resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath(root_url, path)
        converter = xmlconverter.ViolationConverter()
        self.res = _Resource(resourceurl, converter)

    def getall(self):
        """ Get all violations
        :rtype : list[wsag_model.Violation]
        """
        return self.res.getall()

    def getbyid(self, violationid):
        """Get a violation

        :rtype : wsag_model.Violation
        """
        return self.res.getbyid(violationid)

    def getbyagreement(self, agreement_id, testbed, term=None):
        """Get the violations of an agreement.

        :param str agreement_id:
        :param str term: optional GuaranteeTerm name. If not specified,
            violations from all terms will be returned
        :rtype: list[wsag_model.Violation]
        """
        return self.res.get("", params={"agreementId": agreement_id,
                                        "guaranteeTerm": term,
                                        "testbed": testbed})


class Enforcements(object):

    def __init__(self, root_url, path=_ENFORCEMENTJOBS_PATH):
        """Business methods for Violation resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath(root_url, path)
        converter = xmlconverter.EnforcementConverter()
        self.res = _Resource(resourceurl, converter)

    def getall(self):
        """ Get all Enforcements
        :rtype : list[wsag_model.Violation]
        """
        return self.res.getall()

    def getbyagreement(self, agreement_id, testbed):
        """Get the enforcement of an agreement.

        :param str agreement_id:

        :rtype: list[wsag_model.Enforcement]
        """
        return self.res.getbyid(agreement_id, params={"testbed": testbed})


def _buildpath(*paths):
    if "" in paths:
        paths = [path for path in paths if path != ""]

    return "/".join(paths)


def main():
    #
    # Move to test
    #
    global rooturl
    rooturl = "http://127.0.0.1:8080/sla-service"

    c = Factory.templates()
    #r = c.getall()
    #r = c.getbyid("noexiste")
    #r = c.getstatus("agreement03")
    #print r

    #r = c.getbyconsumer('RandomClient')
    r = c.getbyid("template02")

    print r


if __name__ == "__main__":
    main()
