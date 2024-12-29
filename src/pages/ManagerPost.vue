<script setup>
import BaseButton from "@/components/BaseButton.vue";
import NoRecord from "@/components/NoRecord.vue";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const isLoading = ref(true);
const types = ref([]);
const listBLog = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const paginatedData = ref([]);
const searchQuery = ref("");
const selectedFilterType = ref("");
const filterDate = ref("");

const router = useRouter();

const goToEdit = (id) => {
    router.push(`/editPost/${id}`);
};
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

// Phân trang
const totalPages = computed(() => {
    return listBLog.value.length > 0
        ? Math.ceil(listBLog.value.length / itemsPerPage.value)
        : 1;
});
const changePage = (page) => {
    currentPage.value = page;
    updatePaginatedData();
};

// Lấy danh sách các loại blog từ API
const getTypes = () => {
    axios
        .get(import.meta.env.VITE_BASE_API + "/types")
        .then((response) => {
            console.log("Types Response:", response.data);
            isLoading.value = true;
            types.value = response.data;
        })
        .catch((error) => {
            console.log("Error fetching types:", error);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    getTypes();
});

// Lấy danh sách tất cả các blog từ API
const getAllBlog = () => {
    isLoading.value = true;
    axios
        .get(import.meta.env.VITE_BASE_API + "/blog-manager")
        .then((response) => {
            console.log("Blog Response:", response.data);
            listBLog.value = response.data.map((blog) => ({
                ...blog,
                date: blog["created-at"]
                    ? formatDate(blog["created-at"])
                    : formatDate(new Date()),
            }));
            updatePaginatedData();
        })
        .catch((error) => {
            console.log("Error fetching blogs:", error);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    getAllBlog();
});

//Delete Blog
const deleteBlog = async (id) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BASE_API}/blog-manager/${id}`
            );
            listBLog.value = listBLog.value.filter((blog) => blog.id !== id);
            updatePaginatedData();
            Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } catch (error) {
            console.error("Error deleting blog:", error);
            Swal.fire("Error!", "Failed to delete the blog.", "error");
        }
    }
};

//Tìm kiếm và lọc
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

const updatePaginatedData = () => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    paginatedData.value = filteredData.value.slice(start, end);
};

const onSearch = () => {
    currentPage.value = 1;
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
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
        <div class="post-list" v-if="!isLoading">
            <NoRecord v-if="!listBLog.length" />
            <div v-else>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(blog, index) in paginatedData"
                                :key="blog.id"
                                @click="goToDetail(blog.id)"
                            >
                                <td>{{ blog.id }}</td>
                                <td>{{ blog.date }}</td>
                                <td>{{ blog.type }}</td>
                                <td>{{ blog.title }}</td>
                                <td>
                                    <img
                                        :src="blog.image"
                                        alt="Post Image"
                                        width="50"
                                    />
                                </td>
                                <td>{{ blog.description }}</td>
                                <td>
                                    <BaseButton
                                        btnTitle="Edit"
                                        variant="edit-color"
                                        @click.stop="goToEdit(blog.id)"
                                    />
                                </td>
                                <td>
                                    <BaseButton
                                        btnTitle="Delete"
                                        variant="delete-color"
                                        @click.stop="deleteBlog(blog.id)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Phân trang -->
                <div class="pagination">
                    <button
                        :disabled="currentPage === 1"
                        @click="changePage(currentPage - 1)"
                    >
                        &laquo;
                    </button>

                    <button
                        v-for="page in totalPages"
                        :key="page"
                        :class="{ active: currentPage === page }"
                        @click="changePage(page)"
                    >
                        {{ page }}
                    </button>

                    <button
                        :disabled="currentPage === totalPages"
                        @click="changePage(currentPage + 1)"
                    >
                        &raquo;
                    </button>
                </div>
            </div>
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

.content .filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}

.content .filter-container select,
.content .filter-container input {
    width: 30%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1.6rem;
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
}

.content .filter-container select:hover,
.content .filter-container input:hover {
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
    margin-bottom: 50px;
}
.content .table-container {
    min-height: 350px;
    margin-bottom: 50px;
    overflow-x: auto;
}

.content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.content table,
.content th,
.content td {
    border: 1px solid #ccc;
}

.content th,
.content td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
}

.content th {
    background-color: #f4f4f4;
}

.content tbody tr:hover {
    background-color: #f0f0f0;
}

.content table th:nth-child(4),
.content table td:nth-child(4) {
    width: 150px;
    max-width: 150px;
    word-wrap: break-word;
    white-space: normal;
    overflow-wrap: break-word;
}

.content table th:nth-child(6),
.content table td:nth-child(6) {
    width: 170px;
    max-width: 170px;
    word-wrap: break-word;
    white-space: normal;
    overflow-wrap: break-word;
}

.content table td:nth-child(4),
.content table td:nth-child(6) {
    text-align: left;
}

.content .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    gap: 5px;
}

.content .pagination button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 3px;
    font-size: 1.4rem;
    color: #333;
    cursor: pointer;
}

.content .pagination button.active {
    background-color: var(--purple-color);
    color: white;
    border-color: var(--purple-color);
}

.content .pagination button:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
}

.content .pagination button:hover:not(:disabled) {
    background-color: #f8dfff;
    color: #000;
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

@media (max-width: 1280px) {
    .content th,
    .content td {
        font-size: 1.4rem;
    }

    .content table th:nth-child(4),
    .content table td:nth-child(4) {
        width: 100px;
        max-width: 100px;
    }

    .content table th:nth-child(6),
    .content table td:nth-child(6) {
        width: 120px;
        max-width: 120px;
    }

    .content btn {
        min-width: 30px;
        font-size: 1.4rem;
    }
}

@media (max-width: 768px) {
    .content th,
    .content td {
        font-size: 1.2rem;
    }

    .content table th:nth-child(4),
    .content table td:nth-child(4) {
        width: 80px;
        max-width: 80px;
    }

    .content table th:nth-child(6),
    .content table td:nth-child(6) {
        width: 100px;
        max-width: 100px;
    }

    .content btn {
        min-width: 30px;
        font-size: 1.2rem;
    }
}

@media (max-width: 480px) {
    .content th,
    .content td {
        font-size: 1rem;
    }

    .content table th:nth-child(4),
    .content table td:nth-child(4) {
        width: 60px;
        max-width: 60px;
    }

    .content table th:nth-child(6),
    .content table td:nth-child(6) {
        width: 80px;
        max-width: 80px;
    }

    .content btn {
        min-width: 15px;
        font-size: 1rem;
    }
}
</style>
