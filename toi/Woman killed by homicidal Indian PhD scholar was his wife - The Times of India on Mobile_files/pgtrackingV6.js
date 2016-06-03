/*
 * This Script is used to Log the access log data
 * Author : ram.awasthi@timesgroup.com
 * (c) Times Business Solutions Limited
 * Date: 16/7/2010
 */

if(!iBeatPgTrend) {
	var iBeatPgTrend = {
		version     : 1.3,
		
		key         : "",
		host        : "",
		domain      : "",
		url         : "",
		pgDnldTime  : -1,
		channel     : "",
		sessonId    : "",
		agentType   : "",
		referer     : "",
		articleId   : "",
		contentType : "",
		location    : "1",
		cat         : "",
		subcat      : "",
		tag         : "",
		catIds      : "",
		publishedTime : "",
		action      : "1",
		author      : "",
		position    : "",
		utmvsi		: "",
		utmcsr		: "",
		utmccn		: "",
		utmcmd		: "",
		utma		: "",
		utma		: "",
		iBeatField		: "",
		
		//Initialize setup
		init : function () {
				var config = window._page_config;
				if(config){
					this.key       = config.key;
					this.channel   = config.channel;
					this.domain    = config.domain;
					
					if(config.cat) {
						this.cat       = config.cat;
					}
					
					if(config.subcat) {
						this.subcat    = config.subcat;
					}
					
					if(config.contenttag) {
						this.tag       = config.contenttag;
					}
					
					if(config.catIds) {
						this.catIds       = config.catIds;
					}
					
					if(config.articledt) {
						this.publishedTime  = config.articledt;
					}
					
					if(config.author) {
						this.author  = config.author;
					}
					
					 if(config.position) {
                                                this.position  = config.position;
                                        }

					if(config.articleId) {
						this.articleId = config.articleId;
					}
					
					if(config.location) {
						this.location = config.location;
					}
					
					if(config.contentType) {
						this.contentType = config.contentType;
					}
					
					if(config.iBeatField) {
						this.iBeatField = config.iBeatField;
					}
					
					if(config.action) {
						this.action = config.action;
					}
					
					if(config.utmvsi) {
						this.utmvsi = config.utmvsi;
					}
					
					if(config.utmcsr) {
						this.utmcsr = config.utmcsr;
					}
					
					if(config.utmccn) {
						this.utmccn = config.utmccn;
					}
					
					if(config.utmcmd) {
						this.utmcmd = config.utmcmd;
					}
					
					if(config.utma) {
						this.utma = config.utma;
					}
					
					this.host      = config.host;
					if(this.host == "indiatimes.com") {
						this.url = config.url;
					}else{
						this.url = window.location.href;
					}
					
					if(this.url == "") {
						this.url = window.location.href;
					}
					
					this.referer   = document.referrer;
					
					//Maintain session Information If no session Id is sent 3rd Party cookie will do
					if(config.sessionId) {
						this.sessionId = config.sessionId
					} else {
						var sId = this.readCookie("_ibeat_session");
						if(sId) {
							this.sessionId = sId;
						} else {
							this.sessionId = this.guid();
							this.createCookie("_ibeat_session", this.sessionId, 30, "/");
						}
					}
					this.agentType = navigator.userAgent;
					if(typeof(window._pg_startpt)=="number"){
						if(typeof(window._pg_endpt)=="number"){
							this.pgDnldTime = window._pg_endpt - window._pg_startpt;
						}
					}
				}
				
				this.validateCookie();
				
				if(this.validate() == false) {
					return;	
				}

				this.host=this.host.replace(/^www\./,"");
				this.logServer="ibeat.indiatimes.com";
				this.log();
		},
		
		logaction: function(action) {
			this.action = action;
			this.log();
		},
		//Prepares logging Request and make a call to sendRequest
		log: function () {
				var request = "http://"+this.logServer+"/iBeat/pageTrendlog.html?h="+encodeURIComponent(this.host);
				request += "&d="+encodeURIComponent(this.domain);
				request += "&url="+encodeURIComponent(this.url);
				request += "&k="+this.key;
				request += "&ts="+this.pgDnldTime;
				request += "&ch="+encodeURIComponent(this.channel);
				request += "&sid="+encodeURIComponent(this.sessionId);
				request += "&at="+encodeURIComponent(this.agentType);
				request += "&ref="+encodeURIComponent(this.referer);
				request += "&aid="+encodeURIComponent(this.articleId);
				request += "&loc="+encodeURIComponent(this.location);
				request += "&ct="+encodeURIComponent(this.contentType);
				request += "&cat="+encodeURIComponent(this.cat);
				request += "&scat="+encodeURIComponent(this.subcat);
				request += "&ac="+encodeURIComponent(this.action);
				request += "&tg="+encodeURIComponent(this.tag);
				request += "&ctids="+encodeURIComponent(this.catIds);
				request += "&pts="+encodeURIComponent(this.publishedTime);
				request += "&auth="+encodeURIComponent(this.author);
				request += "&pos="+encodeURIComponent(this.position);
				request += "&utmvsi="+encodeURIComponent(this.utmvsi);
				request += "&utmcsr="+encodeURIComponent(this.utmcsr);
				request += "&utmccn="+encodeURIComponent(this.utmccn);
				request += "&utmcmd="+encodeURIComponent(this.utmcmd);
				request += "&utma="+encodeURIComponent(this.utma);
				request += "&iBeatField="+encodeURIComponent(this.iBeatField);
				this.sendRequest(request);
				
		},

		//Actual Logging request is sent here
		sendRequest : function(request) {
				var img = new Image(1,1);
				//Do Some Error Handling if required Though not that much important
				img.src = request;
		},

		//Generate Unique Session ID
		guid:function(){
			var key,rnd,i;
			key="";
			for(i=0;i<16;i++){
				rnd=Math.floor(Math.random()*36).toString(36);
				key = key + rnd;
			}
			return key;
		},
	
	 deleteCookie:function(cookieName){
			if(this.readCookie(cookieName)){
				this.createCookie(cookieName,"",-1);
				return true
			}
			return false
		},

	createCookie:function(name,value,mins,path){
			if(!path){ path="/"  }

			var expiry= "";
			if(mins){
				var cDate=new Date();	
				cDate.setTime(cDate.getTime()+(mins*60*1000));
				expiry=";expires="+cDate.toGMTString();
			} 
			document.cookie=name+"="+value+expiry+";path="+path;
		},
		
		readCookie:function(cookieName){
			var str=cookieName+"=";
			var args = document.cookie.split(":");

			for(var d=0;d<args.length;d++){
				var f=args[d];
				while(f.charAt(0)==" "){
					f=f.substring(1,f.length)
				}
				if(f.indexOf(str)==0){
					return f.substring(cookieName.length,f.length)
				}
			}
			return null;
		},
				
		validateCookie:function(){
			var NameOfCookie = "_iibeat_session";
			var value = "";
			var ExpireDate = new Date();
			var expiredays = 90;
			if (document.cookie.length > 0) 
				{ 
					begin = document.cookie.indexOf(NameOfCookie+"="); 
					if (begin != -1)
						{ 
							begin += NameOfCookie.length+1; 
							end = document.cookie.indexOf(";", begin);
							if (end == -1) end = document.cookie.length;
							value = unescape(document.cookie.substring(begin, end)); 
						}else{
							value = this.uniqueUID();
						}
						value = value;
						var cDate=new Date();	
						cDate.setTime(cDate.getTime() + (expiredays * 24 * 3600 * 1000));
						expiry=";expires="+cDate.toGMTString();
						path="/" ;
						var domainName = ";domain=.indiatimes.com";
						document.cookie = NameOfCookie + "=" + value + domainName + expiry+";path="+path;
				}
			return null;
		},
		
		uniqueUID:function(){
				var d = new Date().getTime();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = (d + Math.random()*16)%16 | 0;
						d = Math.floor(d/16);
						return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});
				return uuid;
		},
		
		validate: function() {
			if(
			   this.cat         == "" ||
			   this.domain      == "" ||
			   this.key         == "" ) {
				    return false;
				}
				return true;
		}
		
	};

	function logaction(action) {
		iBeatPgTrend.logaction(action);
	};
	
	iBeatPgTrend.init();
	
};
