import {
	useState,
	useMemo,
	useCallback,
	useEffect
} from 'react'

// 默认配置
const DEFAULTS = {
	// popper 放置位置
	placement: 'bottom',

	// 是否开启 GPU 加速
	gpuAcceleration: false,

	// 根据给定的像素值将 popper 从原位置进行偏移（可以是负值）
	offset: 0,

	// popper 的边界元素
	boundariesElement: 'viewport',

	// popper 与边界元素的最小距离
	boundariesPadding: 0,

	// popper 会尝试以如下顺序防止溢出，默认情况下他可能在边界元素的左边界和上边界出现溢出
	preventOverflowOrder: ['left', 'right', 'top', 'bottom'],

	// 改变 popper 位置时的选项，默认是翻转到对称面上。
	flipBehavior: 'flip',

	// popper 偏移值的修饰符，用来在偏移值应用到 popper 之前进行修改
	modifiers: [
		'shift',
		'offset',
		'preventOverflow',
		'flip',
		'applyStyle',
	],

	// 不使用的函数
	modifiersIgnored: [],
}

const isParentFixed = (element) => {
	if (element === document.body) return false
	if (window.getComputedStyle(element)['position'] === 'fixed') return true
	return element.parentNode ? isParentFixed(element.parentNode) : element
}

const setStyle = (element, styles) => {
	Object.keys(styles).forEach((prop) => {
		let unit = ''
		if (['width', 'height', 'top', 'right', 'bottom', 'left'].includes(prop) && typeof styles[prop] === 'number') unit = 'px';
		element.style[prop] = styles[prop] + unit
	});
}

const getOffsetParent = (element) => {
	const offsetParent = element.offsetParent
	return offsetParent === window.document.body || !offsetParent ?
		window.document.documentElement :
		offsetParent
}

const getScrollParent = (element) => {
	const parent = element.parentNode
	if (!parent) return element
	if (parent === window.document) {
		return window.document.body.scrollTop ? window.document.body : window.document.documentElement
	}
	if (['scroll', 'auto'].includes(window.getComputedStyle(parent)['overflow']) ||
		['scroll', 'auto'].includes(window.getComputedStyle(parent)['overflow-x']) ||
		['scroll', 'auto'].includes(window.getComputedStyle(parent)['overflow-y'])
	) return parent
	return getScrollParent(element.parentNode)
}

const getOffsetRect = (element) => {
	const elementRect = {
		width: element.offsetWidth,
		height: element.offsetHeight,
		left: element.offsetLeft,
		top: element.offsetTop,
	}
	elementRect.right = elementRect.left + elementRect.width
	elementRect.bottom = elementRect.top + elementRect.height
	return elementRect
}

const getOffsetRectRelativeToCustomParent = (element, parent) => {
	const elementRect = element.getBoundingClientRect()
	const parentRect = parent.getBoundingClientRect()
	const fixed = isParentFixed(element)
	if (fixed) {
		const scrollParent = getScrollParent(parent)
		parentRect.top += scrollParent.scrollTop
		parentRect.bottom += scrollParent.scrollTop
		parentRect.left += scrollParent.scrollLeft
		parentRect.right += scrollParent.scrollLeft
	}
	const rect = {
		top: elementRect.top - parentRect.top,
		left: elementRect.left - parentRect.left,
		bottom: elementRect.top - parentRect.top + elementRect.height,
		right: elementRect.left - parentRect.left + elementRect.width,
		width: elementRect.width,
		height: elementRect.height,
	}
	return rect
}

const getOuterSizes = (element) => {
	const _display = element.style.display
	const _visibility = element.style.visibility
	element.style.display = 'block'
	element.style.visibility = 'hidden'
	const styles = window.getComputedStyle(element)
	const y = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)
	const x = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)
	const result = {
		width: element.offsetWidth + y,
		height: element.offsetHeight + x,
	}
	element.style.display = _display
	element.style.visibility = _visibility
	return result
}

const isFunction = (target) => Object.prototype.toString.call(target) === '[object Function]'

const getOppositePlacement = (placement) => {
	const hash = {
		left: 'right',
		right: 'left',
		bottom: 'top',
		top: 'bottom'
	};
	return placement.replace(/left|right|bottom|top/g, (matched) => hash[matched]);
}

const getPopperClientRect = (popperOffsets) => {
	const offsets = { ...popperOffsets
	}
	offsets.right = offsets.left + offsets.width
	offsets.bottom = offsets.top + offsets.height
	return offsets;
}

