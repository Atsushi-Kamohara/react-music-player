import { useState, useRef } from "react";

import "./App.scss";
import "./index.scss";
import { playList } from "./songs.js";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { PlayArrow } from "@mui/icons-material";

function App() {
  const [isPlay, setPlayFlag] = useState(false);
  const [Icon, setIcon] = useState(
    <PlayArrow className="skipNextButton playerButton" />
  );
  const songs = playList();
  const [index, setIndex] = useState(0);
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(false);
  const audioRef = useRef(!null);
  const intervalRef = useRef(null);

  const playListOrder = (props) => {
    if (props === "next" && index < songs.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      return newIndex;
    } else if (props === "previous" && index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      return newIndex;
    } else {
      return index;
    }
  };

  const showDuration = () => {
    return (
      <>
        <h3 className="duration">
          {Math.floor(duration / 60)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor(duration % 60)
            .toString()
            .padStart(2, "0")}
        </h3>
      </>
    );
  };

  const setPlayIcon = () => {
    setIcon(<PlayArrow className="playArrowButton playerButton" />);
  };
  const setPauseIcon = () => {
    setIcon(<PauseIcon className="pauseButton playerButton" />);
  };

  const setSongInfo = () => {
    return (
      <>
        <audio
          className="audio"
          ref={audioRef}
          preload="metadata"
          onEnded={() => {
            setPlayIcon();
            setPlayFlag(false);
          }}
        ></audio>

        <div className="songContainer">
          <img className="coverImg" alt="cover" src={songs[index].cover} />
          <h2 className="title">{songs[index].title}</h2>
          <h3 className="artist">{songs[index].artist}</h3>
          {showDuration()}
        </div>
      </>
    );
  };

  const skipPreviousButton = () => {
    return (
      <SkipPreviousIcon
        type="button"
        className="skipPreviousButton playerButton"
        onClick={() => {
          audioRef.current.pause();
          setPlayFlag(false);

          audioRef.current.src = songs[playListOrder("previous")].audio;
          audioRef.current.play();
          setPlayFlag(true);
          setPauseIcon();
        }}
      ></SkipPreviousIcon>
    );
  };

  const playButton = () => {
    if (!isPlay) {
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor(audioRef.current.currentTime));
      }, 1000);
      return (
        <>
          <button
            type="button"
            onClick={() => {
              audioRef.current.volume = 0.3;
              audioRef.current.src = songs[index].audio;
              audioRef.current.play();
              setPlayFlag(true);
              setPauseIcon();
            }}
          >
            {Icon}
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            type="button"
            onClick={() => {
              audioRef.current.pause();
              setPlayFlag(false);
              setPlayIcon();
            }}
          >
            {Icon}
          </button>
        </>
      );
    }
  };

  const skipNextAction = () => {
    audioRef.current.pause();
    setPlayFlag(false);

    audioRef.current.src = songs[playListOrder("next")].audio;
    audioRef.current.play();
    setPlayFlag(true);
    setPauseIcon();
  };

  const skipNextButton = () => {
    return (
      <>
        <SkipNextIcon
          type="button"
          className="skipNextButton playerButton"
          onClick={skipNextAction}
        ></SkipNextIcon>
      </>
    );
  };

  const setDrawerActive = () => {
    setActive(!active);
  };

  return (
    <>
      <div
        className={`drawerHandle ${active ? "openDrawer" : ""}`}
        onClick={() => setDrawerActive()}
      ></div>
      <div className={`drawerContainer ${active ? "openDrawer" : ""}`}>
        <div className="drawer">
          <p className="playListTitle">PLAY LIST</p>
          <ul className="playList">
            {songs.map((info, i) => (
              <li className="listItem" key={i}>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    audioRef.current.volume = 0.3;
                    audioRef.current.src = songs[i].audio;
                    audioRef.current.play();
                    setPlayFlag(true);
                    setIndex(i);
                    setPauseIcon();
                  }}
                >
                  <img className="cover" src={info.cover} alt="cover"></img>
                  <div className="infoDiv">
                    <p className="title">{info.title}</p>
                    <p className="artist">{info.artist}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mainContainer">
        {setSongInfo()}

        <div className="playerContainer">
          {skipPreviousButton()}

          {playButton()}

          {skipNextButton()}
        </div>
      </div>
    </>
  );
}

export default App;
