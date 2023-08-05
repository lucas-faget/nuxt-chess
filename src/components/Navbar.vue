<script lang="ts">
    import MobileNavToggle from '@/components/MobileNavToggle.vue';
    import { routesPlay } from '@/router/routes/routesPlay'
    import Dropdown from './Dropdown.vue';

    export default {
        components: { MobileNavToggle, Dropdown },
        data() {
            return {
                menuItemsPlay: routesPlay.map((route) => ({
                    text: route.text,
                    path: route.path
                })),
                isDropdownPlayOpen: false,
                currentRoute: this.$route.path,
                isMobileNavOpen: false
            }
        },
        mounted() {
            this.$router.beforeEach((to, from, next) => {
                this.currentRoute = to.path;
                next();
            });

            document.addEventListener('click', this.handleDocumentClick);
        },
        beforeDestroy() {
            // Supprimez le gestionnaire d'événement lorsque le composant est détruit
            document.removeEventListener('click', this.handleDocumentClick);
        },
        beforeRouteUpdate(to, from, next) {
            this.currentRoute = to.path;
            next();
        },
        methods: {
            handleDocumentClick(event: Event) {
                const dropdownToggle = this.$refs.dropdownTogglePlay;

                if (dropdownToggle && dropdownToggle == event.target) {
                    this.toggleDropdownPlay();
                } else {
                    if (this.isDropdownPlayOpen) {
                        this.isDropdownPlayOpen = false;
                    }
                }
            },
            toggleDropdownPlay() {
                this.isDropdownPlayOpen = !this.isDropdownPlayOpen;
            },
            toggleMobileNav() {
                this.isMobileNavOpen = !this.isMobileNavOpen;
            }
        },
    }
</script>

<template>
    <nav class="nav">
        <div class="logo">
            <router-link to="/">
                <img src="/assets/icon/chess.svg" alt="Logo" />
            </router-link>
        </div>

        <MobileNavToggle :isMobileNavOpen="isMobileNavOpen" @click="toggleMobileNav" />

        <div class="nav-menu" :aria-expanded="isMobileNavOpen">
            <ul class="nav-ul">
                <li class="nav-li">
                    <router-link to="/">
                        <span class="nav-item">
                            home
                        </span>
                    </router-link>
                </li>

                <li class="nav-li">
                    <span class="nav-item" ref="dropdownTogglePlay">
                        Play
                    </span>
                    <div class="dropdown" v-if="isDropdownPlayOpen">
                        <Dropdown :items="menuItemsPlay"></Dropdown>
                    </div>
                </li>

                <li class="nav-li">
                    <router-link to="/learn">
                        <li class="nav-item">
                            learn
                        </li>
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
    .nav
    {
        position: absolute;
        display: flex;
        align-items: center;
        height: var(--navbar-height);
        width: 100vw;
    }

    .logo
    {
        position: relative;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-inline: 10px;
    }

    .logo img
    {
        width: 40px;
        aspect-ratio: 10px;
    }

    .mobile-nav-toggle
    {
        z-index: 1000;
        margin-right: 30px;
    }

    .nav-menu
    {
        height: 100%;
        display: flex;
    }

    .nav-ul
    {
        display: flex;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .nav-li
    {
        position: relative;
    }

    .nav-item
    {
        color: var(--color-light);
        display: flex;
        align-items: center;
        text-transform: capitalize;
    }

    .nav-item:hover
    {
        color: var(--color-gray);
        cursor: pointer;
    }

    .dropdown
    {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
    }

    .dropdown
    {
        position: absolute;
        left: 0;
        bottom: 100;
    }

    @media (min-width: 601px)
    {
        .nav
        {
            gap: 40px;
        }

        .nav-ul
        {
            gap: 40px;
        }

        .nav-li
        {
            height: 100%;
            display: flex;
            align-items: center;
        }
    }

    @media (max-width: 600px)
    {
        nav
        {
            justify-content: space-between;
        }
        
        .nav-menu
        {
            background-color: hsla(0, 0%, 15%, 0.5);
            backdrop-filter: blur(20px);
            position: fixed;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            transform: translateY(0%);
        }

        .nav-menu[aria-expanded="true"]
        {
            transform: translateY(100%);
        }

        .nav-ul
        {
            position: relative;
            left: 100px;
            flex-direction: column;
            justify-content: center;
        }

        .nav-item
        {
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
