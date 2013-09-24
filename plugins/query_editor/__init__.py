from unfold.plugin import Plugin

from django.template.loader import render_to_string

# XXX We need naming helpers in the python Plugin class also, used in template

class QueryEditor(Plugin):

    def template_file(self):
        return "query_editor.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                # XXX datatables
                'js/query_editor.js',
            ] ,
            'css_files': [
                'css/query_editor.css',
#                'css/jquery-ui.css',
#                'css/demo_page.css',
#                'css/demo_table.css',
            ]
        }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 'query_uuid']

    def export_json_settings (self):
        return True

    def template_env(self, request):
        fields = []
        metadata = self.page.get_metadata()
        md_fields = metadata.details_by_object('resource')

        # XXX use django templating system here
        for md_field in md_fields['column']:

            if md_field['type'] == 'string':
                if 'allowed_values' in md_field:
                    allowed_values = md_field['allowed_values'].split(',')

                    options = []
                    for v in allowed_values:
                        v_desc = v.split('-')
                        options.append(v_desc[0])

                    env = {
                        'domid': self.domid,
                        'options': options
                    }
                    filter_input = render_to_string('filter_input_string_values.html', env)
                else:
                    env = {
                        'domid': self.domid,
                        'field': md_field['name']
                    }
                    filter_input = render_to_string('filter_input_string.html', env)
                    
            elif md_field['type'] == 'int':
                allowed_values = md_field.get('allowed_values', '0,0').split(',')
                env = {
                    'domid': self.domid,
                    'field': md_field['name'],
                    'min'  : allowed_values[0],
                    'max'  : allowed_values[1]
                }
                filter_input = render_to_string('filter_input_integer.html', env)
            else:
                env = {
                    'domid': self.domid,
                    'field': md_field['name']
                }
                filter_input = render_to_string('filter_input_others.html', env)

            fields.append({
                'name':          md_field['name'],
                'type':          md_field['type'],
                'resource_type': 'N/A',
                'filter_input':  filter_input,
                'header':        None,
                'checked':       md_field['name'] in self.query.get_select()
            })
        return { 'fields': fields }
