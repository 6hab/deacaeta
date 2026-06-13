// Import neccessary modules and configure environment variables
import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set the port number from environment variables or default to 3000
const port = process.env.PORT ?? 3000;

// Route API_Key
const api_key = process.env.YOUTUBE_API_KEY;

// Route PLAYLIST_ID
const playlist_id = process.env.YOUTUBE_PLAYLIST_ID;



// Define a route to respond with a JSON object containing project and developer infos (optional)
app.get("/", (req, res) => {
    res.json({
        message: "Serveur Deacaeta opérationnel"
    });
});

// Route API
app.get("/coolsongs", async (req, res) => {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist_id}&key=${api_key}`)
    const data = await response.json()
    const songs = data.items.map((item) => {
        return {
            publish_date: item.snippet.publishedAt,
            title: item.snippet.title,
            cover: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url,
            video_id: item.snippet.resourceId.videoId,
            channel_title: item.snippet.videoOwnerChannelTitle,
        }
    })
    res.json(songs)
})


// Start the server and listen on the specified port, logging a message to confirm
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});