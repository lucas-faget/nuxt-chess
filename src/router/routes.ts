import ChessLocalView from '../views/ChessLocalView.vue'
import LearnView from '../views/LearnView.vue'

export const routes = [
	{
		path: '/chess-local',
		name: 'chess-local',
        text: 'Play',
		component: ChessLocalView,
		props: {

		}
	},
	{
		path: '/learn',
		name: 'learn',
        text: 'Learn',
		component: LearnView
	}
]