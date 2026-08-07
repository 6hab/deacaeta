// Import neccessary modules and configure environment variables
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mysql from "mysql2/promise";
import { error } from "node:console";

dotenv.config();

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

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
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, songs.added_at, tags.name AS tag_name FROM songs " + 
        "Left JOIN song_tags ON songs.video_id = song_tags.video_id " + 
        "Left JOIN tags ON song_tags.tag_id = tags.id " + 
        "WHERE songs.is_active = true " + 
        "ORDER BY songs.position ASC"
    );                
    // "SELECT video_id, title, uploader, thumbnail, video_published_at, view_count, added_at, FROM songs WHERE is_active = true ORDER BY position ASC";
    
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
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, songs.added_at, tags.name AS tag_name FROM songs " +
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
                tags: []
            })
        }

        if (row.tag_name !== null) {
            songsMap.get(row.video_id).tags.push(row.tag_name);
        }
    }

    return Array.from(songsMap.values());
}

async function getRecentlyAddedSongs() {
    const [recentIds] = await pool.execute("SELECT video_id FROM songs WHERE is_active = true AND added_at >= NOW() - INTERVAL 7 DAY ORDER BY added_at DESC")

    if (recentIds.length === 0) {
        return []
    } 

    const videoIds = recentIds.map(row => row.video_id)
    const placeholders = videoIds.map(() => "?").join(",")

    const [acitveRecentlyAddedSongs] = await pool.execute(
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, songs.added_at, tags.name AS tag_name FROM songs " +
        "Left JOIN song_tags ON songs.video_id = song_tags.video_id " +
        "Left JOIN tags ON song_tags.tag_id = tags.id " +
        "WHERE songs.video_id IN (" + placeholders + ") " +
        "ORDER BY songs.added_at DESC",
        videoIds
    )

    const songsMap = new Map()

    for (const row of acitveRecentlyAddedSongs) {
        if (!songsMap.has(row.video_id)) {
            songsMap.set(row.video_id, {
                video_id: row.video_id,
                title: row.title,
                uploader: row.uploader,
                thumbnail: row.thumbnail,
                video_published_at: row.video_published_at,
                view_count: row.view_count,
                added_at: row.added_at,
                tags: []
            })
        }

        if (row.tag_name !== null) {
            songsMap.get(row.video_id).tags.push(row.tag_name)
        }
    }

    return Array.from(songsMap.values());
}

function send503ErrorMessage(res) {
    return res.status(503).json({ error: "Le service est temporairement indisponible. Réessayer plus tard." });
}


async function getArtistById(artistId) {
    const [artistInfos] = await pool.execute(
        "SELECT artists.artist_id, artists.name_original, artists.bio, artists.birth_date, artists.death_date, artists.photo,  artist_socials.social_id, artist_socials.link_name, artist_socials.link_url FROM artists " +
        "Left JOIN artist_socials ON artists.artist_id = artist_socials.artist_id " +
        "WHERE artists.artist_id = ? ",
        [artistId]
    );

    const [artistAliases] = await pool.execute(
        "SELECT artist_aliases.artist_id, artist_aliases.alias_id, artist_aliases.alias FROM artist_aliases " +
        "WHERE artist_aliases.artist_id = ?",
        [artistId]
    );

    const artistMap = new Map();

    for (const row of artistInfos) {
        if (!artistMap.has(row.artist_id)) {
            artistMap.set(row.artist_id, {
                artist_id: row.artist_id,
                name_original: row.name_original,
                birth_date: row.birth_date,
                death_date: row.death_date,
                bio: row.bio,
                photo: row.photo,
                aliases: [],
                socials: []
            });
        }

        if (row.social_id) {
            artistMap.get(row.artist_id).socials.push({
                social_id: row.social_id,
                link_name: row.link_name,
                link_url: row.link_url
            });
        }
    }

    for (const row of artistAliases) {
        artistMap.get(row.artist_id).aliases.push({
            artist_id: row.artist_id,
            alias_id: row.alias_id,
            alias: row.alias
        });
    }

    return artistMap.get(Number(artistId));
}

