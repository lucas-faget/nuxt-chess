import PlayLocalView from '@/views/PlayLocalView.vue'
import { ChessVariant } from '@/enums/ChessVariant';

export const routesPlay = [
    {
        path: '/play',
        name: 'play',
        text: 'Standard',
        component: PlayLocalView,
        props: {
			variant: ChessVariant.Standard
		}
    },
    {
        path: '/play/960',
        name: 'play-960',
        text: 'Chess 960',
        component: PlayLocalView,
        props: {
			variant: ChessVariant.Chess960
		}
    },
    {
        path: '/play/4player',
        name: 'play-4player',
        text: 'Four Player Chess',
        component: PlayLocalView,
        props: {
			variant: ChessVariant.FourPlayerChess
		}
    }
];
