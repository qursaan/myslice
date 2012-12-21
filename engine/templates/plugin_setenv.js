{# from plugin.php Plugin.render() #}
{# Plugin initialization (if the plugin has the right structure) #}
if (typeof jQuery('#plugin-{{ uuid }}').{{ classname }} != 'undefined') {
    jQuery('#plugin-{{ uuid }}').{{ classname }}({{ settings_json|safe }});
    {#jQuery('#{{ uuid }}').{{ classname }}('show');#}
}; 
