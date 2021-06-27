import Tabs from '../components/tabs'

const {
	TabPane
} = Tabs

const MyTabs = () => {
	const handleSelect = (name) => {
		console.log('name: ', name)
	}
	return (
		<Tabs selectedName={1} onSelect={handleSelect} style={{ width: 200 }}>
			<TabPane title='标签一' name={1}>111</TabPane>
			<TabPane title='标签二' name={2} disabled={true}>222</TabPane>
			<TabPane title='标签三' name={3}>333</TabPane>
			<TabPane title='标签四' name={4}>444</TabPane>
			<TabPane title='标签五' name={5}>555</TabPane>
			<TabPane title='标签六' name={6}>666</TabPane>
		</Tabs>
	)
}

export default MyTabs