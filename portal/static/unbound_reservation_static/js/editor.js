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
        id: STATIC_URL+'unbound_reservation_static/img/default.svg'
      },
      {
        name: 'Server',
        id: STATIC_URL+'unbound_reservation_static/img/server.svg'
      },
      {
        name: 'Router',
        id: STATIC_URL+'unbound_reservation_static/img/router.svg'
      }
    ],
    "aggregates": [
      {
        "id": "urn:publicid:IDN+geni.case.edu+authority+cm",
        "name": "Case Western"
      },
      {
        "id": "urn:publicid:IDN+geni.it.cornell.edu+authority+cm",
        "name": "Cornell"
      },
      {
        "id": "urn:publicid:IDN+instageni.clemson.edu+authority+cm",
        "name": "Clemson"
      },
      {
        "id": "urn:publicid:IDN+instageni.rnoc.gatech.edu+authority+cm",
        "name": "Georgia Tech"
      },
      {
        "id": "urn:publicid:IDN+instageni.illinois.edu+authority+cm",
        "name": "Illinois"
      },
      {
        "id": "urn:publicid:IDN+instageni.ku.gpeni.net+authority+cm",
        "name": "Kansas"
      },
      {
        "id": "urn:publicid:IDN+lan.sdn.uky.edu+authority+cm",
        "name": "Kentucky"
      },
      {
        "id": "urn:publicid:IDN+geni.kettering.edu+authority+cm",
        "name": "Kettering"
      },
      {
        "id": "urn:publicid:IDN+instageni.lsu.edu+authority+cm",
        "name": "LSU"
      },
      {
        "id": "urn:publicid:IDN+instageni.rnet.missouri.edu+authority+cm",
        "name": "Missouri"
      },
      {
        "id": "urn:publicid:IDN+instageni.iu.edu+authority+cm",
        "name": "Indiana"
      },
      {
        "id": "urn:publicid:IDN+instageni.northwestern.edu+authority+cm",
        "name": "Northwestern"
      },
      {
        "id": "urn:publicid:IDN+instageni.nps.edu+authority+cm",
        "name": "NPS"
      },
      {
        "id": "urn:publicid:IDN+instageni.nysernet.org+authority+cm",
        "name": "NYSERNet"
      },
      {
        "id": "urn:publicid:IDN+genirack.nyu.edu+authority+cm",
        "name": "NYU"
      },
      {
        "id": "urn:publicid:IDN+instageni.cs.princeton.edu+authority+cm",
        "name": "Princeton"
      },
      {
        "id": "urn:publicid:IDN+instageni.sox.net+authority+cm",
        "name": "SOX"
      },
      {
        "id": "urn:publicid:IDN+instageni.stanford.edu+authority+cm",
        "name": "Stanford"
      },
      {
        "id": "urn:publicid:IDN+instageni.idre.ucla.edu+authority+cm",
        "name": "UCLA"
      },
      {
        "id": "urn:publicid:IDN+pks2.sdn.uky.edu+authority+cm",
        "name": "Kentucky II"
      },
      {
        "id": "urn:publicid:IDN+cisco.geniracks.net+authority+cm",
        "name": "Utah Cisco"
      },
      {
        "id": "urn:publicid:IDN+utahddc.geniracks.net+authority+cm",
        "name": "Utah DDC"
      },
      {
        "id": "urn:publicid:IDN+instageni.wisc.edu+authority+cm",
        "name": "Wisconsin"
      }
    ],
    "defaults": [
      {
        name: 'Xen VM',
        type: 'emulab-xen',
        image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD',
        icon: STATIC_URL+'unbound_reservation_static/img/server.svg'
      },
      {
        name: 'Raw PC',
        type: 'raw-pc',
        image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU12-64-STD',
        icon: STATIC_URL+'unbound_reservation_static/img/default.svg'
      },
      {
	name: 'OVS Router',
	type: 'emulab-xen',
	image: 'urn:publicid:IDN+emulab.net+image+emulab-ops:Ubuntu12-64-OVS',
        icon: STATIC_URL+'unbound_reservation_static/img/router.svg'
      }
    ],
    "hardware": [
      {
        "id": "pcvm",
        "name": "pcvm"
      },
      {
        "id": "dl360-vm",
        "name": "dl360-vm"
      },
      {
        "id": "pc",
        "name": "pc"
      },
      {
        "id": "dl360",
        "name": "dl360"
      },
      {
        "id": "dl360-G7",
        "name": "dl360-G7"
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
          "urn:publicid:IDN+geni.case.edu+authority+cm"
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
          "urn:publicid:IDN+geni.case.edu+authority+cm"
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
