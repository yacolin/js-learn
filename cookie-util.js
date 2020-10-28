


var CookieUtil = {
	get: function(name) {
		var cookieName = encodeURLComponent(name) + "=",
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null;


		if (cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(";", cookieStart);
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}

			cookieValue = decodeURLComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
		}

		return cookieValue;
	},

	set: function(name, value, expires, path, domain, secure) {
		var cookieText = encodeURLComponent(name) + "=" + encodeURLComponent(value);

		if (expires instanceof Date) {
			cookieText += "; expires=" + expires.toGMTString();
		}

		if (path) {
			cookieText += "; path=" + path;
		}

		if (domain) {
			cookieText += "; domain=" + domain;
		}

		if (secure) {
			cookieText += "; secure";
		}

		document.cookie = cookieText;
	},

	unset: function(name, path, domain, secure) {
		this.set(name, "", new Date(0), path, domain, secure);
	}
}


var SubCookieUtil = {
	get: function(name, subName) {
		var subCookies = this.getAll(name);
		if (subCookies) {
			return subCookies[subName];
		} else {
			return null;
		}
	},

	getAll: function(name) {
		var cookieName = encodeURLComponent(name) + "=",
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null,
			cookieEnd,
			subCookies,
			i,
			parts,
			result = {};

		if (cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(";", cookieStart);
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}

			cookieValue = decodeURLComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))

			if (cookieValue.length > 0) {
				subCookies = cookieValue.split("&");

				for (i = 0, len = subCookies.length; i < len; i++) {
					parts = subCookies[i].split("=");
					result[decodeURLComponent(parts[0])] = decodeURLComponent(parts[1]);
				}

				return result;
			}
		}

		return null;

	},

	set: function(name, subName, value, expires, path, domain, secure) {
		var subcookies = this.getAll(name) || {};
		subcookies[name] = value;
		this.setAll(name, subcookies, expires, path, domain, secure);
	},


	setAll: function(name, subcookies, expires, path, domain, secure) {
		var cookieText = encodeURLComponent(name) + "=",
			subcookieParts = new Array(),
			subName;


		for (subName in subcookies) {
			if (subName.length > 0 && subcookies.hasOwnProperty(subName)) {
				subcookiesParts.push(encodeURLComponent(subName) + "=" + encodeURLComponent(subcookies[subName]));
			}
		}

		if (cookieParts.length > 0) {
			cookieText += subcookiesParts.join("&");


			if (expires instanceof Date) {
				cookieText += "; expires=" + expires.toGMTString();
			}

			if (path) {
				cookieText += "; path=" + path;
			}

			if (domain) {
				cookieText += "; domain=" + domain;
			}

			if (secure) {
				cookieText += "; secure";
			}
		} else {
			cookieText += "; expires=" + (new Date(0)).toGMTString();
		}

		document.cookie = cookieText;
	},


	uset: function(name, subName, path, domain, secure) {
		var subcookies = this.getAll(name);
		if (subcookies) {
			delete subcookies[subName];
			this.setAll(name, subcookies, null, path, domain, secure);
		}
	},

	unsetAll: function(name, path, domain, secure) {
		this.setAll(name, null, new Date(0), path, domain, secure);
	}
}