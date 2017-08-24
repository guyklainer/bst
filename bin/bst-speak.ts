#!/usr/bin/env node
import * as program from "commander";
import {Global} from "../lib/core/global";
import {SilentEchoClient} from "../lib/external/silent-echo";

program.version(Global.version());

program
    .usage("[options] <utterance>")
    .option("-t, --token <token>", `The token for interacting with your virtual Alexa device - get it here:\n" +
        "https://apps.bespoken.io/dashboard/validation\n" +
        "(Bespoken Dashboard account required for use of this feature)`)
    .description("Speaks to your virtual Alexa device")
    .action(async function () {
        // To handle utterances with multiple words, we need to look at the args
        let utterance: string = "";
        for (let i = 0; i < program.args.length; i++ ) {
            let arg = program.args[i];
            if (typeof arg !== "string") {
                break;
            }

            if (utterance.length > 0) {
                utterance += " ";
            }
            utterance += arg;
        }

        // Just by casting program to options, we can get all the options which are set on it
        const options: any = program;
        const token = options.token;

        let silentEchoResponse;
        try {
            silentEchoResponse = await SilentEchoClient.speak(utterance, token);
        } catch (error) {
            if (error.message === "Token Required") {
                console.log("You need a token for this option to work, get it here:");
                console.log();
                console.log("\thttps://apps.bespoken.io/dashboard/validation");
                console.log("\t(Bespoken Dashboard account required for use of this feature)");
                console.log();
                console.log("Then try again with:");
                console.log();
                console.log("\tbst speak --token <ProvidedToken> <Speech to try>");
                console.log();
                process.exit(0);
                return;
            }
            // Different issue, we throw to be catch by the general error handler.
            throw error;
        }

        if (token) {
            console.log("Token Message:");
        }

        console.log("Transcript:");
        console.log();
        console.log(silentEchoResponse.);
        console.log("\t(Bespoken Dashboard account required for use of this feature)");
        console.log();
        console.log("Then try again with:");
        console.log();
        console.log("\tbst speak --token <ProvidedToken> <Speech to try>");
        console.log();

    });

// Forces help to be printed
if (process.argv.slice(2).length === 0) {
    program.outputHelp();
}

Global.initializeCLI().then(
    () => program.parse(process.argv)
);

