# -*- coding: utf-8 -*-

"""Converts from XML to objects for ws-agreement agreements/templates or any
other xml returned by SLA Manager.

This module offers a set of converters from xml formats returned by SLA Manager
to a more-friendly POJO instances.

The converters are designed to be pluggable: see ListConverter.


Usage:
c = AnyConverter() or
c = ListConverter(AnyOtherConverter())

convertstring(c, "<?xml ... </>")

convertfile(c, "file.xml")

root = ElementTree.parse("file.xml")
c.convert(root.getroot())

"""
from myslice.settings import logger

try:
    # Much faster and lighter library (C implementation)
    from xml.etree import cElementTree as ElementTree
except ImportError:
    from xml.etree import ElementTree

from xml.etree.ElementTree import QName

import dateutil.parser

from wsag_model import Agreement
from wsag_model import Template
from wsag_model import Violation
from wsag_model import Provider
from wsag_model import Enforcement


def convertfile(converter, f):
    """Reads and converts a xml file

    :rtype : object
    :param Converter converter:
    :param str f: file to read
    """
    tree = ElementTree.parse(f)
    result = converter.convert(tree.getroot())
    return result


def convertstring(converter, string):
    """Converts a string

    :rtype : object
    :param Converter converter:
    :param str string: contains the xml to convert
    """
    root = ElementTree.fromstring(string)
    result = converter.convert(root)
    return result


class Converter(object):

    def __init__(self):
        """Base class for converters
        """
        pass

    def convert(self, xmlroot):
        """Converts the given xml in an object

        :rtype : Object that represents the xml
        :param Element xmlroot: root element of xml to convert.
        """
        return None


class ListConverter(Converter):
    def __init__(self, innerconverter):
        super(ListConverter, self).__init__()
        self.innerconverter = innerconverter

    def convert(self, xmlroot):
        result = []

        # Converter for the old xml structure
        # for item in xmlroot.find("items"): # loop through "items" children
        #     inner = self.innerconverter.convert(item)
        #     result.append(inner)
        # return result

        for item in xmlroot:      # loop through children
            inner = self.innerconverter.convert(item)
            result.append(inner)
        return result


class ProviderConverter(Converter):
    """Converter for a provider.

    Input:
    <provider>
        <uuid>1ad9acb9-8dbc-4fe6-9a0b-4244ab6455da</uuid>
        <name>Provider2</name>
    </provider>

    Output:
    wsag_model.Provider
    """

    def __init__(self):
        super(ProviderConverter, self).__init__()

    def convert(self, xmlroot):
        result = Provider()
        result.uuid = xmlroot.find("uuid").text
        result.name = xmlroot.find("name").text
        return result


class EnforcementConverter(Converter):
    """Converter for an Enforcement job.

    Input:
    <enforcement_job>
        <agreement_id>agreement03</agreement_id>
        <enabled>false</enabled>
    </enforcement_job>

    Output:
    wsag_model.Enforcement
    """

    def __init__(self):
        super(EnforcementConverter, self).__init__()

    def convert(self, xmlroot):
        result = Enforcement()
        result.agreement_id = xmlroot.find("agreement_id").text
        result.enabled = xmlroot.find("enabled").text
        return result


class ViolationConverter(Converter):
    """Converter for a violation.

    Input:
    <violation>
        <uuid>1d94627e-c318-41ba-9c45-42c95b67cc32</uuid>
        <contract_uuid>26e5d5b6-f5a1-4eb3-bc91-606e8f24fb09</contract_uuid>
        <service_name>servicename1</service_name>
        <service_scope>test1</service_scope>
        <metric_name>UpTime</metric_name>
        <datetime>2014-07-17T09:32:00+02:00</datetime>
        <actual_value>0.0</actual_value>
    </violation>

    Output:
        wsag_model.Violation
    """
    def __init__(self):
        super(ViolationConverter, self).__init__()

    def convert(self, xmlroot):
        result = Violation()
        result.uuid = xmlroot.find("uuid").text
        result.contract_uuid = xmlroot.find("contract_uuid").text
        result.service_name = xmlroot.find("service_name").text
        result.service_scope = xmlroot.find("service_scope").text
        result.metric_name = xmlroot.find("metric_name").text
        result.actual_value = xmlroot.find("actual_value").text
        dt_str = xmlroot.find("datetime").text
        result.datetime = dateutil.parser.parse(dt_str)

        return result


