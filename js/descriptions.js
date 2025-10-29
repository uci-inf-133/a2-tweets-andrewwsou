let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_tweets = tweet_array.filter(tweet => (tweet.written && tweet.source == "completed_event"));

	//TODO: Filter to just the written tweets
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const textInputBox = document.getElementById("textFilter");
	const searchCount = document.getElementById("searchCount");
	const searchText = document.getElementById("searchText"); 
	const tweetTable = document.getElementById("tweetTable");
	searchText.textContent = '';
	searchCount.textContent = 0;
	textInputBox.addEventListener("input", () => { 
		const table_matches = written_tweets.filter(tweet => 
			(tweet.writtenText.toLowerCase().includes(textInputBox.value)));
		if (textInputBox.value === "") {
			searchText.textContent = '';
			searchCount.textContent = 0;
			tweetTable.innerHTML = '';
		} else {
			searchText.textContent = textInputBox.value;
			searchCount.textContent = table_matches.length;
			tweetTable.innerHTML = '';
			table_matches.forEach((tweet, index) => {
				const row = document.createElement('tr');

				const rowNum = document.createElement('td');
				rowNum.textContent = index + 1;

				const rowAct = document.createElement('td');
				rowAct.textContent = tweet.activityType;

				const rowTweet = document.createElement('td');
				rowTweet.textContent = tweet.text;

				row.appendChild(rowNum);
				row.appendChild(rowAct);
				row.appendChild(rowTweet);

				tweetTable.appendChild(row);
			})
		}
	 })


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});