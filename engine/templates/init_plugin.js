{# from plugin.php Plugin.render() #}
{# Plugin initialization (if the plugin has the right structure) #}
if (typeof jQuery('#{{ uuid }}').{{ classname }} != 'undefined') {
    jQuery('#{{ uuid }}').{{ classname }}({{ settings_json|safe }});
    {#jQuery('#{{ uuid }}').{{ classname }}('show');#}
}; 
