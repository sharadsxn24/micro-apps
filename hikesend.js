(function(){
	var hikeElem = document.querySelector('.hikeshare');
		
	function hikeShare(){
		var title = document.title;
		var href = location.href;
		var url = "hike://send/?text=" + encodeURIComponent(document.title) + " - " + encodeURIComponent(href);
		openWindow(url);
		console.log(title);
	console.log(url);
	}

	function openWindow(url){
		window.open(url, "Share on Hike", false);
	}

	hikeElem.onclick = hikeShare;
}());