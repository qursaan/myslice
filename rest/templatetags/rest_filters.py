from django import template

register = template.Library()

@register.filter(name='key')
def key(d, key_name):
    if key_name in d and d[key_name] != None :
        return d[key_name]
    else :
        return ""

#key = register.filter('key', key)