var fs = require("fs");

// read all the files in this directory (except this one), and load them up
fs.readdirSync(__dirname).forEach(function(file) {	
    if (/\.js$/.test(file) && __dirname + "/" + file != __filename) {	
        console.log("Attaching routes from: " + file);
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name);
    }
});
