import {
	useState,
	useRef
} from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import Icon from '../icon'
import Transition from '../base/Transition'
import Dropdown from '../base/Dropdown'
import classNames from 'classnames'

const prefixCls = 'wvi-cascader'

const Cascader = (props) => {
	const {
		className,
		style
	} = props;
	const [isSelect, setIsSelect] = useState(false)
	const cascaderRef = useRef(null)
	const navRef = useRef(null)
	const classes = classNames(
		`${prefixCls}`,
		className
	)
	const clickOutside = () => {
		setIsSelect(false)
	}
	useClickOutside(cascaderRef, clickOutside)
	const openSelect = () => {
		setIsSelect(true)
	}
	return (
		<div ref={cascaderRef} className={classes} style={style}>
			<div ref={navRef} onClick={openSelect} className={`${prefixCls}-nav`}>
				test<Icon type={'chevron-down'} size={10} className={`${prefixCls}-nav-icon`} />
			</div>	
			<Transition show={isSelect}>
				<Dropdown reference={navRef} style={{visibility: isSelect ? 'visible' : 'hidden'}}>
					<div style={{width: 100, height: 100, border: '1px solid #000'}}></div>
				</Dropdown>
			</Transition>
		</div>
	)
}

export default Cascader