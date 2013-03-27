<?php


class DataTables extends Plugin
{

	/* Knowing the uuid of a query, we could get the results with Plugins */
	/* Same for async */
    public function render_content()
    //$plugin_uuid, $options)
    {

        //Plugins::add_js('/DataTables/jquery.dataTables.js');
        Plugins::add_js('//ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.3/jquery.dataTables.js');
        Plugins::add_js('/DataTables/DataTables.js');
        //Plugins::add_css('/DataTables/DataTables.css');
        //Plugins::add_css('/DataTables/demo_table.css');
        Plugins::add_css('/DataTables/demo_table_jui.css');

        $uuid = $this->uuid;

		$results = Array();
		$async = 1;


        /* XXX required field in options : query_uuid */
         
        
        $query = Plugins::get_query_by_uuid($this->params['query_uuid']);
        $is_unique = Plugins::get_key_filter($query);
	    $method_keys = Plugins::get_default_fields($query->method, $is_unique);
	   //$method_keys = Plugins::query_get_default_keys($options['query_uuid']);
	   //$fields = Plugins::query_get_fields($options['query_uuid']);
        //$all_headers = $_SESSION['metadata']['nodes']['columns'];        
        //$fields = $all_headers;

    	$fields = Plugins::metadata_get_fields($query->method);

       /*
        * @author: lbaron
        * date: 2012-05-29
        * debug columns QueryEditor to DataTables
        *
        */
        // Problem: field names are differents between 
        // $_SESSION['metadata']['nodes']['columns'] 
        // JSON values
        //$fields[]="arch"; // architecture in Session metadata
        //$fields[]="astype"; // as_type in Session metadata
        $fields['platform'] = Array('column' => 'platform');
        $fields['platform_longname'] = Array('column' => 'platform_longname');

        //----------------------------------
        
        $out = Array();
        $out[] = "<table class='display' id='table-$uuid'>";
        $out[] = "<thead><tr>";

        foreach ($method_keys as $f) {
            $out[] = "<th>$f</th>";
        }

        /* We put defaults fields (should be keys) at the beginning, and don't repeat them afterwards */
        foreach ($fields as $key=>$f) {
            if((array_search($f['column'], $method_keys)) === false)
                $out[] = "<th>".$f['column']."</th>";
        }

        if (array_key_exists('checkboxes', $this->params) && ($this->params['checkboxes'])) {
            $out[] = "<th>+/-</th>";            
        }
        $out[] = "</tr></thead>";
        $out[] = "<tbody>";        
        
        /* This might be done asynchronously */
        if (!$async) {
            $query = Plugins::get_query_by_uuid($this->params['query_uuid']);
            foreach ($results as $r) {
                $out[] = "<tr>";
                foreach ($fields as $f) {
                    $out[] = "<td>";
                    $out[] = Plugins::render_element($query, $r[$f], $f); // XXX was query->method
                    $out[] = "</td>";
                }
                if (array_key_exists('checkboxes', $this->params) && ($this->params['checkboxes'])) {
                    $out[] = "<td>[X]</td>";
                }
                $out[] = "</tr>";
            }
        }


        if ($async) {
            /* setup datatables */
            /* TODO:
             * - fixed row for key columns
             * - uniform row height
             * - how to make some columns disappear
             * - how to udpate some columns based on keys
             */
        }
        $out[] = "</tbody>";
        $out[] = "</table>";
        return implode($out);
    }
}

Plugins::register_plugin(
    'DataTables',   /* plugin name */
    'DataTables',   /* class name */
    Array(
        'method' => '*',
        'fields' => Array()
    )
    /* XXX dependencies */
);
