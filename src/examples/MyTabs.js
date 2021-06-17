import Tabs from '../components/tabs/index'

const {
	TabPane
} = Tabs

const MyTabs = () => (
	<Tabs selectedName={1}>
		<TabPane title='标签一' name={1}>111</TabPane>
		<TabPane title='标签二' name={2} disabled={true}>222</TabPane>
		<TabPane title='标签三' name={3}>333</TabPane>
	</Tabs>
)

export default MyTabs