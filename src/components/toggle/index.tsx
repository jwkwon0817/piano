import styles from './styles.module.scss';

interface ToggleProps {
	setToggle: (toggle: boolean) => void;
	toggle: boolean;
	className?: string;
}

export default function Toggle({ setToggle, toggle, className }: ToggleProps) {
	return (
		<div onClick={ () => {
			setToggle(!toggle);
		} } className={ [ styles.container, className ].join(' ') }>
			<div className={ styles.toggler } style={ {
				transform: toggle ? 'translateX(calc(100% + 8px))' : 'translateX(0)',
			} }>
			</div>
		</div>
	);
}
