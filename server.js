
var pc = new webkitRTCPeerConnection(null);
pc.onicecandidate = function(e) {
	if (e.candidate == null) {
		post_request = new XMLHttpRequest();
		post_request.open("POST", "cgi/postoffer.sh", false);
		post_request.send(JSON.stringify(pc.localDescription));
	}
};

navigator.webkitGetUserMedia({ audio: true, video: true },
	function(stream) {
		pc.addStream(stream);
		pc.createOffer(function(desc) {
			pc.setLocalDescription(desc);
		});
	});

intfunc = window.setInterval(function(){
	get_request = new XMLHttpRequest();
	get_request.open("GET", "cgi/getanswer.sh", false);
	get_request.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200 && this.responseText != "") {
				pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(this.responseText)));
				window.clearInterval(intfunc);
			}
		}
	};
	get_request.send(null);
}, 1000);
