
var pc = new webkitRTCPeerConnection(null);
pc.onicecandidate = function(e) {
	if (e.candidate == null) {
		save_request = new XMLHttpRequest();
		save_request.open("POST", "cgi/postoffer.sh", false);
		save_request.send(JSON.stringify(pc.localDescription));
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
	load_request = new XMLHttpRequest();
	load_request.open("GET", "cgi/getanswer.sh", false);
	load_request.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200 && this.responseText != "") {
				var offer = JSON.parse(this.responseText);
				pc.setRemoteDescription(new RTCSessionDescription(offer));
				window.clearInterval(intfunc);
			}
		}
	};
	load_request.send(null);
}, 1000);
