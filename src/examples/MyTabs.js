import Tabs from '../components/tabs/index'

const {
	TabPane
} = Tabs

const MyTabs = () => (
	<Tabs selectedName={1}>
		<TabPane title='标签一' name={1}>111</TabPane>
		<TabPane title='标签二' name={2} disabled={true}>222</TabPane>
		<TabPane title='标签三' name={3}>333</TabPane>
		<TabPane title='标签四' name={4}>444</TabPane>
		<TabPane title='标签五' name={5}>555</TabPane>
		<TabPane title='标签六' name={6}>666</TabPane>
	</Tabs>
)

export default MyTabs