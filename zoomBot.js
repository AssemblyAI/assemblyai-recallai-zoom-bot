/******************************************************************************
 * Dependencies 
******************************************************************************/
import axios from 'axios'
import 'dotenv/config'
import promptSync from 'prompt-sync'
const prompt = promptSync()

/******************************************************************************
 * Custom Axios Instance 
******************************************************************************/
const recall = axios.create({
    baseURL: 'https://api.recall.ai/api/v1',
    headers: {
        'authorization': process.env.RECALL_API_KEY,
        'content-type': 'application/json'
    },
    timeout: 10000
})

/******************************************************************************
 * Bot Functions 
******************************************************************************/
const connectBot = async (meetingURL) => {
    try {
        const payload = {
            // URL of the zoom meeting provided by the user.
            meeting_url: meetingURL,

            // Specify AssemblyAI as the transcription provider.
            transcription: { provider: 'assemblyai' },

            // Webhook URL that is provided via our .env file.
            real_time_transcription: { destination_url: `${process.env.MEETING_URL}/meeting_transcript` }
        }
        const response = await recall.post('/bot', payload)
        const { data: { id } } = response
        return id
    } catch (err) {
        console.error(err)
    }
}

const leaveMeeting = async (meetingID) => {
    try {
        await recall.post(`/bot/${meetingID}/leave_call`)
    } catch (err) {
        console.error(err)
    }
}

// Manage bot portion of the app.
const runApp = async () => {
    const meetingURL = prompt('What is your meeting URL?: ')
    const meetingID = await connectBot(meetingURL)
    console.info(`Joining meeting: ${meetingID}`)
    const endMeeting = prompt('Type "STOP" to end notetaking: ')
    if (endMeeting.toLowerCase() === 'stop') {
        await leaveMeeting(meetingID)
    }
}

// Initiate application
runApp()
