<template>
    <div class="md:ml-[var(--aside-w)]">
        <Aside class="max-md:hidden" />
        <Header class="md:hidden" />
        <div class="min-h-screen">
            <slot />
        </div>
        <Footer />
    </div>
</template>