const getOffsets = (popper, reference, placement) => {
	const popperOffsets = {}
	popperOffsets.position = isParentFixed(reference) ? 'fixed' : 'position'
	// 不清楚为什么用的是 getOffsetParent(_popper) 而不是 _popper
	const referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper))
	const popperRect = getOuterSizes(popper)
	const _placement = placement.split('-')[0]
	if (['left', 'right'].includes(_placement)) {
		popperOffsets.top = referenceOffsets.top + (referenceOffsets.height - popperRect.height) / 2
		_placement === 'left' ? (popperOffsets.left = referenceOffsets.left - popperRect.width) : (popperOffsets.left = referenceOffsets.right)
	} else {
		popperOffsets.left = referenceOffsets.left + (referenceOffsets.width - popperRect.width) / 2
		_placement === 'top' ? (popperOffsets.top = referenceOffsets.top - popperRect.height) : (popperOffsets.top = referenceOffsets.bottom)
	}
	popperOffsets.width = popperRect.width
	popperOffsets.height = popperRect.height
	popperOffsets.right = popperOffsets.left + popperOffsets.width
	popperOffsets.bottom = popperOffsets.top + popperOffsets.height
	return {
		reference: referenceOffsets,
		popper: popperOffsets
	}
}

const runModifiers = (data, modifiers) => {
	modifiers.forEach((modifier) => {
		if (isFunction(modifier) && data) data = modifier(data)
	})
	return data
}

// 内置修饰符
const MODIFIRES = {
	shift(data) {
		const {
			placement,
			offsets
		} = data
		if (!offsets) return
		const basePlacement = placement.split('-')[0]
		const shiftVariation = placement.split('-')[1]
		if (shiftVariation) {
			const {
				reference,
				popper
			} = offsets
			const shiftOffsets = {
				y: {
					start: {
						top: reference.top,
					},
					end: {
						top: reference.top + reference.height - popper.height,
					},
				},
				x: {
					start: {
						left: reference.left,
					},
					end: {
						left: reference.left + reference.width - popper.width,
					},
				},
			}
			const axis = ['bottom', 'top'].includes(basePlacement) ? 'x' : 'y'
			data.offsets.popper = { ...popper,
				...shiftOffsets[axis][shiftVariation]
			}
		}
		return data
	},
	offset(data) {
		const {
			offsets,
			options,
			placement
		} = data;
		const {
			offset
		} = options
		const {
			popper
		} = offsets
		// 根据不同方向就行修改
		if (placement.includes('left')) {
			popper.top -= offset
		} else if (placement.includes('right')) {
			popper.top += offset
		} else if (placement.includes('top')) {
			popper.left -= offset
		} else if (placement.includes('bottom')) {
			popper.left += offset
		}
		data.offsets.popper = popper
		return data
	},
	preventOverflow(data) {
		const {
			offsets,
			options,
			boundaries
		} = data
		const {
			popper
		} = offsets
		const check = {
			left() {
				return {
					left: Math.max(popper.left, boundaries.left),
				}
			},
			right() {
				let left = popper.left
				if (popper.right > data.boundaries.right) {
					left = Math.min(popper.left, data.boundaries.right - popper.width)
				}
				return {
					left,
				}
			},
			top() {
				return {
					top: Math.max(popper.top, data.boundaries.top),
				}
			},
			bottom() {
				let top = popper.top
				if (popper.bottom > data.boundaries.bottom) {
					top = Math.min(popper.top, data.boundaries.bottom - popper.height)
				}
				return {
					top,
				}
			},
		}
		options.preventOverflowOrder.forEach((direction) => {
			data.offsets.popper = Object.assign(popper, check[direction]())
		})
		return data
	},
	flip(data) {
		const {
			popper,
			reference,
			placement,
			options
		} = data
		const basePlacement = placement.split('-')[0]
		const shiftVariation = placement.split('-')[1]
		const placementOpposite = getOppositePlacement(basePlacement)
		let flipOrder = [];
		if (options.flipBehavior === 'flip') {
			flipOrder = [
				placement,
				placementOpposite
			];
		} else {
			flipOrder = options.flipBehavior;
		}
		flipOrder.forEach((step, index) => {
			if (placement !== step || flipOrder.length === index + 1) return
			const popperOffsets = getPopperClientRect(data.offsets.popper)
			const a = ['right', 'bottom'].includes(placement)
			if (
				(a && Math.floor(data.offsets.reference[basePlacement]) > Math.floor(popperOffsets[placementOpposite])) ||
				(!a && Math.floor(data.offsets.reference[basePlacement]) < Math.floor(popperOffsets[placementOpposite]))
			) {
				data.flipped = true
				data.placement = flipOrder[index + 1]
				if (shiftVariation) {
					data.placement += '-' + shiftVariation
				}
				data.offsets.popper = getOffsets(popper, reference, data.placement).popper;
			}
		});
		return data;
	},
	applyStyle(data) {
		const {
			offsets,
			options,
			popper
		} = data
		if (!offsets) return
		const style = {
			position: offsets.popper.position,
		}
		const top = Math.round(offsets.popper.top)
		const left = Math.round(offsets.popper.left)
		if (options.gpuAcceleration) {
			style.transform = `translate3d(${left}px, ${top}px, 0)`
			style.top = 0
			style.left = 0
		} else {
			style.top = top
			style.left = left
		}
		setStyle(popper, style)
		return data
	}
}

