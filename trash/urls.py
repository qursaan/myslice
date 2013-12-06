from django.conf.urls           import patterns, include, url

import trash.simplegridview

urlpatterns = patterns(
    '',
    url(r'^tab/?$',          'trash.sampleviews.tab_view'),
    url(r'^scroll/?$',          'trash.sampleviews.scroll_view'),
    url(r'^plugin/?$',          'trash.pluginview.test_plugin_view'),
    url(r'^dashboard/?$',       'trash.dashboard.dashboard_view'),
    url(r'^simplegrid/(?P<slicename>[\w\.]+)/?$', trash.simplegridview.SimpleGridView.as_view()),
)
