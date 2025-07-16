/******************************************************************************
 * RECALL.AI ZOOM BOT - ASSEMBLYAI INTEGRATION
 * 
 * This bot creates a Recall.ai bot that joins Zoom meetings and streams 
 * real-time transcripts to AssemblyAI for processing, then sends the results
 * to your webhook endpoint.
 * 
 * Integration Flow:
 * 1. Create Recall.ai bot with AssemblyAI transcription provider
 * 2. Bot joins Zoom meeting and captures audio
 * 3. Audio streams to AssemblyAI for real-time transcription
 * 4. Transcripts flow back through Recall.ai to your webhook
 * 5. Webhook receives enriched transcript data with timing & speaker info
 * 
 * Key Configuration:
 * - assembly_ai_v3_streaming: Uses AssemblyAI's streaming API
 * - realtime_endpoints: Webhook URL for receiving transcript data
 * - Regional API endpoints: Different regions for compliance/performance
 ******************************************************************************/
import axios from 'axios'
import 'dotenv/config'
import promptSync from 'prompt-sync'
const prompt = promptSync()

console.log('[BOT] Starting Recall.ai bot for Zoom → AssemblyAI integration')

/******************************************************************************
 * Recall.ai API Client Configuration
 ******************************************************************************/
const recall = axios.create({
    baseURL: `https://${process.env.RECALL_REGION}.recall.ai/api/v1`,
    headers: {
        'authorization': `token ${process.env.RECALL_API_KEY}`,
        'content-type': 'application/json'
    },
    timeout: 10000
})

console.log(`[BOT] Configured for region: ${process.env.RECALL_REGION}`)
console.log(`[BOT] API endpoint: https://${process.env.RECALL_REGION}.recall.ai/api/v1`)

/******************************************************************************
 * Bot Management Functions
******************************************************************************/

const connectBot = async (meetingURL) => {
    try {
        console.log(`[BOT] Creating bot for meeting: ${meetingURL}`)
        console.log(`[BOT] Webhook endpoint: ${process.env.WEBHOOK_URL}/meeting_transcript`)
        
        // This payload configures the bot to use AssemblyAI for transcription
        // and send results to our webhook in real-time
        const payload = {
            meeting_url: meetingURL,
            bot_name: "Transcription Bot",
            
            recording_config: {
                transcript: {
                    // This tells Recall.ai to use AssemblyAI's streaming API
                    // for real-time transcription processing
                    provider: {
                        assembly_ai_v3_streaming: {
                            // Enable formatted text with punctuation and proper casing
                            format_turns: true
                        }
                    }
                },
                realtime_endpoints: [
                    {
                        type: "webhook",
                        // These events give us both final and partial transcripts
                        // - transcript.data: Final transcript segments
                        // - transcript.partial_data: Real-time partial transcripts
                        events: [
                            "transcript.data",
                            "transcript.partial_data"
                        ],
                        url: `${process.env.WEBHOOK_URL}/meeting_transcript`
                    }
                ]
            }
        }
        
        console.log(`[API] POST /bot - Creating bot with AssemblyAI integration`)
        const response = await recall.post('/bot', payload)
        
        console.log(`[API] Bot created successfully`)
        console.log(`[BOT] Bot ID: ${response.data.id}`)
        console.log(`[BOT] Status: ${response.data.status}`)
        
        return response.data.id
        
    } catch (err) {
        console.error(`[BOT] ERROR creating bot:`, err.response?.data || err.message)
        if (err.response?.status === 401) {
            console.error(`[BOT] Check your RECALL_API_KEY in .env`)
        }
        if (err.response?.status === 400) {
            console.error(`[BOT] Invalid configuration - check AssemblyAI setup in Recall.ai dashboard`)
        }
        return null
    }
}

const leaveMeeting = async (meetingID) => {
    try {
        console.log(`[BOT] Leaving meeting: ${meetingID}`)
        await recall.post(`/bot/${meetingID}/leave_call`)
        console.log(`[BOT] Successfully left meeting`)
    } catch (err) {
        console.error(`[BOT] ERROR leaving meeting:`, err.response?.data || err.message)
    }
}

// Main application flow
const runApp = async () => {
    console.log(`[BOT] Starting application...`)
    
    // Validate environment configuration
    console.log(`[BOT] Validating configuration...`)
    
    if (!process.env.RECALL_API_KEY) {
        console.error('[BOT] ERROR: RECALL_API_KEY not found in .env file')
        console.error('[BOT] Get your API key from your Recall.ai dashboard')
        process.exit(1)
    }
    
    if (!process.env.RECALL_REGION) {
        console.error('[BOT] ERROR: RECALL_REGION not found in .env file')
        process.exit(1)
    }
    
    const validRegions = ['us-west-2', 'us-east-1', 'eu-central-1', 'ap-northeast-1']
    if (!validRegions.includes(process.env.RECALL_REGION)) {
        console.error(`[BOT] ERROR: RECALL_REGION must be one of: ${validRegions.join(', ')}`)
        process.exit(1)
    }
    
    if (!process.env.WEBHOOK_URL) {
        console.error('[BOT] ERROR: WEBHOOK_URL not found in .env file')
        console.error('[BOT] Start ngrok first: ngrok http 8000')
        process.exit(1)
    }
    
    console.log(`[BOT] ✓ Configuration valid`)
    console.log(`[BOT] ✓ Region: ${process.env.RECALL_REGION}`)
    console.log(`[BOT] ✓ Webhook: ${process.env.WEBHOOK_URL}`)
    
    // Get meeting URL from user
    console.log(`[BOT] Ready to join meeting and start transcription`)
    const meetingURL = prompt('What is your meeting URL?: ')
    
    // Create and deploy bot
    const meetingID = await connectBot(meetingURL)
    
    if (!meetingID) {
        console.error('[BOT] Failed to create bot. Exiting...')
        process.exit(1)
    }
    
    console.log(`[BOT] ✓ Bot deployed successfully`)
    console.log(`[BOT] Bot is joining meeting and will start sending transcripts to webhook`)
    console.log(`[BOT] Check Terminal 2 for real-time transcripts`)
    
    // Wait for user to stop transcription
    const endMeeting = prompt('Type "STOP" to end transcription: ')
    if (endMeeting.toLowerCase() === 'stop') {
        await leaveMeeting(meetingID)
        console.log(`[BOT] Transcription ended`)
    }
}

/******************************************************************************
 * Start Application
******************************************************************************/
runApp()
