import {
	useState,
	useRef
} from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import Icon from '../icon'
import Transition from '../base/Transition'
import Dropdown from '../base/Dropdown'

const prefixCls = 'wvi-cascader'

const Cascader = (props) => {
	const [isSelect, setIsSelect] = useState(false)
	const casRef = useRef(null)
	const clickOutside = () => {
		setIsSelect(false)
	}
	useClickOutside(casRef, clickOutside)
	const openSelect = () => {
		setIsSelect(true)
	}
	return (
		<div ref={casRef} className={prefixCls}>
			<div onClick={openSelect} className={`${prefixCls}-head`}>
				test<Icon type={'chevron-down'} size={10} className={`${prefixCls}-head-icon`} />
			</div>	
			<Transition show={isSelect}>
				<Dropdown style={{display: isSelect ? 'block' : 'none'}}>
					<div style={{width: 100, height: 100, background: 'blue'}}></div>
				</Dropdown>
			</Transition>
		</div>
	)
}

export default Cascader