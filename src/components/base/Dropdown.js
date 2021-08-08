import {
	useState,
	useRef,
	useMemo
} from 'react'
import usePopper from '../../hooks/usePopper'

const prefixCls = 'wvi-dropdown'

const DropDown = ({
	reference,
	className,
	placement: _placement = 'bottom-start',
	style = {},
	children
}) => {
	const [placement, setPlacement] = useState(_placement)
	const popperRef = useRef()
	const styles = useMemo(() => {
		let placementStart = placement.split('-')[0];
		let placementEnd = placement.split('-')[1];
		const leftOrRight = placement === 'left' || placement === 'right';
		let transformOrigin
		if (!leftOrRight) {
			transformOrigin = placementStart === 'bottom' || (placementStart !== 'top' && placementEnd === 'start') ? 'center top' : 'center bottom';
		}
		return { ...style,
			transformOrigin
		}
	}, [placement, style])
	usePopper(reference, popperRef, {
		placement,
		computeStyle: {
			gpuAcceleration: false
		},
		preventOverflow: {
			boundariesElement: 'window'
		},
		onCreate() {},
		onUpdate(data) {
			if (data) setPlacement(data.placement)
		}
	})
	return (
		<div ref={popperRef} className={prefixCls} style={styles}>{children}</div>
	)
}

export default DropDown