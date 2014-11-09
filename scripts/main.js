// $(document).ready(function() {$('#genre').multiselect(
// 	{ 
// 		maxHeight: 150,  enableCaseInsensitiveFiltering: true, buttonClass: 'btn btn-link', 
// 		buttonText: function(options, select) 
// 					{
// 		                if (options.length === 0) {
// 		                    return '';
// 		                }
// 		                else if (options.length > 2) {
// 		                    return options.length + ' selected';
// 		                }
// 		                 else {
// 		                     var labels = [];
// 		                     options.each(function() {
// 		                         if ($(this).attr('label') !== undefined) {
// 		                             labels.push($(this).attr('label'));
// 		                         }
// 		                         else {
// 		                             labels.push($(this).html());
// 		                         }
// 		                     });
// 		                     return labels.join(', ') + ' ';
// 		                 }
// 		            }
		
// 	});
// });


$("#username").focus();
searchQuery = document.getElementById('artist')
genre_id = document.getElementById('genre')
var language = {}
MakePlaylist = document.getElementById('makePlaylist')
var mxmAPI_base = 'https://api.musixmatch.com/ws/1.1/'
var apiKey = 'd8951a826384c648324e206c942b5cce'
var tagAPI_base = 'http://glacial-hollows-8890.herokuapp.com/lyrics_analysis/v1.0'
var chordAPI_base = 'http://ec2-54-194-213-147.eu-west-1.compute.amazonaws.com/chord_analysis/v1.0/chords?trackID='//'http://ec2-54-194-130-174.eu-west-1.compute.amazonaws.com/chord_analysis/v1.0/chords?trackID='
var chordAPIUrl = 'http://ec2-54-194-213-147.eu-west-1.compute.amazonaws.com/media' //'http://ec2-54-194-130-174.eu-west-1.compute.amazonaws.com/media'
var mxmAPI_base_new = 'http://ec2-54-165-48-238.compute-1.amazonaws.com:8080/ws/1.1/macro.subtitles.get?app_id=musixmatch-rd-v1.0&usertoken=74b62c7030d940b2c0e9d3cc97a42f4bc531e9501479cd9e' //'http://apic.musixmatch.com/ws/1.1/'
var echonest_base = 'http://developer.echonest.com/api/v4/track/profile?api_key='
var echonest_song_base = 'http://developer.echonest.com/api/v4/song/profile?api_key='
var echonest_search_base = 'http://developer.echonest.com/api/v4/song/search?api_key='
var echonest_api_key = 'UUZDTANXIMNN98YW6'
var musicbrainz_base = 'http://musicbrainz.org/ws/2'
var spotify_auth_base = 'https://accounts.spotify.com/authorize'
var spotify_client_ID = '14fb55b1df36454793caa07ab8abefe6'
var spotify_client_secret = 'cf72548f86e8493d8aa38cc881a63ee4'
var duolingoAPI_base = 'http://ec2-54-77-238-210.eu-west-1.compute.amazonaws.com/duolingoHack/v1.0/'
var Aylien_id = 'ed4ad169'
var Aylien_key = '21e2e9d4ea06485722b64a6b65ad360b'
// var musicbrainz

var have_valid_playlist = false
var username = ''

// document.getElementById("genre").innerHTML = ''
genreList = new Array()
for (var i = 0; i < genres["music_genre_list"].length; i++) 
{
	// k = {}
	// k['value'] = genres["music_genre_list"][i]["music_genre"]["music_genre_id"]
	// k['label'] = genres["music_genre_list"][i]["music_genre"]["music_genre_name"]
	// document.getElementById("genre").innerHTML += "<option value=" +genres["music_genre_list"][i]["music_genre"]["music_genre_id"] + ">" + genres["music_genre_list"][i]["music_genre"]["music_genre_name"] + "</option>"						
	// genreList.push(k)
};
// nlform = new NLForm( document.getElementById( 'nl-form' ) )
// console.log(genreList)
// console.log($("#genre"))
// $("#genre").autocomplete({source: genreList, messages: { noResults: '',  results: function() {}}})

function getJSON(url) 
{
	var get_promise = $.getJSON(url);
	//console.log(url)
	return get_promise.then(JSON.stringify).then(JSON.parse);
}

