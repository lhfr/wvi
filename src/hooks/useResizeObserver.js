import {
	useEffect
} from 'react'

const useResizeOberver = (ref, fn) => {
	useEffect(() => {
		const el = ref.current
		const resizeObserver = new ResizeObserver(fn)
		resizeObserver.observe(el)
		return () => resizeObserver.unobserve(el)
	}, [ref, fn])
}

export default useResizeOberver