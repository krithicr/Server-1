const express = require("express");
// const apicache = require("apicache");

const app = express();
// let cache = apicache.middleware;
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const Path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/", async (req, res) => {
  const { inputText } = req.body;
  console.log(inputText);

  try {
    const responseText = await runSample(
      (projectId = "university-chatbot-xwgt"),
      inputText
    );
    res.send(responseText);
  } catch (error) {
    console.error("Error processing user input:", error);
    res.status(500).send("Error processing user input");
  }
});

async function runSample(projectId, inputText) {
  const sessionId = uuid.v4();

  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: Path.join(__dirname + "/key.json"),
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: inputText,

        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  // console.log("Detected intent");
  const result = responses[0].queryResult;
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    // console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    // console.log("  No intent matched.");
  }
  // console.log(result.fulfillmentText);
  return result.fulfillmentText;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
