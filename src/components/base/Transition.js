import {
	CSSTransition
} from 'react-transition-group'

const Transition = ({
	show,
	children
}) => {
	return (
		<CSSTransition
			in={show}
			timeout={300}
			classNames={'transition-drop'}
		>
			{children}
		</CSSTransition>
	)
}

export default Transition