import {
	useState,
	useRef,
	useEffect
} from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import Icon from '../icon'
import Transition from '../base/Transition'

const prefixCls = 'wvi-cascader'

const Cascader = ({
	value,
	children
}) => {
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
				{value}<Icon type={'chevron-down'} size={20} className={`${prefixCls}-head-icon`} size={10} />
			</div>	
			<Transition show={isSelect}>
				<div style={{width: 100, height: 100, background: 'blue', display: isSelect ? '' : 'none'}}></div>
			</Transition>
		</div>
	)
}

export default Cascader