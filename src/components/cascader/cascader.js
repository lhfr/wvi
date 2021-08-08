import {
	useState,
	useRef
} from 'react'
import classNames from 'classnames'
import useClickOutside from '../../hooks/useClickOutside'
import Icon from '../icon'
import Transition from '../base/Transition'
import Dropdown from '../base/Dropdown'
import Caspanel from './caspanel'

const prefixCls = 'wvi-cascader'

const Cascader = ({
	data,
	className,
	style
}) => {
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
					<Caspanel data={data} />
				</Dropdown>
			</Transition>
		</div>
	)
}

export default Cascader