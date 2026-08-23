import { useEffect, useRef, useState } from "react";
import { Music4 } from "lucide-react";

const musicVideosIds = [
  "k85mRPqvMbE", // Crazy Frog - Axel F (Official Video)
  "-SyBR-M2YvU", // LE TIGRE - DECEPTACON
  "QgFX80N34Fc", // Lazy Confessions
  "xfeys7Jfnx8", // Nice guys


  "Uw_hZfH5Ukc", // 9MM x LOLI SHIGURE UI
  "jr478w--dpE", // 3 random make an awesome song, yt channel : Jaime Maldonado
  "KHb-1Kysz08", // TrickYzb - PPAP2026(Music video)
  "ZPYyOtFRS4M", // favbea - play this at 1.25x speed, you'll thank me later
  "e60G9pxOE-Y", // Totally Spies Theme Song (Offical Music Video)
  "1uqJicx-MIg", // D4DJ meme
  "WIKqgE4BwAY", // BABYMETAL - ギミチョコ！！- Gimme chocolate!!
  "iF2xUtCcu6Q", // bxnji - bouncin
];

type FlyingNote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  videoId: string;
  shape: string;
  color: string;
  trail: {x: number, y: number}[];
  trailCounter: number;
};

type SongDetails = {
  video_id: string;
  title: string;
  uploader: string;
  thumbnail: string;
  video_published_at: string;
  artist: string | null;
};

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collectedSongs, setCollectedSongs] = useState<SongDetails[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleClicksOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("click", handleClicksOutside);
    return () => {
      document.removeEventListener("click", handleClicksOutside);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const header = document.querySelector("header")
    const headerHeight = header ? header.offsetHeight : 0

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", handleResize);

    let t = 0;
    let animationId: number;

    let currentFlyingNotes: FlyingNote[] = [];

    let nextWaveIn = 1;

    // Couleur du background
    const backgroundGradiant = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradiant.addColorStop(0, "#0f1726");
    backgroundGradiant.addColorStop(1, "#0a0f19");

    const noteShapes = ["♩", "♪", "♫", "♬"];

    const trySpawnWave = () => {
      nextWaveIn -= 0.016;

      if (nextWaveIn <= 0) {
        const waveSize = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < waveSize; i++) {
          const videoId =
            musicVideosIds[Math.floor(Math.random() * musicVideosIds.length)];
          const shape =
            noteShapes[Math.floor(Math.random() * noteShapes.length)];

          const hue = Math.floor(Math.random() * 360)
          const color = `hsl(${hue}, 80%, 65%)`

          const startY = headerHeight + Math.random() * (canvas.height - headerHeight)

          currentFlyingNotes.push({
            x: -50,
            y: startY,
            vx: 0.5 + Math.random() * 2,
            vy: (Math.random() - 0.5) * 1,
            videoId,
            shape,
            color,
            trailCounter: 0,
            trail: [{x: -50, y: startY}],
          });
        }

        nextWaveIn = 15 + Math.random() * (30 - 15);
      }
    };

    const updateFlyingNotes = () => {
      currentFlyingNotes.forEach((note) => {
        note.x += note.vx;
        note.y += note.vy;
        note.trailCounter += 1

        if (note.y < headerHeight) {
          note.vy *= -1
        }

        if (note.trailCounter > 10) {
          note.trail.push({x: note.x, y: note.y})

          if (note.trail.length > 5) {
            note.trail.shift()
          }

          note.trailCounter = 0
        }
      });

      currentFlyingNotes = currentFlyingNotes.filter(
        (note) => note.x > -100 && note.x < canvas.width + 100,
      );
    };

    // Notes filantes
    const drawFlyingNotes = () => {
      currentFlyingNotes.forEach((note) => {

        note.trail.forEach((pos, index) => {
          const opacity = index / note.trail.length
          ctx.globalAlpha = opacity

          // Design de la trainée des notes
          ctx.shadowBlur = 16
          ctx.shadowColor = note.color
          ctx.beginPath();
          ctx.font = "18px sans-serif"
          ctx.fillStyle = note.color
          ctx.fillText(note.shape, pos.x, pos.y);
          ctx.fill();
        });
        
        // Design des notes de musiques
        ctx.font = "20px sans-serif"
        ctx.fillStyle = note.color
        ctx.fillText(note.shape, note.x, note.y, canvas.width)
        ctx.globalAlpha = 1
      });
    };

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = backgroundGradiant;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      trySpawnWave();
      updateFlyingNotes();
      drawFlyingNotes();

      t += 0.016;
      animationId = requestAnimationFrame(frame);
    };
    frame();

    const handleClick = async (event: MouseEvent) => {
      const clickX = event.clientX;
      const clickY = event.clientY;

      const clicked = currentFlyingNotes.find((note) => {
        const dx = note.x - clickX;
        const dy = note.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 20;
      });

      if (!clicked) return;

      try {
        const res = await fetch(
          `http://localhost:3000/coolsongs/${clicked.videoId}`,
        );
        const data: SongDetails = await res.json();

        setCollectedSongs((prev) => {
          if (prev.some((s) => s.video_id === data.video_id)) {
            return prev;
          } else {
            return [...prev, data];
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
      {collectedSongs.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDrawerOpen((prev) => !prev);
          }}
          className="bg-neutral-900 fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border border-neutral-600 flex items-center justify-center hover:bg-neutral-800 cursor-pointer"
        >
          <Music4 size={15} className="" />

          <span className="bg-cyan-500/60 absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs flex items-center justify-center">
            {collectedSongs.length}
          </span>
        </button>
      )}

      {isDrawerOpen && (
        <div
          ref={drawerRef}
          className="fixed z-50 bg-black/90 w-60 max-h-70 overflow-y-auto bottom-25 right-4 rounded"
        >
          <h2 className="flex text-amber-500/90 justify-center gap-1 mb-1 mt-2">
            {" "}
            <Music4 size={19} /> Collected notes <Music4 size={19} />
          </h2>

          {collectedSongs.map((song) => (
            <a
              key={song.video_id}
              href={`https://www.youtube.com/watch?v=${song.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-1 py-2 hover:bg-neutral-800"
            >
              <img
                src={song.thumbnail}
                alt="thumbnail"
                className="w-15 h-15 object-cover"
              />

              <div className="flex flex-col min-w-0">
                <p className="text-white text-sm truncate">{song.title}</p>
                <p className="text-neutral-300 text-xs">
                  {song.artist ?? song.uploader}
                </p>
                <p className="text-neutral-400 italic">
                  {song.video_published_at.slice(0, 4)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