function getLyrics(track) 
{
	var lyrics_URI = mxmAPI_base + 'track.lyrics.get?apikey=b463ed1270b71853d56be5bd776a9b4a&track_id=' + track.track.track_id + '&format=jsonp&callback=?'
	// var lyrics_URI = mxmAPI_base + 'track.subtitles.get?apikey=b463ed1270b71853d56be5bd776a9b4a&track_id=' + track.track.track_id + '&subtitle_format=stledu'+'&format=jsonp&callback=?'
	lyrics_URI = encodeURI(lyrics_URI)
	// console.log(lyrics_URI)
	//var get_promise = $.getJSON(lyrics_URI);
	//console.log(url)
	
	// console.log(trackWithLyrics)
	return new Promise(function(resolve,reject)
	{
		getJSON(lyrics_URI).then(function(response)
		{
			// console.log(response)
			if(response.message.header.status_code == 200)
			{
				trackWithLyrics = {}
				trackWithLyrics['lyrics'] = response.message["body"].lyrics.lyrics_body
				trackWithLyrics['track'] = track.track
				resolve(trackWithLyrics)
			}
			else
			{
				console.log('Lyrics not found: Track.id - ' + track.track.track_id )
				trackWithLyrics = {}
				trackWithLyrics['lyrics'] = ''
				trackWithLyrics['track'] = track.track

				resolve(trackWithLyrics)
			}
		});
	})
		//console.log(url)
		//return getJSON(url);
}

function getArtistMbid(artist)
{
	var artist_URI = mxmAPI_base + 'artist.search?apikey=d8951a826384c648324e206c942b5cce&q_artist=' + artist + '&format=jsonp&callback=?'
	artist_URI = encodeURI(artist_URI)
	
	return new Promise(function(resolve,reject)
	{
		getJSON(artist_URI).then(function(response)
		{
			if(response.message.header.status_code == 200)
			{
				artist_mbid = response.message["body"].artist_list[0].artist.artist_mbid
				// console.log(artist_mbid)
				// console.log(response)
				resolve(artist_mbid)	
			}
			else
			{
				reject("artist not found")
			}
			
		})
	}) 
}

function filterAlbums(album_list)
{
	studio_album_list = new Array()
	// console.log(album_list)
	tr = 0
	return new Promise(function(resolve,reject)
	{
		for (var i = 0; i < album_list.length; i++) 
		{
			// Things[i]
			// console.log(album_list[i])
			if(album_list[i]["primary-type"] == "Album")
			{
				if(album_list[i]["secondary-types"].length == 0)
				{
					// console.log(album_list[i])
					
					if( (album_list[i]["first-release-date"].match(/-/g)||[]).length == 2 )
					{
						console.log(album_list[i])
						tr = tr+1
						studio_album_list.push(album_list[i]["id"])
					}
				}
			}
			// if
		}
		console.log("Number of albums " + tr)
		resolve(studio_album_list)
	})
}

function getAlbumMbidsFromReleaseGroups(release_group_id)
{
	release_Uri = musicbrainz_base +'/release-group/'+ release_group_id + '?inc=releases&fmt=json'
	release_Uri = encodeURI(release_Uri)
	// console.log(release_group_id)
	return new Promise(function(resolve,reject)
	{
		getJSON(release_Uri).then(function(response)
		{
			console.log(response)
			albumObj = {}
			albumObj["id"] = response.releases[0]["id"]
			albumObj["release_date"] = response["first-release-date"]
			albumObj["title"] = response["title"]
			// resolve(response.releases[0]["id"])
			resolve(albumObj)
		})
	})
}

// function getTracksFromAlbum_Mbid(album_mbid)
function getTracksFromAlbum_Mbid(albumObj)
{
	// release_Uri = musicbrainz_base +'/release-group/'+ release_group_id + '?inc=releases&fmt=json'
	// release_Uri = encodeURI(release_Uri)
	// console.log(release_group_id)
	var tracks_URI = mxmAPI_base + 'album.tracks.get?apikey=d8951a826384c648324e206c942b5cce&page=1&page_size=100&album_mbid=' + albumObj["id"] + '&format=jsonp&callback=?'
	tracks_URI = encodeURI(tracks_URI)
	trackObject = {}

	return new Promise(function(resolve,reject)
	{
		getJSON(tracks_URI).then(function(response)
		{
			if(response.message.header.status_code == 200)
			{
				Promise.some(response.message["body"].track_list.map(getLyrics), response.message["body"].track_list.length).then(function(res)
				{
					// console.log(res)
					album = new Array()
					for (var i = 0; i < res.length; i++) 
					{
						albumTracks = {}
						albumTracks["lyrics"] = res[i]["lyrics"]
						albumTracks["track"] = res[i]["track"]
						albumTracks["release_date"] = albumObj["release_date"]
						albumTracks["id"] = albumObj["id"]
						albumTracks["album_title"] = albumObj["title"]
						album.push(albumTracks)
					}

					resolve(album)
				}).error(function(e){console.log(e)})
			}
			else
			{
				console.log("album tracks NOT FOUND " + album_mbid)
				album = []
				resolve(album)
				// reject("album tracks not found")	
			}
			
		})
	})
}

