<script lang="ts">
    export type Item = {
        text: string,
        path: string
    }

    export default {
        props: {
            items: Array<Item>
        }
    }
</script>

<template v-if="items">
    <div class="dropdown-menu">
        <template v-for="(item, index) in items" :key="index">
            <router-link :to="item.path">
                <div class="dropdown-item">
                    {{ item.text }}
                </div>
            </router-link>
        </template>
    </div>
</template>

<style scoped>
    .dropdown-menu {
        background-color: var(--color-dark);
        padding: 4px;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
    }

    .dropdown-item {
        color: var(--color-gray);
        padding: 5px 10px;
        border-radius: 8px;
        cursor: pointer;
        white-space: nowrap;
    }

    .dropdown-item:hover {
        background-color: var(--color-dark-gray);
        color: var(--color-light);
    }
</style>
