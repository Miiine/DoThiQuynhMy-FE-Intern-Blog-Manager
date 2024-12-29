<script setup>
const props = defineProps({
    btnTitle: String,
    variant: String,
});
</script>

<template>
    <button :class="`base-button ${variant}`">
        {{ btnTitle }}
    </button>
</template>

<style scoped>
.base-button {
    padding: 6px 14px;
    /* min-width: 60px; */
    background-color: var(--purple-color);
    border-radius: 6px;
    border: none;
    font-weight: 500;
    font-size: 1.6rem;
    text-align: center;
    color: var(--white-color);
    cursor: pointer;
}
.base-button:hover {
    background-color: #5442ab;
}
.primary {
    background-color: var(--purple-color);
}
.edit-color {
    background-color: rgb(93, 93, 255);
}
.edit-color:hover {
    background-color: rgb(50, 50, 204);
}
.delete-color {
    background-color: rgb(249, 73, 73);
}
.delete-color:hover {
    background-color: rgb(204, 50, 50);
}
</style>
