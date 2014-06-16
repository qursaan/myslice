# -*- coding: utf-8 -*-

import requests

import xmlconverter
import wsag_model


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
_VIOLATIONS_PATH = "violations"
_ENFORCEMENTJOBS_PATH = "enforcementjobs"

rooturl = ""


class Factory(object):
    @staticmethod
    def agreements():
        """Returns aREST client for Agreements

        :rtype : Agreements
        """
        return Agreements(rooturl)

    @staticmethod
    def providers():
        """Returns aREST client for Providers

        :rtype : Providers
        """
        return Providers(rooturl)

    @staticmethod
    def violations():
        """Returns aREST client for Violations

        :rtype : Violations
        """
        return Violations(rooturl)

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
        url = _buildpath_(self.rooturl, path)
        result = requests.get(url, **kwargs)
        print "GET {} {} {}".format(
            result.url, result.status_code, result.text[0:70])
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

        print("content-type = " + content_type)
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

    def getbyid(self, id):
        """Get resource 'id'"""
        r = self.client.get(id)
        resource = _Resource._processresult(r, self.converter)
        return resource, r

    def get(self, params):
        """Generic query over resource: GET /resource?q1=v1&q2=v2...

        :param dict[str,str] params: values to pass as get parameters
        """
        r = self.client.get("", params=params)
        resources = self._processresult(r, self.listconverter)
        return resources, r

class Agreements(object):

    def __init__(self, root_url, path=_AGREEMENTS_PATH):
        """Business methods for Agreement resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath_(root_url, path)
        converter = xmlconverter.AgreementConverter()
        self.res = _Resource(resourceurl, converter)

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

    def getstatus(self, agreementid):
        """Get guarantee status of an agreement

        :param str agreementid :
        :rtype : wsag_model.AgreementStatus
        """
        path = _buildpath_(agreementid, "guaranteestatus")
        r = self.res.client.get(path, headers={'accept': 'application/json'})
        json_obj = r.json()
        status = wsag_model.AgreementStatus.json_decode(json_obj)

        return status, r

class Providers(object):

    def __init__(self, root_url, path=_PROVIDERS_PATH):
        """Business methods for Providers resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath_(root_url, path)
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

class Violations(object):

    def __init__(self, root_url, path=_VIOLATIONS_PATH):
        """Business methods for Violation resource
        :param str root_url: url to the root of resources
        :param str path: path to resource from root_url

        The final url to the resource is root_url + "/" + path
        """
        resourceurl = _buildpath_(root_url, path)
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

    def getbyagreement(self, agreement_id, term=None):
        """Get the violations of an agreement.

        :param str agreement_id:
        :param str term: optional GuaranteeTerm name. If not specified,
            violations from all terms will be returned
        :rtype: list[wsag_model.Violation]
        """
        return self.res.get(
            {"agreementId": agreement_id, "guaranteeTerm": term})


def _buildpath_(*paths):
    return "/".join(paths)


def main():
    #
    # Move to test
    #
    global rooturl
    rooturl = "http://10.0.2.2:8080/sla-service"

    c = Factory.agreements()
    #r = c.getall()
    #r = c.getbyid("noexiste")
    #r = c.getstatus("agreement03")
    #print r

    #r = c.getbyconsumer('RandomClient')

    c = Providers(rooturl)
    r = c.getall()

    c = Violations(rooturl)
    #r = c.getall()
    r_ = c.getbyagreement("agreement03", "GT_Otro")
    r_ = c.getbyid('cf41011d-9f30-4ebc-a967-30b4ea928192')

    print r_


if __name__ == "__main__":
    main()


