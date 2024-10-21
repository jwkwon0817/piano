import styles from './styles.module.scss';
import { useKeyTitleStore } from '../../stores/keyTitleStore.ts';
import { usePlayingStore } from '../../stores/playingStore.ts';

interface KeyProps {
	isWhite: boolean;
	play: (note: string) => void;
	note: string;
}

export default function Key({ note, play, isWhite = true }: KeyProps) {
	const { keyTitle } = useKeyTitleStore((state) => state);
	const { playingList } = usePlayingStore((state) => state);


	if (isWhite) {
		return (
			<div className={ styles.whiteContainer } onClick={ () => play(note) } style={ {
				transform: playingList.includes(note) ? 'translateY(4px)' : 'translateY(0)',
			} }>
				<span className={ keyTitle ? styles.visible : '' }>{ keyTitle && note }</span>
			</div>
		);
	} else {
		return (
			<div className={ styles.blackContainer } onClick={ () => play(note) } style={ {
				position: 'absolute',
				marginTop: playingList.includes(note) ? '4px' : '0',
			} }>
			</div>
		);
	}
}

