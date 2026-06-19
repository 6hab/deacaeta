// Import neccessary modules and configure environment variables
import express from "express";
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

// Verification de la config de la clé API et de l'id de playlist
if (!api_key || !playlist_id) {
    console.error(`Config incomplet : ${ !api_key ? 'YOUTUBE_API_KEY' : 'YOUTUBE_PLAYLIST_ID'} manquant`);
    process.exit(1);
}

// Define a route to respond with a JSON object containing project and developer infos (optional)
app.get("/", (req, res) => {
    res.json({
        message: "Serveur Deacaeta opérationnel"
    });
});

// Route API
let cachedSongs = null;
let lastFetchTime = null;
app.get("/coolsongs", async (req, res) => {
    if (cachedSongs !== null && Date.now() - lastFetchTime < 1000 * 60 * 60) {
        res.json(cachedSongs);
    }
    else{  
        let hasNextPage = true;
        let pageToken = null;
        let allSongs = [];

        try {  
            while (hasNextPage) {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist_id}&key=${api_key}${pageToken ? '&pageToken=' + pageToken : ''}`)
                const data = await response.json();

                if (!response.ok) {
                    throw new  Error(`Youtube API error ${response.status}: ${data.error?.message ?? 'Erreur inconnue'}`);
                }

                const songs = data.items.map((item) => {
                    return {
                        publish_date: item.snippet.publishedAt,
                        title: item.snippet.title,
                        cover: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url,
                        video_id: item.snippet.resourceId.videoId,
                        channel_title: item.snippet.videoOwnerChannelTitle,
                    }
                })
                allSongs = [...allSongs, ...songs]; 

                if (data.nextPageToken) {
                    pageToken = data.nextPageToken;
                }
                else{
                    hasNextPage = false;
                }
            }

            lastFetchTime = Date.now();
            cachedSongs = allSongs;
            res.json(allSongs);
        } catch (error) {
            console.error(error);

            if (cachedSongs !== null){
                res.json(cachedSongs)
            }
            else {
                res.status(503).json({ error: "Le service est temporairement indisponible. Réessayer plus tard." });
            }
            
        }
    }
})


// Start the server and listen on the specified port, logging a message to confirm
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});