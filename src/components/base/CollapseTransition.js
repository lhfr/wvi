import {
	CSSTransition
} from 'react-transition-group'

const CollapseTransition = ({
	show,
	children
}) => {
	const handleEnter = (el) => {
		el.classList.add('collapse-transition')
		el.style.height = 0
	}
	const handleEntering = (el) => {
		el.style.height = el.scrollHeight + 'px'
		el.style.overflow = 'hidden'
	}
	const handleEntered = (el) => {
		el.classList.remove('collapse-transition')
		el.style.height = ''
		el.style.overflow = ''
	}
	const handleExit = (el) => {
		el.classList.add('collapse-transition')
		// 解决收起时子组件不显示的 bug
		el.style.display = 'block'
		el.style.height = el.scrollHeight + 'px'
		el.style.overflow = 'hidden'
	}
	const handleExiting = (el) => {
		el.style.height = 0
	}
	const handleExited = (el) => {
		el.classList.remove('collapse-transition')
		el.style.display = 'none'
		el.style.height = ''
		el.style.overflow = ''
	}
	return (
		<CSSTransition 
			in={show}
			onEnter={handleEnter}
			onEntering={handleEntering}
			onEntered={handleEntered}
			onExit={handleExit}
			onExiting={handleExiting}
			onExited={handleExited}
			timeout={200}
		>
			{children}
		</CSSTransition>
	)
}

export default CollapseTransition