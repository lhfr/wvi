import {
	HashRouter,
	Route,
	Link
} from 'react-router-dom'
import Icon from './examples/MyIcon'
import Menu from './examples/MyMenu'
import Tabs from './examples/MyTabs'
import Cascsder from './examples/MyCascader'

const containerStyle = {
	listStyle: 'none',
	display: 'flex',
	marginBottom: 20
}

const Router = () =>
	<HashRouter>
		<ul style={containerStyle}>
		   <li><Link to='icon'>icon</Link>|</li>
     	   <li><Link to='menu'>menu</Link>|</li>
     	   <li><Link to='tabs'>tabs</Link>|</li>
     	   <li><Link to='cascader'>cascader</Link>|</li>
  		</ul>
  		<Route path='/icon' component={Icon} />
		<Route path='/menu' component={Menu} />
		<Route path='/tabs' component={Tabs} />
		<Route path='/cascader' component={Cascsder} />
	</HashRouter>

export default Router