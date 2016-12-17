// 	
//Liri checks for the following input: 
// To run type ' node liri.js app-phrase name1'
//   app-phrase = (my-tweets, movie-this, spotify-this-song, do-what-it-says)
//   name1 = name or song requested	
// ****** my-tweets	Shows last 10 - 20 tweets	
// ****** spotify-this-song	Display artist, song name, preview link, album name,
// song name	
// ****** movie-this	Return title, year, IMDB rating, country, language, plot,
// actors, rating, rating URL	
// ****** do-what-it-says	This will run the first command in the txt file	

//  1. grab the data from keys.js. Then store the keys in a variable kyOfTwitter.

/////   +++++++++++++++++++++++++

var appPhrase = process.argv[2];
var name1 = process.argv[3];

var request = require('request');
var fs = require('fs');

var params = {screen_name: 'dee_terwilliger', count: 20};


// 2. check which app going to run, check if there is a value in
//     process.arg[3] which is name1, then run corresponding functions

switch (appPhrase) {
    case 'my-tweets':
        myTweets();
        break;
    case 'movie-this':
    	// if no name1 (process.argv[3]) argument, assign a value
    	if ((name1 == null) || (name1 == undefined)) {
        	name1 = 'Mr Nobody';
    	}
        movieThis(name1);
        break;
    case 'spotify-this-song':
    	// if no name1 (process.argc[3]) argument, assign a value
    	if ((name1 == null) || (name1 == undefined)) {
        	name1 = 'the sign';
    	}
        spotifyThisSong(name1);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
    // if do not provide correct app command console.log message    
    console.log("Use my-tweets, movie-this, spotify-this-song, do-what-it-says");

}

// end main control section


// -------function Section --------------

// my-tweets function
function myTweets() {
	var Twitter = require('twitter');
	var kyOfTwitter = require('./keys.js');
	var client = new Twitter(kyOfTwitter.twitterKeys);

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && (response.statusCode === 200)) {
            fs.appendFile('log.txt', 
            	('------- Twitter Entry Begins ----------\r\n' + 
            		Date() +  '\r\n \r\nDATA OUTPUT:\r\n'), 
            	    function(err) {
                		if (err) throw err;
                    });
            console.log(' ');
            console.log('Last 20 Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var cnter = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('log.txt', (cnter + '. Tweet: ' + tweets[i].text 
                	+ '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('log.txt', ('------ Twitter Entry Ends -----\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
} 
// end myTweets function

//  movieThis function prints out the movie info 
function movieThis(value) {
    
    request('http://www.omdbapi.com/?t=' + value + '&tomatoes=true&r=json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsonBody = JSON.parse(body);
            console.log(' ');
            console.log('Title: ' + jsonBody.Title);
            console.log('Year: ' + jsonBody.Year);
            console.log('IMDb Rating: ' + jsonBody.imdbRating);
            console.log('Country: ' + jsonBody.Country);
            console.log('Language: ' + jsonBody.Language);
            console.log('Plot: ' + jsonBody.Plot);
            console.log('Actors: ' + jsonBody.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonBody.tomatoURL);
            console.log(' ');
            fs.appendFile('log.txt', ('----------Movie This Entry Begins --------\r\n' 
            	+ Date() +  '\r\nOutput Information:\r\n' + 'Title: ' 
            	+ jsonBody.Title + '\r\nYear: ' + jsonBody.Year + '\r\nIMDb Rating: ' 
            	+ jsonBody.imdbRating + '\r\nCountry: ' + jsonBody.Country 
            	+ '\r\nLanguage: ' + jsonBody.Language + '\r\nPlot: ' + jsonBody.Plot 
            	+ '\r\nActors: ' + jsonBody.Actors + '\r\nRotten Tomatoes Rating: ' 
            	+ jsonBody.tomatoRating + '\r\nRotten Tomatoes URL: ' 
            	+ jsonBody.tomatoURL 
            	+ '\r\n --------- Movie This Entry Ends ------\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
} 
//end movie this function



// spotifyThisSong function looks up a song in Spotify puts the info
// to the screen then stores it in log.txt
function spotifyThisSong(value) {
    
    request('https://api.spotify.com/v1/search?q=' + value + '&type=track', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsonBody = JSON.parse(body);
            console.log(' ');
            console.log('Artist: ' + jsonBody.tracks.items[0].artists[0].name);
            console.log('Song: ' + jsonBody.tracks.items[0].name);
            console.log('Preview Link: ' + jsonBody.tracks.items[0].preview_url);
            console.log('Album: ' + jsonBody.tracks.items[0].album.name);
            console.log(' ');
            fs.appendFile('log.txt', ('-------- Entry Spotify Begins-------\r\n' 
            	+ Date() + '\r\n \r\nOutput Information:\r\n' + 'Artist: ' 
            	+ jsonBody.tracks.items[0].artists[0].name + '\r\nSong: ' 
            	+ jsonBody.tracks.items[0].name + '\r\nPreview Link: ' 
            	+ jsonBody.tracks.items[0].preview_url + '\r\nAlbum: ' 
            	+ jsonBody.tracks.items[0].album.name 
            	+ '\r\n-------- Entry Spotify Ends ---------\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
} 
// end spotifyThisSong function



// doWhatItSays function that reads input from a text file to 
// run one of the apps  
function doWhatItSays() {
	// random.txt  ==>  app,"title"
    fs.readFile('random.txt', 'utf8', function(error, rdData) {
    	var sampleTextArr = rdData.split(',');
    	switch (sampleTextArr[0]) {
    		case 'my-tweets':
        		myTweets();
        		break;
    		case 'movie-this':
        		movieThis(sampleTextArr[1]);
        		break;
    		case 'spotify-this-song':
        		spotifyThisSong(sampleTextArr[1]);
        		break;
        	default:
        		console.log(error);
		}
	});
} 
// end doWhatItSays function

//  end of program



