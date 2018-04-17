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
      default: ["F0REM4N", "spez", "gallowboob"]
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

r.config({ retryErrorCodes: [503] });

const targets = argv.targets;

let messages = [];

let downvotePromises = [];

let count = 0;

const errorFiveOhThree =
  'StatusCodeError: 503 - "<!doctype html><html><title>Ow! -- reddit.com</title><style>body{text-align:center;position:absolute;top:50%;margin:0;margin-top:-275px;width:100%}h2,h3{color:#555;font:bold 200%/100px sans-serif;margin:0}h3,p{color:#777;font:normal 150% sans-serif}p{font-size: 100%;font-style:italic;margin-top:2em;}</style><img src=//www.redditstatic.com/trouble-afoot.jpg alt=""><h2>all of our servers are busy right now</h2><h3>please try again in a minute</h3><p>(error code: 503)';

const getData = async () => {
  const targetsToMap = await targets.map(async (target, index, array) => {
    console.log(`Starting to downvote ${target}`);

    messages.push({
      target: target,
      successfullyDownvoted: 0,
      olderThanThirty: 0,
      fiveOhThreeErrors: 0
    });
    await r
      .getUser(target)
      .getComments({ limit: argv.limit })
      .then(comments =>
        comments.map(comment => {
          if (
            moment.utc().diff(moment.unix(comment.created_utc), "days") > 30
          ) {
            ++messages[index].olderThanThirty;
          } else {
            downvotePromises.push(
              r
                .getComment(comment.id)
                .downvote()
                .then(++messages[index].successfullyDownvoted)
                .catch(function(err) {
                  ++messages[index].fiveOhThreeErrors;
                })
            );
          }
        })
      )
      .catch(console.log);

    return messages;
  });

  Promise.all(targetsToMap)
    .then(downvotingResults =>
      console.log("complete", new Set(downvotingResults[0]))
    )
    .catch(console.log);
};

getData();
