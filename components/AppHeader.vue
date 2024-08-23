<script setup lang="ts">
const items = ref([
    {
        label: "Home",
        icon: "pi pi-home",
        route: "/",
    },
    {
        label: "Play",
        icon: "pi pi-play-circle",
        items: [
            {
                label: "Anybody",
                icon: "pi pi-users",
            },
            {
                label: "Computer",
                icon: "pi pi-microchip-ai",
            },
            {
                label: "Friend",
                icon: "pi pi-face-smile",
            },
        ],
    },
    {
        label: "3D Chess",
        icon: "pi pi-box",
        route: "/three",
    },
]);
</script>

<template>
    <div class="card m-1">
        <Menubar :model="items">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
            <template #end>
                <div class="flex gap-4">
                    <DarkModeSelector />
                    <div class="flex items-center gap-4">
                        <Button
                            type="button"
                            label="Log in"
                            severity="secondary"
                            icon="pi pi-user"
                            iconPos="left"
                        ></Button>
                        <Button
                            type="button"
                            label="Sign up"
                            severity="contrast"
                            icon="pi pi-sign-in"
                            iconPos="left"
                        ></Button>
                    </div>
                </div>
            </template>
        </Menubar>
    </div>
</template>

<style>
:root {
    --header-height: 5rem;
}
</style>
