import LearnPiecesView from '../../views/LearnPiecesView.vue'
import LearnOpeningsView from '../../views/LearnOpeningsView.vue'

export const learnRoutes = [
    {
        id: 1,
        text: 'Pieces',
        path: '/learn/pieces',
        name: 'learn-pieces',
        component: LearnPiecesView
    },
    {
        id: 2,
        text: 'Openings',
        path: '/learn/openings',
        name: 'learn-openings',
        component: LearnOpeningsView
    },
];
