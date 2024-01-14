import { playRoutes } from './routes/play';
import { homeRoutes } from './routes/home';
import { learnRoutes } from './routes/learn';

export const routes = [
    {
        id: 1,
        title: "Home",
        children: homeRoutes,
    },
    {
        id: 2,
        title: "Play",
        children: playRoutes,
    },
    {
        id: 3,
        title: "Learn",
        children: learnRoutes,
    },
] 
