import { useEffect, useRef, useState } from "react";

const specialSongIds = [
  "CjKO3qiJo0s", // charlie jay.☆ - sorry.
  "wtq6FnM3c8U", // nico's nextbots ost - sherbet lobby w/ bxnji
  "XY9S9OM119g", // selahh!!! - "Shmoovin"
  "kl-7YbMrAbc", // i9bonsai - picnic
  "cUFVR5sgbt0", // Three random guys sing together, yt channel : Chris Cooper
  "44UaY-AN6ho", // VØJ, Narvent - Memory Reboot (Music Video)
  "zuzGzcnB30o", // Sokuu - Laisse la partir
  "JP6W6bC9_m0", // capoxxo - perfect ft. oaf1 & dreamcache
  "VbJmWCuMiEM", // Concrete Blonde - Bloodletting (The Vampire Song)
  "QgFX80N34Fc", // Lazy Confessions
  "KHb-1Kysz08", // TrickYzb - PPAP2026(Music video)
  "ZPYyOtFRS4M", // favbea - play this at 1.25x speed, you'll thank me later

  "1e9B31FLT-s", // Ludovico Einaudi - Experience

  "ZoNH1HJr0OQ", // 攬佬SKAI ISYOURGOD [Poker music]
  "yupEwQ6qCd0", // 攬佬SKAI ISYOURGOD/AR [Horse racing]

  "RgqR60K5qBU", // harinezumi *all plats*
  "Ubfuj_XMynw", // master X Cellou Lamikai
  "XkmNtT_CAUc", // 中島 愛 - そんなこと裏のまた裏話でしょ？ (Full Ver.)
];

type FlyingNote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  videoId: string;
};

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    let trySpawnWave = () => {
      nextWaveIn -= 0.016;

      if (nextWaveIn <= 0) {
        const waveSize = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < waveSize; i++) {
          const videoId =
            specialSongIds[Math.floor(Math.random() * specialSongIds.length)];

          currentFlyingNotes.push({
            x: -50,
            y: Math.random() * canvas.height,
            vx: 0.5 + Math.random() * 2,
            vy: (Math.random() - 0.5) * 1,
            videoId,
          });
        }

        nextWaveIn = 15 + Math.random() * (30 - 15);
      }
    };

    const updateFlyingNotes = () => {
      currentFlyingNotes.forEach((note) => {
        note.x += note.vx;
        note.y += note.vy;
      });

      currentFlyingNotes = currentFlyingNotes.filter(
        (note) => note.x > -100 && note.y < canvas.width + 100,
      );
    };

    const drawFlyingNotes = () => {
      currentFlyingNotes.forEach((note) => {
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(note.x, note.y, 8, 0, Math.PI * 2);
        ctx.fill();
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

    const handleClick = (event: MouseEvent) => {
      const clickX = event.clientX
      const clickY = event.clientY

      const clicked = currentFlyingNotes.find(note => {
        const dx = note.x - clickX
        const dy = note.y - clickY
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < 20
      })

      if (clicked) {
        setSelectedVideoId(clicked.videoId)
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
      {selectedVideoId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <p>Note : {selectedVideoId}</p>
        </div>
      )

      }
    </>
  );
}
