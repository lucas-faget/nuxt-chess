import { createRouter, createWebHistory } from 'vue-router'
import { homeRoutes } from './routes/home';
import { playRoutes } from './routes/play';
import { learnRoutes } from './routes/learn';
import ErrorView from '../views/ErrorView.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		...homeRoutes,
		...playRoutes,
		...learnRoutes,
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
