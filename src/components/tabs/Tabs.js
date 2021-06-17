import {
	useState,
	useRef,
	useEffect
} from 'react'
import classNames from 'classnames'
import {
	findComponentsDownward
} from '../../utils/assist'
import Icon from '../icon'

const prefixCls = 'wvi-tabs'

const Tabs = (props) => {
	const {
		style,
		children,
		animated = true,
	} = props;
	const [tabList, setTabList] = useState([])
	const [tabWidth, setTabWidth] = useState(0)
	const [tabOffset, setTabOffset] = useState(0)
	const [scrollable, setScrollable] = useState(false)
	const [selectedName, setSelectedName] = useState(props.selectedName)
	const navRef = useRef(null)
	const navScrollRef = useRef(null)
	const classes = classNames(
		`${prefixCls}`, {
			[`${prefixCls}-animated`]: animated
		}
	)
	const tabClasses = (v) => classNames(
		`${prefixCls}-tab`, {
			[`${prefixCls}-tab-active`]: v.name === selectedName,
			[`${prefixCls}-tab-disabled`]: v.disabled
		}
	)
	const tabInkClasses = classNames(
		`${prefixCls}-tab-ink`, {
			[`${prefixCls}-tab-ink-animated`]: animated
		}
	)
	const contentClasses = classNames(
		`${prefixCls}-content`, {
			[`${prefixCls}-content-animated`]: animated
		}
	)
	const navContainerClasses = classNames(
		`${prefixCls}-nav-container`, {
			[`${prefixCls}-nav-scroll-abled`]: scrollable
		}
	)
	const tabPreClasses = classNames(
		`${prefixCls}-tab-prev`, {
			[`${prefixCls}-tab-prev-disabled`]: !scrollable
		}
	)
	const tabNextClasses = classNames(
		`${prefixCls}-tab-next`, {
			[`${prefixCls}-tab-next-disabled`]: !scrollable
		}
	)
	const tabInkStyle = {
		width: tabWidth,
	}
	animated ? tabInkStyle.transform = `translateX(${tabOffset}px)` : tabInkStyle.left = `${tabOffset}px`
	useEffect(() => {
		// 初始化 navList
		const panes = findComponentsDownward(children, 'TabPane')
		const tabList = panes.map(pane => {
			const {
				title,
				name,
				disabled
			} = pane.props
			return {
				title,
				name,
				disabled
			}
		})
		setTabList(tabList)
	}, [children])
	useEffect(() => {
		// 初始化 tab 长度
		setTimeout(() => {
			const firstTab = navRef.current.querySelector(`.${prefixCls}-tab`)
			setTabWidth(firstTab.offsetWidth)
		})
	}, [])
	useEffect(() => {
		// 更新 tabOffset
		let tabOffset = 0
		const index = tabList.findIndex(v => v.name === selectedName)
		tabOffset += index * (tabWidth + 10)
		setTabOffset(tabOffset)
	}, [selectedName, tabList, tabWidth])
	useEffect(() => {
		// 更新 scrollable
		const dom = navScrollRef.current
		const resizeObserver = new ResizeObserver(() => {
			const navWidth = navRef.current.offsetWidth
			const navScrollWidth = navScrollRef.current.offsetWidth
			setScrollable(navScrollWidth < navWidth)
		})
		resizeObserver.observe(dom)
		return () => resizeObserver.unobserve(dom)
	}, [setScrollable])
	const handleClick = (i) => {
		const tab = tabList[i]
		if (tab.disabled) return
		setSelectedName(tabList[i].name)
	}
	return (
		<div className={classes} style={style}>
			<div className={navContainerClasses}>
			    <span className={tabPreClasses}><Icon type={'chevron-left'} /></span>
          		<span className={tabNextClasses}><Icon type={'chevron-right'} /></span>
    		    <div className={`${prefixCls}-nav-scroll`} ref={navScrollRef}>
          			<div className={`${prefixCls}-nav`} ref={navRef}>
          				{
          					tabList.map((v, i) => (
          						<div key={v.name} onClick={() => handleClick(i)} className={tabClasses(v)}>{v.title}</div>
          					))
          				}
          				<div className={tabInkClasses} style={tabInkStyle} />
          			</div>
    			</div>
			</div>
			<div className={contentClasses}>{children}</div>
		</div>
	)
}

export default Tabs