function getArtistAlbumMbids(artist)
{
	return new Promise(function(resolve,reject)
	{
		getArtistMbid(artist).then(function(response)
		{
			album_Uri = musicbrainz_base + '/artist/'+ response + '?inc=release-groups&fmt=json'
			album_Uri = encodeURI(album_Uri)
			console.log(album_Uri)
			getJSON(album_Uri).then(function(musicbrainz_response)
			{
				filterAlbums(musicbrainz_response["release-groups"]).then(function(releaseGrpsList)
				{
					// console.log(releaseGrpsList)
					Promise.some(releaseGrpsList.map(getAlbumMbidsFromReleaseGroups), releaseGrpsList.length).then(function(result)
					{
						// console.log(result)
						Promise.some(result.map(getTracksFromAlbum_Mbid), result.length).then(function(allAlbumLyrics)
						{
							// console.log(allAlbumLyrics)
							// console.log('here1')
							resolve(allAlbumLyrics)
						}).error(function(e){console.log(e)})
					}).error(function(e){console.log(e)})
				})
			})
		})
	})
}


function generatePlaylist(wrds,language_code, leeway) //enter URI which has tracklist to build playlist of related tracks. search_with_words is a flag to accomodate different kind of JSON response structure fetched from the seed_URI
{
	words = new Array()
	lyricWords = new Array()
	// console.log(typeof(language.value[0]))
	lan = language.value[0]
	stpWords = stopwords[(language.value[0]).toLowerCase()]
	// console.log(stopwords)
	genre_id = document.getElementById('genre')
	// console.log(genre_id.value)
	console.log(genre_id.selectedOptions.length)
	var stemmer = new Snowball(language.value[0])

	wrds.forEach(function(word)
	{
		if(stpWords.indexOf(word.toLocaleLowerCase()) == -1)
		{
			// words.push(word.toLocaleLowerCase())
			stemmer.setCurrent(word.toLocaleLowerCase())
			stemmer.stem()
			words.push(stemmer.getCurrent())
		}
	})

	final_playlist_ids = new Array()
	final_playlist_tracks = new Array()
	seed_track_ids = new Array()
	url_list = new Array()
	var repeatFlag = false
	var seed_URI = mxmAPI_base + 'track.search?apikey=b463ed1270b71853d56be5bd776a9b4a&s_track_rating=desc&page_size=100&f_lyrics_language=' + language_code +'&f_music_genre_id=' //genre_id.value +'&format=jsonp&callback=?'
	console.log(typeof(genre_id.selectedOptions))
	
	for (var i = 0; i < genre_id.selectedOptions.length; i++) 
	{
		console.log(genre_id.selectedOptions[i].value)
		url_list.push(encodeURI(seed_URI + genre_id.selectedOptions[i].value +'&format=jsonp&callback=?'))
	}

	// seed_URI = encodeURI(seed_URI)
	console.log(url_list)
	leeway = 60
	playlistLength = 0
	console.log(words)
	console.log(wrds)
	//http://api.musixmatch.com/ws/1.1/track.search?apikey=b463ed1270b71853d56be5bd776a9b4a&f_lyrics_language=it&s_track_rating=desc
	// document.getElementById("progress").style.display = "inline-block"
	// $("#status").text("Searching musixmatch for songs with words in your vocabulary. You have " + wrds.length() + " words in your vocabulary")
	$("#status").text("Your 'current language' on Duolingo is " + language.value[0] + ". Searching tracks with words in your Duolingo vocabulary.")
	return new Promise(function(resolve,reject)
	{
		Promise.all( url_list.map(getJSON)).then(function(responses)
		{
			//console.log(123)
			//console.log(response)
			console.log('here0')
			Promise.all(responses.map(function(response)
			{
					console.log('here1')
					// return new Promise(function(resolve,reject)
					// {
						console.log('here2')
						if (response.message.header.status_code == 200)
						{	
							//console.log(3)
							track_list = response.message.body.track_list
							
							if (track_list.length >=1)
							{
								return Promise.all(track_list.map(getLyrics)).then(function(values)
								{
									// console.log(values)
									console.log(values)
									values.forEach(function(trackObject)
									{
										//console.log(trackObject)
										notFound = 0
										if(trackObject.lyrics.message.header.status_code == 200)
										{
											var lyrics = trackObject.lyrics.message['body'].lyrics.lyrics_body
											// lyrics = lyrics.replace(/↵/g,"")
											// console.log(lyrics.replace(/↵/,''))
											var lyricsP = lyrics.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"") //lyrics.replace('\n',' ')
											var lyricsFinal = lyricsP.replace(/\s{2,}/g," ") //.replace('\t',' ')
											lyricWords = lyricsFinal.replace(/\n/g,' ').split(' ')
											lyricWords.every(function(Word)
											{
												//console.log(Word)
												if(stpWords.indexOf(Word.toLocaleLowerCase()) == -1)
												{
													stemmer.setCurrent(Word.toLocaleLowerCase())
													stemmer.stem()
													// words.push(stemmer.getCurrent())
													if(words.indexOf(stemmer.getCurrent()) == -1)
													{
														notFound = notFound +1
													}
													// console.log(Word)
												}
												if(notFound > leeway)
												{
												// console.log(notFound)
													return false
												}
												if(notFound <= leeway)
												{
													return true
												}
											})
											
											if (notFound <= leeway) 
											{
												// console.log(notFound)
												// console.log(lyricWords)
												// console.log(words)
												playlistLength = playlistLength +1
												final_playlist_ids.push(trackObject.track.track_spotify_id)
												// return true
											}
											// if(notFound > leeway)
											// {
											// 	return false
											// }	
										}
									})	
									// console.log(playlistLength)
							
								})
							}
							else
							{
								console.log('empty genre')
								// resolve('asd')
							}
						}

						// resolve(playlistLength)
						// else
						// {
						// 	reject(Error(response.message))
						// }
						// console.log('here1')
					// })
			})).then(function(){
				console.log('here3')
				resolve(final_playlist_ids)})	
				// console.log('here2')
		})
	})	
}
	
