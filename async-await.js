



function timeoutPromose(argument) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve("done");
		}, interval)
	})
}