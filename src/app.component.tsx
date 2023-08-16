import { useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { pairHashpack, authenticateUser } from './hashconnect';

import styles from "./app.module.css";

const App = () => {
  const [pairingString, setPairingString] = useState('')
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    sendMessage,    
    addEventListener,
    removeEventListener,
    requestFullscreen,
    takeScreenshot,
    unload,
  } = useUnityContext({
    loaderUrl: "/unitybuild/crateclicker.loader.js",
    dataUrl: "/unitybuild/crateclicker.data",
    frameworkUrl: "/unitybuild/crateclicker.framework.js",
    codeUrl: "/unitybuild/crateclicker.wasm",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [screenshotDatas, setScreenshotDatas] = useState<string[]>([]);
  const [scores, setScores] = useState<[number, number][]>([]);

  const handleClickStartGame = (time: number) => {
    if (isLoaded === false || isPlaying === true) {
      return;
    }
    setIsPlaying(true);
    sendMessage("GameController", "StartGame", time);
  };

  const handleClickFullscreen = () => {
    if (isLoaded === false) {
      return;
    }
    requestFullscreen(true);
  };

  const handleClickScreenshot = () => {
    if (isLoaded === false) {
      return;
    }
    const screenshotData = takeScreenshot();
    if (screenshotData !== undefined) {
      setScreenshotDatas([screenshotData, ...screenshotDatas]);
    }
  };

  const handleClickUnload = async () => {
    if (isLoaded === false) {
      return;
    }
    try {
      await unload();
      console.log("Unload success");
    } catch (error) {
      console.error(`Unable to unload: ${error}`);
    }
  };

  const handleGameOver = useCallback(
    (time: number, score: number) => {
      time = Math.round(time);
      setIsPlaying(false);
      setScores([[time, score], ...scores]);
    },
    [scores]
  );
  
  
  


  useEffect(() => {
    addEventListener("PairWallet", handleGameOver);
    
    return () => {
      removeEventListener("PairWallet", handleGameOver);
      pairHashpack()
          
      
    };
  }, [handleGameOver, addEventListener, removeEventListener]);

  return (
    <div className={styles.container}>
     
      <div className={styles.unityWrapper}>
        {isLoaded === false && (
          <div className={styles.loadingBar}>
            <div
              className={styles.loadingBarFill}
              style={{ width: loadingProgression * 100 }}
            />
          </div>
        )}
        <Unity
          unityProvider={unityProvider}
          style={{ display: isLoaded ? "block" : "none" }}
        />
      </div>
      <div className="buttons">
        
        <button onClick={handleClickFullscreen}>Fullscreen</button>
        
        <button onClick={async () => {
          const saveData = await pairHashpack()
          setPairingString(saveData.pairingString)
        }}>Pair wallet</button>


      </div>
      
      <ul>
        {scores.map(([time, score]) => (
          <li key={time}>
            {score} unity send to hashconnect...
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export { App };
