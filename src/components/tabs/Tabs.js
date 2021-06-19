import {
	useState,
	useRef,
	useEffect,
	useMemo
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
	const [navOffset, setNavOffset] = useState(0)
	const [scrollable, setScrollable] = useState(false)
	const [navStyle, setNavStyle] = useState({})
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
		width: tabWidth - 10,
	}
	animated ? tabInkStyle.transform = `translateX(${tabOffset}px)` : tabInkStyle.left = `${tabOffset}px`
	// 初始化 navList
	useEffect(() => {
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
	// 初始化 tab 长度
	useEffect(() => {
		setTimeout(() => {
			const firstTab = navRef.current.querySelector(`.${prefixCls}-tab`)
			setTabWidth(firstTab.offsetWidth + 10)
		})
	}, [])
	// 更新 scrollable
	useEffect(() => {
		setTimeout(() => {
			const dom = navScrollRef.current
			const resizeObserver = new ResizeObserver(() => {
				const navScrollWidth = navScrollRef.current.offsetWidth
				const navWidth = navRef.current.offsetWidth
				setScrollable(navScrollWidth < navWidth)
			})
			resizeObserver.observe(dom)
			return () => resizeObserver.unobserve(dom)
		})
	}, [])
	// 更新 tabOffset
	useEffect(() => {
		let tabOffset = 0
		const index = tabList.findIndex(v => v.name === selectedName)
		tabOffset += index * tabWidth
		setTabOffset(tabOffset)
	}, [selectedName, tabList, tabWidth])
	let scrollOffset;
	// 更新 navOffset
	useEffect(() => {
		setTimeout(() => {
			if (!scrollable) return;
			const navScroll = navScrollRef.current
			const nav = navRef.current
			const activeTab = navScroll.querySelector(`.${prefixCls}-tab-active`)
			const navScrollBounding = navScroll.getBoundingClientRect()
			const navBounding = nav.getBoundingClientRect()
			const activeTabBounding = activeTab.getBoundingClientRect()
			let navOffset = 0
			if (activeTabBounding.right > navScrollBounding.right) {
				navOffset = navScrollBounding.right - activeTabBounding.right + scrollOffset
			} else if (activeTabBounding.left < navScrollBounding.left) {
				navOffset = navBounding.left - activeTabBounding.left
			} else {
				navOffset = scrollOffset
			}
			setNavOffset(navOffset)
		})
	}, [scrollable, selectedName, scrollOffset])
	scrollOffset = useMemo(() => {
		const navStyle = {}
		navStyle.transform = `translateX(${navOffset}px)`
		setNavStyle(navStyle)
		return Number(navStyle.transform.slice(11, -3))
	}, [navOffset])
	const handleSelectTab = (i) => {
		const tab = tabList[i]
		if (tab.disabled) return
		setSelectedName(tabList[i].name)
	}
	const handleScrollPrev = () => {
		if (-scrollOffset <= tabWidth) {
			setNavOffset(0)
		} else {
			setNavOffset((navOffset) => navOffset + tabWidth)
		}
	}
	const handleScrollNext = () => {
		const navScrollWidth = navScrollRef.current.offsetWidth
		const navWidth = navRef.current.offsetWidth
		if (navWidth - navScrollWidth <= -scrollOffset + tabWidth) {
			setNavOffset(navScrollWidth - navWidth)
		} else {
			setNavOffset((navOffset) => navOffset - tabWidth)
		}
	}
	return (
		<div className={classes} style={style}>
			<div className={navContainerClasses}>
			    <span onClick={handleScrollPrev} className={tabPreClasses}><Icon type={'chevron-left'} /></span>
          		<span onClick={handleScrollNext} className={tabNextClasses}><Icon type={'chevron-right'} /></span>
    		    <div ref={navScrollRef} className={`${prefixCls}-nav-scroll`}> 
          			<div ref={navRef} className={`${prefixCls}-nav`} style={navStyle}>
          				{
          					tabList.map((v, i) => (
          						<div key={v.name} onClick={() => handleSelectTab(i)} className={tabClasses(v)}>{v.title}</div>
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