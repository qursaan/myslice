from django.conf.urls           import patterns, include, url

import trash.simpletableview
import trash.simplegridview
import trash.simplevalidatebutton

urlpatterns = patterns(
    '',
    url(r'^tab/?$',          'trash.sampleviews.tab_view'),
    url(r'^scroll/?$',          'trash.sampleviews.scroll_view'),
    url(r'^plugin/?$',          'trash.pluginview.test_plugin_view'),
    url(r'^dashboard/?$',       'trash.dashboard.dashboard_view'),
    url(r'^simpletable/(?P<slicename>[\w\.]+)/?$', trash.simpletableview.SimpleTableView.as_view()),
    url(r'^simplegrid/(?P<slicename>[\w\.]+)/?$', trash.simplegridview.SimpleGridView.as_view()),
    url(r'^simplevalidatebutton/(?P<username>[\w\._]+)/?$', trash.simplevalidatebutton.SimpleValidateButtonView.as_view()),
)
