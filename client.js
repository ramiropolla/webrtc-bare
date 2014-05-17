
var pc = new webkitRTCPeerConnection(null);
pc.onicecandidate = function(e) {
	if (e.candidate == null) {
		save_request = new XMLHttpRequest();
		save_request.open("POST", "cgi/postanswer.sh", false);
		save_request.send(JSON.stringify(pc.localDescription));
	}
};
pc.onaddstream = function(e) {
	document.getElementById("elvideo").src = URL.createObjectURL(e.stream);
};

save_request = new XMLHttpRequest();
save_request.open("GET", "cgi/getoffer.sh", false);
save_request.onreadystatechange = function() {
	if (this.readyState == 4) {
		if (this.status == 200) {
			var offer = JSON.parse(this.responseText);
			pc.setRemoteDescription(new RTCSessionDescription(offer));
			pc.createAnswer(function (desc) {
				pc.setLocalDescription(desc);
			});
		}
	}
};
save_request.send(null);
