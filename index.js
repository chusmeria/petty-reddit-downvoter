"use strict";
const snoowrap = require("snoowrap");
const moment = require("moment");
const argv = require("yargs")
    .options({
        targets: {
            alias: "t",
            describe: "User you want to target with your program",
            demandOption: true,
            type: "array",
            default: ["F0REM4N"]
        },
        limit: {
            alias: "l",
            default: 50,
            demandOption: true,
            type: "number",
            describe:
                "The number of comments you would like to have downvoted. Comments older than 1 month cannot be downvoted."
        }
    })
    .help().argv;
const credentials = require("./client_credentials.json");

// NOTE: Hardcoding credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper

// Use client_credentials.json to pass in credentials

const r = new snoowrap(credentials);

const targets = argv.targets;

const messages = new Set([]);

targets.forEach(target => {
    messages.add(`downvoting ${target}`);
    r
        .getUser(target)
        .getComments({ limit: argv.limit })
        .then(comments =>
            comments.map(comment => {
                r
                    .getComment(comment.id)
                    .downvote()
                    .catch(
                        e =>
                            moment
                                .utc()
                                .diff(
                                    moment.unix(comment.created_utc),
                                    "days"
                                ) > 30
                                ? console.log(
                                      "This comment is 30 days old or older"
                                  )
                                : console.log(e)
                    );
            })
        )
        .then(() => console.log(messages))
        .catch(e => console.log(e));
});
