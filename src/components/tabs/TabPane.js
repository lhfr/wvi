import {
	useContext,
	useMemo
} from 'react'
import classNames from 'classnames'
import {
	TabsContext
} from './Tabs'

const prefixCls = 'wvi-tabs-tabpane';

const TabPane = ({
	name,
	children,
	className,
	style = {}
}) => {
	const {
		selectedName
	} = useContext(TabsContext)
	const classes = classNames(
		`${prefixCls}`,
		className
	)
	const contentStyle = useMemo(() => {
		style.visibility = name === selectedName ? 'visible' : 'hidden'
		return style
	}, [name, selectedName, style])
	return (
		<div className={classes} style={contentStyle}>{children}</div>
	)
}

export default TabPane