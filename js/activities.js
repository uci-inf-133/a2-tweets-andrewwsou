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
			activityTracker[activity] = { totalDistance: 0, logs: 0, weekday: 0, weekend: 0, weekdayLogs: 0, weekendLogs: 0 };
		}

		activityTracker[activity].totalDistance += distance;
		activityTracker[activity].logs += 1;

		const tweetTime = new Date(tweet.time);
		const dayWeek = tweetTime.getDay();
		const categorizedDOW = (dayWeek === 0 || dayWeek === 6) ? "weekend" : "weekday";
		// console.log(categorizedDOW);
		// console.log(activityTracker[activity].categorizedDOW);
		activityTracker[activity][categorizedDOW] += distance;
		if (categorizedDOW === "weekend") { activityTracker[activity].weekendLogs += 1; }
		if (categorizedDOW === "weekday") { activityTracker[activity].weekdayLogs += 1; }
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


	let totalWeekdayAvg = 0, totalWeekendAvg = 0;

	for (const activity in activityTracker) {
		const currActivity = activityTracker[activity];

		totalWeekdayAvg += currActivity.weekdayLogs > 0 ? currActivity.weekday / currActivity.weekdayLogs : 0;
		totalWeekendAvg += currActivity.weekendLogs > 0 ? currActivity.weekend / currActivity.weekendLogs : 0;
	}
	// console.log(totalWeekdayAvg);
	const lengthWeekdays = totalWeekdayAvg / Object.keys(activityTracker).length;
	const lengthWeekends = totalWeekendAvg / Object.keys(activityTracker).length;

	if (lengthWeekdays > lengthWeekends) {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekdays";
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
	}

	console.log(activityTracker);



	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "activityType",
			"type": "nominal",
			"title": "Activity"
		},
		"y": {
			"type": "quantitative",
			"aggregate": "count",
			"axis": { "title": "Tweet Amount" }
		}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const top3Names = topThree.map(activity => activity[0]);
	const dayIndexes = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const topThreeGraphing = tweet_array
		.filter(tweet => 
			tweet.source === "completed_event" && top3Names.includes(tweet.activityType) && Number.isFinite(tweet.distance))
		.map(tweet => 
		({ activityType: tweet.activityType, distance: Number(tweet.distance), dayOfWeek: dayIndexes[tweet.time.getDay()]}));

	console.log(topThreeGraphing);


	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances of each type of activity per day of week.",
	  "data": {
	    "values": topThreeGraphing
	  },
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "dayOfWeek",
			"type": "nominal",
			"title": "time (day)",
			"sort": dayIndexes
		},
		"y": {
			"field": "distance",
			"type": "quantitative",
			"axis": { "title": "distance" }
		},
		"color": {
			"field": "activityType", 
			"type": "nominal"
		}
	  }
	};
	// vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	mean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the aggregated mean for top three most tweeted activities and their distances.",
	  "data": {
	    "values": topThreeGraphing
	  },
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "dayOfWeek",
			"type": "nominal",
			"title": "time (day)",
			"sort": dayIndexes
		},
		"y": {
			"aggregate": "mean",
			"field": "distance",
			"type": "quantitative",
			"axis": { "title": "distance" }
		},
		"color": {
			"field": "activityType", 
			"type": "nominal"
		}
	  }
	};
	vegaEmbed('#distanceVis', mean_vis_spec, {actions:false});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});