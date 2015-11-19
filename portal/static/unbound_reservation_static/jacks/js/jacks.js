(function () {
  window.JACKS_LOADER = window.JACKS_LOADER || {};
  var loader = window.JACKS_LOADER;
  loader.params = loader.params || {};
  loader.basePath = loader.basePath ||
    '';
  loader.baseUrl = loader.baseUrl ||
    'https://www.emulab.net/protogeni/jacks-stable/';

  loader.loadScript = function (relPath, dataMain) {
    var script = document.createElement('script');
    if (dataMain)
    {
      script.dataset['main'] = this.basePath + dataMain;
    }
    script.src = this.basePath + relPath;
    script.type = 'application/javascript';
    script.async = false;
    script.defer = false;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  loader.loadStyle = function (relPath) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = this.basePath + relPath;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  loader.prefixPaths = function (libs, modules, templates) {
    var result = {};
    for (key in libs)
    {
      if (libs.hasOwnProperty(key))
      {
	result[key] = this.basePath + libs[key];
      }
    }
    var i = 0;
    for (i = 0; i < modules.length; i += 1)
    {
      result[modules[i]] = this.basePath + modules[i];
    }
    for (i = 0; i < templates.length; i += 1)
    {
      result[templates[i]] = 'text!' + this.basePath + templates[i];
    }
    console.dir(result);
    return result;
  };

  var sourceOptionList = ['local', 'locals', 'devel', 'stable', 'portal', 'none'];

  var sourceOptions = {
    'local': 'http://localhost:8080/',
    'locals': 'https://localhost:8080/',
    'devel': 'https://www.emulab.net/protogeni/jacks-devel/',
    'stable': 'https://www.emulab.net/protogeni/jacks-stable/',
    'portal': 'https://portal.geni.net/jacks-stable/',
    'none': './'
  };

  function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {};
    var re = /[?&]?([^=]+)=([^&]*)/g;
    var tokens = re.exec(qs);
    
    while (tokens) {
      params[decodeURIComponent(tokens[1])]
        = decodeURIComponent(tokens[2]);
      tokens = re.exec(qs);
    }
    
    return params;
  }

  var params = getQueryParams(window.location.search);
  if (params.source)
  {
    window.JACKS_LOADER.params.source = params.source;
  }

  var sourceName = window.JACKS_LOADER.params['source'];
  if (sourceOptionList.indexOf(sourceName) !== -1)
  {
    window.JACKS_LOADER.basePath = sourceOptions[sourceName];
    if (sourceName === 'none')
    {
      window.JACKS_LOADER.baseUrl = './';
    }
    else
    {
      window.JACKS_LOADER.baseUrl = sourceOptions[sourceName];
    }
  }

  window.Jacks = window.Jacks || function (context) {
    var that = this;
    if (window.JACKS_LOADER.isReady)
    {
      instantiate();
    }
    else
    {
      that.isReady = false;
      window.JACKS_LOADER.onReady = instantiate;
    }

    function instantiate()
    {
      that.context = context;
      that.instance = new JACKS_LOADER.MainClass(context);
      that.isReady = true;
      if (that.context.readyCallback)
      {
	that.context.readyCallback(that.instance.updateIn,
				   that.instance.updateOut);
      }
    }
  };

  window.JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/js/loadall.js');
})();
