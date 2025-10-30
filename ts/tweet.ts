class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}


	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        const currTweet = this.text;

        if (currTweet.startsWith("Just completed") || currTweet.startsWith("Just posted")) {
            return "completed_event";
        } else if (currTweet.startsWith("Watch my")) {
            return "live_event"
        } else if (currTweet.startsWith("Achieved")) {
            return "achievement"
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const currTweet = this.text.slice(0, -35);
        if (currTweet.endsWith("Check it out!")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text.slice(0, -35);;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const currTweet = this.text.split(" ");
        if (currTweet.includes("km")) {
            return currTweet[currTweet.indexOf('km') + 1];
        }
        if (currTweet.includes("mi")) {
            return currTweet[currTweet.indexOf('mi') + 1];
        }
        return currTweet[currTweet.indexOf('a') + 1];
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet
        const currTweet = this.text.split(" ");
        let indexUnit = currTweet.indexOf("mi");
        if (indexUnit != -1) {
            const prev = currTweet[indexUnit - 1]
            const value = parseFloat(prev);
            if (Number.isFinite(value)) { return value };
        }
        indexUnit = currTweet.indexOf("km");
        if (indexUnit != -1) {
            const prev = currTweet[indexUnit - 1]
            const value = parseFloat(prev);
            if (Number.isFinite(value)) { return (value / 1.609) };
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const urlFind = /(https:\/\/[^\s]+)/;
        const clickableLink = this.text.replace(
            urlFind, '<a href="$1" target="_blank">$1</a>'
        );
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + clickableLink + "</td></tr>";
    }
}