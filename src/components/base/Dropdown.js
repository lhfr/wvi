import {
	useMemo
} from 'react'

const prefixCls = 'wvi-dropdown'

const DropDown = ({
	className,
	style,
	children
}) => {
	const styles = useMemo(() => {
		style.transformOrigin = 'center top'
		return style
	}, [style])
	return (
		<div className={prefixCls} style={styles}>{children}</div>
	)
}

export default DropDown