function getUsernameAndLanguage()
{
	var seed_query = duolingoAPI_base + 'languages.get?username=' + searchQuery.value + '&format=jsonp&callback=?'
	seed_query = encodeURI(seed_query)
	username = searchQuery.value
	$("#status").text("Fetching duolingo data")
	// document.getElementById("progress").style.display = "inline-block"
	console.log(seed_query)
	return new Promise(function(resolve,reject)
	{
		getJSON(seed_query).then(function(response){
			console.log(response)
			console.log(response['lang'])
			language['value'] = response['lang']
		
			resolve(language)
			// document.getElementById("genreHolder").style.display = "inline-block"
			// document.getElementById("makePlaylist").style.display = "inline-block"
			// $("#status").text("Your 'current language' on Duolingo is " + language['value'] + ". Please select a genre (or multiple genres with ctrl/cmd) and press ''Make Playlist''")
			// document.getElementById("progress").style.display = "none"
		})
	})
		// console.log(words)
}

function getWordsAndMakePlaylist()
{
	console.log(language)
	var seed_query = duolingoAPI_base + 'words.get?username=' + searchQuery.value + '&language='+ language.value[0] + '&format=jsonp&callback=?'
	seed_query = encodeURI(seed_query)
	username = searchQuery.value
	// $("#status").text("Fetching duolingo data")
	// document.getElementById("progress").style.display = "inline-block"
	console.log(seed_query)
	getJSON(seed_query).then(function(response){
		generatePlaylist(response.words,response.language_code, 10).then(function(track_ids)
		{
			console.log('here4')
			console.log(track_ids)

			if(track_ids.length > 0)
			{
				$("#status").text("Making playlist with the tracks found.")
				// <iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:5Z7ygHQo02SUrFmcgpwsKW,1x6ACsKV4UdWS2FMuPFUiT,4bi73jCM02fMpkI11Lqmfe" frameborder="0" allowtransparency="true"></iframe>
				localStorage.setItem('track_ids', JSON.stringify(track_ids));
				localStorage.setItem('playlist-name', 'Musixmatch-Polyglottis'+'-'+language.value[0])
				var src = "https://embed.spotify.com/?uri=spotify:trackset:"+username+'-'+language.value[0]+ ':'+ track_ids.toString()
				//console.log(src)
				$("#status").text("Done!")
				document.getElementById("SpotifyWidget").style.visibility = "visible"
				$('#SpotifyWidget').empty()
				document.getElementById("SpotifyWidget").innerHTML += '<iframe id = "SpotifyWidgetFrame" frameborder="0" allowtransparency="true" width="373" height="453" style = "display:inline"></iframe>'
				document.getElementById("SpotifyWidgetFrame").src = src
				//console.log(document.getElementById("SpotifyWidget").innerHTML)
				
				have_valid_playlist = true
				// document.getElementById("progress").style.display = "none"
				
				return Promise.resolve()
			}
			else
			{
				$("#status").text("No tracks found. Either your duolingo vocabulary is not large or no songs in the chosen genre. Please select a more popular genre.")
				return Promise.reject()
			}
		}, function(error){
				console.log(error)
				// $("#status").text("No songs found with these search terms. Try again please.")
				return Promise.reject()
			}).then(function()
			{
				//console.log('love')
				//document.getElementById("SpotifySave").disabled = false
				document.getElementById("SpotifySave").style.display = "inline-block"

			})

	})
	
}

