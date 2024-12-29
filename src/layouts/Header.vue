<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const activeTab = ref("blogs");

const toAddPost = () => {
    router.push("/addPost");
};

const toHome = () => {
    activeTab.value = "blogs";
    router.push("/");
};

const toManagerPage = () => {
    activeTab.value = "manager";
    router.push("/managerPost");
};

const toTopics = () => {
    activeTab.value = "topics";
};
</script>

<template>
    <div class="header">
        <img src="/src/assets/images/logo.svg" alt="logo" class="logo" />
        <div class="nav-container">
            <ul class="nav">
                <li>
                    <a
                        :class="{ active: activeTab === 'blogs' }"
                        @click="toHome"
                        >Blogs</a
                    >
                </li>
                <li>
                    <a
                        :class="{ active: activeTab === 'manager' }"
                        @click="toManagerPage"
                        >Manager</a
                    >
                </li>
            </ul>
            <BaseButton
                btnTitle="Create"
                variant="primary"
                @click="toAddPost"
            />
        </div>
    </div>
</template>

<style scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 60vw;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--white-color);
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 5px;
    z-index: 100;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header .logo {
    width: 80px;
    height: 20px;
}

.header .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header .nav {
    display: flex;
    justify-content: space-between;
}

.header .nav li {
    list-style: none;
    margin-right: 32px;
}

.header .nav a {
    text-decoration: none;
    color: var(--black-color);
    font-weight: 600;
    font-size: 1.6rem;
}

.header .nav li:hover a {
    color: var(--pink-color);
}

.header .nav a.active {
    color: var(--pink-color);
    font-weight: bold;
}

@media (max-width: 1280px) {
    .header {
        width: 80vw;
    }
}
@media (max-width: 768px) {
    .header {
        width: 90vw;
    }
}

@media (max-width: 480px) {
    .header {
        width: 96vw;
    }
    .header .nav li {
        list-style: none;
        margin-right: 12px;
    }

    .header .nav a {
        font-size: 1.4rem;
    }
}
</style>
