import { ChessVariant } from '@/chess/types/ChessVariant';
import TwoPlayerGameView from '../../views/TwoPlayerGameView.vue'
import FourPlayerGameView from '../../views/FourPlayerGameView.vue'

export const playRoutes = [
    {
        id: 1,
        text: 'Standard',
        path: '/play',
        name: 'play',
        component: TwoPlayerGameView,
        props: {
            variant: ChessVariant.Standard
        }
    },
    {
        id: 2,
        text: 'Fischer Random Chess',
        path: '/play/960',
        name: 'play-960',
        component: TwoPlayerGameView,
        props: {
            variant: ChessVariant.FischerRandom
        }
    },
    {
        id: 3,
        path: '/play/fog',
        name: 'play-fog',
        text: 'Fog Of War Chess',
        component: TwoPlayerGameView,
        props: {
            variant: ChessVariant.FogOfWar
        }
    },
    {
        id: 4,
        text: 'Four Player Chess',
        path: '/play/4player',
        name: 'play-4player',
        component: FourPlayerGameView,
        props: {
            variant: ChessVariant.FourPlayer
        }
    },
];