function songAnalysis(song)
{
	lyrics = song.lyrics.split('\n')
	return new Promise(function(resolve,reject)
	{

		Promise.all(lyrics.map(sentimentPhrase)).then(function(songSentiments)
		{
			positiveScore = 0
			negativeScore = 0
			for (var k = 0; k < songSentiments.length; k++) 
			{
				
				if(songSentiments[k]["type"] == "positive")
				{
					positiveScore = positiveScore + songSentiments[k]["score"]
				}
				if(songSentiments[k]["type"] == "negative")
				{
					negativeScore = negativeScore + songSentiments[k]["score"]
				}
			}
			song["positiveScore"] = positiveScore
			song["negativeScore"] = negativeScore
			// console.log('here3')
			resolve(song) 
		})
	})
}

function albumAnalysis(album)
{
 	return new Promise(function(resolve,reject)
 	{
 		// console.log('here2')
 		Promise.all(album.map(songAnalysis)).then(function(albumSentiments)
 		{
 			positiveAlbumScore = 0
 			negativeAlbumScore = 0
 			for (var i = 0; i < albumSentiments.length; i++) 
 			{
 				positiveAlbumScore = positiveAlbumScore + albumSentiments[i]["positiveScore"]
 				negativeAlbumScore = negativeAlbumScore + albumSentiments[i]["negativeScore"]
 			}
 			album = {}
 			album["tracks"] = albumSentiments
 			album["positiveScore"] = positiveAlbumScore
 			album["negativeScore"] = negativeAlbumScore
 			resolve(album)
 		})	
 	})
}

function doAnalysis(discography)
{
	return new Promise(function(resolve,reject)	
	{	
		// console.log('here1')
		Promise.all(discography.map(albumAnalysis)).then(function(discographySentiments)
		{
			resolve(discographySentiments)
		})
	})
}


// var chart = new google.visualization.WordTree(document.getElementById('wordtree_basic'));
// function readyHandler() 
// {	
// 		// console.log('asda')
// 		// console.log('The user selected' + chart.getSelection());
// 		console.log('asdzxczxc')
// 		// google.visualization.events.addListener(chart, 'select', selectHandler)
// }

// function selectHandler()
// {
// 	console.log('selection')
// 	debugger
// 	chart.getSelection()
// }

$("#wordtree_basic").click(function(event){
    console.log('clicked')
    console.log(chart.pE.Mk["label"])
});

function drawChart(lyricsPhrases) 
{
	// console.log(lyricsPhrases)
	
	dataArray = [['Phrases']]
	// tempArr = new Array()
	// tempArr.push(lyricsPhrases)
	for (var i = 0; i < lyricsPhrases.length; i++) {
		// Things[i]
		
		if (lyricsPhrases[i] != "")
		{
			tempArr = new Array()
			tempArr.push(lyricsPhrases[i])
			dataArray.push(tempArr)
		}
	};
	console.log(dataArray.length)
	// dataArray.push(lyricsPhrases)
	console.log(dataArray)
	var data = google.visualization.arrayToDataTable(dataArray)
	// console.log(data)
	
	chart.draw(data, {'format': 'implicit', 'word': 'of', 'type': 'double'});
	// console.log('asd')
	// google.visualization.events.addListener(chart, 'select', selectHandler)
	// console.log('asd')
        // var data = google.visualization.arrayToDataTable(
        //   [ ['Phrases'],
        //     ['cats are better than dogs'],
        //     ['A heart that is full up like a landfill'], 
        //    ['A job that slowly kills you'], 
        //    ['Bruises that won'], 
        //    [''], 
        //    ['You look so tired, unhappy'], 
        //    ['Bring down the government'], 
        //    ['They don, they don speak for us'], 
        //    [''], 
        //    ['Ill take a quiet life'], 
        //    ['A handshake of carbon monoxide'], 
        //    ['No alarms and no surprises'], 
        //    ['No alarms and no surprises'], 
        //    ['No alarms and no surprises'], 
        //    ['Silent'],
        //    ['Silent'], 
        //    [''], 
        //    ['This is my final fit'], 
        //    ['My final bellyache with'], 
        //    ['No alarms and no surprises'],
        //    ['No alarms and no surprises'], 
        //    ['No alarms and no surprises please'], 
        //    [''], 
        //    ['Such a pretty house'], 
        //    ['And such a pretty garden'],
        //    ['No alarms and no surprises'], 
        //    ['No alarms and no surprises'], 
        //    ['No alarms and no surprises please'], 
        //    ['INSTRUMENTAL'], 
        //    ["Don't forget that you are our son"], 
        //    ['Now go back to bed'], 
        //    [''], 
        //    ["We just know that you'll do well"], 
        //    ["You won't come to harm"], 
        //    [''], 
        //    ['Death to all who stand in your way'],
        //    ['Wake my dear'], ["Dressed in Bishop's robes"], 
        //    ['Terrifies me still'], 
        //    ["In Bishop's robes"], 
        //    ['Bastard headmaster'], 
        //    [''], 
        //    ['I am not going back'], 
        //    ['I am not going back'], 
        //    ['I am not going back'], 
        //    [''], 
        //    ['Children taught to kill'], 
        //    ['To tear themselves to bits'],
        //    ['On playing fields'], 
        //    ["Dressed in Bishop's robes"], 
        //    [''], 
        //    ['I am not going back'], 
        //    ['I am not going back'], 
        //    ['I am not going back'], 
        //    ['How do you get your teeth so pearly?'], 
        //    ['Dewdrop dentures'], 
        //    ['White-washed fences'], 
        //    ['She runs from the third world pearly'], 
        //    [''], 
        //    ['Vanilla (feel it crawl to me)'], 
        //    ['Milkshakes (crawl back again)'], 
        //    ['From hard rock (whatever you say)'], 
        //    ['Cafés (it wont go away)'], 
        //    ['That is where (I feel it crawl to me)'], 
        //    ['She got her (crawl back again)'], 
        //    ['Sweet tooth (it will not go away)'], 
        //    ['For white boys (whatever you say)'], 
        //    [''],
        //    ['She runs from the third world pearly'], [''], ['Hurts me'], ['Darling use me'], ['Darling use me'], ['Darling use me'], ['If I get old, I will not give in'], ['But if I do, remind me of this'], ['Remind me that'], ['Once I was free'], ['Once I was cool'], ['Once I was me'], [''], ['And if I sit down and cross my arms'], ['Hold me up to this song'], [''], ['Knock me out, smash out my brains'], ['If I take a chair, start to talk shit'], [''], ['If I get old, remind me of this'], ['That we kissed and I really meant it'], ['Whatever happens, if we are still speaking'], ['Pick up the phone, play me this song'], ['Open your mouth wide'], ['The universe will sigh'], ['And while the ocean blooms'], ['It is what keeps me alive'], ['So why does it still hurt?'], ['Do not blow your mind with whys'], [''], ['I am moving out of orbit'], ['(Turning in somersaults)'], ['Turning in somersaults'],
        //   ]
        // );

        //var options = 
          //wordtree: {
            //format: 'implicit',
            //word: 'it'
          //}                
}
// function sentimentPhrase(phrase) 
// {

