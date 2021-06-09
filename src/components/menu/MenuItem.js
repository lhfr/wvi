import {
	useContext
} from 'react'
import classNames from 'classnames'
import {
	MenuContext
} from './Menu'

const prefixCls = 'wvi-menu'

const MenuItem = ({
	name,
	className,
	style,
	children
}) => {
	const {
		selectedName,
		handleSelect
	} = useContext(MenuContext)
	const classes = classNames(
		`${prefixCls}-item`, {
			[`${prefixCls}-item-active`]: selectedName === name
		},
		className
	)
	const handleClick = () => {
		selectedName !== name && handleSelect(name)
	}
	return (
		<li 
			onClick={handleClick} 
			className={classes}
			style={style}
		>
			{children}
		</li>
	)
}

export default MenuItem