import { useEffect, useRef } from "react";
import { useCollectedSongs } from "../contexts/CollectedSongsContext";

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
  trail: { x: number; y: number }[];
  trailCounter: number;
};

export type SongDetails = {
  video_id: string;
  title: string;
  uploader: string;
  thumbnail: string;
  video_published_at: string;
  artist: string | null;
};

export function FlyingNotesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCollectedSongs } = useCollectedSongs();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

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

          const hue = Math.floor(Math.random() * 360);
          const color = `hsl(${hue}, 80%, 65%)`;

          const startY =
            headerHeight + Math.random() * (canvas.height - headerHeight);

          currentFlyingNotes.push({
            x: -50,
            y: startY,
            vx: 0.5 + Math.random() * 2,
            vy: (Math.random() - 0.5) * 1,
            videoId,
            shape,
            color,
            trailCounter: 0,
            trail: [{ x: -50, y: startY }],
          });
        }

        nextWaveIn = 15 + Math.random() * (30 - 15);
      }
    };

    const updateFlyingNotes = () => {
      currentFlyingNotes.forEach((note) => {
        note.x += note.vx;
        note.y += note.vy;
        note.trailCounter += 1;

        if (note.y < headerHeight) {
          note.vy *= -1;
        }

        if (note.trailCounter > 10) {
          note.trail.push({ x: note.x, y: note.y });

          if (note.trail.length > 5) {
            note.trail.shift();
          }

          note.trailCounter = 0;
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
          const opacity = index / note.trail.length;
          ctx.globalAlpha = opacity;

          // Design de la trainée des notes
          ctx.shadowBlur = 16;
          ctx.shadowColor = note.color;
          ctx.beginPath();
          ctx.font = "18px sans-serif";
          ctx.fillStyle = note.color;
          ctx.fillText(note.shape, pos.x, pos.y);
          ctx.fill();
        });

        // Design des notes de musiques
        ctx.font = "20px sans-serif";
        ctx.fillStyle = note.color;
        ctx.fillText(note.shape, note.x, note.y, canvas.width);
        ctx.globalAlpha = 1;
      });
    };

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [setCollectedSongs]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      />
    </>
  );
}