async function getArtistSongs(artistId) {
    const [artistSongs] = await pool.execute(
        "SELECT songs.video_id, songs.title, songs.uploader, songs.thumbnail, songs.video_published_at, songs.view_count, tags.name AS tag_name FROM songs " + 
        "Left JOIN song_artists ON songs.video_id = song_artists.video_id " + 
        "Left JOIN song_tags ON songs.video_id = song_tags.video_id " + 
        "Left JOIN tags ON song_tags.tag_id = tags.id " + 
        "WHERE song_artists.artist_id = ?",
        [artistId]
    );

    const songsMap = new Map();

    for (const row of artistSongs) {
        if (!songsMap.has(row.video_id)) {
            songsMap.set(row.video_id, {
                video_id: row.video_id,
                title: row.title,
                uploader: row.uploader,
                thumbnail: row.thumbnail,
                video_published_at: row.video_published_at,
                view_count: row.view_count,
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
            "SELECT video_id, title, uploader, thumbnail, video_published_at FROM songs WHERE video_id = ?",
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

// Rélation entre une musique et son artiste
app.post("/coolsongs/:videoId/artists", async(req, res) => {
    try {
        const { videoId } = req.params;
        const { artist_id } = req.body;

        if (!artist_id) {
            return res.status(400).json({error: "An artist must be selected."})
        }

        const [result] = await pool.execute(
            "INSERT INTO song_artists (video_id, artist_id) VALUES (?, ?)",
            [videoId, artist_id]
        )
        res.status(201).json({message: "Artist linkded to the song successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while linking the artist to the song."});
    }
})

// Création de tag
app.post("/tags", async(req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({error: "The tag name and type are required."});
        }

        const [result] = await pool.execute(
            "INSERT INTO tags (name, type) VALUES (?, ?)",
            [name, type]
        )
        res.status(201).json({message: "Tag created successfully.", tagId: result.insertId});
    } catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({error: "A tag with this name already exists."});
        }
        else {
            res.status(500).json({error: "An error occurred while creating a tag."});
        }
    }
})

// Recherche de tag parmis tous les tags
app.get("/tags", async(req, res) => {
    try {
        const { search } = req.query;
        
        const [result] = await pool.execute(
            "SELECT id, name FROM tags " +
            "WHERE name LIKE ?",
            [`%${search}%`]
        )
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while searching a tag."});
    }
})

// Rélier une chanson à un ou plusieurs tags
app.post("/coolsongs/:videoId/tags", async(req, res) => {
    try {
        const { videoId } = req.params;
        const { tag_ids } = req.body;

        if (!tag_ids) {
            return res.status(400).json({error: "At least one tag must be selected."});
        }

        for (const tagId of tag_ids) {
            const [result] = await pool.execute(
                "INSERT INTO song_tags (video_id, tag_id) VALUES (?, ?)",
                [videoId, tagId]
            )
        }
        res.status(201).json({message: "Tag(s) linked to the song successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while tagging a song."});
    }
})

// ----------- Page d'accueil ------------------------------------------------------------------------------------
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
});

app.get("/recentlyaddedsongs", async (req, res) => {
    try {
        const activeCachedRecentlyAddedSongs = await getRecentlyAddedSongs()

        if (activeCachedRecentlyAddedSongs.length === 0) {
            await syncSongs()
            res.json(await getRecentlyAddedSongs())
        }
        else {
            res.json(activeCachedRecentlyAddedSongs)
        }
    } catch (dbError) {
        console.log(dbError)
        send503ErrorMessage(res)
    }
})



// ---------- Page artistes ----------------------------------------------------------------------------------------------------

// Création d'artiste
app.post("/artists", async (req, res) => {
    const { name_original, bio, birth_date, death_date, photo} = req.body;

    if (!name_original) {
        return res.status(400).json({ error: "The original name is required." });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO artists (name_original, bio, birth_date, death_date, photo) VALUES (?, ?, ?, ?, ?)",
            [name_original, bio, birth_date, death_date, photo]
        );
        res.status(201).json({ message: "Artist added successfully.", artistId: result.insertId });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding the artist. "})
    }
})

