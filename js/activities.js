function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	const activityTracker = {};
	tweet_array.forEach( tweet => {
		const activity = tweet.activityType;
		const distance = tweet.distance;
		if (!activityTracker[activity]) {
			activityTracker[activity] = { totalDistance: 0, logs: 0 };
		}
		// if (activity == "run") {
		// 	console.log(tweet.text)
		// 	console.log(distance);
		// 	console.log(tweet.text)
		// }
		activityTracker[activity].totalDistance += distance;
		activityTracker[activity].logs += 1;
	});

	document.getElementById('numberActivities').innerText = Object.keys(activityTracker).length;
	console.log(activityTracker);



	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});