import {
	useState,
	createContext
} from 'react'
import classNames from 'classnames'
import {
	updataOpenedNames
} from './utils'

const prefixCls = 'wvi-menu'

export const MenuContext = createContext()

const Menu = (props) => {
	const {
		onSelect,
		onOpen,
		className,
		style,
		theme = 'light',
	} = props;
	const [selectedName, setSelectedName] = useState(props.selectedName)
	const [openedNames, setOpenedNames] = useState(props.openedNames)
	const classes = classNames(
		prefixCls,
		`${prefixCls}-${theme}`,
		className
	)
	const handleSelect = (name) => {
		// 更新状态
		setSelectedName(name);
		// 执行回调事件
		onSelect(name);
	}
	const handleOpen = (name) => {
		setOpenedNames(openedNames => updataOpenedNames(openedNames, name));
		onOpen(openedNames);
	}
	return (
		<ul className={classes} style={style}>
			<MenuContext.Provider value={{selectedName, openedNames, handleSelect, handleOpen}}>
				{props.children}
			</MenuContext.Provider>
		</ul>
	)
}

export default Menu