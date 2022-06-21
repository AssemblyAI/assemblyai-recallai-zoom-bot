<!-- ABOUT THE PROJECT -->
## About The Project
This is a simple CLI project that uses [Recall.ai](https://www.recall.ai), [AssemblyAI](https://www.assemblyai.com) and Zoom.
A user can provide a Zoom URL allowing a transcription bot (created and maintained by Recall.ai) to join the meeting. 



### Built With
* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com)
* [ngrok](https://ngrok.com)


<!-- GETTING STARTED -->
## Getting Started
To get a local copy up and running follow these simple example steps.

### Prerequisites
* npm
  ```sh
  npm install npm@latest -g
  ```
* ngrok
  * Installation guide found [here](https://ngrok.com/).

### Installation

1. Get a free API Key at [https://www.recall.ai](https://www.recall.ai)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API Key in the `.env` file.
   ```txt
   RECALL_API_KEY=token YOUR TOKEN HERE
   ```

<!-- USAGE EXAMPLES -->
## Usage
1. Generate a URL for your webhook using ngrok on our specified port (8000).
   ```sh
   ngrok http 8000
   ```
2. Add your webhook URL to the `.env` file.
   ```txt
   WEBHOOK_URL=YOUR URL HERE
   ```
3. Start your webhook service.
   ```sh
   node webhook.js
   ```
4. Once the service is running open start your Zoom Bot.
   ```sh
   node zoomBot.js
   ```
5. Follow the application prompts. 
