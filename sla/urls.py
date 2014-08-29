from django.conf.urls import patterns, url, include

from sla import slicetabsla

urlpatterns = patterns('',
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	url(r'^testbeds/', slicetabsla.Testbeds.as_view(), name="testbeds"),
	url(r'^(?P<slicename>[^/]+)/?$', slicetabsla.SLAView.as_view(), name="agreements_summary"),
	url(r'^agreements/(?P<agreement_id>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/detail$', slicetabsla.agreement_details, name='agreement_details'),
	url(r'^agreements/(?P<agreement_id>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/guarantees/(?P<guarantee_name>\w+)/violations$', slicetabsla.agreement_term_violations, name='agreement_term_violations'),
	url(r'^agreements/simplecreate/?$', slicetabsla.AgreementSimple.as_view(), name="agreementsimple"),
)