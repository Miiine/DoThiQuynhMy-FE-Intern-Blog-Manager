<script setup></script>

<template>
    <div class="no-record">
        <img src="/src/assets/images/no-record.png" alt="no record" />
        <h2>No blogs at this time!</h2>
        <p>Please add new blogs.</p>
    </div>
</template>

<style scoped>
.content .no-record {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
}

.content .no-record img {
    width: 60%;
    height: auto;
    margin-bottom: 20px;
}
.content .no-record p {
    font-size: 1.6rem;
    margin-top: 4px;
}
</style>
