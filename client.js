
var pc = new webkitRTCPeerConnection(null);
pc.onicecandidate = function(e) {
	if (e.candidate == null) {
		post_request = new XMLHttpRequest();
		post_request.open("POST", "cgi/postanswer.sh", false);
		post_request.send(JSON.stringify(pc.localDescription));
	}
};
pc.onaddstream = function(e) {
	document.getElementById("elvideo").src = URL.createObjectURL(e.stream);
};

get_request = new XMLHttpRequest();
get_request.open("GET", "cgi/getoffer.sh", false);
get_request.onreadystatechange = function() {
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
get_request.send(null);
