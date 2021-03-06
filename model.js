function Model()
{
	self = this;
    this.gameId = YOI_GAME_ID;
	this.displayName = ""; // for displaying newly added content
    this.gameJSONText = '';
	this.gameNotes = []; //this is using new API
    this.currentNote = {};
    this.currentNote.noteId = 0;
    this.audio_context = '';
    this.recorder = '';
	this.contentWaitingToUpload = 0; // when user uploads multiple contents, you'll have to wait till all are uploaded before you can push it to HTML
    this.mapMarkers = [];
	this.tags = '';
	this.serverCallsToLoad = 5; //right now, we have 5 consecutive server calls for icon URLS, all must complete before we can continue
	this.loadFinishCallback = '' ;
	this.siftTypeCode = 0; //we keep track of this so we can sift from tag or search changes without forgetting what main sift we were using. Start with top

	self.playerId = 0;

	this.finishLoad = function(callback){
		//dynamically load the tags and their icon urls from the server
		
		if(callback) //this is set when it's called from index
		{	
			this.loadFinishCallback = callback;
			callService("notes.getAllTagsInGame", model.loadTagsFromServer,"/"+ this.gameId, false);
		}
		else  //it's being called from the laodTagsFromServer's returning
		{
			this.serverCallsToLoad--; //one more is loaded
			//not untill all the server calls return can we proceed
			if(this.serverCallsToLoad <= 0){ 
				this.loadFinishCallback();
			}
		}	
	}

	
  $('.sifter-show-logout-button').hide();
	//check to see if they have a session cookie with their playerId and can skip login, if not set it to zero
	if($.cookie("sifter") > 0)
	{
		self.playerId = $.cookie("sifter");
    self.displayName = $.cookie("displayName"); // Since there is no re-check from the server on page load

    $('.sifter-show-logout-button').show();
	}

	this.loadTagsFromServer = function(response){
		//format tag array
		model.tags = JSON.parse("[" + response + "]")[0].data;

	
		//retrieve and store icon URLs

			callService("media.getMediaObject", function(response){model.tags[0].iconURL = JSON.parse("[" + response + "]")[0].data.url; model.finishLoad(); }, "/"+model.gameId+ "/" + model.tags[0].media_id, false);
			callService("media.getMediaObject", function(response){model.tags[1].iconURL = JSON.parse("[" + response + "]")[0].data.url; model.finishLoad(); }, "/"+model.gameId+ "/" + model.tags[1].media_id, false);
			callService("media.getMediaObject", function(response){model.tags[2].iconURL = JSON.parse("[" + response + "]")[0].data.url; model.finishLoad(); }, "/"+model.gameId+ "/" + model.tags[2].media_id, false);
			callService("media.getMediaObject", function(response){model.tags[3].iconURL = JSON.parse("[" + response + "]")[0].data.url; model.finishLoad(); }, "/"+model.gameId+ "/" + model.tags[3].media_id, false);
			callService("media.getMediaObject", function(response){model.tags[4].iconURL = JSON.parse("[" + response + "]")[0].data.url; model.finishLoad(); }, "/"+model.gameId+ "/" + model.tags[4].media_id, false);
	}

    this.addNoteFromData = function(note)
    { 
        //Fix up note tags
        note.tagString = note.tags[0].tag;  //all notes are required to have one, and only one, tag
        note.geoloc = new google.maps.LatLng(note.lat, note.lon);
        this.gameNotes[this.gameNotes.length] = note;
    }

    this.populateFromData = function(rawNotes)
    {	//the notes coming in need some processing
		this.gameNotes = []; //empty out old notes
		this.rawNotes = rawNotes;
        for(var i = 0; i < this.rawNotes.length; i++)
        {
                this.addNoteFromData(this.rawNotes[i]);
        }
		
    };

	this.getSiftTypeCode= function(siftType){
		switch(siftType){
       		case "top":
				this.siftTypeCode = 0;
        	    break;
	       	case "recent":
				this.siftTypeCode = 2;
	            break;
    	    case "popular":			
				this.siftTypeCode = 1;
	            break;
    	   	case "mine":
				this.siftTypeCode = 3;
            	break;
    	   	case "tags":
				// in this case we don't change it but use the last setting
	            break;
    	    case "search":
				// in this case we don't change it but use the last setting
	            break;
    	}
		console.log(siftType + " " + this.siftTypeCode);
		return(this.siftTypeCode);
	}

    this.views = new function Views()
    { 
        //Content
        //this.mainView.addEventListener('click', function(e) { e.stopPropagation(); }); 
		//don't know why this is commented out, but if we don't need it we don't need the removeEventListeners either
        this.mainViewLeft              = document.getElementById('main_view_left');
        this.createNoteViewContainer   = document.getElementById('create_note_view_container');
        this.noteViewContainer         = document.getElementById('note_view_container');
        

    this.staticContainer = document.getElementById('static_view_container');
		this.loginViewContainer        = document.getElementById('login_view_container');
        this.joinViewContainer         = document.getElementById('join_view_container');
        this.forgotViewContainer       = document.getElementById('forgot_view_container');
        this.constructNoteView         = document.getElementById('note_view_construct');
        this.constructNoteCreateView   = document.getElementById('note_create_view_construct');

        
		this.constructLoginView     	= document.getElementById('login_view_construct');
        this.constructJoinView      	= document.getElementById('join_view_construct');
        this.constructForgotView      	= document.getElementById('forgot_view_construct');

		this.loginButton				= document.getElementById('loginButton'); 
		this.logoutButton				= document.getElementById('logoutButton');
		this.fbloginButton				= document.getElementById('fbloginButton');
		this.siftMineButton				= document.getElementById('siftMineButton');

    /* TODO toggle classes/use jquery */
/*		if(self.playerId > 0){ //if the cookie indicated they are logged in
			this.loginButton.style.display = 'none'; // hide login
			this.fbloginButton.style.display = 'none'; //they are already logged in

			//check to see if they are logged into facebook and update the logout button accordingly
			if(FB.IsLoggedIn){
				console.log("facebook logged in");
				this.logoutButton.style.display = 'inline'; //They are logged in, let them log out
			
			}else{ //since they are only logged into siftr, use the siftr logout button 
				console.log("facebook not logged in");
				this.logoutButton.style.display = 'inline'; //They are logged in, let them log out
			}

		}
		else{
			this.logoutButton.style.display = 'none';
		}
*/
        this.likeIcon     = '<img id="likeIcon" src="./assets/images/LikeIcon.png" height=10px; />';
        this.commentIcon  = '<img src="./assets/images/CommentIcon.png" height=8px; />';
        this.noteIcon     = '';

		this.darkness		    = document.getElementById("darkBackgroundLayer");
		this.darkness.style.display = 'none';

        //Map
        this.map = document.getElementById('main_view_map');
        var centerLoc = new google.maps.LatLng(0, 0);
        var myOptions = { zoom:5, center:centerLoc, mapTypeId:google.maps.MapTypeId.ROADMAP };
        this.gmap = new google.maps.Map(this.map, myOptions);
		
		//default map pin location is in lake, where no notes are expected. User must move this pin to submit a note.
		this.defaultLat = 43.081829;
		this.defaultLon = -89.402313;
 
        // marker clusterer
        var mcOptions = { styles: [
            { height:53, url:"./assets/images/speechBubble_cluster_large.png", width:41, anchor:[15,17], fontFamily:"Helvetica, Arial" },
            { height:53, url:"./assets/images/speechBubble_cluster_large.png", width:41, anchor:[15,13], fontFamily:"Helvetica, Arial" },
            { height:53, url:"./assets/images/speechBubble_cluster_large.png", width:41, anchor:[15,13], fontFamily:"Helvetica, Arial" },
            { height:53, url:"./assets/images/speechBubble_cluster_large.png", width:41, anchor:[15,13], fontFamily:"Helvetica, Arial" },
            { height:53, url:"./assets/images/speechBubble_cluster_large.png", width:41, anchor:[15,13], fontFamily:"Helvetica, Arial" }
        ]};
        
        this.markerclusterer = new MarkerClusterer(this.gmap,[],mcOptions);
        
        this.markerclusterer.setMinimumClusterSize(300)
    };
}
