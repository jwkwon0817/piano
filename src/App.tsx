import { useEffect, useRef, useState } from 'react';
import { Piano } from '@tonejs/piano/build/piano/Piano';
import styles from './App.module.scss';
import { Key, Toggle } from './components';
import Lottie from 'react-lottie';
import loadingLottie from './assets/lotties/Loading.json';
import { useKeyTitleStore } from './stores/keyTitleStore.ts';
import { usePlayingStore } from './stores/playingStore.ts';

const keyMap = {
	'q': 'C4',
	'2': 'C#4',
	'w': 'D4',
	'3': 'D#4',
	'e': 'E4',
	'r': 'F4',
	'5': 'F#4',
	't': 'G4',
	'6': 'G#4',
	'y': 'A4',
	'7': 'A#4',
	'u': 'B4',
};

function App() {
	const [ isLoaded, setIsLoaded ] = useState(false);
	const playerRef = useRef<Piano | null>(null);
	const currentlyPressedKeys = useRef<Set<string>>(new Set());

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
				console.log('Piano loaded');
			}
		}
	};

	const play = (note: string) => {
		if (playerRef.current) {
			playerRef.current.keyDown({ note, velocity: 0.7 });
			setPlayingList([ ...playingList, note ]);

			setTimeout(() => {
				playerRef.current?.keyUp({ note });
				setPlayingList(playingList.filter((playingNote) => playingNote !== note));
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

	return (
		isLoaded && playerRef.current ? (
			<div className={ styles.container }>
				<div className={ styles.keyTitleToggleContainer }>
					<p>Key Label</p>
					<Toggle setToggle={ setKeyTitle } toggle={ keyTitle } />
				</div>
				<div className={ styles.keyboardContainer }>
					<Keyboard play={ play } octave={ 2 } />
					<Keyboard play={ play } octave={ 3 } />
					<Keyboard play={ play } />
					<Keyboard play={ play } octave={ 5 } />
					<Keyboard play={ play } octave={ 6 } />
				</div>
			</div>
		) : (
			<div className={ styles.loadingContainer }>
				<Lottie options={ {
					loop: true,
					autoplay: true,
					animationData: loadingLottie,
					rendererSettings: {
						preserveAspectRatio: 'xMidYMid slice',
					},
				} } height={ 200 } width={ 200 } />
			</div>
		)
	);
}

function Keyboard({ octave = 4, play }: { octave?: number, play: (note: string) => void }) {
	const whiteKeys = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ].map((note) => `${ note }${ octave }`);
	const blackKeys = [ 'C#', 'D#', null, 'F#', 'G#', 'A#' ].map((note) => note && `${ note }${ octave }`);

	return (
		<div className={ styles.keyboard }>
			{ whiteKeys.map((note, index) => (
				<Key
					note={ note }
					key={ index }
					isWhite={ true }
					play={ play }
				/>
			)) }
			<div className={ styles.black }>
				{ blackKeys.map((note, index) => note && (
					<Key
						note={ note }
						key={ index }
						isWhite={ false }
						play={ play }
					/>
				)) }
			</div>
		</div>
	);
}

export default App;
