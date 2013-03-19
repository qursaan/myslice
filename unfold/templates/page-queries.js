{% for json in queries_jsons %} manifold.insert_query({{ json|safe }});
{% endfor %}
$(document).ready(function () {
  var query_uuid_domids = new Array();
{% for d in query_uuid_domids %}  query_uuid_domids.push({'query_uuid':"{{ d.query_uuid }}", 'id':{{ d.domid }}});
{% endfor %}
  manifold.asynchroneous_exec(query_uuid_domids);
})
