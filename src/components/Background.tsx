import { useEffect, useRef, useState } from "react";
import { Music4 } from "lucide-react";

const musicVideosIds = [
  "k85mRPqvMbE", // Crazy Frog - Axel F (Official Video)
  "wtq6FnM3c8U", // nico's nextbots ost - sherbet lobby w/ bxnji
  "XY9S9OM119g", // selahh!!! - "Shmoovin"
  "Uw_hZfH5Ukc", // 9MM x LOLI SHIGURE UI
  "kl-7YbMrAbc", // i9bonsai - picnic
  "jr478w--dpE", // 3 random make an awesome song, yt channel : Jaime Maldonado
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
  '3QqnZTqZL_A', // 🎵Waluigi vs Smash Bros BATTLE RAP Part 2 🎵
  'KNp6-syx8A8', // 「完璧な姉様DE★SU★WA」ファイアーエムブレム ヒーローズ
  'e60G9pxOE-Y', // Totally Spies Theme Song (Offical Music Video)
  'IEGoyTTzQQs', // burbank - gucci gucci
  'YNRPT_2pw5A', // BEN TO opening full
  '1uqJicx-MIg', // D4DJ meme
  '85hM3RG7Ksk', // NXCRE & The Villains - TWISTED (ROCK)
  'RMNjO-rFGX4', // "just let it happen"
  'ng8mh6JUIqY', // BABYMETAL - BxMxC (OFFICIAL)
  '9mH-aj_n6AE', // カッコよすぎるお姉さんと踊りました「Crazy Shuffle / Yooh」 - NISHI【DANCERUSH World Champion】
  'IDdcA0IPxXg', // Phoenix Wright - Smooth Criminal
  '-SyBR-M2YvU', // LE TIGRE - DECEPTACON
  'yoHR8qwuqmY', // mambo-p - Proof geometric can solve love affairs
  '3qr1-yE5c6s', // Lil Mabu - RICH SCHOLAR (Official Music Video)
  'xfeys7Jfnx8', // Nice guys
  'iF2xUtCcu6Q', // bxnji - bouncin
];

type FlyingNote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  videoId: string;
};

type SongDetails = {
    video_id: string
    title: string
    uploader: string
    thumbnail: string
    video_published_at: string
    artist: string | null
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collectedSongs, setCollectedSongs] = useState<SongDetails[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
            musicVideosIds[Math.floor(Math.random() * musicVideosIds.length)];

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

    const handleClick = async (event: MouseEvent) => {
      const clickX = event.clientX
      const clickY = event.clientY

      const clicked = currentFlyingNotes.find(note => {
        const dx = note.x - clickX
        const dy = note.y - clickY
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < 20
      })

      if (!clicked) return

      try {
        const res = await fetch(`http://localhost:3000/coolsongs/${clicked.videoId}`)
        const data: SongDetails = await res.json()

        setCollectedSongs(prev => {
          if (prev.some(s => s.video_id === data.video_id)) {
            return prev
          }
          else {
            return [...prev, data]
          }
        })
      } catch (err) {
          console.error(err)
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
          onClick={() => setIsDrawerOpen(true)}
          className="bg-neutral-800 fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border border-neutral-600 flex items-center justify-center cursor-pointer"
        >
          <Music4 
            size={15}
            className=""
          />

          <span
            className="bg-cyan-500/60 absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
          >
            {collectedSongs.length}
          </span>
        </button>
      )}
    </>
  );
}