//     url = 'https://api.aylien.com/api/v1/sentiment'
//     return new Promise(function(resolve,reject){
//     	$.ajax(url, {
//         	type: 'POST',
//         	data: {
//         		"text":phrase
//         	},   	
//         	headers: {
//         		"Accept": "application/jsonp",
//             	"Content-type":  "application/x-www-form-urlencoded",
//       			"X-AYLIEN-TextAPI-Application-ID": Aylien_id,
//       			"X-AYLIEN-TextAPI-Application-Key": Aylien_key
//         	},
//         	success: function(r) {
//             	console.log(r)
//             	resolve(r);
//         	},
//         	error: function(r) {
//             	reject(null);
//         	},
//         	dataType: 'jsonp',
//         	jsonp: "callback"
//     	})
//     })
// }



function sentimentPhrase(phrase) 
{
	// console.log(phrase)
	url = 'https://twinword-sentiment-analysis.p.mashape.com/analyze/'
    return new Promise(function(resolve,reject){
    	$.ajax(url, {
        	type: 'POST',
        	data: {
        		"text":phrase
        	},   	
        	headers: {
            	"Content-type":  "application/x-www-form-urlencoded",
            	"X-Mashape-Key": "D9IepVrpHYmshbc9QdFqNHTEHf04p1liu0OjsnOISSYUb4QQBu"
        	},
        	
        	success: function(r) 
        	{
        		r = JSON.parse(r)
            	// console.log(typeof(r))
            	sentiment = {}
            	sentiment["type"] = r["type"]
            	sentiment["score"] = r.score
            	// console.log(sentiment)
            	resolve(sentiment);
        	},
        	error: function(r) 
        	{
        		sentiment = {}
        		sentiment["type"] = 'error'
        		sentiment["score"] = 0
        		// console.log(sentiment)
            	resolve(sentiment);
        	},
        	
        	// jsonp: "callback",
        	dataType: 'jsonp'
    	})
    })
}

function removeDuplicates(discography)
{
	for (var i = 0; i < discography.length; i++) 
	{
		// Things[i]
		album = discography[i]
		
		if (album.length == 0)
		{
			discography.splice(i,1)
			continue
		}

		for (var j = 0; j < album.length; j++) 
		{
			trackName = album[j].track.track_name
			for (var k = i+1 ; k < discography.length; k++) 
			{
				delAlbum = discography[k]
				for (var l = 0; l < delAlbum.length; l++) 
				{
					// console.log(delAlbum[l])
					if(trackName == delAlbum[l].track.track_name)
					{
						console.log(trackName)
						console.log(discography[k][l])
						discography[k].splice(l,1)
					}
				}
			}	
		}
	}
	return discography
}


