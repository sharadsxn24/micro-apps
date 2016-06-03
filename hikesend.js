(function(){
	var hikeElem = document.querySelector('.hikeshare');
		
		// var now = new Date().valueOf();
		// setTimeout(function () {
		//     if (new Date().valueOf() - now > 100) return;
		//     window.location = "https://itunes.apple.com/appdir";
		// }, 25);
		// window.location = "appname://";

	function hikeShare(){
		var title = document.title;
		var href = location.href;
		var now = new Date().valueOf();
		var url = "hike://send/?text=" + encodeURIComponent(document.title) + " - " + encodeURIComponent(href);

		setTimeout(function () {
		    if (new Date().valueOf() - now > 100) return;
		    // window.location = "https://play.google.com/store/apps/details?id=com.bsb.hike";
		    window.location = "http://get.hike.in/";
		}, 50);
		
		window.location = url;

		//openWindow(url);
		console.log(title);
		console.log(url);
	}

	function openWindow(url){
		window.open(url, "Share on Hike", false);
	}

	hikeElem.onclick = hikeShare;
}());