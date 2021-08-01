import {
	useEffect
} from 'react'

const useClickOutside = (ref, callback) => {
	useEffect(() => {
		const element = ref.current
		const handleClick = (event) => {
			!element.contains(event.target) && callback()
		}
		window.addEventListener('click', handleClick)
		return () => window.removeEventListener('click', handleClick)
	}, [ref, callback])
}

export default useClickOutside