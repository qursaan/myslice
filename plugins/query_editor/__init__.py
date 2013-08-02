from unfold.plugin import Plugin

from django.template.loader import render_to_string

class QueryEditor(Plugin):

    def template_file(self):
        return "query_editor.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/query_editor.js',
            ] ,
            'css_files': [
                'css/query_editor.css',
                'css/demo_page.css',
                'css/demo_table.css',
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
        print "METADATA FIELDS", md_fields

        # XXX use django templating system here
        for md_field in md_fields['column']:

            if md_field['type'] == 'string':
                if 'allowed_values' in md_field:
                    allowed_values = md_field['allowed_values'].split(',')

                    options = []
                    for v in allowed_values:
                        v_desc = v.split('-')
                        options.append(v_desc[0])

                    env = {'options': options}
                    filter_input = render_to_string('filter_input_string_values.html', env)
                else:
                    env = {'filter_id': "%s-filter-%s" % (self.domid, md_field['name'])}
                    filter_input = render_to_string('filter_input_string.html', env)
                    
            elif md_field['type'] == 'int':
                allowed_values = md_field.get('allowed_values', '0,0').split(',')
                env = {'min': allowed_values[0], 'max': allowed_values[1]}
                filter_input = render_to_string('filter_input_integer.html', env)
            else:
                env = {'filter_id': "%s-filter-%s" % (self.domid, md_field['name'])}
                filter_input = render_to_string('filter_input_others.html', env)

            fields.append({
                'name':          md_field['name'],
                'type':          md_field['type'],
                'resource_type': 'N/A',
                'filter_input':  filter_input,
                'header':        None,
            })
        return { 'fields': fields }
