$(function(){
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyD1UCXTw5xWE5WehTfqh0AK-K2asMyf4S4",
	    authDomain: "couplette-b67ce.firebaseapp.com",
	    databaseURL: "https://couplette-b67ce.firebaseio.com",
	    projectId: "couplette-b67ce",
	    storageBucket: "couplette-b67ce.appspot.com",
	    messagingSenderId: "934836634497"
	};
	firebase.initializeApp(config);

	var dataRef = firebase.database();
	// Initial Values
	var firstName1 = "";
	var firstName2 = "";
	var lastName1 = "";
	var lastName2 = "";
	var coupleEmail = "";
	var password = "";
	var confirmPassword = "";
	var zipcode = "";
	var picture = "";
	var description = "";
	var arts = ""
	var dining = "";
	var films = "";
	var music = "";
	var gaming = "";
	var outdoor = "";
	var travel = "";
	var other = "";
	var age = 0;
	var comment = "";
	var coupleUsername = "";

	$("#button").on("click", function(event) {
		event.preventDefault();
		// Code in the logic for storing and retrieving the most recent user.
		firstName1 = $("#name-input").val().trim();
		firstName2 = $("#name-input2").val().trim();
		lastName1 = $("#last-input").val().trim();
		lastName2 = $("#last-input2").val().trim();
		coupleEmail = $("#email-address").val().trim();
		password = $("#pass").val().trim();
		confirmPassword = $("#confirm-pass").val().trim();
		zipcode = $("#zipcode").val().trim();
		description = $("#textarea").val().trim();
		arts = $("#artsbox").val().trim();
		dining = $("#diningbox").val().trim();
		films = $("#filmsbox").val().trim();
		music = $("#musicbox").val().trim();
		gaming = $("#gamingbox").val().trim();
		outdoor = $("#outdoorbox").val().trim();
		travel = $("#travelbox").val().trim();
		other = $("#otherbox").val().trim();
		age = $("#age-input").val().trim();
		comment = $("#comment-input").val().trim();
		coupleUsername = $("#couple-username").val().trim();
		// Code for the push
		dataRef.ref().push({
			firstName1: firstName1,
			firstName2: firstName2,
			lastName1: lastName1,
			lastName2: lastName2,
			coupleEmail: coupleEmail,
			password: password,
			confirmPassword: confirmPassword,
			zipcode: zipcode,
			description: description,
			Interests: {
				Arts: arts,
				Dining: dining,
				Films: films,
				Music: music,
				Gaming: gaming,
				Outdoors: outdoor,
				Travel: travel,
				other: other,
			},
			age: age,
			coupleUsername: coupleUsername,
			comment: comment,
			// dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	});
	
	//Sample User Criteria
	var userCriteria = {
	    ageLow: 18,
	    ageHigh: 25,
	    gender: "mf",
	    distance: 5,
	    interests: {
	        film: true,
	        sports: true,
	        arts: true,
	        gaming: true,
	        dining: true,
	        travel: true,
	        outdoors: true,
	        music: true
	    }
	}

	function matchUser (criteria, userToComp){
	    var match = false;
	    var tempArray = Object.keys(criteria.interests);
	    for (var i = 0; i < tempArray.length; i++){
	        if (userToComp.interests[tempArray[i]] === criteria.interests[tempArray[i]]){
	            match = true;
	        }
	    }
	    //check for age
	    if (criteria.ageLow !== null){
	        if (criteria.ageLow === 55){
	            if (!(criteria.ageLow <= userToComp.age1)){
	                match = false;
	            }
	            if (!(criteria.ageLow <= userToComp.age2)){
	                match = false;
	            }
	        }
	        else {
	            // console.log(((criteria.ageLow <= userToComp.Age2 <= criteria.ageHigh)));
	            if (!(criteria.ageLow <= userToComp.age1 && userToComp.age1 <= criteria.ageHigh)){
	            match = false
	            }
	            if (!(criteria.ageLow <= userToComp.age2 && userToComp.age2 <=criteria.ageHigh)){
	            match = false
	            }
	        }
	    }
	    if (criteria.gender !== null){
	        if (criteria.gender !== userToComp.gender){
	            match = false;
	        }
	    }
	    if (match){
	        return true;
	    }
	    else {
	        return false;
	    };
	}
	function collectUser(criteria){
	    dataRef.ref("users").once("value", function(snapshot){
	        var users = snapshot.val();
	        var userNameArray = Object.keys(users);
	        var namesThatMatch = []
	        for (var i = 0; i < userNameArray.length; i++){
	            if (matchUser(criteria, users[userNameArray[i]])){
	                namesThatMatch.push(users[userNameArray[i]].username);
	            }
	        }
	        console.log(namesThatMatch);
	    })
	}
	collectUser(userCriteria);

	//add calendar date pick functionality to event page date input field
	$("#dateEvent").datepicker({minDate: 0});

	$("#dateEvent").on("change", function(){
		if ($(this).val() !== undefined){
			$(".eventZipcode").slideDown();
		}
	});

	$(".zipInp").on("keyup", function(){
		var zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;

		if (zipRegex.test($(this).val())){
			$(".eventTypeBlock").slideDown();
		}

		else {
			$(".eventTypeBlock").slideUp();
			$(".diningEvent").slideUp();
			$(".filmEvent").slideUp();
			$(".eventType").val(0);
			$(".filmTimes").slideUp("fast");
			$(".films").slideUp("fast");

		}
	})

	//adding dynamic page updates based on event select dropdown option
	$(".eventType").on("change", function(){

		if ($(this).val() === "EventDefault"){
			$(".filmEvent").slideUp("fast");
			$(".diningEvent").slideUp("fast");
		}

		else if ($(this).val() === "Film"){
			var movieZipURL = 'https://data.tmsapi.com/v1.1/theatres?zip=' + $('.zipInp').val() + '&api_key=n9dzsauzmnxaps66hbyawcuz';
			// var movieZipURL = "http://data.tmsapi.com/v1.1/theatres?zip=78701&api_key=turvtrjxt4n6b9skn4ahnpgx"
			$.ajax({
				url: movieZipURL,
				method: "GET"
			}).done(function(response){
				console.log(response);
				$(".diningEvent").slideUp("fast", function(){
				$(".filmEvent").slideDown("normal");
			});
			})

			
			
		}

		else if ($(this).val() === "Dining"){
			// var diningURL = "https://developers.zomato.com/api/v2.1" + $('.zipInp').val() + '&api_key=9f66ce02ce13cacef3eaaefa8cc3fab7';
			// var clientKey = "2vD3lQM9gR9SrTBk9GlSCn22KwOsvQRxlvBGlnQCf0uHT623NnWpKYruvgX17Ozt";
			// zipURL = "https://www.zipcodeapi.com/rest/"+clientKey+"/info.json/" + $('.zipInp').val() + "/radians";
			// // var diningURL = "https://developers.zomato.com/api/v2.1" +  + '&api_key=9f66ce02ce13cacef3eaaefa8cc3fab7';
			$.ajax({
				url: zipURL,
				method: "GET"
			}).done(function(response){
				console.log(response);
			})
			$(".filmEvent").slideUp("fast", function(){
				$(".diningEvent").slideDown("normal");
			});
		}
	});

	$(".filmEvent").on("change", function(){
		if ($(this).val() === "EventDefault"){
			$(".films").slideUp("fast");
		}

		else {
			$(".films").slideDown("normal");
			
		}

	});

	$(".films").on("change", function(){
		if ($(this).val() === "EventDefault"){
			$(".filmTimes").slideUp("fast");
		}

		else {
			$(".filmTimes").slideDown("normal");
			
		}

	});

	$(".filmTimes").on("change", function(){
		if ($(this).val() === "EventDefault"){
			$(".friendFindSubmit").slideUp("fast");
		}

		else {
			$(".friendFindSubmit").slideDown("normal");
			
		}

	});

	$(".interest").on("click", function(){
		if ($(this).attr("data-selected") === "false"){
			$(this).css("background", "#ffa9be");
			$(this).css("border", "1px solid #c4536f");
			$(this).attr("data-selected", "true");
		}

		else {
			$(this).css("background", "white");
			$(this).css("border", "1px solid darkgrey");
			$(this).attr("data-selected", "false");
		}
	})

})