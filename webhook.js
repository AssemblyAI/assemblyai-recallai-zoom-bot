/******************************************************************************
 * RECALL.AI + ASSEMBLYAI INTEGRATION WEBHOOK SERVER
 * 
 * This server receives real-time transcripts from Recall.ai, which acts as a
 * bridge between Zoom meetings and AssemblyAI's transcription service.
 * 
 * Data Flow:
 * 1. Zoom Meeting Audio → Recall.ai bot captures audio
 * 2. Recall.ai → AssemblyAI for real-time transcription  
 * 3. AssemblyAI → Recall.ai with transcript + metadata
 * 4. Recall.ai → This webhook with enriched transcript data
 * 
 * Key Features:
 * - Word-level timestamps for precise timing
 * - Speaker identification with participant metadata
 * - Zoom-specific data (user IDs, platform info)
 * - Real-time and partial transcript events
 ******************************************************************************/
import 'dotenv/config'
import express from 'express'

/******************************************************************************
 * Express Configuration
 ******************************************************************************/
const app = express()
const port = 8000
app.use(express.json())

console.log('[WEBHOOK] Starting webhook server for Recall.ai → AssemblyAI integration')

/******************************************************************************
 * Webhook Routes
 ******************************************************************************/

// Main webhook endpoint - receives transcript data from Recall.ai
app.post('/meeting_transcript', (req, res) => {
    try {
        const { event, data } = req.body
        
        if (event === 'transcript.data' || event === 'transcript.partial_data') {
            const { data: transcriptData } = data
            const { words, participant, transcript } = transcriptData
            
            if (participant?.name && words?.length > 0) {
                const eventType = event === 'transcript.data' ? 'FINAL' : 'PARTIAL'
                
                // Extract transcript text - try formatted text first, fall back to words
                let transcriptText = ''
                if (transcriptData.text) {
                    transcriptText = transcriptData.text
                } else if (transcript && transcript.text) {
                    transcriptText = transcript.text
                } else {
                    // Reconstruct from individual words
                    transcriptText = words.map(word => word.text).join(' ')
                }
                
                // Display the transcript
                console.log(`[TRANSCRIPT] ${eventType} - ${participant.name}: ${transcriptText}`)
            }
        } else {
            console.log(`[WEBHOOK] Non-transcript event: ${event}`)
        }
        
        res.setHeader('ngrok-skip-browser-warning', 'true')
        res.status(200).send('OK')
        
    } catch (error) {
        console.error(`[WEBHOOK] ERROR processing webhook:`, error.message)
        res.status(500).send('Error processing webhook')
    }
})


app.listen(port, () => {
    console.log(`[WEBHOOK] Server running on port ${port}`)
    console.log(`[WEBHOOK] Ready to receive transcripts from Recall.ai`)
    console.log(`[WEBHOOK] Integration: Zoom → Recall.ai → AssemblyAI → This webhook`)
})