// Affichage de tous les artistes 
app.get("/artists", async(req, res) => {
    try {
        const { search } = req.query;

        if (req.query.search) {
            const [result] = await pool.execute(
                "SELECT artists.artist_id, artists.name_original, artists.photo FROM artists " +
                "LEFT JOIN artist_aliases ON artists.artist_id = artist_aliases.artist_id " +
                "WHERE artists.name_original LIKE ? OR artist_aliases.alias LIKE ?",
                [`%${search}%`, `%${search}%`]
            )
            res.status(200).json(result);
        }
        else {
            
            const [result] = await pool.execute(
                "SELECT artists.artist_id, artists.name_original, artists.photo FROM artists"
            )
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while retrieving the artists."});
    }
})

// Modification des infos d'un artiste existant
app.put("/artists/:artistId", async(req, res) => {
    try {
        const { artistId } = req.params;
        const { name_original, birth_date, death_date, bio, photo } = req.body;

        const [result] = await pool.execute(
            "UPDATE artists SET name_original = ?, birth_date = ?, death_date = ?, bio = ?, photo = ? WHERE artist_id = ?",
            [name_original, birth_date, death_date, bio, photo, artistId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Artist not found."})
        }
        res.status(200).json({message: "Artist updated successfully."});

    } catch(error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while updating the artist."});
    }
})

// Ajout d'alias
app.post("/artists/:artistId/aliases", async(req, res) => {
    try {
        const { artistId } = req.params;
        const { alias } = req.body;

        if (!alias) {
            return res.status(400).json({error: "The alias must be completed."});
        }

        const [result] = await pool.execute(
            "INSERT INTO artist_aliases (artist_id, alias) VALUES (?, ?)",
            [artistId, alias]
        );
        res.status(201).json({message: "Alias added successfully.", aliasId: result.insertId });
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while adding an alias."});
    }
})

// Suppression d'alias
app.delete("/artists/:artistId/aliases/:aliasId", async(req, res) => {
    try { 
        const { artistId, aliasId } = req.params;

        const [result] = await pool.execute(
            "DELETE FROM artist_aliases WHERE artist_id = ? AND alias_id = ?",
            [artistId, aliasId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Alias not found."});
        }
        res.status(200).json({message: "Alias deleted successfully."});
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while deleting an alias."});
    }
})

// Ajout de réseau social
app.post("/artists/:artistId/socials", async(req, res) => {
    try {
        const { artistId } = req.params
        const { link_name, link_url } = req.body;

        if (!link_name || !link_url) {
           return res.status(400).json({ error: "The link name and url must be completed."}) 
        }

        const [result] = await pool.execute(
            "INSERT INTO artist_socials (artist_id, link_name, link_url) VALUES (?, ?, ?)",
            [artistId, link_name, link_url]
        );
        res.status(201).json({message: "Social link added successfully.", socialId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while adding a social."});
    }
})

// Suppression de réseau social
app.delete("/artists/:artistId/socials/:socialId", async(req, res) => {
    try {
        const { artistId, socialId } = req.params;

        const [result] = await pool.execute(
            "DELETE FROM artist_socials WHERE artist_id = ? AND social_id = ?",
            [artistId, socialId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Social link not found."});
        }
        res.status(200).json({message: "Social link deleted successfully."});

    } catch(error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while deleting a social link."})
    }
})

// Lecture des infos de l'artiste pour le front
app.get("/artists/:artistId", async(req, res) => {
    try {
        const { artistId } = req.params;
        const artistInfos = await getArtistById(Number(artistId));

        if (artistInfos === undefined) {
            return res.status(404).json({error: "Artist not found."})
        }
        res.status(200).json(artistInfos);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while retrieving the artist."});
    }
})

// Lecture des musiques de l'artiste pour le front
app.get("/artists/:artistId/songs", async(req, res) => {
    try {
        const { artistId } = req.params;

        const artistSongs = await getArtistSongs(Number(artistId));
        res.status(200).json(artistSongs);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while retrieving the artist's songs."});
    }
})

// Lecture des artistes ayant collaboré ensemble
app.get("/artists/:artistId/featurings", async(req, res) => {
    try {
        const { artistId } = req.params;

        const [result] = await pool.execute(
            "SELECT DISTINCT artists.artist_id, artists.name_original, artists.photo FROM song_artists AS sa1 JOIN song_artists AS sa2 ON sa1.video_id = sa2.video_id AND sa1.artist_id != sa2.artist_id " + 
            "Left JOIN artists ON artists.artist_id = sa2.artist_id " +
            "WHERE sa1.artist_id = ?",
            [artistId]
        )
        res.status(200).json(result);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "An error occurred while retrieving featurings."});
    }
})

// Lecture des artistes similaires 
app.get("/artists/:artistId/similar-artists", async(req, res) => {
    try {
        const { artistId } = req.params;

        const [result] = await pool.execute(
            "SELECT DISTINCT artists.artist_id, artists.name_original, artists.photo FROM song_artists AS sa1 " +
            "JOIN song_tags AS st1 ON sa1.video_id = st1.video_id " +
            "JOIN song_tags AS st2 ON st1.tag_id = st2.tag_id AND st1.video_id != st2.video_id " + 
            "JOIN song_artists AS sa2 ON st2.video_id = sa2.video_id " +
            "JOIN artists ON artists.artist_id = sa2.artist_id " + 
            "WHERE sa1.artist_id = ? AND sa2.artist_id != ?",
            [artistId, artistId]
        )
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred while retrieving similar artists."})
    }
})

// Lancement du server
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});