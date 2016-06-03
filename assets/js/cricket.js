// var platformSdk ={
// 	bridgeEnabled: false
	
// }
var cricketapp = {
	checkTimeout:null,
	checkLive: null,
	state: 0,
	dataLoaded: 0,
	env: 'staging',
	checkAllData: null,
	liveData: {},
	cache: {},
	version: "2",
	subBlock: {
		"tag_type": 1,
		"tag_id" : 7
	},
	currentCat: 0,
	factsList:["The Twenty20 format of cricket was introduced by the England and Wales Cricket Board in 2003.",
	"Chris Gayle was the first player to score a ton in T20Is. He achieved this feat during the World T20 2007.",
	"The first-ever T20I was played between Australia and New Zealand on 17th February 2005.",
	"Brett Lee was the first bowler to take a hat-trick in T20Is. The Australian achieved the feat against Bangladesh in 2007.",  
	"MS Dhoni is the only player in World T20 history to captain a team in every game.",
	"Australia were beaten by Zimbabwe in the first-ever World T20 game.",
	"Yuvraj Singh and Chris Gayle share the record for the fastest 50 in T20s off just 12 balls.",
	"Brendon McCullum of New Zealand is the only player to score two T20I centuries.",
	"Suresh Raina was the first Indian to score a T20I century.",
	"Shahid Afridi of Pakistan holds the record for most wickets in T20Is.",
	"Martin Guptill and Kane Williamson’s 1st wicket partnership of 171* is the highest in T20I cricket.",
	"Shahid Afridi of Pakistan has played the most T20I games in his career so far.",
	"Brendan McCullum has the highest score in World T20s. He scored 123 off 58 balls against Bangladesh in 2012.",
	"Chris Gale has 8 fifty plus scores in World T20.",
	"Tillakaratne Dilshan has scored most runs in one edition of World T20. 317 runs in 7 matches in 2009.",
	"New Zealand is the only team to be involved in two tied matches in the World T20.",
	"Pakistan and Sri Lanka have won the most matches in World T20’s history - 16 each.",
	"Brendon McCullum of New Zealand holds the record for maximum sixes and fours in T20Is.",
	"With 156 runs against England in 2013, Aaron Finch of Australia holds the record for highest individual score in T20Is.",
	"India’s highest score in a World T20 match is 218/4 against England."
],
	init: function(isRetry){

		// if(platformSdk.helperData.env && platformSdk.helperData.env =="prod"){
		// 	cricketapp.env = "prod";
		// }
		if (cricketapp.env == "prod"){
			var domain = 'https://content.app.hike.in';
			var subscribeDomain = "https://subscription.platform.hike.in";
			var cricketURL = "https://platform.hike.in/cricket/v1/";
			
		} else {
			var domain = 'https://stagingcontent.app.hike.in';
			var subscribeDomain = "https://qa-content.hike.in";
			var cricketURL = "https://staging.platform.hike.in/cricket/v1/";

		}
		
		cricketapp.endpoints = {	
			'liveMatches': cricketURL+'getLiveScores',
			'liveMatch': cricketURL+ 'getLiveScore',
			'otherMatches': cricketURL+ 'getMatches',
			'cricket': domain + '/content/v1/channel/cricket/topic/cricket/items',
			'subscribe': subscribeDomain + '/subscription/api/v3/microapps/subscribe.json',
			'unsubscribe': subscribeDomain + '/subscription/api/v3/microapps/unsubscribe.json'
		};
		var tappedElementCount = document.getElementsByClassName("tapping");

		if(tappedElementCount.length){
			for(var i=0; i< tappedElementCount.length;i++){
				tappedElementCount[i].addEventListener("touchstart", function(){
					this.classList.add("tapped");
				});
				tappedElementCount[i].addEventListener("touchend", function(){
					this.classList.remove("tapped");
				});
				tappedElementCount[i].addEventListener("touchcancel", function(){
					this.classList.remove("tapped");
				});
				tappedElementCount[i].addEventListener("touchleave", function(){
					this.classList.remove("tapped");
				});
			}
		}
		this.blockScreen = document.getElementById("blockScreen");
		this.splashScreen = document.getElementById("splashScreen");
		this.loadingScreen = document.getElementById("loadingScreen");
		this.offlineScreen = document.getElementById("offlineScreen");
		this.containerTabs = document.getElementsByClassName("containerTabs")[0];
		this.offlineStrip =document.getElementById("offlineStrip");
		this.swipewrap = document.getElementsByClassName("swipe-wrap")[0];
		this.swipecontainer = document.getElementsByClassName("swipecontainer")[0]


		if(platformSdk.bridgeEnabled){

			this.initOverflowMenu();
			this.showSplash();
			var platformVersion = parseInt(document.getElementsByTagName('body')[0].getAttribute("data-platform-version")) || 0;

			if(platformVersion<5){
				document.getElementsByClassName("swipecontainer")[0].style.paddingTop ="12px";
			}
		}else{
													cricketapp.callBindTab=true;
						if(localStorage.cacheData){
							cricketapp.cache = JSON.parse(localStorage.cacheData);
							cricketapp.bindCachedData();
						}	else{


			this.getAlldata();}

		}
		//PlatformBridge.allowBackPress('false');
		// try{
		// 	PlatformBridge.allowUpPress('false');
		// }
		// catch(e){

		// }

  // Add feature check for Service Workers here
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
			if(isRetry){
				var ae = {};
				ae["ek"] = "retry_click";
				ae["cat"] = "no_internet";
				ae["mapp_vs"] = cricketapp.version;

				if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
			}

	
	},
	callUnBlock: function(){
		platformSdk.events.publish('app.menu.om.block');

	},
	showSplash: function(){
		if(platformSdk.block =="true"){
			cricketapp.blockScreen.style.display="block";
			cricketapp.containerTabs.style.display="none";


		}
		else if(platformSdk.helperData && !platformSdk.helperData.ftueDone){
			cricketapp.splashScreen.style.display="block";
			var ae = {};
			ae["ek"] = "ftue_optin_vu";
			ae["mapp_vs"] = cricketapp.version;

			if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
			console.log(ae);
		}else{
			cricketapp.loadingScreen.style.display="block";
			cricketapp.containerTabs.style.display="none";

			//try{
				platformSdk.nativeReq({
					fn: 'getFromCache',
					ctx: this,
					data: "cacheData",
					success: function(response){
						if (response === "") {
							console.log("no cache found");
							//cricketapp.offlineScreen.style.display="block";
							cricketapp.cache = {};
							cricketapp.callBindTab=true;
							cricketapp.getAlldata();

						} else {
							console.log("cache found");
							//console.log(response);

							response = decodeURIComponent(response);
							//try {

								response = JSON.parse(response);
								cricketapp.cache = response;
								cricketapp.bindCachedData();

							//} catch(e) {

								//cricketapp.cache = {};		


							//}	
						}

			


					}
				});		
			//}
			// catch(e){

			// 	cricketapp.getAlldata();

			// }


		}
	},
	bindTabSwipeEvents: function(){
		var containers = document.getElementsByClassName('tab-data');

		var bullets = document.getElementsByClassName('comp__tab');

	        window.slider =
	        new Swipe(document.getElementById('sliderTabs'), {
	            continuous: false,
			    disableScroll: false,
			    stopPropagation: false,
	          callback: function(pos) {

	            var i = bullets.length;
	            while (i--) {
	              bullets[i].className = ' comp__tab';
	            }
	              bullets[pos].className = 'comp__tab selected';
	              document.getElementById("sliderTabs").style.height = containers[pos].offsetHeight+ "px";
	              var ae = {};
				  ae["ek"] = "micro_app";
				  ae["event"] = "cat_select";
				  var tabs= [];
				  tabs[0] = "news";
				  tabs[1] = "fixtures";
				  tabs[2] = "results";
				  
				  ae["fld3"] = tabs[cricketapp.currentCat];

				  ae["fld2"] = tabs[pos];
				  cricketapp.currentCat =pos;
				  if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
			    }

	        });

			document.getElementById("sliderTabs").style.height = containers[0].offsetHeight+ "px";
 			bullets[0].className = 'comp__tab selected';
 			bullets[1].className = 'comp__tab ';
 			bullets[2].className = 'comp__tab ';

			if(bullets.length){
				for(var i=0;i<bullets.length;i++){
					bullets[i].addEventListener("click", function(event){
						event.preventDefault();
						var parent = this.parentNode;
						var index = Array.prototype.indexOf.call(parent.children, this);
						slider.slide(index);
					});	
				}
			}
	},
	subscribeRoutine: function(type, bool, url, obj){
		console.log("subsribe call ");
		var data = {
			url: url,
			params: obj
		};

		data = JSON.stringify(data);
		platformSdk.nativeReq({
			fn: 'doPostRequest',
			ctx: this,
			data: data,
			success: function(res){
				res = decodeURIComponent(res);
				try {
					res = JSON.parse(res);
				} catch(e) {
					return false;
				}

				if (res.status_code === 200 && res.status === "success") {
					if (type === "block") cricketapp.block = bool;
					//cricketapp.setState();
				}
			}
		});
	},
	callSubscribe: function(){
		platformSdk.helperData.ftueDone = 1;
		platformSdk.updateHelperData(platformSdk.helperData);
		cricketapp.splashScreen.style.display="none";
		cricketapp.blockScreen.style.display="none";
		cricketapp.offlineScreen.style.display="none";
		cricketapp.callBindTab= true;

		cricketapp.getAlldata();
		var url = cricketapp.endpoints.subscribe;
		var bool = false;
		cricketapp.blockScreen.style.display="none";
		cricketapp.subscribeRoutine('block', bool, url, cricketapp.subBlock);



		var ae = {};
		ae["ek"] = "ftue_optin_choice";
		ae["subscribe"] = "yes";
		ae["mapp_vs"] = cricketapp.version;

		if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);

	},
	callUnSubscribe: function(){

		cricketapp.splashScreen.style.display="none";
		cricketapp.blockScreen.style.display="block";
		platformSdk.events.publish('app.menu.om.block');
		var ae = {};
		ae["ek"] = "ftue_optin_choice";
		ae["subscribe"] = "no";
		ae["mapp_vs"] = cricketapp.version;

		if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);

	},
	getCachedData: function(){

	},
	checkConnection: function(fn, ctx){
		if (platformSdk.bridgeEnabled){
			platformSdk.nativeReq({
				fn: 'checkConnection',
				ctx: this,
				data: "",
				success: function(response){
					if (typeof fn === "function") fn(response);
				}
			});	
		} else {
			if (navigator.onLine){
				if (typeof fn === "function") fn.call(ctx);
			} else {
				platformSdk.events.publish('app/offline');
				platformSdk.events.publish('app/hideSplash');
			}
		}
	},
	initOverflowMenu: function(){
		var omList = [{
			"title": platformSdk.block === "true" ? "Unblock" : "Block",
			"en": "true",
			"eventName": "app.menu.om.block"
		},
		{
			"title": "Notifications",
			"en": "true",
			"eventName": "app.menu.om.mute",
			"is_checked": platformSdk.mute === "true" ? "false" : "true"
		}];

		platformSdk.events.subscribe('app.menu.om.mute', function(id){
			id = "" + platformSdk.retrieveId('app.menu.om.mute');
			if (platformSdk.mute == "true"){
				platformSdk.mute = "false";
				platformSdk.muteChatThread();
				platformSdk.updateOverflowMenu(id, {
					"is_checked": "true"
				});
			} else {
				platformSdk.mute = "true";
				platformSdk.muteChatThread();
				platformSdk.updateOverflowMenu(id, {
					"is_checked": "false"
				});
			}

			// analytic call
			var ae = {};
			ae["ek"] = platformSdk.mute === "true" ? "mute" : "unmute";
			ae["mapp_vs"] = cricketapp.version;

			if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
		});

		platformSdk.events.subscribe('app.menu.om.block', function(id){
			id = "" + platformSdk.retrieveId('app.menu.om.block');
			if (platformSdk.block === "true"){
				platformSdk.block = "false";
				if (platformSdk.bridgeEnabled) platformSdk.unblockChatThread();
				platformSdk.events.publish('app.state.block.hide');
				platformSdk.updateOverflowMenu(id, {
					"title": "Block"
				});

				var url = cricketapp.endpoints.subscribe;
				var bool = false;
				cricketapp.blockScreen.style.display="none";

				if(platformSdk.helperData && !platformSdk.helperData.ftueDone){
					cricketapp.splashScreen.style.display="block";
				}else{
					cricketapp.callBindTab= true;
					if(localStorage.cacheData)
					cricketapp.getAlldata();
				}


			} else {
				platformSdk.block = "true";
				platformSdk.blockChatThread();
				platformSdk.events.publish('app.state.block.show');
				platformSdk.updateOverflowMenu(id, {
					"title": "Unblock"
				});
				cricketapp.blockScreen.style.display="block";
				var url = cricketapp.endpoints.unsubscribe;
				var bool = true;

				if(cricketapp.checkLive){
					clearTimeout(cricketapp.checkLive );
				}
				if(cricketapp.checkAllData){
					clearTimeout(cricketapp.checkAllData );

				}
				cricketapp.containerTabs.style.display="none";

			}

			// analytic call
			var ae = {};
			ae["ek"] = platformSdk.block === "true" ? "block" : "unblock";
			ae["mapp_vs"] = cricketapp.version;

			if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);

			//cricketapp.subscribeRoutine('block', bool, url, cricketapp.subBlock);

		});


		platformSdk.setOverflowMenu(omList);
	},
	getAlldata: function(){
		cricketapp.getLiveMatchData();
		cricketapp.getNewsData();
	},
	getLiveMatchData: function(){
		platformSdk.ajax({
			type: 'GET',
			timeout: 30000,
			url: cricketapp.endpoints.liveMatches,
			success: function(response) {
			
					var res =  JSON.parse(response);

					cricketapp.bindLiveData(res);
					cricketapp.cache.liveData = res;

					if(cricketapp.dataLoaded){
							cricketapp.containerTabs.style.display="block";
							if(cricketapp.callBindTab){
								cricketapp.bindTabSwipeEvents();
								cricketapp.callBindTab= false;
							}
							cricketapp.loadingScreen.style.display="none";
							if(!cricketapp.cache.newsData){
								cricketapp.getNewsData();
							}

										
					}
					cricketapp.dataLoaded =1;

					localStorage.setItem("cacheData",JSON.stringify(cricketapp.cache) );
					if(cricketapp.checkTimeout){
						clearTimeout(setTimeout);
					}
					if(cricketapp.checkAllData){
						clearTimeout(cricketapp.checkAllData);
					}
					cricketapp.checkAllData= setTimeout(cricketapp.getLiveMatchData,30000);
					cricketapp.offlineScreen.style.display="none";


			},
			error: function(response){
				console.log("erro");
					platformSdk.nativeReq({
						fn: 'getFromCache',
						ctx: this,
						data: "cacheData",
						success: function(response){
							if (response === "") {
								console.log("no cache found");
								cricketapp.offlineScreen.style.display="block";
								//cricketapp.cache = {};
								cricketapp.callBindTab = true;

							} else {
								console.log("cache found");

								response = decodeURIComponent(response);
								try {
									response = JSON.parse(response);
									//cricketapp.cache = response;
									//cricketapp.bindCachedData();

								} catch(e) {
								console.log("cache get error");
								cricketapp.offlineScreen.style.display="block";
								cricketapp.cache = {};
								cricketapp.callBindTab = true;

								}	
							}
							cricketapp.awakeCall();
							if(cricketapp.checkTimeout){
								clearTimeout(cricketapp.checkTimeout );
							}
							cricketapp.checkTimeout = setTimeout(cricketapp.awakeCall, 5000);


						}
					});				

				
			}
		});
	},
	awakeCall: function(){
		console.log("calling checkConnection in setTimeout");

		cricketapp.checkConnection(function(type){
			console.log("got type: " +type);

			if(type!=0 && type!=-1){
				cricketapp.offlineStrip.style.display="none";

				cricketapp.getLiveMatchData();
				cricketapp.getNewsData();
				clearTimeout(cricketapp.checkTimeout );
			}else{
				cricketapp.offlineStrip.style.display="block";

				cricketapp.checkTimeout = setTimeout(cricketapp.awakeCall, 5000);

			}
		});

	},
	getFormatTest: function(res){
		if(res.team1.in1 || res.team2.in1){

			res.team1.score = (res.team1.in1?res.team1.in1 :"") + (res.team1.in2 && res.team1.in2!=""?" & "+res.team1.in2: "");
			res.team2.score = (res.team2.in1?res.team2.in1:"" )+ (res.team2.in2 && res.team2.in2!=""?" & "+res.team2.in2: "");
		


			if(res.team1.in2){
				res.team1.overs ="";

			}else{
				res.team1.overs =res.team1.in1overs ;

			}
			if(res.team2.in2){
				res.team2.overs ="";
			}else{
				res.team2.overs =res.team2.in1overs ;

			}

			if(!res.team1.score){
				res.team1.overs ="Yet to bat";
			}
			if(!res.team2.score){
				res.team2.overs ="Yet to bat";
			}
		}
		if(!res.status ){
			if(res.state =="stump"){
				res.status ="Stumps";
			}
			else if(res.state =="lunch"){
				res.status ="Lunch";

			}
			else if(res.state =="tea"){
				res.status ="Tea";

			}else if(res.state == "complete"||res.state == "mom" || res.state == "abandon" ){
				res.status ="Match over";

			}else if(res.state == "innings break" ){
				res.status ="Innings break";

			}
		}
		return res;

	},
	getMatchState: function(res){
		if(res && res.state){
			switch(res.state){
				case "preview":
				case "toss":
					res.actualState = "fixture";
					break;
				case "inprogress":
				case "innings break":
				case "delay":
				case "rain":
				case "badweather":
				case "badlight":
				case "dinner":
				case "innings":
				case "break":
				case "wetoutfield":
				case "lunch":
				case "tea":
					if(res.team1.score || res.team2.score || res.team2.in1 || res.team1.in1){
						res.actualState = "live";
					}else{
						res.actualState = "fixture";

					}
					break;
				case "complete":
				case "mom":
				case "abandon":
					res.actualState = "result";
					break;
				default: 
					if(res.team1.score || res.team2.score || res.team2.in1 || res.team1.in1){
							res.actualState = "live";
					}else{
						res.actualState = "fixture";

					}			
			}
		}
		var response= res;
		if(response.type!="TEST"){
			var temp;
			if (response.team1 && response.team1.score != null) {

					if (response.team1.current && response.team2.score == "") {
						// team1 is left

					} else if (response.team2.current && response.team1.score == "") {
						// team2 is left

						temp = response.team1.current;
						response.team1.current = response.team2.current;
						response.team2.current = temp;


						temp = response.team1.score;
						response.team1.score = response.team2.score;
						response.team2.score = temp;

						temp = response.team1.overs;
						response.team1.overs = response.team2.overs;
						response.team2.overs = temp;

						temp = response.team1.name;
						response.team1.name = response.team2.name;
						response.team2.name = temp;

						temp = response.team1.flagImage;
						response.team1.flagImage = response.team2.flagImage;
						response.team2.flagImage = temp;

					} else if (response.team1.current && response.team2.score != "") {	
						// team2 is left

						temp = response.team1.current;
						response.team1.current = response.team2.current;
						response.team2.current = temp;

						temp = response.team1.score;
						response.team1.score = response.team2.score;
						response.team2.score = temp;

						temp = response.team1.overs;
						response.team1.overs = response.team2.overs;
						response.team2.overs = temp;

						temp = response.team1.name;
						response.team1.name = response.team2.name;
						response.team2.name = temp;

						temp = response.team1.flagImage;
						response.team1.flagImage = response.team2.flagImage;
						response.team2.flagImage = temp;
					} 
				
			
			}
		}
		return response;
	},
    isEmpty: function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },
	bindLiveData:function(res){
		var html='';
		var index =0;
		var indIndex=0;
		var actualIndex;
		var lastNotif ={};
		var notifIndex = null;
		if(!cricketapp.isEmpty(platformSdk.notifData)){

            for(var i in platformSdk.notifData){
				lastNotif=platformSdk.notifData[i];
            }
            PlatformBridge.deleteAllNotifData();

  
        }
		if(res && res.length){
			

		}else if(cricketapp.cache && cricketapp.cache.fixtureData && cricketapp.cache.fixtureData.length){
			res =[];
			cricketapp.cache.fixtureData[0].actualState = "fixture";
			res[0] = cricketapp.cache.fixtureData[0]; 
		}
		if(res && res.length){
			for(var i=0;i<res.length;i++){
				res[i].team1.name = res[i].team1.name.substr(0,4);
				res[i].team2.name = res[i].team2.name.substr(0,4);


				res[i].basePath = cricketapp.basePath;
				res[i] = cricketapp.getMatchState(res[i]);
				if(res[i].type =="TEST"){
				
					res[i] = cricketapp.getFormatTest(res[i]);

				}else{
					if(!res[i].team1.score){
						res[i].team1.overs ="Yet to bat";
					}
					if(!res[i].team2.score){
						res[i].team2.overs ="Yet to bat";
					}
				}
				res[i].team1.flagImage = res[i].team1.flagImage?res[i].team1.flagImage:"";
				res[i].team2.flagImage = res[i].team2.flagImage?res[i].team2.flagImage:"";
				cricketapp.liveData[res[i].matchId] = res[i];
				html+=tmpl("liveCard",res[i]);
			
				if(lastNotif.matchId && lastNotif.matchId==res[i].matchId){
					notifIndex =i;
				}
			}
			cricketapp.swipewrap.innerHTML = html;

		}
		if(res && res.length){
			for(var i=0;i<res.length;i++){
				
				if(res[i].actualState=="live" && (res[i].team1.name =="ind" || res[i].team2.name =="ind") ){
					indIndex = i;
					break;
				}

			}

		}
		if(res && res.length){
			for(var i=0;i<res.length;i++){
				
				if(res[i].actualState=="live"){
					index = i;
					break;
				}

			}

		}
		if(notifIndex!=null){
			actualIndex = notifIndex;
		}
		else if(indIndex >0 ){
			actualIndex=indIndex;
		}else if(index>0){
			actualIndex = index;
		}else{
			actualIndex=0;
		}




		if(cricketapp.lastIndex){
			actualIndex =cricketapp.lastIndex;
		}
		if(cricketapp.swipecontainer.style.display=="none"){
			cricketapp.swipecontainer.style.display ="block";

		}
		if(!res.length){
			cricketapp.swipecontainer.style.display ="none";
		}else if(res.length==1){

			cricketapp.showSwipe(actualIndex);

		}else{

			cricketapp.showSwipe(actualIndex);
			var dots = '';

			for(var j=0;j<res.length;j++){
				if(j==actualIndex){
					dots+='<li class="on"></li>';
				}else{
					dots+='<li></li>';

				}
			}
			document.getElementById("position").innerHTML =dots;
			document.getElementsByClassName("counter")[0].style.display ="block";

		}


		document.getElementById("content").style.display="block";

	    cricketapp.bindEvents();



	},
	bindCachedData: function(){
		cricketapp.bindLiveData(cricketapp.cache.liveData);
		cricketapp.bindNewsData(cricketapp.cache.newsData);

		cricketapp.bindFixResData(cricketapp.cache.fixtureData,"fixtures_data","fixtureCard");

		cricketapp.bindFixResData(cricketapp.cache.resultsData,"results_data","resultCard");
		//if(!platformSdk.helperData.timeout){
			// platformSdk.helperData.timeout = 3000;
			// platformSdk.updateHelperData(platformSdk.helperData);
		//}
		setTimeout(function(){
			cricketapp.containerTabs.style.display="block";

			cricketapp.loadingScreen.style.display="none";

			cricketapp.bindTabSwipeEvents();

			cricketapp.getAlldata();

		},1000);
	},
	showSwipe: function(index){
		//window.mySwipe = Swipe(document.getElementById('slider'));

		var bullets = document.getElementById("position").getElementsByTagName("li");
        window.mySwipe = new Swipe(document.getElementById('slider'), {
            startSlide: index,
            // speed: 400,
            // auto: 7000,	
             continuous: false,
            disableScroll: false,
            stopPropagation: false,
            callback: function(pos) {
            	cricketapp.lastIndex =pos;
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                bullets[pos].className = 'on';
            },
            // transitionEnd: function(index, elem) {}
        });

	},
	getNewsData: function(){
		platformSdk.ajax({
			url: cricketapp.endpoints.cricket,
			type: 'POST',
			timeout: 30000,
			headers: [['Content-Type', 'application/x-www-form-urlencoded']],
			data: 's=1&e=5',	
			success: function(response) {
				if(response ){
					var res =  JSON.parse(response);
					cricketapp.bindNewsData(res);
					cricketapp.cache.newsData = res;
					

					localStorage.setItem("cacheData",JSON.stringify(cricketapp.cache) );
					if(cricketapp.dataLoaded){
							cricketapp.containerTabs.style.display="block";
							if(cricketapp.callBindTab){
								cricketapp.bindTabSwipeEvents();
								cricketapp.callBindTab= false;
							}

							document.getElementById("loadingScreen").style.display="none";

					}
					cricketapp.dataLoaded = 1;

					cricketapp.getFixtures();
	    			cricketapp.getResults();

				}else{

				}

			},
			error: function(response){

			}
		});
	},
	bindNewsData: function(res){
		var html ='';

		if(res && res.items.length){
			for(var i=0;i<res.items.length;i++){
				res.items[i].ts  = cricketapp.timeago(new Date().getTime() - res.items[i].published_ts);
				html+=tmpl("news_data",res.items[i]);
			}
			document.getElementsByClassName("news_data")[0].innerHTML = html+' <div class="moreFromCricbuzz " data-ts="" data-source = "more" data-id="1" data-cat="news" onclick="cricketapp.openFullPage(this)"  href="http://hike.m.cricbuzz.com/cricket-news/latest-news" data-title="Latest Cricket News">More from Cricbuzz</div>';

		}

	},
	imageError: function(obj){
		obj.src=basePath + "assets/images/news_default.png";
	},
	flagList: ["ind","aus","eng","rsa","nz","wi","zim","afg","ire","sl","ban","pak","sco","uae"]
	,
	flagError: function(obj,type){
		console.log(obj);
		var index = cricketapp.flagList.indexOf(obj.nextElementSibling.innerHTML.trim().substr(0,3));
		if(index != -1 ){
			obj.src = basePath+ "assets/images/"+ cricketapp.flagList[index]+".png";
			return;
		}
		var newSrc = obj.getAttribute("data-src");
		if(!newSrc || (newSrc &&  newSrc == obj.src) ){
			newSrc = basePath + "assets/images/news_default.png";
		}
		obj.src = newSrc;
		if(type){
			obj.className = obj.className+" defaultImage";
		}else{
			obj.className = obj.className+" defaultImageSmall";

		}

	},
	timeago: function(ts){
		if (ts >= 86400000){
			var a = Math.round(ts/86400000);
			return a === 1 ? a + ' day ago' : a + ' days ago';
		} else if (ts > 3600000){
			var a = Math.round(ts/3600000);
			return a === 1 ? a + ' hour ago' : a + ' hours ago';
		} else {
			var a = Math.round(ts/60000);
			return a === 1 ? a + ' minute ago' : a + ' minutes ago';
		}
	},
	getFixtures: function(){
		var now = new Date().getTime();
		var startTime = parseInt(now/1000);
		var endTime = parseInt((now + 24*30*3600000)/1000);
		platformSdk.ajax({
			url: cricketapp.endpoints.otherMatches+"?startTs="+ startTime+"&endTs=0&order=1&limit=5",
			type: 'GET',
			success: function(response) {
				if(response && !response.error){
					var html ='';
					var res=  JSON.parse(response);
					if(res && res.length){
						cricketapp.bindFixResData(res,"fixtures_data","fixtureCard");
	                    cricketapp.cache.fixtureData = res;
					localStorage.setItem("cacheData",JSON.stringify(cricketapp.cache) );

						
					}

					if(!cricketapp.swipewrap.children.length){
						cricketapp.bindLiveData(cricketapp.cache.fixtureData[0]);
						//cricketapp.swipecontainer.style.display ="block";
					}

				

				}else{

				}
			},
			error: function(response){

			}
		});

	},
	bindFixResData: function(res,eleClass,template){
		var html ='';

		if(res && res.length){
			for(var i=0;i<res.length;i++){
				res[i].day = res[i].date.split(" ")[1];
				res[i].month = res[i].date.split(" ")[0].substr(0,3);
				res[i].basePath = cricketapp.basePath;	

				var today = new Date();
			    today.setHours(0, 0, 0, 0);

			    var yesterday = new Date();
			    yesterday.setHours(0, 0, 0, 0);
			    yesterday.setDate(yesterday.getDate() - 1);

			    var tomorrow = new Date();
			    tomorrow.setHours(0, 0, 0, 0);
			    tomorrow.setDate(tomorrow.getDate() + 1);	
			    var date = new Date ();
			    if(date.getMonth()==11 && res[i].month.toLowerCase() =="jan"){
			    	var newDate = new Date(res[i].date +" "+ (new Date().getFullYear() +1) );
			    }else{
			    	var newDate = new Date(res[i].date +" "+ new Date().getFullYear() );
			    }
			    if(today.getTime() == newDate.getTime()){
			    	res[i].dayName = "Today";

			    }else if(tomorrow.getTime() == newDate.getTime()){
			    	res[i].dayName = "Tomorrow";

			    }else if(yesterday.getTime() == newDate.getTime()){
			    	res[i].dayName = "Yesterday";

			    }else{
			    	var weekday = new Array(7);
					weekday[0]=  "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";

					res[i].dayName =weekday[newDate.getDay()];
			    	 
			    }
				res[i].team1.flagImage = res[i].team1.flagImage?res[i].team1.flagImage:"";
				res[i].team2.flagImage = res[i].team2.flagImage?res[i].team2.flagImage:"";	
				res[i].team1.name = res[i].team1.name.substr(0,4);
				res[i].team2.name = res[i].team2.name.substr(0,4);
				html+=tmpl(template,res[i]);
			}
		
		if(eleClass == "fixtures_data"){
			document.getElementsByClassName(eleClass)[0].innerHTML = html+ '    <div class="moreFromCricbuzz" data-ts="" data-source = "more" data-id="1" data-cat="fixtures" onclick="cricketapp.openFullPage(this)"  onclick="cricketapp.openFullPage(this)"  href="http://hike.m.cricbuzz.com/cricket-schedule" data-title="Upcoming Matches">More from Cricbuzz</div>' ;
		}else{
			document.getElementsByClassName(eleClass)[0].innerHTML = html+ '<div data-ts="" data-source = "more" data-id="1" data-cat="results" onclick="cricketapp.openFullPage(this)"  class="moreFromCricbuzz" onclick="cricketapp.openFullPage(this)"  href="http://hike.m.cricbuzz.com/cricket-archive" data-title="Cricket Series Results">More from Cricbuzz</div>' ;

		}
	}



	},
	getResults: function(){
		var now = new Date().getTime();
		var startTime = parseInt((now - 24*30*3600000)/1000);
		var endTime = parseInt((now - 24*3600000)/1000);
		platformSdk.ajax({
			url: cricketapp.endpoints.otherMatches+"?startTs="+ startTime+"&endTs="+endTime+"&order=0&limit=5",
			type: 'GET',
			success: function(response) {
				if(response && !response.error){
					var html ='';
					var res=  JSON.parse(response);
					if(res && res.length){
						cricketapp.bindFixResData(res,"results_data","resultCard");
						cricketapp.cache.resultsData = res;
					localStorage.setItem("cacheData",JSON.stringify(cricketapp.cache) );
						
					}

				}else{

				}
			},
			error: function(response){

			}
		});
	},
	getTeamShortName: function(str){
		var obj = {
			"Australia": "aus",
			"England": "eng",
			"India": "ind",
			"Sri Lanka": "sl",
			"New Zealand": "nz",
			"Zimbabwe": "zim",
			"South Africa": "rsa",
			"West Indies": "wi",
			"Bangladesh": "ban",
			"Ireland": "ire",
			"Afghanistan": "afg",
			"Pakistan": "pak",
			"UAE": "uae",
			"Scotland": "sco",

		}
		return obj[str];
	},

	getFullScore: function(matchId,title){
		var container = document.querySelector('.container');

		this.formatLiveScore(matchId);
		var html = tmpl("miniScoreCard",cricketapp.liveData[matchId]);
       	container.classList.add('view-change');

       	document.getElementsByClassName("details-view")[0].innerHTML = html;
		cricketapp.state =1;

		PlatformBridge.allowBackPress('true');

		try{
			PlatformBridge.allowUpPress('true');
		}
		catch(e){
			
		}	
		try{
			PlatformBridge.changeBotTitle(title);
		}
		catch(e){
			
		}	

		document.getElementById("content").style.maxHeight="100%";
		if(cricketapp.checkAllData){
			clearTimeout(cricketapp.checkAllData);
		}

       	cricketapp.bindFullScreenEvents();
       	cricketapp.updateMatchScore();

	},
	backPressEvent: function(){

	
		var container = document.querySelector('.container');

		container.classList.remove('view-change');
		cricketapp.state =0;
		document.getElementById("content").removeAttribute("style");
		PlatformBridge.allowBackPress('false');
		try{
			PlatformBridge.allowUpPress('false');
		}
		catch(e){
			
		}	
		try{
			PlatformBridge.changeBotTitle("Cricket");
		}
		catch(e){
			
		}	

		document.getElementsByClassName("details-view")	[0].innerHTML ="";
		if(cricketapp.checkLive ){
					clearTimeout(cricketapp.checkLive );
		}
		cricketapp.getLiveMatchData();

	
	},
	bindFullScreenEvents: function(){
		cricketapp.refreshEle = document.getElementById("refresh");

		var backPress = platformSdk.events.subscribe('onBackPressed', function(){
			cricketapp.backPressEvent();
		});
		var upPress = platformSdk.events.subscribe('onUpPressed', function(){
			cricketapp.backPressEvent();


		});
		var fullScoreEle = document.getElementById("fullScoreLink");
		var shareButton = document.getElementById("ShareFullScore");
		var forwardFullScore = document.getElementById("forwardFullScore");

		// if(fullScoreEle){
		// 	fullScoreEle.addEventListener("click", function(event){
		// 						event.stopPropagation();

		// 		PlatformBridge.openFullPage(this.getAttribute("data-title"),this.getAttribute("data-href"));
		// 	});
		// }
		if(shareButton){
			shareButton.addEventListener("click", function(event){
				event.stopPropagation();
				PlatformBridge.share("Cricket Scores now on Hike","Get hike at http://hike.in/cricket");
				var ae = {};
				ae["ek"] = "micro_app";
				ae["event"] = "card_share";
				ae["fld3"] = document.getElementById("scoredetailCard").getAttribute("data-matchid") +"";
				ae["fld1"] = "cricketv2";

				if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
			});
		}
		if(forwardFullScore){
				forwardFullScore.addEventListener("click", function(event){
					event.stopPropagation();

					var matchId = this.getAttribute("data-matchid");
					if(cricketapp.liveData[matchId].type =="TEST"){
						cricketapp.liveData[matchId].isTest = true;
					}else{
						cricketapp.liveData[matchId].isTest = false;

					}
					var obj = {};
					if(cricketapp.liveData[matchId].actualState =="result"){
						obj["layoutId"] = "fwd_resultMatch.html";  

					}else if(cricketapp.liveData[matchId].actualState =="live"){
						obj["layoutId"] = "fwd_liveScore.html";  

					}else {
						obj["layoutId"] = "fwd_fixture.html";  

					}

		           	obj["h"] = 200;
		           	obj["push"] = "silent";

		            obj["ld"] = cricketapp.liveData[matchId];
		           	obj["ld"]["newsURL"] = cricketapp.liveData[matchId].newsURL;
		           
		           	obj["ld"]["timings"] = "Starts on "+cricketapp.liveData[matchId].date;



		             obj["hd"]= {"nextPollTs":cricketapp.liveData[matchId].nextPollTs,"liveScorePollUrl":cricketapp.endpoints.liveMatch+"?matchId="+matchId,"caption_text":"Get hike at http://hike.in/cricket","share_text":"Cricket scores now on hike!"};
		             if(cricketapp.liveData[matchId].actualState !="fixture"){
		             	if(!cricketapp.liveData[matchId].team2.score){
		             		var score2 = "Yet to bat";
		             	}else{
		             		score2=  cricketapp.liveData[matchId].team2.score;
		             	}
		             	if(!cricketapp.liveData[matchId].team1.score){
		             		var score1 = "Yet to bat";
		             	}else{
		             		score1=  cricketapp.liveData[matchId].team1.score;
		             	}
		             	var notifText = cricketapp.liveData[matchId].title+": "+ cricketapp.liveData[matchId].status+", "+ cricketapp.liveData[matchId].team1.name+" - " + score1+", " + cricketapp.liveData[matchId].team2.name+" - "+score2;
		            	obj["notifText"] = notifText;

						PlatformBridge.forwardToChat(JSON.stringify(obj),notifText);
					}else{
						var notifText = cricketapp.liveData[matchId].title+": "+ cricketapp.liveData[matchId].status;
						obj["notifText"] = notifText;

						PlatformBridge.forwardToChat(JSON.stringify(obj),notifText);
					}
					var ae = {};
					ae["ek"] = "fwd_button_clicked";
					ae["cat"] = "cricket";
					ae["mapp_vs"] = cricketapp.version;
					ae["c_id"] = parseInt(document.getElementById("scoredetailCard").getAttribute("data-matchid"));

					ae["source"] = "match_id";

					if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);

				});

		}
		var tappedElementCount = document.getElementsByClassName("tap");

		if(tappedElementCount.length){
			for(var i=0; i< tappedElementCount.length;i++){
				tappedElementCount[i].addEventListener("touchstart", function(){
					this.classList.add("tapped");
				});
				tappedElementCount[i].addEventListener("touchend", function(){
					this.classList.remove("tapped");
				});
				tappedElementCount[i].addEventListener("touchcancel", function(){
					this.classList.remove("tapped");
				});
				tappedElementCount[i].addEventListener("touchleave", function(){
					this.classList.remove("tapped");
				});
			}
		}
	},
	formatLiveScore: function(matchId){
		if(cricketapp.liveData[matchId].battingScore && (cricketapp.liveData[matchId].battingScore[0].name || cricketapp.liveData[matchId].battingScore[1].name ) ){	
		cricketapp.liveData[matchId].battingScore.first = cricketapp.liveData[matchId].battingScore[0];
		cricketapp.liveData[matchId].battingScore.second = cricketapp.liveData[matchId].battingScore[1];

		cricketapp.liveData[matchId].bowlingScore.first = cricketapp.liveData[matchId].bowlingScore[0];
		cricketapp.liveData[matchId].bowlingScore.second = cricketapp.liveData[matchId].bowlingScore[1];
		}else{
			delete cricketapp.liveData[matchId].battingScore;
		}

	},	

	updateMatchScore: function(){
		var matchId = document.getElementById("scoredetailCard").getAttribute("data-matchid");
		platformSdk.ajax({
			type: 'GET',
			url:cricketapp.endpoints.liveMatch+"?matchId="+ matchId,
			success: function(response) {
				if(response){
					var res = JSON.parse(response);
					res.basePath =cricketapp.basePath;
					res.team1.name = res.team1.name.substr(0,4);
					res.team2.name = res.team2.name.substr(0,4);
					res = cricketapp.getMatchState(res);
					if(res.type =="TEST"){
						res = cricketapp.getFormatTest(res);
						

					}else{
						if(!res.team1.score){
							res.team1.overs ="Yet to bat";
						}
						if(!res.team2.score){
							res.team2.overs ="Yet to bat";
						}
					}
					cricketapp.liveData[matchId] = res;
					cricketapp.formatLiveScore(matchId);
					var htmlData = tmpl("miniScoreCard",cricketapp.liveData[matchId]);
					document.getElementsByClassName("details-view")[0].innerHTML = htmlData;
					var loadingIcon = document.getElementById("loadingFullScore");
					if(loadingIcon){
						loadingIcon.style.display="none";
					}

					cricketapp.bindFullScreenEvents();
					if(cricketapp.checkLive ){
						clearTimeout(cricketapp.checkLive );
					}
					if(res.actualState !="result"){
						cricketapp.checkLive = setTimeout(cricketapp.updateMatchScore,30000);
					} 
					var matchStatus = document.getElementById("matchStatus");
					if(matchStatus && res.actualState && res.actualState!="fixture"){
						matchStatus.style.display="none";
					}

				}
						cricketapp.refreshEle.classList.remove('play');
						try{
							var team = document.getElementById("scoredetailCard").getElementsByClassName("currentTeam")[0].children[0];
							team.classList.add('scale');
							setTimeout(function() {
										team.classList.remove('scale');

							}, 500);
						}
						catch(e){

						}


			},
			error: function(response){

				cricketapp.refreshEle.classList.remove('play');
				document.getElementById("loadingFullScore").style.display="none";


			}
		});
	},
	refreshScore: function(obj){
		cricketapp.refreshEle = obj;
		event.stopPropagation();
		//platformSdk.events.publish('/refresh/startAnimation/', obj);
		obj.classList.add('play');
		cricketapp.obj = obj;

		cricketapp.updateMatchScore();
		var ae = {};
		ae["ek"] = "micro_app";
		ae["event"] = "card_ref";
		ae["fld3"] = document.getElementById("scoredetailCard").getAttribute("data-matchid") +"";

		ae["fld1"] = "cricketv2";

		if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);

	},
	bindEvents: function(){

		var liveCards = document.getElementsByClassName("cardlive");
		if(liveCards.length){
			for(i=0;i<liveCards.length;i++){
				liveCards[i].addEventListener("click", function(){
					cricketapp.getFullScore(this.getAttribute("data-matchid"),this.getAttribute("data-title"));	
					var ae = {};
					ae["ek"] = "full_st";
					ae["c_id"] = parseInt(this.getAttribute("data-id"));
					ae["source"] = this.getAttribute("data-source");
					ae["p_ts"] = this.getAttribute("data-ts");
					ae["cat"] = this.getAttribute("data-cat");
					ae["url"] = this.getAttribute("href");
					ae["mapp_vs"] = cricketapp.version;

					if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
					console.log(ae);
				});
			}
		}


	},
	openFullPage: function(obj,isNews){
		if(platformSdk.bridgeEnabled) {
			event.preventDefault();
			event.stopPropagation();
			if(isNews){
				PlatformBridge.openFullPage(obj.getAttribute("data-title"),obj.getAttribute("href").replace("www.","hike.m."));
			}else{


				PlatformBridge.openFullPage(obj.getAttribute("data-title"),obj.getAttribute("href"));
			}

		}
			var ae = {};
			ae["ek"] = "full_st";
			ae["c_id"] = parseInt( obj.getAttribute("data-id"));
			ae["source"] = obj.getAttribute("data-source");
			ae["p_ts"] = obj.getAttribute("data-ts");
			ae["cat"] = obj.getAttribute("data-cat");
			ae["url"] = obj.getAttribute("href");
			ae["mapp_vs"] = cricketapp.version;

			if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
			console.log(ae);
		
	}
	

};
// var setDataCallback = platformSdk.events.subscribe('webview/data/loaded', function() {
// 	platformSdk.bridgeEnabled = platformSdk.checkBridge();
// 	if(platformSdk.bridgeEnabled) {
// 		cricketapp.basePath=basePath;
// 		cricketapp.init();

         
// 	}

