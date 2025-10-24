function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const times = tweet_array.map( tweet => tweet.time.getTime());
	const earliestTweet = new Date(Math.min(...times)).toLocaleString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
	const latestTweet = new Date(Math.max(...times)).toLocaleString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

	console.log(earliestTweet)
	console.log(latestTweet)
	document.getElementById('firstDate').innerText = earliestTweet;
	document.getElementById('lastDate').innerText = latestTweet;
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});