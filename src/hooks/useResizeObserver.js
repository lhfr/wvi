import {
	useEffect
} from 'react'

const useResizeOberver = (ref, callback) => {
	useEffect(() => {
		const el = ref.current
		const resizeObserver = new ResizeObserver(callback)
		resizeObserver.observe(el)
		return () => resizeObserver.unobserve(el)
	}, [ref, callback])
}

export default useResizeOberver