// });

        
            



// (function(){
// 	 var $ = function(selector) {
//         return document.querySelector(selector);
//     };
//     if ($(".comp__tabs") != null) {
//         var tabs = $(".comp__tabs").getElementsByClassName("comp__tab");

//         for (var i = 0; i < tabs.length; i++) {
//             var tab = tabs[i];
//             tab.onclick = showHideTabs;
//         }
//     }

//     function showHideTabs(event) {
//         var target = event.target;
//         var parent = event.target.parentNode;
//         var oldCat;
//         var attribute = target.getAttribute("data-id");
//         var allTabsData = parent.nextElementSibling.children;

//         for (var i = 0; i < parent.children.length; i++) {
//             if (parent.children[i].classList.contains("selected")) {
//             	oldCat=parent.children[i].getAttribute("data-id");
//                 parent.children[i].classList.remove("selected");
//             }
//         }
//         target.classList.add("selected");
//         for (var i = 0; i < allTabsData.length; i++) {
//             if (allTabsData[i].getAttribute("data-id") == attribute) {
//                 allTabsData[i].style.display = 'block';
//             } else {
//                 allTabsData[i].style.display = 'none';

//             }
//         }
//         	var ae = {};
// 			ae["ek"] = "cat_select";
// 			ae["new_cat"] = attribute;
// 			ae["old_cat"] = oldCat;
// 			ae["mapp_vs"] = cricketapp.version;

// 			if (platformSdk.bridgeEnabled) platformSdk.utils.logAnalytics("true", "click", ae);
//     }
// }());

function onPause(){
	if(cricketapp.checkTimeout){
		clearTimeout(cricketapp.checkTimeout);
	}
	if(cricketapp.checkLive){
		clearTimeout(cricketapp.checkLive);
	}
	if(cricketapp.checkAllData){
		clearTimeout(cricketapp.checkAllData);
	}
}
function onResume(){
       // if(cricketapp.state){
       //      cricketapp.updateMatchScore();
       //  }else{
       //  	cricketapp.getLiveMatchData();
       //  }


}
var delegate = function(criteria, listener) {
  return function(e) {
    var el = e.target;
    do {
      if (!criteria(el)) continue;
      e.delegateTarget = el;
      listener.apply(this, arguments);
      return;
    } while( (el = el.parentNode) );
  };
};
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
window.addEventListener("DOMContentLoaded", function(){
		document.getElementById("quoteCricket").innerHTML ='"'+cricketapp.factsList.randomElement()+'"';
	

});

window.onload= function(){
	cricketapp.basePath="";
	cricketapp.init();
 

}
 
