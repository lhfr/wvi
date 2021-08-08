import {
	useState
} from 'react'
import Casitem from './casitem'

const prefixCls = 'wvi-cascader'

const Caspanel = ({
	data
}) => {
	const [subList, setSubList] = useState([])
	const handleClick = (item) => {
		if (item.children && item.children.length) {
			setSubList(item.children)
		} else {
			setSubList([])
		}
	}
	return (
		<div className={`${prefixCls}-menu`}>
			<ul>
				{ data.map(item => <Casitem data={item} key={item.value} onClick={() => handleClick(item)} />) }
			</ul>
			{ subList.length ? <Caspanel data={subList} /> : null }
		</div>
	)
}

export default Caspanel