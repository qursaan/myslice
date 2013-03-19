{% for json in queries_jsons %} manifold.insert_query({{ json|safe }});
{% endfor %}
$(document).ready(function () {
var async_queries = new Array();
{% for d in query_uuid_domids %} async_queries.push({'query_uuid':"{{ d.query_uuid }}", 'id':{{ d.domid }}});
{% endfor %}
manifold_async_exec(async_queries);
})
