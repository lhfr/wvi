import {
	useEffect
} from 'react'

const useClickOutside = (ref, callback) => {
	useEffect(() => {
		const el = ref.current
		const handleClick = (e) => {
			!el.contains(e.target) && callback()
		}
		window.addEventListener('click', handleClick)
		return () => window.removeEventListener('click', handleClick)
	}, [ref, callback])
}

export default useClickOutside