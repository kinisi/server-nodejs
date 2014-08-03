module.exports = {
    "port": 5674,
    "mysql": {
        "conn": {
            "host": "ai1dev1",
            "user": "kuser0",
            "password": "9aad1067f476ba",
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
