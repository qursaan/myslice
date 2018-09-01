from datetime import datetime
from dateutil import tz
import dateutil.parser

"""Contains the bean models for the SlaManager xml/json types
"""


class Agreement(object):

    class Context(object):
        def __init__(self):
            self.expirationtime = datetime.now()
            self.service = ""
            self.initiator = ""
            self.responder = ""
            self.provider = ""
            self.consumer = ""

        def __repr__(self):
            s = "<Context(" + \
                "expirationtime={}, provider={}, consumer={}, service={})>"
            return s.format(
                repr(self.expirationtime),
                repr(self.provider),
                repr(self.consumer),
                repr(self.service))

        def service_formatted(self):
            return self.service.replace('_', ' ')

        def testbed_formatted(self):
            return self.template_id.replace('Service', ' - ')

        def time_formatted(self):
            from_zone = tz.tzutc()
            to_zone = tz.tzlocal()
            time = dateutil.parser.parse(self.expirationtime)
            time = time.replace(tzinfo=from_zone)
            time = time.astimezone(to_zone)
            return time.strftime('%d-%m-%Y at %H:%M:%S')

    class Property(object):
        def __init__(self):
            self.servicename = ""
            self.name = ""
            self.metric = ""
            self.location = ""

        def __repr__(self):
            str_ = "<Property(name={}, servicename={}, \
                    metric={}, location={})>"
            return str_.format(
                repr(self.name),
                repr(self.servicename),
                repr(self.metric),
                repr(self.location))

    class GuaranteeTerm(object):

        class GuaranteeScope(object):
            def __init__(self):
                self.servicename = ""
                self.scope = ""

            def __repr__(self):
                return "<GuaranteeScope(servicename={}, scope={}>)".format(
                    repr(self.servicename),
                    repr(self.scope)
                )

        class ServiceLevelObjective(object):
            def __init__(self):
                self.kpiname = ""
                self.customservicelevel = ""

            def __repr__(self):
                s = "<ServiceLevelObjective(kpiname={}, \
                    customservicelevel={})>"
                return s.format(
                    repr(self.kpiname),
                    repr(self.customservicelevel)
                )

        def __init__(self):
            self.name = ""
            self.scopes = []        # item: GuaranteeScope
            """:type : list[Agreement.GuaranteeTerm.GuaranteeScope]"""
            self.servicelevelobjective = \
                Agreement.GuaranteeTerm.ServiceLevelObjective()

        def __repr__(self):
            s = "<GuaranteeTerm(scopes={}, servicelevelobjective={})>"
            return s.format(
                repr(self.scopes),
                repr(self.servicelevelobjective)
            )

    def __init__(self):
        """Simple bean model for a ws-agreement agreement/template
        """
        self.context = Agreement.Context()
        self.agreement_id = ""
        self.descriptionterms = {}
        self.variables = {}         # key: Property.name / value: Property
        """:type : dict[str,Agreement.Property]"""
        self.guaranteeterms = {}    # key: GT.name / value: GT
        """:type : dict[str,Agreement.GuaranteeTerm]"""

    def __repr__(self):
        s = ("<Agreement(agreement_id={}, context={}, descriptionterms={}, " +
             "variables={}, guaranteeterms={}>")
        return s.format(
            repr(self.agreement_id),
            repr(self.context),
            repr(self.descriptionterms),
            repr(self.variables),
            repr(self.guaranteeterms)
        )


class Template(Agreement):
    def __init__(self):
        super(Template, self).__init__()
        self.template_id = ""

    def __repr__(self):
        s = ("<Template(template_id={}, context={}, descriptionterms={}, " +
             "variables={}, guaranteeterms={}>")
        return s.format(
            repr(self.template_id),
            repr(self.context),
            repr(self.descriptionterms),
            repr(self.variables),
            repr(self.guaranteeterms)
        )


class Enforcement(object):
    def __init__(self):
        """Simple bean model for an enforcement"""
        self.agreement_id = ""
        self.enabled = ""

    def __repr__(self):
        return ("<Enforcement(agreement_id={}, enabled={})>".format(
                self.agreement_id,
                self.enabled)
                )


class AgreementStatus(object):

    class StatusEnum:
        VIOLATED = "VIOLATED"
        FULFILLED = "FULFILLED"
        NON_DETERMINED = "NON_DETERMINED"

    class GuaranteeTermStatus(object):
        def __init__(self):
            self.name = ""
            self.status = ""

        def __repr__(self):
            s = "<GuaranteeTermStatus(name='{}' status='{}')>"
            return s.format(self.name, self.status)

    def __init__(self, lst=None):
        self.agreement_id = ""
        self.guaranteestatus = ""
        if lst is None:
            self.guaranteeterms = []
        else:
            self.guaranteeterms = lst

    def __repr__(self):
        return (
            "<AgreementStatus( agreement_id={}, guaranteestatus={}, " +
            "guaranteeterms={})>").format(
            self.agreement_id,
            self.guaranteestatus,
            repr(self.guaranteeterms))

    @staticmethod
    def json_decode(json_obj):
        o = AgreementStatus()
        o.agreement_id = json_obj["AgreementId"]
        o.guaranteestatus = json_obj["guaranteestatus"]

        for term in json_obj["guaranteeterms"]:
            t = AgreementStatus.GuaranteeTermStatus()
            t.name = term["name"]
            t.status = term["status"]
            o.guaranteeterms.append(t)
        return o


class Violation(object):
    def __init__(self):
        """Simple bean model for a violation"""
        self.uuid = ""
        self.contract_uuid = ""
        self.service_scope = ""
        self.service_name = ""
        self.metric_name = ""
        self.datetime = datetime.utcnow()
        self.actual_value = 0

    def __repr__(self):
        return ("<Violation(uuid={}, datetime={}, contract_uuid={}, \
                service_name={}, service_scope={}, metric_name={}, \
                actual_value={})>\n".format(
                self.uuid,
                self.datetime,
                self.contract_uuid,
                self.service_name,
                self.service_scope,
                self.metric_name,
                self.actual_value)
                )

    def format_time(self):
        # return str(datetime.fromtimestamp(self.datetime))
        return str(self.datetime)


class Provider(object):
    def __init__(self):
        """Simple bean model for a provider"""
        self.uuid = ""
        self.name = ""

    def __repr__(self):
        return ("<Provider(uuid={}, name={})>".format(
                self.uuid,
                self.name)
                )

    def to_xml(self):
        xml = "<provider><uuid>{}</uuid><name>{}</name></provider>""".format(
            self.uuid,
            self.name
        )
        return xml

    @staticmethod
    def from_dict(d):
        """Creates a Provider object from a dict structure (e.g.
        a deserialized json string)

        Usage:
        json_obj = json.loads(json_data)
        out = wsag_model.Provider.from_dict(json_obj)
        """
        result = Provider(d["uuid"], d["name"])
        return result
