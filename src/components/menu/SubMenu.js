import {
	useState,
	useContext,
	useCallback,
	useMemo
} from 'react'
import classNames from 'classnames'
import {
	MenuContext
} from './Menu'
import CollapseTransition from '../base/CollapseTransition'
import Icon from '../icon'

const prefixCls = 'wvi-menu'

const SubMenu = ({
	name,
	title,
	className,
	style,
	children
}) => {
	const {
		openedNames,
		handleOpen
	} = useContext(MenuContext)
	const [isOpen, setIsOpen] = useState(openedNames.includes(name));
	const classes = classNames(
		`${prefixCls}-submenu`, {
			[`${prefixCls}-opened`]: isOpen
		},
		className
	)
	const subStyle = useMemo(() => {
		const style = {}
		style.display = isOpen ? 'block' : 'none'
		return style
	}, [isOpen])
	const handleClick = useCallback(() => {
		setIsOpen(isOpen => !isOpen)
		handleOpen(name)
	}, [name, handleOpen])
	return (
		<li className={classes} style={style}>
			<div onClick={handleClick} className={`${prefixCls}-submenu-title`}>
				{title}<Icon type={'chevron-down'} size={10} className={`${prefixCls}-submenu-title-icon`} />
			</div>
			<CollapseTransition show={isOpen}>
				{/* 类似 v-show 收起时隐藏菜单 */}
				<ul className={`${prefixCls}-submenu-item`} style={subStyle}>{ children }</ul>
			</CollapseTransition>
		</li>
	)
}

export default SubMenu