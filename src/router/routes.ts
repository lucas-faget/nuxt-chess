import ChessView from '../views/ChessView.vue'
import ErrorView from '../views/ErrorView.vue'

export const routes = [
	{
		path: '/local',
		name: 'local',
        homeText: 'Play Locally',
		component: ChessView,
		props: {
			isLocal: true,
		}
	},
	{
		path: '/online',
		name: 'online',
        homeText: 'Play Online',
		component: ChessView,
		props: {
			isLocal: false,
		}
	},
	{
		path: '/ai',
		name: 'ai',
        homeText: 'Play Against AI',
		component: ErrorView,
		props: {
			code: '404',
			message: 'Not Found'
		}
	}
]