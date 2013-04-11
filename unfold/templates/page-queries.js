{% for json in queries_json %}manifold.insert_query({{ json|safe }});
{% endfor %}
$(document).ready(function () {
var query_publish_dom_tuples = new Array();
{% for d in query_publish_dom_tuples %}try {query_publish_dom_tuples.push({'query_uuid':"{{ d.query_uuid }}"{%if d.domid %},'domid':"{{ d.domid }}"{% endif %}}) } 
catch(err){console.log ("Could not expose query {{ d.query_uuid }}")}
{% endfor %}
manifold.asynchroneous_exec(query_publish_dom_tuples);
})
