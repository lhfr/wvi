import Menu from '../components/menu/index'

const {
	SubMenu,
	MenuGroup,
	MenuItem
} = Menu

const MyMenu = () => {
	const handleSelect = (name) => {
		console.log('name: ', name)
	}
	const handleOpen = (name) => {
		console.log('name: ', name)
	}
	return (
		<Menu selectedName={1} openedNames={['sub1']} onSelect={handleSelect} onOpen={handleOpen} style={{ width: 200 }}>
		    <MenuItem name={1}>Doc</MenuItem>
		    <MenuItem name={2}>Blog</MenuItem>
		    <MenuItem name={3}>Github</MenuItem>
		    <MenuItem name={4}>Help</MenuItem>
		    <SubMenu title="Versions" name="sub1">
		      <MenuGroup title="history">
		        <MenuItem name={5}>3.x</MenuItem>
		        <MenuItem name={6}>2.x</MenuItem>
		        <MenuItem name={7}>1.x</MenuItem>
		      </MenuGroup>
		    </SubMenu>
		</Menu>
	)
}

export default MyMenu