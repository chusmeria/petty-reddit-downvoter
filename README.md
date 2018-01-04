# petty-reddit-downvoter

For those of us who enjoy things like [/r/pettyrevenge](https://www.reddit.com/r/pettyrevenge/), this is a NodeJS CLI tool that uses [snoowrap](https://github.com/not-an-aardvark/snoowrap) to downvote people that annoy you... or whatever. The PRD will downvote any number of targets that you list, and takes commands using the `-t` or `--targets` flag and defaults to their 50 most recent comments. You can increase the number of comments to downvote using the `-l` or `--limit` flag, but just remember that only comments made within the past month will be downvoted. See the future updates section below about expectations for better error handling and reporting in the future.

Let's get petty with it!

# installing
1. `git clone repo`
2. `cd petty-reddit-downvoter`
3. `yarn` or `npm install`
4. Add credentials in `client_credentials.json`
    - If you do not have reddit credentials you can get your oauth2 client id and client secret using [Reddit's Guide](https://github.com/reddit/reddit/wiki/OAuth2)

# simple downvoting
1. `cd ../petty-reddit-downvoter`
2. `node index.js --targets username1 username2 username3 -l `
    - If you have someone you want to downvote frequently, go ahead and pop their name into their username into the yargs target.default array! Then push the button every few days because... fuck 'em, amirite?

# notes on functionality
The current setup of PRD should avoid calls to comments older than 30 days. If all targets are downvoted successfully you'll get an stdout object letting you know the results of the PRD in an array called `messages` of objects structured as
```
{
    target: nameOfTarget,
    successfullyDownvoted: count,
        olderThanThirty: count of comments older than 30 days,
        fiveOhThreeErrors: count of 503 errors encountered while downvoting
}
```
Please note that `messages[index].fiveOhThreeErrors` only includes a count of downvotes that threw 503s and not entire targets. If the entire target request throws a 503 error, stdout will print a message that says `There was a 503 error (reddit is busy) when trying to downvote gallowboob. Try getting petty with it later and make sure to spam the shit out of reddit admins in a pettyway about how bad their servers are.This is what was done before the error [messages]`. This is somewhat ugly because if you catch several 503 errors it makes the console messy. 

# future updates
1. Ratelimit management. 
    - Will add the ability to check ratelimit availability. The script only checks to see if the number of targets and the number of comments multiplied together will be greater than 600. The ratelimit as defined by the reddit API is 600 requests per minute. This is largely done because no one wants to wait 5 minutes just to downvote someone 300 times when there is no reason to wait.
    - If you are expecting to downvote more than 600 posts in 10 minutes, add the key-value pair `requestDelay: 1000` to the `r.config({})` object to avoid API ratelimit errors. 
2. Submission downvotes.
    - The script will not downvote submissions, just comments. 
3. Remove the number of console.logs for dates that are older than 30 days and include them in a single output
4. Better reporting and error handling.
    - I've never used promises before, so after a few hours of looking into them I've done my best. Currently, this throws errors in odd spots, and it prints stuff out somewhat randomly.  If a 503 error is thrown while downvoting people, then 