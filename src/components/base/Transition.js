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
			// 解决动画关闭时闪烁的问题
			timeout={250}
			classNames={'transition-drop'}
		>
			{children}
		</CSSTransition>
	)
}

export default Transition