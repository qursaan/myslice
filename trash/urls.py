from django.conf.urls           import patterns, include, url

urlpatterns = patterns('',
                       url(r'^tab/?$',          'trash.sampleviews.tab_view'),
                       (r'^scroll/?$',          'trash.sampleviews.scroll_view'),
                       (r'^plugin/?$',          'trash.pluginview.test_plugin_view'),
                       (r'^dashboard/?$',       'trash.dashboard.dashboard_view'),
)