// 参考 popper.js
const usePopper = (reference, popper, options = {
	placement: 'bottom-start'
}) => {
	const [position, setPosition] = useState()
	// 重新生成修饰符列表
	const _options = useMemo(() => {
		const newOptions = { ...DEFAULTS,
			...options
		}
		newOptions.modifiers = newOptions.modifiers.map(modifier => {
			if (newOptions.modifiersIgnored.includes(modifier)) return ''
			return MODIFIRES[modifier] || modifier
		})
		return newOptions
	}, [options])
	// 计算 poper 的偏移量，注意与 reference 的偏移有关
	const _offsets = useMemo(() => {
		const _reference = reference.current
		const _popper = popper.current
		if (_popper == null) return
		const _placement = _options.placement.split('-')[0]
		return getOffsets(_popper, _reference, _placement)
	}, [reference, popper, _options])
	// 计算 poper 的边界信息
	const _boundaries = useMemo(() => {
		const _popper = popper.current
		if (_popper == null) return
		let boundaries = {}
		const {
			boundariesElement,
			boundariesPadding
		} = _options
		if (boundariesElement === 'window') {
			const {
				body
			} = window.document
			boundaries = {
				top: 0,
				left: 0,
				right: Math.max(body.clientWidth, body.scrollWidth),
				bottom: Math.max(body.clientHeight, body.scrollHeight),
			}
		} else if (boundariesElement === 'viewport') {
			const offsetParent = getOffsetParent(_popper)
			// 这里 scrollParent 应该在 offsetParent 内部
			const scrollParent = getScrollParent(_popper)
			const fixed = position === 'fixed'
			const scrollTop = fixed ? 0 : scrollParent.scrollTop
			const scrollLeft = fixed ? 0 : scrollParent.scrollLeft
			const offsetParentRect = getOffsetRect(offsetParent)
			boundaries = {
				top: 0 - (offsetParentRect.top - scrollTop),
				left: 0 - (offsetParentRect.left - scrollLeft),
				right: window.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
				bottom: window.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
			}
		} else {
			if (getOffsetParent(_popper) === boundariesElement) {
				boundaries = {
					top: 0,
					left: 0,
					right: boundariesElement.clientWidth,
					bottom: boundariesElement.clientHeight,
				}
			} else {
				boundaries = getOffsetRect(boundariesElement)
			}
		}
		boundaries.left += boundariesPadding
		boundaries.right -= boundariesPadding
		boundaries.top += boundariesPadding
		boundaries.bottom -= boundariesPadding
		return boundaries
	}, [popper, _options, position])
	const onCreate = useCallback(() => {
		_options.onCreate()
	}, [_options])
	const onUpdate = useCallback((data) => {
		_options.onUpdate(data)
	}, [_options])
	const onDestory = useCallback(() => {
		const _popper = popper.current
		if (_popper == null) return
		_popper.removeAttribute('x-placement')
		_popper.style.left = ''
		_popper.style.position = ''
		_popper.style.top = ''
		_popper.style.transform = ''
	}, [popper])
	const update = useCallback(() => {
		let data = {}
		data.placement = _options.placement
		data.offsets = _offsets
		data.boundaries = _boundaries
		data.options = _options
		data.reference = reference.current
		data.popper = popper.current
		return runModifiers(data, _options.modifiers)
	}, [reference, popper, _offsets, _boundaries, _options])
	const setupEventListeners = useCallback(() => {
		const _reference = reference.current
		if (_reference == null) return
		window.addEventListener('resize', update)
		if (_options.boundariesElement !== 'window') {
			let target = getScrollParent(_reference)
			if (target === window.document.body || target === window.document.documentElement) target = window
			target.addEventListener('scroll', update);
		}
	}, [reference, _options, update])
	const removeEventListeners = useCallback(() => {
		const _reference = reference.current
		if (_reference == null) return
		window.removeEventListener('resize', update)
		if (_options.boundariesElement !== 'window') {
			let target = getScrollParent(_reference)
			if (target === window.document.body || target === window.document.documentElement) target = window
			target.removeEventListener('scroll', update);
		}
	}, [reference, _options, update])
	// 初始并更新 popper 的信息
	useEffect(() => {
		const _reference = reference.current
		const _popper = popper.current
		_popper.setAttribute('x-placement', _options.placement)
		const position = isParentFixed(_reference) ? 'fixed' : 'absolute'
		setPosition(position)
		setStyle(_popper, {
			position
		})
	}, [reference, popper, _options])
	// 设置监听事件
	useEffect(() => {
		onCreate()
		const data = update()
		onUpdate(data)
		setupEventListeners()
		return () => {
			removeEventListeners()
			onDestory()
		}
	}, [update, onCreate, onUpdate, onDestory, setupEventListeners, removeEventListeners])
}

export default usePopper