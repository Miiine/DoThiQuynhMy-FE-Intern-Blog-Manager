<script setup>
import { useRoute } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";

const route = useRoute();
const id = route.params.id; // Lấy ID từ URL

const postDetail = ref(null);
const isLoading = ref(true);

// Hàm formatDate định dạng ngày thành dd/mm/yyyy
const formatDate = (date) => {
    try {
        const d =
            typeof date === "number" ? new Date(date * 1000) : new Date(date);
        if (isNaN(d)) throw new Error("Invalid date");
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
};
//Lây dữ liệu từ API
const fetchPostDetail = async (id) => {
    try {
        console.log("Fetching post detail for ID:", id);
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_API}/blog-manager/${id}`
        );
        const data = response.data;
        postDetail.value = {
            ...data,
            date: data["created-at"] ? formatDate(data["created-at"]) : "N/A", // Định dạng ngày nếu có
        };
        console.log("Post Detail:", postDetail.value);
    } catch (error) {
        console.error("Error fetching post detail:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (id) fetchPostDetail(id); // Gọi API nếu có ID
});
</script>

<template>
    <div class="content" v-if="!isLoading && postDetail">
        <p class="date">
            Date: <b>{{ postDetail.date }}</b>
        </p>
        <p class="author">By: <b>Quynh My</b></p>
        <h1 class="title">{{ postDetail.title }}</h1>
        <p class="desc">{{ postDetail.description }}</p>
        <img :src="postDetail.image" alt="post" />
        <p class="post-content">{{ postDetail.content }}</p>
    </div>

    <div v-if="isLoading" class="loading-overlay">
        <p>Loading...</p>
    </div>

    <div v-if="!isLoading && !postDetail">
        <p>Error loading post detail. Please try again later.</p>
    </div>
</template>

<style scoped>
.content {
    margin-top: 20px;
}
.content .date,
.content .author {
    font-size: 1.6rem;
    text-transform: uppercase;
    color: var(--gray-color);
    font-weight: 400;
}

.content .date b,
.content .author b {
    color: var(--black-color);
}

.content .author {
    margin-top: 5px;
}

.content .title {
    margin: 20px 0;
}

.content .desc {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 20px;
}

.content img {
    width: 80%;
    display: block;
    margin: 20px auto;
}

.content .post-content {
    color: #4a4a4a;
    font-size: 1.6rem;
    margin-bottom: 100px;
    text-align: justify;
}

@media (max-width: 480px) {
    .content .date,
    .content .author,
    .content .post-content {
        font-size: 1.4rem;
    }
    .content .desc {
        font-size: 1.6rem;
    }
}
</style>