function lyricsForWordTree(discography)
{
	// allPhrases = new Array()
	console.log(discography)
	disco = new Array()
	// allPhrases = ''
	trackArray = new Array()
	for (var i = 0; i < discography.length; i++) 
	{
		album = discography[i]
		pronoun = 0
		poss_pronoun = 0
		release_date = ''
		for (var j = 0; j < album.length; j++) 
		{
			// console.log(album[])
			trackObj = {}
			song = album[j]["lyrics"].split('\n')
			track_pronoun = 0
			track_poss_pronoun = 0
			trackObj['track_name'] = album[j]['track']['track_name']
			trackObj['spotify_id'] = album[j]['track']['track_spotify_id']
			release_date = album[j]['release_date']
			album_title = album[j]['album_title']
			// allPhrases = allPhrases + song + '\n'
			// console.log(song)
			// track_pronoun = 
			for (var k = 0; k < song.length; k++) 
			{
				// allPhrases = allPhrases + song[k] + '.'
				// phrase = new Array()
				// phrase.push(song[k])
				// phrase = ''
				// phrase = "['"  + song[k] + "']"
				// phrase = song[k] 
				// allPhrases = allPhrases 
				// allPhrases.push(song[k])
				// console.log(song[k])
				words = song[k].split(' ')
				for (var l = 0; l < words.length; l++) 
				{
					word = words[l]
					// Things[i]
					// console.log(word)
					if(pronouns.indexOf(word)!=-1)
					{

						pronoun = pronoun+1
						track_pronoun = track_pronoun +1
					}
					if(poss_pronouns.indexOf(word)!=-1)
					{
						// console.log(word)
						poss_pronoun = poss_pronoun+1
						track_poss_pronoun = track_poss_pronoun +1
					}

				}
			}
			trackObj['narcissism'] = Math.floor((track_poss_pronoun/track_pronoun)*100)
			trackArray.push(trackObj)
		}
		newAlbum = {}
		newAlbum['album'] = album
		newAlbum['pronoun'] = pronoun
		newAlbum['poss_pronoun'] = poss_pronoun
		newAlbum['release_date'] = release_date
		newAlbum['album_title'] = album_title
		newAlbum['narcissism'] = Math.floor((poss_pronoun/pronoun)*100)
		disco.push(newAlbum)
	}
	return[disco, trackArray]
}


var tweetTxt = ''
$("#artist").keyup(function(event) {
    if (event.keyCode == 13) 
    {
    	// myStopFunction();
    	
        // $("#status").text("Processing")
        document.getElementById("status2").style.display = "inline"
        getArtistAlbumMbids(searchQuery.value).then(function(allTracks)
        {
        	// console.log(allTracks)
        	// sentimentPhrase("i don't want to be your friend i just want to be your lover")
        	// console.log(allTracks)
        	filteredDiscography = removeDuplicates(allTracks)
        	// console.log(filteredDiscography)
        	// doAnalysis(filteredDiscography)
        	// console.log(finalAlbumList)
        	// return(doAnalysis(filteredDiscography))
        	// return(lyricsForWordTree(filteredDiscography))
        	return filteredDiscography
        })
        .then(function(filteredDiscography)
        {
        	arr = lyricsForWordTree(filteredDiscography)
        	phrases = arr[0]
        	trackArray = arr[1]
        	
        	
        	trackArray.sort(function(a,b){
        	var c = a["narcissism"];
        	var d = b["narcissism"];
        	return d-c;
        	})


			console.log(trackArray)
        	narcissisticPlaylistLength = 15
        	
        	if(trackArray.length < 15)
        	{
        		narcissisticPlaylistLength = trackArray.length	
        	}
        	
        	topTracksData = new Array()
        	playlist = new Array()

        	for (var i = 0; i < narcissisticPlaylistLength; i++) 
        	{
        		topTrack = new Array()
        		topTrack.push(trackArray[i]['track_name'])
        		topTrack.push(trackArray[i]['narcissism'])
        		playlist.push(trackArray[i]['spotify_id'])
        		topTracksData.push(topTrack)
        		
        	}

        	// console.log(topTracksData)
        	// console.log(playlist)
        	phrases.sort(function(a,b){
        	var c = new Date(a["release_date"]);
        	var d = new Date(b["release_date"]);
        	return c-d;
        	})
        	discoData = new Array()
        	pronoun = 0
        	poss_pronoun = 0
        	for (var i = 0; i < phrases.length; i++) 
        	{
        		// Things[i]
        		albumData = new Array()
        		albumData.push(phrases[i]['album_title'])
        		albumData.push(phrases[i]['narcissism']) 
        		discoData.push(albumData)
        		pronoun = pronoun + phrases[i]['pronoun']
        		poss_pronoun = poss_pronoun + phrases[i]['poss_pronoun']
        	}
        	totalNarcissism = Math.floor(poss_pronoun/pronoun*100)

        	console.log(discoData)
        	drawNarcissism(discoData, searchQuery.value)
        	drawTrackNarcissism(topTracksData, searchQuery.value)
        	document.getElementById("status2").style.display = "none"
        	document.getElementById("totalNarcissism").innerHTML = '<p> Total narcissism of '+ (searchQuery.value).toUpperCase() + ': <b>' + totalNarcissism +'</b>%</p>'
        	document.getElementById("status").style.display = "inline"
        	tweetTxt = 'The narcissism level of ' + (searchQuery.value).toUpperCase() +  ' is ' + totalNarcissism + '%'
        	// $('#twitterButton').attr('data-text', )   
        	// twttr.widgets.load()
        	// console.log(document.getElementById("twitter").innerHTML)
        	// ev.preventDefault();
    		// Remove existing iframe
    		playlist_name = 'Top narcissistic tracks of ' + (searchQuery.value).toUpperCase()
    		displayPlaylist(playlist,  playlist_name)
    		$('#tweetBtn iframe').remove();
    				// Generate new markup
   			var tweetBtn = $('<a></a>')
        		.addClass('twitter-share-button')
        		.attr('href', 'http://twitter.com/share')
        		.attr('data-url', 'http://lab.musixmatch.com/narcissism')
        		.attr('data-text', tweetTxt)
        		.attr('data-hashtags',"LyricNarcissism");
    		console.log(tweetTxt)
   			 $('#tweetBtn').append(tweetBtn);
    		twttr.widgets.load();

        	document.getElementById("tweetBtn").style.display = "block"
        	
        	// console.log(phrases)

        	// console.log(discographySentiments)
        	// google.visualization.events.addListener(chart, 'ready', readyHandler)
        	// drawChart(phrases)

        })
		
    }
});

