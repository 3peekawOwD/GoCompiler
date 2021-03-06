const fetch = require("node-fetch");
const fs = require("fs");

var path = require("path");
let inputProgramm = process.argv[2];
var code;

if(path.extname(inputProgramm) == ".go") {
  code = fs.readFileSync(inputProgramm, "utf8")
} else {
  throw new TypeError("Unknown input file type")
}

fetch("https://golang.org/compile", {
	"headers": { 
		"accept": "application/json, text/javascript, */*; q=0.01", 
		"accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7", 
		"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
	}, 
	"body": "version=2&body=" + encodeURIComponent(code),
	"method": "POST" 
})
.then(res => res.json())
.then(body => {
	if(body.Errors) return console.log(`[ERROR] -> ${body.Errors}`);
	if(body.Events == null) return console.log("Program exited.");

	for(var i=0; i<body.Events.length; i++) {
		if(body.Events[i].Kind == "stdout") {
			if(body.Events[i].Delay == 0) {
				console.log(body.Events[i].Message)
			}
			else {
				for(var j = 0; i<body.Events[i].Delay; i++) {
					console.log(body.Events[i].Message)
				}
			}
		}
	}
	console.log("Program exited.")
})
