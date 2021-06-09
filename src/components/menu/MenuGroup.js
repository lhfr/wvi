import classNames from 'classnames'

const prefixCls = 'wvi-menu'

const MenuGroup = ({
	title,
	className,
	style,
	children
}) => {
	const classes = classNames(
		`${prefixCls}-item-group`,
		className
	)
	return (
		<li className={classes} style={style}>
			<div className={`${prefixCls}-item-group-title`}>{title}</div>
				<ul>
					{ children }
				</ul>
		</li>
	)
}

export default MenuGroup