import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";
import { conversor } from "../../utils/conversor";
import { Button } from "@/components/ui/button";
export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayinginState,
    playList,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffle,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer();

  const [progress, setProgress] = useState(0);

  function atualizaProgresso() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function modificaAndamento(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function terminoEpisodio() {
    if (hasNext) {
      playNext();
    } else if (isShuffle) {
      toggleShuffle();
    } else {
      clearPlayerState();
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong className="text-slate-100">Tocando Agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            alt=""
            width={292}
            height={292}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong className="text-slate-100">
            Selecione um podcast para ouvir
          </strong>
        </div>
      )}

      {episode && (
        <audio
          src={episode.url}
          ref={audioRef}
          autoPlay
          onPlay={() => setPlayinginState(true)}
          onPause={() => setPlayinginState(false)}
          loop={isLooping}
          onLoadedMetadata={atualizaProgresso}
          onEnded={terminoEpisodio}
        />
      )}

      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>{conversor(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                max={episode.duration}
                value={progress}
                onChange={modificaAndamento}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{conversor(episode?.duration ?? 0)}</span>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffle ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pause" className="mx-auto" />
            ) : (
              <img src="/play.svg" alt="Tocar" className="mx-auto" />
            )}
          </button>
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
