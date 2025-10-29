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
			activityTracker[activity] = { totalDistance: 0, logs: 0, weekday: 0, weekend: 0 };
		}

		activityTracker[activity].totalDistance += distance;
		activityTracker[activity].logs += 1;

		const tweetTime = new Date(tweet.time);
		const dayWeek = tweetTime.getDay();
		const categorizedDOW = (dayWeek === 0 || dayWeek === 6) ? "weekend" : "weekday";
		// console.log(categorizedDOW);
		// console.log(activityTracker[activity].categorizedDOW);
		activityTracker[activity][categorizedDOW] += distance;
	});

	document.getElementById('numberActivities').innerText = Object.keys(activityTracker).length;
	// console.log(activityTracker);

	const activityLogs = Object.entries(activityTracker);
	activityLogs.sort((a, b) => b[1].logs - a[1].logs);

	const topThree = activityLogs.slice(0, 3);

	document.getElementById('firstMost').innerText = topThree[0][0];
	document.getElementById('secondMost').innerText = topThree[1][0];
	document.getElementById('thirdMost').innerText = topThree[2][0];

	topThree.sort((a, b) => b[1].totalDistance - a[1].totalDistance);

	document.getElementById('longestActivityType').innerText = topThree[0][0];
	document.getElementById('shortestActivityType').innerText = topThree[2][0];

	// const dateLogs = tweet_array.map(tweet => { })

	// const daysWeekCounts = { weekday: 0, weekend: 0 };
	// tweet_array.forEach(tweet => 
	// 	if (tweet.activityType == "")
	// );

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