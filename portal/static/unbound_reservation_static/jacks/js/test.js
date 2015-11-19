var jacksInput = null;
var jacksOutput = null;
var contextUrl = 'https://www.emulab.net/protogeni/jacks-context/tom-context.json';
//var contextUrl = 'basic.json';

function init()
{
  $.get(contextUrl).then(contextReady, contextFail);
}

function contextReady(data)
{
  context = data;
  window.jacksInstance = new window.Jacks(createOptions(context));
  if (! window.File || ! window.FileReader || ! window.FileList ||
      ! window.Blob)
  {
    $('#load').hide();
  }
  if (! window.Blob)
  {
    $('#save').hide();
  }
  
  $('#view-source').click(clickViewSource);
  $('#save').click(clickSave);
  $('#load').click(clickLoad);

  $('#add-rspec').on('click', function (e) {
    e.preventDefault();
    var extraRspec = document.getElementById('extra-rspec').textContent;
    jacksInput.trigger('add-topology', [{ rspec: extraRspec }]);
  });

  $('#add-more-rspec').on('click', function (e) {
    e.preventDefault();
    var extraRspec = document.getElementById('extra-extra-rspec').textContent;
    jacksInput.trigger('add-topology', [{ rspec: extraRspec }]);
  });
}

function contextFail(fail1, fail2)
{
  console.log(fail1, fail2)
  alert('Failed to find context. Check your Internet connection');
}

function jacksReady(input, output)
{
  jacksInput = input;
  jacksOutput = output;
      
  input.trigger('change-topology',
                [{ rspec:
                   document.getElementById('rspec').textContent }]);

  jacksOutput.on('fetch-topology', saveToFile);
  jacksOutput.on('selection', function (selection) {
//                console.log(selection);
  });
  jacksOutput.on('modified-topology', function (topo) {
   //             console.log(topo);
  });
  jacksOutput.on('modified', function (topo) {
  //              console.log('modified-field', topo);
  });
}

function saveToFile(rspecList)
{
  var file = new Blob([rspecList[0].rspec],
                      { type: 'application/octet-stream' });
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(file); 
  a.download = 'saved.rspec';
  document.body.appendChild(a);
  a.click(); $('a').last().remove();
}

function clickLoad()
{
	alert("0");
  if (jacksInput)
  {
    $('#load-input').html('<input type="file"/>');
    $('#load-input input').on('change', function () {
      var file = $('#load-input input')[0].files[0];
      if (file)
      {
        var reader = new FileReader();
        alert("1");
        reader.onload = function (e) {
        	alert("2");
        columns_unsaved = {};
 columns = {};
          var contents = e.target.result;
          alert("3");
          jacksInput.trigger('change-topology', [{ rspec: contents }]);
          alert("4");
        };
        alert("5");
        reader.readAsText(file);
        alert("6");
      }
    });
    alert("7");
    $('#load-input input').click();
    alert("8");
    
  }
}

function clickSave()
{
  if (jacksInput)
  {
    jacksInput.trigger('fetch-topology');
  }
}

function clickViewSource()
{
  if (jacksInput)
  {
    jacksInput.trigger('show-rspec');
  }
}

function createOptions(context)
{
  if (typeof(context) === 'string')
  {
    context = JSON.parse(context);
  }
  if (context.canvasOptions.defaults.length === 0)
  {
    delete context.canvasOptions.defaults;
  }
  return {
    mode: 'editor',
    multiSite: true,
    source: 'rspec',
    root: '#jacksContainer',
//    size: { x: 600, y: 300 },
    show: {
//      rspec: false,
      tour: false,
      version: true,
      menu: true,
      selectInfo: true
    },
    readyCallback: jacksReady,
    canvasOptions: context.canvasOptions,
    constraints: context.constraints
  };
}