// $('#tweetBtn').on('click', function(ev) {

// });
function displayPlaylist(track_ids, playlist_name)
{
	// console.log('here4')
	console.log(track_ids)
	if(track_ids.length > 0)
	{
		// $("#status").text("Making playlist with the tracks found.")
		// <iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:5Z7ygHQo02SUrFmcgpwsKW,1x6ACsKV4UdWS2FMuPFUiT,4bi73jCM02fMpkI11Lqmfe" frameborder="0" allowtransparency="true"></iframe>
		localStorage.setItem('track_ids', JSON.stringify(track_ids));
		localStorage.setItem('playlist-name', playlist_name)
		var src = "https://embed.spotify.com/?uri=spotify:trackset:"+playlist_name+ ':'+ track_ids.toString()
		//console.log(src)
		// $("#status").text("Done!")
		// document.getElementById("SpotifyWidget").style.visibility = "visible"
		$('#SpotifyWidget').empty()
		document.getElementById("SpotifyWidget").innerHTML += '<iframe id = "SpotifyWidgetFrame" frameborder="0" allowtransparency="true" width="373" height="453" style = "display:inline"></iframe>'
		document.getElementById("SpotifyWidgetFrame").src = src
		document.getElementById("spotifyStuff").style.display = "inherit"


		//console.log(document.getElementById("SpotifyWidget").innerHTML)
		// have_valid_playlist = true
		// document.getElementById("progress").style.display = "none"
				
		// return Promise.resolve()
	}
}

 function drawNarcissism(discoData, artistName) {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Narcissism of ' + artistName + ' albums'
        },
        subtitle: {
            text: 'Source: <a href="http://musixmatch.com/">Musixmatch</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '15px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Narcissism (%)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Narcissism: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'Narcissism',
            data: discoData ,
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
};

function drawTrackNarcissism(discoData, artistName) {
    $('#container2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Top narcissistic tracks of ' + artistName
        },
        subtitle: {
            text: 'Source: <a href="http://musixmatch.com/">Musixmatch</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '15px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Narcissism (%)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Narcissism: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'Narcissism',
            data: discoData ,
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
};

Highcharts.createElement('link', {
   href: 'http://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

// MakePlaylist.onclick = function(e){
	
// 	$('#SpotifyWidget').empty()
// 	document.getElementById("SpotifySave").style.display = "none"
// 	document.getElementById("makePlaylist").style.display = "none"
// 	document.getElementById("status").style.display = "inline-block"
// 	$("#status").text("Searching your vocabulary in this language")
// 	getUsernameAndLanguage().then(function()
// 	{
// 		getWordsAndMakePlaylist();	
// 	});
	
// }

SpotifySave.onclick = function(e){
  loginWithSpotify()
}


// GetImages.onclick = function(e){
// 	getTagsAndImages()
// }

// $(window).blur(function(e){
//     //$('#result').text('Clicked out of the window or on the iframe');
//     console.log('Clicked out of the window or on the iframe')
// })
// SpotifySave.onclick = function(e){
//   loginWithSpotify()
// }