import { Piano } from '@tonejs/piano/build/piano/Piano';
import { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import styles from './App.module.scss';
import loadingLottie from './assets/lotties/Loading.json';
import { Key, Toggle } from './components';
import { useKeyTitleStore } from './stores/keyTitleStore.ts';
import { usePlayingStore } from './stores/playingStore.ts';

const keyMap = {
  '1': 'F#3',
  q: 'G3',
  '2': 'G#3',
  w: 'A3',
  '3': 'A#3',
  e: 'B3',
  r: 'C4',
  '5': 'C#4',
  t: 'D4',
  '6': 'D#4',
  y: 'E4',
  u: 'F4',
  '8': 'F#4',
  i: 'G4',
  '9': 'G#4',
  o: 'A4',
  '0': 'A#4',
  p: 'B4',
  '[': 'C5',
  '=': 'C#5',
  '\\': 'D#5',
  ']': 'D5',
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef<Piano | null>(null);
  const currentlyPressedKeys = useRef<Set<string>>(new Set());

  const [help, setHelp] = useState(false);

  const { keyTitle, setKeyTitle } = useKeyTitleStore((state) => state);
  const { playingList, setPlayingList } = usePlayingStore((state) => state);

  useEffect(() => {
    loadPiano().then(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const loadPiano = async () => {
    if (!playerRef.current) {
      const piano = new Piano({
        velocities: 5,
      });
      piano.toDestination();
      await piano.load();
      playerRef.current = piano;

      if (playerRef.current && playerRef.current.loaded) {
        setIsLoaded(true);
        console.log('Jeewon Piano loaded');
      }
    }
  };

  const play = (note: string) => {
    if (playerRef.current) {
      playerRef.current.keyDown({ note, velocity: 0.7 });
      setPlayingList([...playingList, note]);

      setTimeout(() => {
        playerRef.current?.keyUp({ note });
        setPlayingList(
          playingList.filter((playingNote) => playingNote !== note),
        );
      }, 100); // Shorter duration for note
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key as keyof typeof keyMap;

    if (keyMap[key] && !currentlyPressedKeys.current.has(key)) {
      currentlyPressedKeys.current.add(key); // Add key to the set
      play(keyMap[key]); // Play the corresponding note
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key as keyof typeof keyMap;

    if (keyMap[key]) {
      currentlyPressedKeys.current.delete(key); // Remove key from the set
    }
  };

  return isLoaded && playerRef.current ? (
    <div className={styles.container}>
      <div className={styles.keyTitleToggleContainer}>
        <p>Key Label</p>
        <Toggle setToggle={setKeyTitle} toggle={keyTitle} />
      </div>
      <div
        className={styles.help}
        onClick={() => {
          setHelp(!help);
        }}>
        <p>?</p>
        <div
          className={styles.helpContent}
          style={{
            display: help ? 'block' : 'none',
          }}>
          <p>
            <span className={styles.codeBlock}>Q</span>부터 시작해서
          </p>
          <p>
            <span className={styles.codeBlock}>]</span>까지의 키보드를
            눌러보세요!
          </p>
          <p>숫자 부분은 반음을 표현할 수 있습니다!</p>
        </div>
      </div>
      <div className={styles.keyboardContainer}>
        <Keyboard play={play} octave={2} />
        <Keyboard play={play} octave={3} />
        <Keyboard play={play} />
        <Keyboard play={play} octave={5} />
        <Keyboard play={play} octave={6} />
      </div>
    </div>
  ) : (
    <div className={styles.loadingContainer}>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: loadingLottie,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={200}
        width={200}
      />
    </div>
  );
}

function Keyboard({
  octave = 4,
  play,
}: {
  octave?: number;
  play: (note: string) => void;
}) {
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(
    (note) => `${note}${octave}`,
  );
  const blackKeys = ['C#', 'D#', null, 'F#', 'G#', 'A#'].map(
    (note) => note && `${note}${octave}`,
  );

  return (
    <div className={styles.keyboard}>
      {whiteKeys.map((note, index) => (
        <Key note={note} key={index} isWhite={true} play={play} />
      ))}
      <div className={styles.black}>
        {blackKeys.map(
          (note, index) =>
            note && <Key note={note} key={index} isWhite={false} play={play} />,
        )}
      </div>
    </div>
  );
}

export default App;
