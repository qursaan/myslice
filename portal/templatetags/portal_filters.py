from django import template
from django.template.loader_tags import do_include
from django.core.files.storage import default_storage
from myslice.settings import theme

register = template.Library()

class IncludeNode(template.Node):
    
    def __init__(self, template_name):
        if theme :
            self.theme_template_name = "%s%s" % (theme, template_name)
        self.template_name = template_name

    def render(self, context):
        try:
            # Loading the template and rendering it
            included_template = template.loader.get_template(self.theme_template_name).render(context)
        except template.TemplateDoesNotExist:
            # template theme does not exists, try the generic one
            try:
                # Loading the template and rendering it
                included_template = template.loader.get_template(self.template_name).render(context)
            except template.TemplateDoesNotExist:
                included_template = ''
                
        return included_template

@register.tag
def widget(parser, token):
    """Usage: {% widget "widget.html" %}

    This will fail silently if the template doesn't exist. If it does, it will
    be rendered with the current context."""
    try:
        tag_name, template_name = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, \
            "%r tag requires a single argument" % token.contents.split()[0]

    return IncludeNode(template_name[1:-1])

@register.filter(name='file_exists')
def file_exists(filepath):
    if default_storage.exists('portal' + filepath):
        return filepath
    else:
        index = filepath.rfind('/')
        new_filepath = filepath[:index] + '/image.png'
        return new_filepath

@register.filter
def get_type(value):
    return type(value).__name__

@register.filter
def get_name_from_urn(value):
    return value.split("+")[-1]
