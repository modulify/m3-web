<template>
    <section role="group" class="m3-navigation__section">
        <div v-if="'header' in $slots" class="m3-navigation__section-header">
            <slot name="header" />
        </div>

        <slot />
    </section>
</template>
