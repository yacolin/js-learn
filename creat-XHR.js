

var createXHR = (function() {
	if (typeof XMLHttpRequest != "undefined") {

		return function() {
			return new XMLHttpRequest();			
		}
	} else if (typeof ActiveXObject != "undefined") {

		return function() {
			if (typeof arguments.callee.activeXString != "string") {
				var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
					i, len;

				for (i = 0, len = versions.length; i < len; i++) {
					try {
						new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
					} catch(ex) {

					}
				}
			}

			return new ActiveXObject(arguments.callee.activeXString);
		}
	} else {
		return function() {
			throw new Error("No XHR object available.");
		}
		
	}

})()

