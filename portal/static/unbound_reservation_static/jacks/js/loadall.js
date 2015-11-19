(function () {

  var i;
  var styles = [
    STATIC_URL+'unbound_reservation_static/jacks/css/jacks-lib.css',
    STATIC_URL+'unbound_reservation_static/jacks/css/tourist.css',
    STATIC_URL+'unbound_reservation_static/jacks/css/select2.css',
    STATIC_URL+'unbound_reservation_static/jacks/css/select2-bootstrap.css',
    STATIC_URL+'unbound_reservation_static/jacks/css/main.css'
  ];

  for (i = 0; i < styles.length; i += 1)
  {
    JACKS_LOADER.loadStyle(styles[i]);
  }

  var scripts = [
/*
    "lib/forge/des.js",
    "lib/forge/debug.js",
    "lib/forge/util.js",
    "lib/forge/log.js",
    "lib/forge/socket.js",
    "lib/forge/md5.js",
    "lib/forge/sha1.js",
    "lib/forge/hmac.js",
    "lib/forge/aes.js",
    "lib/forge/pem.js",
    "lib/forge/asn1.js",
    "lib/forge/jsbn.js",
    "lib/forge/prng.js",
    "lib/forge/random.js",
    "lib/forge/oids.js",
    "lib/forge/rsa.js",
    "lib/forge/pbe.js",
    "lib/forge/x509.js",
    "lib/forge/pki.js",
    "lib/forge/tls.js",
    "lib/forge/aesCipherSuites.js",
    "lib/forge/tlssocket.js",
    "lib/forge/http.js",
*/
    STATIC_URL+"unbound_reservation_static/jacks/lib/swfobject.js",
    STATIC_URL+"unbound_reservation_static/jacks/lib/vkbeautify.js"
  ];

  for (i = 0; i < scripts.length; i += 1)
  {
    JACKS_LOADER.loadScript(scripts[i]);
  }

  if (window.$ === undefined)
  {
    JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/lib/jquery-2.0.3.min.js');
    JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/lib/bootstrap.min.js');
  }
  else if (window.$.fn.modal === undefined)
  {
    JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/lib/bootstrap.min.js');
  }
  if (window.require === undefined)
  {
    JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/lib/require.js');
  }
  window.JACKS_LOADER.loadScript(STATIC_URL+'unbound_reservation_static/jacks/js/main.js');

}());
