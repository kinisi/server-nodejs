var path = require('path');

module.exports = {
    "port": 5674,
    "mysql": {
        "conn": {
            "host": "ai1dev2.kinisi.cc",
            "user": "kadm",
            "password": "5ad50dcdc887b2",
            "database": "kdev1",
            "dateStrings": true
        }
    },
    "static": {
        "defaultIndexPath": "/testmap.html",
        "basepath": path.resolve(__dirname + "/../static")
    },
    "tablequery": {
        "whitelist": [
            "device_location",
            "v_device_location",
            "device_configuration",
            "device_interface"
        ]
    },
    "download": {
        "basepath": path.resolve(__dirname + "/../downloads")
   }
};
