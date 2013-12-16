from django.conf.urls           import patterns, include, url

import trash.querytableview
import trash.querygridview
import trash.validatebuttonview

urlpatterns = patterns(
    '',
    url(r'^tab/?$',                                             'trash.tabview.tab_view'),
    url(r'^scroll/?$',                                          'trash.scrollview.scroll_view'),
    url(r'^plugin/?$',                                          'trash.pluginview.test_plugin_view'),
    url(r'^dashboard/?$',                                       'trash.dashboardview.dashboard_view'),
    url(r'^querytable/(?P<slicename>[\w\.]+)/?$',               trash.querytableview.QueryTableView.as_view()),
    url(r'^querygrid/(?P<slicename>[\w\.]+)/?$',                trash.querygridview.QueryGridView.as_view()),
    url(r'^validatebutton/(?P<username>[\w\._]+)/?$',           trash.validatebuttonview.ValidateButtonView.as_view()),
)
