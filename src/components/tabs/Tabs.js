import {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
	createContext
} from 'react'
import classNames from 'classnames'
import {
	findComponentsDownward
} from '../../utils/assist'
import Icon from '../icon'
import useResizeObserver from '../../hooks/useResizeObserver'

const prefixCls = 'wvi-tabs'

export const TabsContext = createContext()

const Tabs = (props) => {
	const {
		children,
		className,
		style,
		animated = true,
		onSelect
	} = props;
	const [tabList, setTabList] = useState([])
	const [tabWidth, setTabWidth] = useState(0)
	const [tabOffset, setTabOffset] = useState(0)
	const [navOffset, setNavOffset] = useState(0)
	const [scrollable, setScrollable] = useState(false)
	const [selectedName, setSelectedName] = useState(props.selectedName)
	const navRef = useRef(null)
	const navScrollRef = useRef(null)
	const classes = classNames(
		`${prefixCls}`, {
			[`${prefixCls}-animated`]: animated
		},
		className
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
	const tabInkStyle = useMemo(() => {
		const style = {}
		style.width = tabWidth - 10
		style.transform = `translateX(${tabOffset}px)`
		return style
	}, [tabWidth, tabOffset])
	const navStyle = useMemo(() => {
		const style = {}
		style.transform = `translateX(${navOffset}px)`
		return style
	}, [navOffset])
	const contentStyle = useMemo(() => {
		const style = {}
		const tabIndex = tabList.findIndex(v => v.name === selectedName)
		style.transform = `translateX(-${tabIndex}00%)`
		return style
	}, [tabList, selectedName])
	// 初始化 tabList
	useEffect(() => {
		const panes = findComponentsDownward(children, 'TabPane')
		const list = panes.map(pane => {
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
		setTabList(list)
	}, [children])
	// 初始化 tab 长度
	useEffect(() => {
		const navFirstTab = navRef.current.querySelector(`.${prefixCls}-tab`)
		const width = navFirstTab ? navFirstTab.offsetWidth + 10 : 0
		setTabWidth(width)
	}, [tabList])
	// 更新 scrollable
	const updateScrollable = () => {
		const navScroll = navScrollRef.current
		const nav = navRef.current
		const navScrollWidth = (navScroll && navScroll.offsetWidth) || 0
		const navWidth = (nav && nav.offsetWidth) || 0
		setScrollable(navScrollWidth < navWidth)
	}
	useResizeObserver(navScrollRef, updateScrollable)
	// 点击 tab 更新 tabOffset
	useEffect(() => {
		let offset = 0
		const tabIndex = tabList.findIndex(v => v.name === selectedName)
		offset += tabIndex * tabWidth
		setTabOffset(offset)
	}, [selectedName, tabList, tabWidth])
	// 点击 tab 更新 navOffset
	useEffect(() => {
		if (!scrollable) return
		const navScroll = navScrollRef.current
		const nav = navRef.current
		const activeTab = navScroll.querySelector(`.${prefixCls}-tab-active`)
		const navScrollBounding = navScroll.getBoundingClientRect()
		const navBounding = nav.getBoundingClientRect()
		const activeTabBounding = activeTab.getBoundingClientRect()
		const currentOffset = Number(nav.style.transform.slice(11, -3)) // 防止死循环
		let offset = currentOffset
		if (activeTabBounding.right > navScrollBounding.right) offset = navScrollBounding.right - activeTabBounding.right + offset
		if (activeTabBounding.left < navScrollBounding.left) offset = navBounding.left - activeTabBounding.left
		setNavOffset(offset)
	}, [selectedName, scrollable])
	const handleSelectTab = useCallback((i) => {
		const {
			disabled,
			name
		} = tabList[i]
		if (disabled) return
		setSelectedName(name)
		onSelect(name)
	}, [tabList, onSelect])
	const handleScrollPrev = useCallback(() => {
		tabWidth <= -navOffset ? setNavOffset(offset => offset + tabWidth) : setNavOffset(0)
	}, [tabWidth, navOffset])
	const handleScrollNext = useCallback(() => {
		const navScrollWidth = navScrollRef.current.offsetWidth
		const navWidth = navRef.current.offsetWidth
		navWidth - navScrollWidth <= -navOffset + tabWidth ? setNavOffset(navScrollWidth - navWidth) : setNavOffset(offset => offset - tabWidth)
	}, [navOffset, tabWidth])
	return (
		<div className={classes} style={style}>
			<div className={navContainerClasses}>
			    <span onClick={handleScrollPrev} className={tabPreClasses}><Icon type={'chevron-left'} size={10} /></span>
          		<span onClick={handleScrollNext} className={tabNextClasses}><Icon type={'chevron-right'} size={10} /></span>
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
			<div className={`${prefixCls}-content-container`}>
     			<div className={contentClasses} style={contentStyle}>
     				<TabsContext.Provider value={{selectedName}} >
     					{children}
     				</TabsContext.Provider>
     			</div>
			</div>
		</div>
	)
}

export default Tabs