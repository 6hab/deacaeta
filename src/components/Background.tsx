import { useEffect, useRef } from "react";

const specialSongIds = [
  "_fwh2va0Afg", // [Blue Archive OST] Total Assault vs Binah (Endless Carnival) | Extended Version
  "_9_848RvWPY", // Yakusa OST - Ideal For Violence
  "CjKO3qiJo0s", // charlie jay.☆ - sorry.
  "wtq6FnM3c8U", // nico's nextbots ost - sherbet lobby w/ bxnji
  "XY9S9OM119g", // selahh!!! - "Shmoovin"
  "kl-7YbMrAbc", // i9bonsai - picnic
  "cUFVR5sgbt0", // Three random guys sing together, yt channel : Chris Cooper
  "8b-WwN4H7lE", // Instupendo - Comfort Chain
  "44UaY-AN6ho", // VØJ, Narvent - Memory Reboot (Music Video)
  "zuzGzcnB30o", // Sokuu - Laisse la partir
  "zvLU4NASBrE", // heylog - healer
  "183BtLya1Hw", // i9bonsai - nthn
  "LC0RdHm1jCY", // SENSES - I Don't Wanna Change
  "X8mUdysgK3g", // Aries - SAYONARA
  "JP6W6bC9_m0", // capoxxo - perfect ft. oaf1 & dreamcache
  "VbJmWCuMiEM", // Concrete Blonde - Bloodletting (The Vampire Song)
  "vFwYJYl5GUQ", // Type O Negative - Black No. 1
  "h3kSPHcjN34", // Lost On The Moon feat. Rina Chan
  "SObAA8trKqg", // Busta Nights (Full Version)
  "tWvxQgM7QP", // Muscle March OST - PaPaPa Love
  "iRKceCMYZG", // Beattraax - Project Sexy (Extended Club Edit)
  "LWa1S3YrXd0", // ICHIGO (イチゴ) - Main dish
  "QgFX80N34Fc", // Lazy Confessions
  "hL7S9Dmt0So", // Ef - Chanel Beads
  "aDBQbWTESMM", // Ar Tonelico II - EXEC_SPHILIA/. with Lyrics
  "wELUCVMT7zI", // KC Undercover: Theme Song

  "2L0lQo0Oaow", // red 41 -
  "u8-O21UN6UI", // red 40 - unemployment

  "3gZTs-9rf2I", // H2O Just Add Water ~ Where We Belong
  "HyvxsvKyK48", // Kate Alexa - Nobody Knows - H2O: Just Add Water
  "R3ZRHsdiYvQ", // Kate Alexa - Tonight - H2O: Just Add Water

  "MUKWRdfoqBA", // Teen Titans: Theme songs
  "kdwnzTxUw7Q", // Tamiga & 2Bad - Tell Me | Official Video Extended
  "JWHbWac-QhY", // THE DIVIDE OST - Running After My Fate | JEAN-PIERRE TAIEB
  "KHb-1Kysz08", // TrickYzb - PPAP2026(Music video)
  "RJMpeYwifEU", // Magic System - Premiere Gaou
  "ZPYyOtFRS4M", // favbea - play this at 1.25x speed, you'll thank me later

  "ZKhSIYsEZFA", // The House in Fata Morgana OST - main theme
  "uAbauJc4Oxo", // The House in Fata Morgana OST - Petalouda

  "1e9B31FLT-s", // Ludovico Einaudi - Experience
  "YCIG3RaPnwA", // 【GhostFinal & FLuoRiTe】Moonlit Occultation「PGR]
  "hHjlQ5DG7KM", // Re:CREATORS Opening 1 Full

  "ZoNH1HJr0OQ", // 攬佬SKAI ISYOURGOD [Poker music]
  "yupEwQ6qCd0", // 攬佬SKAI ISYOURGOD/AR [Horse racing]

  "RgqR60K5qBU", // harinezumi *all plats*
  "Ubfuj_XMynw", // master X Cellou Lamikai
  "UxZm-LBAGZA", // Outbreak Company op Full
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
            vx: 2 + Math.random() * 2,
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

    const handleClick = (event: MouseEvent) => {};
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
  );
}
