<script setup lang="ts">
const selectedMode = ref<string>("dark");

const options = ref([
    { icon: "pi pi-sun", mode: "light" },
    { icon: "pi pi-moon", vmode: "dark" },
]);

const toggleDarkMode = () => {
    document.documentElement.classList.toggle("p-dark");
};

onMounted(() => {
    if (selectedMode.value === "dark") {
        document.documentElement.classList.add("p-dark");
    }
});
</script>

<template>
    <div class="card flex justify-center">
        <SelectButton
            v-model="selectedMode"
            :options="options"
            optionLabel="mode"
            dataKey="mode"
            aria-labelledby="custom"
            @click="toggleDarkMode"
        >
            <template #option="slotProps">
                <i :class="slotProps.option.icon"></i>
            </template>
        </SelectButton>
    </div>
</template>
