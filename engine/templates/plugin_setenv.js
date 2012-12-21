{# from plugin.php Plugin.render() #}
{# Plugin initialization (if the plugin has the right structure) #}
if (typeof jQuery('#{{ domid }}').{{ classname }} != 'undefined') {
    jQuery('#{{ domid }}').{{ classname }}({{ settings_json|safe }});
    {#jQuery('#{{ domid }}').{{ classname }}('show');#}
}; 
