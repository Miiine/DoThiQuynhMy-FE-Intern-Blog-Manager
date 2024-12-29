<script setup>
import NoRecord from "@/components/NoRecord.vue";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoading = ref(true);
const types = ref([]);
const listBLog = ref([]);
const itemsPerPage = 6;
const currentPage = ref(1);
const searchQuery = ref("");
const selectedFilterType = ref("");
const filterDate = ref("");

const goToDetail = (id) => {
    router.push(`/post/${id}`);
};

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

// Lấy danh sách các loại blog từ API
const getTypes = () => {
    axios
        .get(import.meta.env.VITE_BASE_API + "/types")
        .then((response) => {
            console.log("Types Response:", response.data);
            isLoading.value = false;
            types.value = response.data;
        })
        .catch((error) => {
            console.log("Error fetching types:", error);
            isLoading.value = false;
        });
};

// Lấy danh sách tất cả các blog từ API và cập nhật dữ liệu
const getAllBlog = () => {
    isLoading.value = true;
    axios
        .get(import.meta.env.VITE_BASE_API + "/blog-manager", {
            params: { page: currentPage.value, limit: itemsPerPage },
        })
        .then((response) => {
            console.log("Blog Response:", response.data);
            listBLog.value = [
                ...listBLog.value,
                ...response.data.map((blog) => ({
                    ...blog, // Giữ nguyên các thuộc tính của blog
                    date: blog["created-at"]
                        ? formatDate(blog["created-at"])
                        : formatDate(new Date()), // Nếu không có ngày tạo thì dùng ngày hiện tại
                })),
            ];
        })
        .catch((error) => {
            console.log("Error fetching blogs:", error);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    getTypes();
    getAllBlog();
});

//load more btn
const loadMoreBlogs = () => {
    currentPage.value++;
    getAllBlog();
};

// Tìm kiêm và lọc
const filteredData = computed(() => {
    return listBLog.value.filter((blog) => {
        const matchesSearch = blog.title
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());

        const matchesType =
            !selectedFilterType.value || blog.type === selectedFilterType.value;

        const matchesDate =
            !filterDate.value || blog.date === formatDate(filterDate.value);

        return matchesSearch && matchesType && matchesDate;
    });
});

const onSearch = () => {
    currentPage.value = 1; // Reset về trang đầu tiên
    updatePaginatedData();
};

const onFilterChange = () => {
    currentPage.value = 1;
    updatePaginatedData();
};
</script>

<template>
    <div class="content">
        <div class="search-box">
            <input
                type="text"
                placeholder="Search by title..."
                v-model="searchQuery"
                @input="onSearch"
            />
            <i class="fa fa-search fa-fw"></i>
        </div>
        <div class="filter-container">
            <select v-model="selectedFilterType" @change="onFilterChange">
                <option value="">All Types</option>
                <option v-for="type in types" :key="type.id" :value="type.name">
                    {{ type.name }}
                </option>
            </select>
            <input type="date" v-model="filterDate" @change="onFilterChange" />
        </div>
        <h3>all post</h3>

        <div class="post-list" v-if="!isLoading">
            <NoRecord v-if="!listBLog.length" />
            <div
                class="post-item"
                v-else
                v-for="(blog, index) in filteredData"
                :key="blog.id"
            >
                <img :src="blog.image" alt="Post Image" width="50" />
                <div class="post-content">
                    <div class="post-infor">
                        <p class="type">
                            Type: <b>{{ blog.type }}</b>
                        </p>
                        <p class="date">
                            Date: <b>{{ blog.date }}</b>
                        </p>
                    </div>
                    <p class="author">By: <b>Quynh My</b></p>
                    <a class="title" @click="goToDetail(blog.id)">{{
                        blog.title
                    }}</a>
                    <p class="desc">
                        {{ blog.description }}
                    </p>
                </div>
            </div>
        </div>
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
        <div class="loadMore-container" v-if="!isLoading">
            <a class="loadmore-btn" @click="loadMoreBlogs">Load More</a>
        </div>
    </div>
</template>

<style scoped>
.content .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--white-color);
    border-radius: 5px;
    border: #ccc 1px solid;
    padding: 20px 15px 20px 24px;
    margin: 10px 0;
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
}

.content .search-box:hover {
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.2);
}

.content .search-box input {
    font-size: 1.4rem;
    color: var(--black-color);
    flex: 1;
    border: none;
    outline: none; /*xoa duong vien khi focus*/
}
.content .search-box input::placeholder {
    color: #979797;
}

.content .search-box i {
    color: #333;
    opacity: 0.7;
    margin-left: 10px;
}

.filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}

.filter-container select,
.filter-container input {
    width: 30%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1.6rem;
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-container select:hover,
.filter-container input:hover {
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.2);
}

.content h3 {
    color: var(--gray-color);
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.6rem;
    margin: 30px 0 10px 0;
}

.content .post-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.content .post-item {
    width: 49%;
    margin-bottom: 50px;
}

.content .post-item img {
    width: 100%;
    border-radius: 10px;
}

.content .post-content {
    width: 100%;
}

.content .post-infor {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.4rem;
    text-transform: uppercase;
    color: var(--gray-color);
    font-weight: 400;
    margin-top: 10px;
}
.content .post-infor b {
    color: var(--black-color);
}

.content .post-content .author {
    font-size: 1.4rem;
    text-transform: uppercase;
    color: var(--gray-color);
    font-weight: 400;
    margin-top: 5px;
}
.content .post-content .author b {
    color: var(--black-color);
}

.content .post-content .title {
    display: inline-block;
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--black-color);
    margin: 20px 0;
}
.content .post-content .title:hover {
    color: var(--pink-color);
}
.content .post-content .desc {
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--gray-color);
}

.content .post-content .title,
.content .post-content .desc,
.content .post-infor,
.content .post-content .author {
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
}

.content .loadMore-container {
    display: flex;
    justify-self: center;
}

.content .loadmore-btn {
    display: inline-block;
    margin: 100px 0;
    padding: 10px 20px;
    color: var(--pink-color);
    font-size: 1.6rem;
    font-weight: 600;
    border: var(--pink-color) 2px solid;
    border-radius: 25px;
    min-width: 136px;
    text-align: center;
    cursor: pointer;
}

.content .loadmore-btn:hover {
    background-color: var(--pink-color);
    color: var(--white-color);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid var(--purple-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.loading-overlay p {
    margin-top: 10px;
    font-size: 1.6rem;
    color: var(--gray-color);
}

@media (max-width: 768px) {
    .content .post-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .content .post-item {
        width: 90%;
        margin-bottom: 50px;
    }
}

@media (max-width: 480px) {
    .content .post-item {
        width: 96%;
        margin-bottom: 50px;
    }

    .content .post-content .title {
        font-size: 2rem;
    }

    .content .post-content .desc {
        font-size: 1.4rem;
    }

    .content .loadmore-btn {
        font-size: 1.4rem;
        padding: 8px 16px;
    }
}
</style>
