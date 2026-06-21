// Import neccessary modules and configure environment variables
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set the port number from environment variables or default to 3000
const port = process.env.PORT ?? 3000;

// API_Key et PLAYLIST_ID
const api_key = process.env.YOUTUBE_API_KEY;
const playlist_id = process.env.YOUTUBE_PLAYLIST_ID;

// Verification de la config de la clé API et de l'id de playlist
if (!api_key || !playlist_id) {
    console.error(`Config incomplet : ${ !api_key ? 'YOUTUBE_API_KEY' : 'YOUTUBE_PLAYLIST_ID'} manquant`);
    process.exit(1);
}


function isDbInfosValueNull(envVar){
    if (envVar.name === 'DB_PASS') {
        return false;
    }

    return !envVar.value;
}
const dbInfos = [
    { name: 'DB_HOST', value: process.env.DB_HOST },
    { name: 'DB_USER', value: process.env.DB_USER },
    { name: 'DB_PASS', value: process.env.DB_PASS },
    { name: 'DB_NAME', value: process.env.DB_NAME }
].filter(isDbInfosValueNull);

if (dbInfos.length > 0) {
    dbInfos.forEach((dbInfo) => {
        console.error(`Config incomplet : ${dbInfo.name} manquant`);
    });
    process.exit(1);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


// ------- Fonctions ----------------------------------------------------------------------------------------------------

async function fetchSongs(){
    let hasNextPage = true;
    let pageToken = null;
    let allSongs = [];

    while (hasNextPage) {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=50&playlistId=${playlist_id}&key=${api_key}${pageToken ? '&pageToken=' + pageToken : ''}`);
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
                        uploader: item.snippet.videoOwnerChannelTitle,
                        position: item.snippet.position,
                    }
        });
        allSongs = [...allSongs, ...songs]; 
        
        if (data.nextPageToken) {
            pageToken = data.nextPageToken;
        }
        else{
            hasNextPage = false;
        }
    }

    const filteredSongs = allSongs.filter(song => song.cover && song.uploader);
    return filteredSongs;
}

async function syncSongs() {
    const fetchedSongs = await fetchSongs();

    for (const song of fetchedSongs) {
        await pool.execute(
            "INSERT INTO songs (video_id, title, uploader, cover, publish_date, position) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, uploader = ?, cover = ?, publish_date = ?, position = ?",
            [
                // VALUES
                song.video_id, 
                song.title, 
                song.uploader, 
                song.cover, 
                song.publish_date,
                song.position,
                
                // UPDATE
                song.title, 
                song.uploader, 
                song.cover, 
                song.publish_date,
                song.position,
            ]
        );
    }

    const [videoIdsRows] = await pool.execute("SELECT video_id FROM songs");  
    const dbVideoIds = videoIdsRows.map(row => row.video_id);

    const freshIds = new Set(fetchedSongs.map(song => song.video_id));

    for (const videoId of dbVideoIds) {
        if (!freshIds.has(videoId)) {
            await pool.execute(
                "UPDATE songs SET is_active = false WHERE video_id = ?",
                [videoId]
            );
        }
    }

    const currentDateTime = new Date();

    await pool.execute(
        "INSERT INTO cache_meta (id, last_fetch_time) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_fetch_time = ?",
        [
            // VALUES
            1, 
            currentDateTime,
            
            // UPDATE
            currentDateTime
        ]
    );

    return fetchedSongs;
}

async function getActiveCachedSongs() {
    const [activeCachedSongs] = await pool.execute("SELECT video_id, title, uploader, cover, publish_date, artist FROM songs WHERE is_active = true ORDER BY position ASC");
    return activeCachedSongs;
}

function send503ErrorMessage(res) {
    return res.status(503).json({ error: "Le service est temporairement indisponible. Réessayer plus tard." });
}

// ------- Routes -------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.json({
        message: "Serveur Deacaeta opérationnel"
    });
});

// Route API
app.get("/coolsongs", async (req, res) => {
    try {
        const [row] = await pool.execute("SELECT last_fetch_time FROM cache_meta WHERE id = 1");
        
        if (row.length === 0 || (Date.now() - row[0]?.last_fetch_time?.getTime() >= 1000 * 60 * 60 *2)) {
            await syncSongs();
            res.json(await getActiveCachedSongs());
        }
        else {
            const activeCachedSongs = await getActiveCachedSongs();
            res.json(activeCachedSongs);  
        }
    } catch (error) {
        console.error(error);

        try {
            const activeCachedSongs = await getActiveCachedSongs();

            if (activeCachedSongs.length === 0) {
                send503ErrorMessage(res);
            }
            else {
                res.json(activeCachedSongs)
            }
        } catch (dbError) {
            console.error(dbError);
            send503ErrorMessage(res);
        }
    }  
});


// Lancement du server
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});