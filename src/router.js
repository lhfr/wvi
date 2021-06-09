import {
	HashRouter,
	Route,
	Link
} from 'react-router-dom'
import Icon from './examples/MyIcon'
import Menu from './examples/MyMenu'

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
  		</ul>
  		<Route path='/icon' component={Icon} />
		<Route path='/menu' component={Menu} />
	</HashRouter>

export default Router