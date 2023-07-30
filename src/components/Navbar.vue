<script lang="ts">
    import MobileNavToggle from '@/components/MobileNavToggle.vue';
    import { routes } from '@/router/routes'

    export default {
        components: { MobileNavToggle },
        data() {
            return {
                routes: routes,
                currentRoute: this.$route.path,
                isMobileNavOpen: false
            }
        },
        mounted() {
            this.$router.beforeEach((to, from, next) => {
                this.currentRoute = to.path;
                next();
            });
        },
        beforeRouteUpdate(to, from, next) {
            this.currentRoute = to.path;
            next();
        },
        methods: {
            toggleMobileNav() {
                this.isMobileNavOpen = !this.isMobileNavOpen;
            }
        },
    }
</script>

<template>
    <nav class="nav">
        <RouterLink to="/">
            <div class="logo">
                <img src="/assets/piece/white/p.svg" alt="Logo" />
            </div>
        </RouterLink>

        <MobileNavToggle :isMobileNavOpen="isMobileNavOpen" @click="toggleMobileNav" />

        <ul class="nav-ul" :aria-expanded="isMobileNavOpen">
            <RouterLink to="/">
                <li class="nav-li">
                    home
                </li>
            </RouterLink>
            <RouterLink v-for="route in routes" :key="route.name" :to="route.path">
                <li class="nav-li">
                    {{ route.text }}
                </li>
            </RouterLink>
        </ul>
    </nav>
</template>

<style scoped>
    .nav
    {
        position: absolute;
        background-color: hsla(0, 0%, 0%, 0);
        display: flex;
        align-items: center;
        height: 70px;
        width: 100vw;
    }

    .logo
    {
        position: relative;
        z-index: 1000;
        padding-inline: 10px;
    }

    .logo > img
    {
        height: 60px;
    }

    .mobile-nav-toggle
    {
        z-index: 1000;
        margin-right: 30px;
    }

    .nav-ul
    {
        display: flex;
        height: 100%;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .nav-ul > a
    {
        text-decoration: none;
    }

    .nav-li
    {
        color: var(--color-light);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        text-transform: capitalize;
    }

    .nav-li:hover
    {
        color: var(--color-gray);
        cursor: pointer;
    }

    @media (min-width: 601px)
    {
        nav
        {
            gap: 40px;
        }

        .nav-ul
        {
            gap: 40px;
        }
    }

    @media (max-width: 600px)
    {
        nav {
            justify-content: space-between;
        }
        
        .nav-ul
        {
            background-color: hsla(0, 0%, 15%, 0.5);
            backdrop-filter: blur(20px);
            position: fixed;
            top: -100%;
            left: 0;
            gap: 10px;
            width: 100%;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
            transform: translateY(0%);
        }

        .nav-ul[aria-expanded="true"]
        {
            transform: translateY(100%);
        }

        .nav-li
        {
            width: 100vw;
            font-size: 40px;
        }
    }

    @keyframes from-dark-to-light
    {
        0% {
            background-color: var(--color-dark);
        }
        100% {
            background-color: var(--color-light);
        }
    }

    @keyframes from-light-to-dark
    {
        0% {
            background-color: var(--color-light);
        }
        100% {
            background-color: var(--color-dark);
        }
    }
</style>
