import {
	useEffect
} from 'react'

const useResizeOberver = (ref, callback) => {
	useEffect(() => {
		const element = ref.current
		const resizeObserver = new ResizeObserver(callback)
		resizeObserver.observe(element)
		return () => resizeObserver.unobserve(element)
	}, [ref, callback])
}

export default useResizeOberver