class AgreementConverter(Converter):
    def __init__(self):
        """Converter for an ws-agreement agreement or template.
        """
        super(AgreementConverter, self).__init__()
        self._namespaces = {
            "wsag": "http://www.ggf.org/namespaces/ws-agreement",
            "sla": "http://sla.atos.eu",
        }
        self.agreement_tags = (
            "{{{}}}Agreement".format(self._namespaces["wsag"]),
        )
        self.template_tags = (
            "{{{}}}Template".format(self._namespaces["wsag"]),
        )

    def convert(self, xmlroot):
        """
        :param Element xmlroot: root element of xml to convert.
        :rtype: wsag_model.Agreement
        """
        # for name, value in xmlroot.attrib.items():
        #      logger.debug('SLA xmlconverter: {} = {}'.format(name, value))

        if xmlroot.tag in self.agreement_tags:
            result = Agreement()
            agreementId = str(QName(self._namespaces["wsag"], "AgreementId"))
            result.agreement_id = xmlroot.attrib[agreementId]
        elif xmlroot.tag in self.template_tags:
            result = Template()
            templateId = str(QName(self._namespaces["wsag"], "TemplateId"))
            result.template_id = xmlroot.attrib[templateId]
        else:
            raise ValueError("Not valid root element name: " + xmlroot.tag)

        context = xmlroot.find("wsag:Context", self._namespaces)
        result.context = self._parse_context(context)

        terms = xmlroot.find("wsag:Terms/wsag:All", self._namespaces)

        properties = terms.findall("wsag:ServiceProperties", self._namespaces)
        result.variables = self._parse_properties(properties)

        guarantees = terms.findall("wsag:GuaranteeTerm", self._namespaces)
        result.guaranteeterms = self._parse_guarantees(guarantees)

        return result

    def _parse_context(self, element):
        nss = self._namespaces
        result = Agreement.Context()

        result.template_id = self._find_text(element, "wsag:TemplateId")
        result.expirationtime = self._find_text(element, "wsag:ExpirationTime")

        service_elem = element.find("sla:Service", nss)
        result.service = \
            service_elem.text if service_elem is not None else "<servicename>"

        initiator = self._find_text(element, "wsag:AgreementInitiator")
        responder = self._find_text(element, "wsag:AgreementResponder")
        serviceprovider_elem = self._find_text(element, "wsag:ServiceProvider")

        #
        # Deloop the initiator-responder indirection.
        #
        if serviceprovider_elem == "AgreementResponder":
            consumer = initiator
            provider = responder
        elif serviceprovider_elem == "AgreementInitiator":
            consumer = responder
            provider = initiator
        else:
            raise ValueError(
                "Invalid value for wsag:ServiceProvider : " +
                serviceprovider_elem)

        result.initiator = initiator
        result.responder = responder
        result.provider = provider
        result.consumer = consumer

        return result

    def _parse_property(self, element, servicename):
        nss = self._namespaces

        key = _get_attribute(element, "Name")
        value = Agreement.Property()
        value.servicename = servicename
        value.name = key
        value.metric = _get_attribute(element, "Metric")
        value.location = element.find("wsag:Location", nss).text

        return key, value

    def _parse_properties(self, elements):
        result = {}
        nss = self._namespaces
        for element in elements:
            servicename = _get_attribute(element, "ServiceName")
            for var in element.findall("wsag:VariableSet/wsag:Variable", nss):
                key, value = self._parse_property(var, servicename)
                result[key] = value

        return result

    def _parse_guarantee_scope(self, element):
        result = Agreement.GuaranteeTerm.GuaranteeScope()
        result.servicename = _get_attribute(element, "ServiceName")
        result.scope = element.text
        return result

    def _parse_guarantee_scopes(self, elements):
        result = []
        for scope in elements:
            result.append(self._parse_guarantee_scope(scope))
        return result

    def _parse_guarantee(self, element):
        nss = self._namespaces

        result = Agreement.GuaranteeTerm()
        name = _get_attribute(element, "Name")
        result.name = name
        scopes = element.findall("wsag:ServiceScope", nss)
        result.scopes = self._parse_guarantee_scopes(scopes)

        kpitarget = element.find(
            "wsag:ServiceLevelObjective/wsag:KPITarget", nss)
        slo = Agreement.GuaranteeTerm.ServiceLevelObjective()
        result.servicelevelobjective = slo
        slo.kpiname = kpitarget.find("wsag:KPIName", nss).text
        slo.customservicelevel = kpitarget.find(
            "wsag:CustomServiceLevel", nss).text

        return name, result

    def _parse_guarantees(self, elements):
        result = {}
        for element in elements:
            key, value = self._parse_guarantee(element)
            result[key] = value
        return result

    def _find_text(self, src, path):
        """Returns the inner text of the element located in path from the src
        element; None if no elements were found.

        :type src: Element
        :type path: src
        :rtype: str

        Usage:
            text = _find_text(root, "wsag:Context/ExpirationTime")
        """
        dst = src.find(path, self._namespaces)
        if dst is None:
            return ""
        return dst.text


def _get_attribute(element, attrname):
    """
    Get attribute from an element.

    Wrapper over Element.attrib, as this doesn't fallback to the element
    namespace if the attribute is qnamed and the requested attribute name
    is not.

    Ex:
        <ns:elem attr1="value1" ns:attr2="value2"/>

        _get_attribute(elem, "attr1") -> value1
        _get_attribute(elem, "attr2") -> value2
        _get_attribute(elem, "{uri}:attr1") -> Error
        _get_attribute(elem, "{uri}:attr2") -> value2
    """
    isns = (attrname[0] == '{')

    #
    # Handle qnamed request:
    #   attrname = {uri}name
    #
    if isns:
        return element.attrib[attrname]

    #
    # Handle non-qnamed request and non-qnamed actual_attr
    #   attrname = name
    #   actual_attr = name
    #
    if attrname in element.attrib:
        return element.attrib[attrname]

    #
    # Handle non-qnamed request but qnamed actualAttr
    #   attrname = name
    #   actual_attr = {uri}name
    #
    tag_uri = element.tag[0: element.tag.find('}') + 1]
    return element.attrib[tag_uri + attrname]
