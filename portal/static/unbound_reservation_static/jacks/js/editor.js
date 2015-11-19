function createOptions(callback)
{
  return {
    mode: 'editor',
    multiSite: true,
    source: 'rspec',
    root: '#jacksContainer',
    show: {
      rspec: false,
      tour: false,
      version: true,
      menu: true,
      selectInfo: true
    },
    readyCallback: callback,
  "canvasOptions": {
    "icons": [
      {
        name: 'Node',
        id: 'https://www.emulab.net/protogeni/jacks-stable/images/default.svg'
      },
      {
        name: 'Server',
        id: 'https://www.emulab.net/protogeni/jacks-stable/images/server.svg'
      },
      {
        name: 'Wireless',
        id: STATIC_URL+'unbound_reservation_static/img/wireless.png'
      }
    ],
    "aggregates": [
      {
        "id": "omf:nitos.outdoor",
        "name": "Nitos"
      },
      {
        "id": "omf:netmode",
        "name": "Netmode"
      },
        {
        "id": "ple",
        "name": "PlanetLab"
      }
    ],
    "defaults": [
      {
        name: 'VM',
        type: 'emulab-xen',
        image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD',
        icon: 'https://www.emulab.net/protogeni/jacks-stable/images/server.svg'
      },
      {
        name: 'Raw PC',
        type: 'raw-pc',
        image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD',
        icon: 'https://www.emulab.net/protogeni/jacks-stable/images/default.svg'
      },
      {
	name: 'Wireless',
	type: 'wireless',
	image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS',
       // icon: 'https://www.emulab.net/protogeni/jacks-stable/images/router.svg'
       icon: STATIC_URL+'unbound_reservation_static/img/wireless.png'
      }
    ],
    "hardware": [
      {
        "id": "plab-pc",
        "name": "plab-pc"
      },
      {
        "id": "commel",
        "name": "commel"
      },
      {
        "id": "pc",
        "name": "pc"
      },
      {
        "id": "orbit",
        "name": "orbit"
      },
      {
        "id": "diskless",
        "name": "diskless"
      },
      {
        "id": "alix3d2",
        "name": "alix3d2"
      }
      ,
      {
        "id": "Intel Atom",
        "name": "Intel Atom"
      }
    ],
    "images": [
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD",
        "name": "FreeBSD 8.2 32-bit version"
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD",
        "name": "Ubuntu 12.04 LTS"
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS",
        "name": "Ubuntu 12.04 with OVS for ProtoGeni (by Niky)",
	"nomac": true
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD",
        "name": "Generic osid for openvz virtual nodes."
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD",
        "name": "Standard 32-bit Fedora 15 image"
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD",
        "name": "FreeBSD 9.2 32-bit version"
      },
      {
        "id": "urn:publicid:IDN+emulab.net+image+emulab-ops:CENTOS63-64-STD",
        "name": "Emulab Standard CentOS 6.3 64-bit image."
      }
    ],
    "linkTypes": [
      {
        "id": "lan",
        "name": "Ethernet"
      },
      {
        "id": "vlan",
        "name": "Stitched Ethernet"
      },
      {
        "id": "gre-tunnel",
        "name": "GRE Tunnel",
	"ip": "auto"
      },
      {
        "id": "egre-tunnel",
        "name": "EGRE Tunnel",
	"ip": "auto"
      }
    ],
    "types": [
      {
        "id": "emulab-xen",
        "name": "emulab-xen"
      },
      {
        "id": "emulab-openvz",
        "name": "emulab-openvz"
      },
      {
        "id": "raw-pc",
        "name": "raw-pc"
      },
        {
        "id": "wireless",
        "name": "wireless"
      }
      ,
        {
        "id": "plab-vserver",
        "name": "plab-vserver"
      }
    ]
  },
  "constraints": [
    {
      "node": {
	"types": [ "emulab-openvz", "raw-pc" ]
      },
      "link": {
	"linkTypes": [ "gre-tunnel" ]
      },
      "node2": {
	"types": [ "emulab-openvz", "raw-pc" ]
      }
    },
    {
      "node": {
	"types": [ "emulab-xen" ]
      },
      "link": {
	"linkTypes": [ "egre-tunnel" ]
      },
      "node2": {
	"types": [ "emulab-xen" ]
      }
    },
    {
      "node": {
	"types": [ "*" ]
      },
      "link": {
	"linkTypes": [ "lan", "vlan" ]
      },
      "node2": {
	"types": [ "*" ]
      }
    },
    {
      "node": {
	"aggregates": [ "*" ]
      },
      "link": {
	"linkTypes": [ "egre-tunnel", "gre-tunnel" ]
      },
      "node2": {
	"aggregates": [ "*" ]
      }
    },
    {
      "node": {
	"aggregates": [
        "ple",
        "urn:publicid:IDN+geni.case.edu+authority+cm",
        "urn:publicid:IDN+geni.it.cornell.edu+authority+cm",
        "urn:publicid:IDN+instageni.clemson.edu+authority+cm",
        "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm",
        "urn:publicid:IDN+instageni.illinois.edu+authority+cm",
        "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm",
        "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm",
        "urn:publicid:IDN+geni.kettering.edu+authority+cm",
        "urn:publicid:IDN+instageni.lsu.edu+authority+cm",
        "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm",
        "urn:publicid:IDN+instageni.iu.edu+authority+cm",
        "urn:publicid:IDN+instageni.northwestern.edu+authority+cm",
        "urn:publicid:IDN+instageni.nps.edu+authority+cm",
        "urn:publicid:IDN+instageni.nysernet.org+authority+cm",
        "urn:publicid:IDN+genirack.nyu.edu+authority+cm",
        "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm",
        "urn:publicid:IDN+instageni.sox.net+authority+cm",
        "urn:publicid:IDN+instageni.stanford.edu+authority+cm",
        "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm",
        "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm",
        "urn:publicid:IDN+utahddc.geniracks.net+authority+cm",
        "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
	]
      },
      "link": {
	"linkTypes": [ "vlan", "lan" ]
      },
      "node2": {
	"aggregates": [
	"ple",
        "urn:publicid:IDN+geni.case.edu+authority+cm",
        "urn:publicid:IDN+geni.it.cornell.edu+authority+cm",
        "urn:publicid:IDN+instageni.clemson.edu+authority+cm",
        "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm",
        "urn:publicid:IDN+instageni.illinois.edu+authority+cm",
        "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm",
        "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm",
        "urn:publicid:IDN+geni.kettering.edu+authority+cm",
        "urn:publicid:IDN+instageni.lsu.edu+authority+cm",
        "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm",
        "urn:publicid:IDN+instageni.iu.edu+authority+cm",
        "urn:publicid:IDN+instageni.northwestern.edu+authority+cm",
        "urn:publicid:IDN+instageni.nps.edu+authority+cm",
        "urn:publicid:IDN+instageni.nysernet.org+authority+cm",
        "urn:publicid:IDN+genirack.nyu.edu+authority+cm",
        "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm",
        "urn:publicid:IDN+instageni.sox.net+authority+cm",
        "urn:publicid:IDN+instageni.stanford.edu+authority+cm",
        "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm",
        "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm",
        "urn:publicid:IDN+utahddc.geniracks.net+authority+cm",
        "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
	]
      }
    },
    {
      "node": {
        "aggregates": [
          "ple"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "wireless"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "ple"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:CENTOS63-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:CENTOS63-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:OPENVZ-STD"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD82-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FEDORA15-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "images": [
          "urn:publicid:IDN+emulab.net+image+emulab-ops:FBSD92-STD"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.case.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cenic.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.it.cornell.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.clemson.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.metrodatacenter.com+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.illinois.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+geni.kettering.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.lsu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.maxgigapop.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.iu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.northwestern.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nps.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.nysernet.org+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+genirack.nyu.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm"
        ],
        "hardware": [
          "dl360-G7"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.rutgers.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.sox.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.stanford.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+cisco.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+utahddc.geniracks.net+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-openvz"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "emulab-xen"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "lan"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pcvm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "dl360-vm"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "pc"
        ],
        "types": [
          "raw-pc"
        ]
      }
    },
    {
      "node": {
        "aggregates": [
          "urn:publicid:IDN+instageni.wisc.edu+authority+cm"
        ],
        "hardware": [
          "delay-dl360"
        ],
        "types": [
          "raw-pc"
        ]
      }
    }
  ]
  };
}
