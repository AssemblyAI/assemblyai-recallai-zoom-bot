/******************************************************************************
 * Dependencies 
******************************************************************************/
import 'dotenv/config'
import express from 'express'

/******************************************************************************
 * Express config 
******************************************************************************/
const app = express()
const port = 8000
app.use(express.json())

/******************************************************************************
 * Routes 
******************************************************************************/
// Webhook endpoint to handle incoming transcripts from Recall
app.post('/meeting_transcript', (req, res) => {
    let { data: { transcript: { speaker, words } } } = req.body
    if (speaker !== null) {
        const msg = words.map(word => word.text)
        console.info(`${speaker}: ${msg.join(' ')}`)
    }
    res.status(200).send('OK')
})

app.listen(port, () =>
    console.log(`webhook running on port ${port}`)
)
