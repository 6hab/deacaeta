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
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&maxResults=50&playlistId=${playlist_id}&key=${api_key}${pageToken ? '&pageToken=' + pageToken : ''}`);
        const data = await response.json();

        if (!response.ok) {
            throw new  Error(`Youtube API error ${response.status}: ${data.error?.message ?? 'Erreur inconnue'}`);
        }

        let songs = data.items.map((item) => {
            return {
                        added_at: new Date(item.snippet.publishedAt),
                        video_published_at: new Date(item.contentDetails?.videoPublishedAt),
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url,
                        video_id: item.snippet.resourceId.videoId,
                        uploader: item.snippet.videoOwnerChannelTitle,
                        position: item.snippet.position,
                    }
        });

        // Fetch du nombre de vues
        const videoIds = songs.map(row => row.video_id);
        const fetchedViewCount = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&key=${api_key}&id=${videoIds.join(",")}`);
        
        const viewCountData = await fetchedViewCount.json();
        //console.log(JSON.stringify(viewCountData, null, 2))

        const viewCountMap = new Map(viewCountData.items.map(item => [item.id, item.statistics.viewCount]))
        songs = songs.map(song => (
            {...song, view_count: Number(viewCountMap.get(song.video_id))}
        ))

        // Stockage des songs
        allSongs = [...allSongs, ...songs]; 
        
        if (data.nextPageToken) {
            pageToken = data.nextPageToken;
        }
        else{
            hasNextPage = false;
        }
    }

    const filteredSongs = allSongs.filter(song => song.thumbnail && song.uploader);
    return filteredSongs;
}

async function syncSongs() {

    const fetchedSongs = await fetchSongs();

    for (const song of fetchedSongs) {
        await pool.execute(
            "INSERT INTO songs (video_id, title, uploader, thumbnail, video_published_at, view_count, added_at, position, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, uploader = ?, thumbnail = ?, video_published_at = ?, view_count = ?, added_at = ?, position = ?, is_active = ?",
            [
                // VALUES
                song.video_id, 
                song.title, 
                song.uploader, 
                song.thumbnail, 
                song.video_published_at,
                song.view_count,
                song.added_at,
                song.position,
                true,
                
                // UPDATE
                song.title, 
                song.uploader, 
                song.thumbnail, 
                song.video_published_at,
                song.view_count,
                song.added_at,
                song.position,
                true
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
    const [activeCachedSongs] = await pool.execute(
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, songs.added_at, songs.artist, tags.name AS tag_name FROM songs " + 
        "Left JOIN song_tags ON songs.video_id = song_tags.video_id " + 
        "Left JOIN tags ON song_tags.tag_id = tags.id " + 
        "WHERE songs.is_active = true " + 
        "ORDER BY songs.position ASC"
    );                
    // "SELECT video_id, title, uploader, thumbnail, video_published_at, view_count, added_at, artist FROM songs WHERE is_active = true ORDER BY position ASC";
    
    const songsMap = new Map();

    for (const row of activeCachedSongs) {
        if (!songsMap.has(row.video_id)) {
            songsMap.set(row.video_id, {
                video_id: row.video_id,
                title: row.title,
                uploader: row.uploader,
                thumbnail: row.thumbnail,
                video_published_at: row.video_published_at,
                view_count: row.view_count,
                added_at: row.added_at,
                artist: row.artist,
                tags: []
            });
        }
        
        if (row.tag_name !== null) {
            songsMap.get(row.video_id).tags.push(row.tag_name);
        }
    }

    const songs = Array.from(songsMap.values());
    return songs;
}

async function getTopViewedSongs() {
    const [topIds] = await pool.execute("SELECT video_id, FROM songs WHERE is_active = true ORDER BY view_count DES LIMIT 100");

    if (topIds.length === 0) {
        return [];
    }

    const videoIds = topIds.map(row => row.video_id);
    const placeholders = videoIds.map(() => "?").join(",");

    const [activeCachedTopViewedSongs] = await pool.execute(
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, songs.added_at, songs.artist, tags.name AS tag_name FROM songs " +
        "Left JOIN song_tags ON songs.video_id = song_tags.video_id " +
        "Left JOIN tags ON song_tags.tag_id = tags.id " +
        "WHERE songs.video_id IN (" + placeholders + ") " +
        "ORDER BY songs.view_count DESC",
        videoIds
    );

    const songsMap = new Map()

    for (const row of activeCachedTopViewedSongs) {
        if (!songsMap.has(row.video_id)) {
            songsMap.set(row.video_id, {
                video_id: row.video_id,
                title: row.title,
                uploader: row.uploader,
                thumbnail: row.thumbnail,
                video_published_at: row.video_published_at,
                view_count: row.view_count,
                added_at: row.added_at,
                artist: row.artist,
                tags: []
            })
        }

        if (row.tag_name !== null) {
            songsMap.get(row.video_id).tags.push(row.tag_name);
        }
    }

    return Array.from(songsMap.values());
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

app.get("/coolsongs/:videoId", async (req, res) => {
    try {
        const { videoId } = req.params

        const [rows] = await pool.execute(
            "SELECT video_id, title, uploader, thumbnail, artist, video_published_at FROM songs WHERE video_id = ?",
            [videoId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: "Musique introuvable" })
        }

        res.json(rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

app.get("/topsongs/views", async (req, res) => {
    try {
        const activeCachedTopViewedSongs = await getTopViewedSongs();

        if (activeCachedTopViewedSongs.length === 0) {
            await syncSongs();
            res.json(await getTopViewedSongs());
        }
        else {
            res.json(activeCachedTopViewedSongs)
        }
    } catch (dbError) {
        console.log(dbError);
        send503ErrorMessage(res);
    }
    }
);


// Lancement du server
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});