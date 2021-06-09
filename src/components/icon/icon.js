import classNames from 'classnames'

const prefixCls = 'wvi-icon'

const Icon = ({
	type,
	size,
	color,
	className,
	style
}) => {
	const classes = classNames(
		prefixCls, {
			[`fa fa-${type}`]: !!type
		},
		className
	)
	const styles = {}
	size && (styles.size = size)
	color && (styles.color = color)
	return (
		<i className={classes} style={{...styles, ...style}} />
	)
}

export default Icon