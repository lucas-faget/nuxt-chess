import { createRouter, createWebHistory } from 'vue-router'
import { homeRoutes } from './routes/home';
import { playRoutes } from './routes/play';
import { learnRoutes } from './routes/learn';
import ErrorView from '../views/ErrorView.vue'
import PrivateGameView from '../views/PrivateGameView.vue'

function generateAlphanumericString(length: number) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const router = createRouter({
	history: createWebHistory(),
	routes: [
		...homeRoutes,
		...playRoutes,
		...learnRoutes,
		// {
		// 	path: '/room',
		// 	redirect: () => {
		// 		const roomId = generateAlphanumericString(8);
		// 		return `/${roomId}`;
		// 	},
		// },
		// {
		// 	path: '/:roomId([A-Za-z0-9]{8})',
		// 	component: PrivateGameView,
		// 	props: (route) => ({
		// 		roomId: route.params.roomId,
		// 	}),
		// },
		{
			path: '/:pathMatch(.*)*',
			name: '404',
			component: ErrorView,
			props: {
				code: '404',
				message: 'Not Found'
			}
		}
	]
});

export default router;
