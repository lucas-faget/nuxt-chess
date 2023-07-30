import type { RouteLocationNormalized } from 'vue-router';
import PlayLocalView from '@/views/PlayLocalView.vue'
import LearnView from '@/views/LearnView.vue'
import { ChessVariant } from '@/enums/ChessVariant';

export const routes = [
	{
		path: '/play',
		name: 'play',
        text: 'Play',
		component: PlayLocalView,
		props: (route: RouteLocationNormalized) => {
			const variantParam = route.query.variant || ChessVariant.Standard;
	  
			switch (variantParam) {
				case ChessVariant.Standard:
					return {
						variant: ChessVariant.Standard,
					};
				case ChessVariant.Chess360:
					return {
						variant: ChessVariant.Chess360,
					};
				case ChessVariant.FourPlayerChess:
					return {
					variant: ChessVariant.FourPlayerChess,

					};
				default:
					return {
						variant: ChessVariant.Standard,
					};
			}
		}
	},
	{
		path: '/learn',
		name: 'learn',
        text: 'Learn',
		component: LearnView
	}
];
