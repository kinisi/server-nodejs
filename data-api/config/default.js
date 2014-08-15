module.exports = {
    "port": 5674,
    "mysql": {
        "conn": {
            "host": "ai1dev1.kinisi.cc",
            "user": "kadm",
            "password": "5ad50dcdc887b2",
            "database": "kdev1",
            "dateStrings": true
        }
    },
    "static": {
        "defaultIndexPath": "/testmap.html",
        "basepath": __dirname + "/../static"
    },
    "tablequery": {
        "whitelist": [
            "device_location",
            "v_device_location",
            "device_configuration"
        ]
    }
}
