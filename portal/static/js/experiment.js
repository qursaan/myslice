function render_node(platform, node){
    console.log(platform,node);
    nitos = false;
    if('@component_manager_id' in node){
        // urn:publicid:IDN+ple+authority+cm
        t_urn = node['@component_manager_id'].split('+');
        //if(t_urn[1].indexOf(":") > -1)
        testbed = t_urn[1];
        t_testbed = testbed.split(':');
        if(t_testbed.length > 1){
            testbed = t_testbed[1];
            if(t_testbed[0] == 'omf' || t_testbed[1].includes('nitos')){
                nitos = true;
            }
        }
        if(!document.getElementById(testbed)){
        //if(!$('#'+testbed).length){
            testbed = 'default';
        }
    }else{
        testbed = 'default';
    }
    elm = document.getElementById(testbed);
    newElement = document.createElement('p');
    if('services' in node && 'login' in node['services']){
        console.log(node['services']['login']);
        login = node['services']['login'];
        // TODO: Check if this login info has already been printed or not
        // Ex: IoT-Lab 1 ssh gateway per site, but info is per node in the RSpec
        if(!document.getElementById(login['@username']+'_'+login['@hostname'])){
            if('@port' in login && login['@port']!='22'){
                newElement.innerHTML = "<p class='command' id='"+login['@username']+"_"+login['@hostname']+"'>$ ssh "+login['@username']+"@"+login['@hostname']+" -p "+login['@port']+"</p>";
            }else{
                newElement.innerHTML = "<p class='command' id='"+login['@username']+"_"+login['@hostname']+"'>$ ssh "+login['@username']+"@"+login['@hostname']+"</p>";
            }
            elm.appendChild(newElement); 
        }
    }else if('@component_name' in node){
        console.log(node['@component_name']);
    }else{
        console.log(node);
    }
    if(nitos){
        newElement = document.createElement('p');
        var commands = "$ omf stat -t "+node['@component_name']+" # check the status of the node <br>"; 
        commands += "$ omf tell -a on -t "+node['@component_name']+" # turn on the node <br>";
        commands += "$ omf load -i baseline.ndz -t "+node['@component_name']+" # loading OMF image on the node <br>";
        commands += "$ ssh root@"+node['@component_name']+" # ssh to the node";

        newElement.innerHTML = "<p class='command'>"+commands+"</p>";
        elm.appendChild(newElement); 
    }
    $("#loading").hide();
    elm.style.display = "block";
    //$('#'+testbed).show();
    if(document.getElementById(testbed + '_header')){
        document.getElementById(testbed + '_header').style.display = "block";
    }
    if(document.getElementById(testbed + '_footer')){
        document.getElementById(testbed + '_footer').style.display = "block";
    }
    /*
    if($('#'+testbed+'_header').length){
        $('#'+testbed+'_header').show();
    }
    if($('#'+testbed+'_footer').length){
        $('#'+testbed+'_footer').show();
    }
    */
}

