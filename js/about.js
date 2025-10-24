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

	// console.log(earliestTweet)
	// console.log(latestTweet)
	document.getElementById('firstDate').innerText = earliestTweet;
	document.getElementById('lastDate').innerText = latestTweet;
	

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	


	const tweetCounts = { completed_event: 0, live_event: 0, achievement: 0, miscellaneous: 0 };

	tweet_array.forEach(tweet => tweetCounts[tweet.source]+= 1);

	// console.log(tweetCounts)
	document.querySelectorAll('.completedEvents').forEach(compEvents => compEvents.innerText = tweetCounts.completed_event);
	document.getElementsByClassName('liveEvents')[0].innerText = tweetCounts.live_event;
	document.getElementsByClassName('achievements')[0].innerText = tweetCounts.achievement;
	document.getElementsByClassName('miscellaneous')[0].innerText = tweetCounts.miscellaneous;

	
	const totalTweets = tweet_array.length;

	const compPct = math.format(((tweetCounts.completed_event / totalTweets) * 100), { notation: 'fixed', precision: 2 });
	const livePct = math.format(((tweetCounts.live_event / totalTweets) * 100), { notation: 'fixed', precision: 2 });
	const achievementPct = math.format(((tweetCounts.achievement / totalTweets) * 100), { notation: 'fixed', precision: 2 });
	const miscPct = math.format(((tweetCounts.miscellaneous / totalTweets) * 100), { notation: 'fixed', precision: 2 });

	document.getElementsByClassName('completedEventsPct')[0].innerText = compPct + '%';
	document.getElementsByClassName('liveEventsPct')[0].innerText = livePct + '%';
	document.getElementsByClassName('achievementsPct')[0].innerText = achievementPct + '%';
	document.getElementsByClassName('miscellaneousPct')[0].innerText = miscPct + '%';

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});