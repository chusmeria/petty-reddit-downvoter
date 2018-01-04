# petty-reddit-downvoter

For those of us who enjoy things like [/r/pettyrevenge](https://www.reddit.com/r/pettyrevenge/), this is a NodeJS CLI tool that uses [snoowrap](https://github.com/not-an-aardvark/snoowrap) to downvote people that annoy you... or whatever. The PRD will downvote any number of targets that you list, and takes commands using the `-t` or `--targets` flag and defaults to their 50 most recent comments. You can increase the number of comments to downvote using the `-l` or `--limit` flag, but just remember that only comments made within the past month will be downvoted.

Let's get petty with it!

# installing
1. `git clone repo`
2. `yarn` or `npm install`
3. Add credentials in `client_credentials.json`
    - If you do not have reddit credentials you can get your oauth2 client id and client secret using [Reddit's Guide](https://github.com/reddit/reddit/wiki/OAuth2)

# simple downvoting
1. `cd ../petty-reddit-downvoter`
2. `node index.js --targets username1 username2 username3 -l `
    - If you have someone you want to downvote frequently, go ahead and pop their name into their username into the yargs target.default array! Then push the button every few days because... fuck 'em, amirite?

# future updates
1. Ratelimit management. 
    - Will add the ability to check ratelimit availability. The script only checks to see if the number of targets and the number of comments multiplied together will be greater than 600. The ratelimit as defined by the reddit API is 600 requests per minute. This is largely done because no one wants to wait 5 minutes just to downvote someone 300 times when there is no reason to wait.
2. Submission downvotes.
    - The script will not downvote submissions, just comments. 
3. Remove the number of console.logs for dates that are older than 30 days and include them in a single output
