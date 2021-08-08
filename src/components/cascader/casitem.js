import Icon from '../icon'

const prefixCls = 'wvi-cascader'

const Casitem = ({
	data,
	onClick
}) => {
	return (
		<li onClick={onClick} className={`${prefixCls}-item`}>
			{ data.label }
			{ data.children && data.children.length > 0 && <Icon type={'chevron-right'} size={5} className={`${prefixCls}-item-icon`} /> }
		</li>
	)
}

export default Casitem