<script setup>
import BaseButton from "@/components/BaseButton.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const type = ref("");
const title = ref("");
const description = ref("");
const content = ref("");
const errors = ref({});
const loading = ref(false);

const types = ref([]);

// Hàm lấy danh sách types từ API
const getTypes = () => {
    axios
        .get(import.meta.env.VITE_BASE_API + "/types")
        .then((response) => {
            loading.value = true;
            types.value = response.data;
        })
        .catch((error) => {
            console.log("Error fetching types:", error);
        })
        .finally(() => {
            loading.value = false;
        });
};

onMounted(() => {
    getTypes();
});

// Quản lý dropdown để chọn type
const selectedType = ref(null);
const showDropdown = ref(false);
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
    const selectedElement = document.querySelector(".custom-select .selected");
    if (selectedElement) {
        selectedElement.classList.toggle("active", showDropdown.value);
    }
};
const selectType = (selected) => {
    selectedType.value = selected;
    type.value = selected ? selected.name : "";
    showDropdown.value = false;
};

// Hàm validate form trước khi gửi dữ liệu
const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!type.value) {
        errors.value.type = "Please select a type.";
        isValid = false;
    }

    if (!title.value) {
        errors.value.title = "Title is required.";
        isValid = false;
    }

    if (title.value.length > 300) {
        errors.value.title = "Title must not exceed 300 characters.";
        isValid = false;
    }

    if (!description.value) {
        errors.value.description = "Description is required.";
        isValid = false;
    }

    if (!content.value) {
        errors.value.content = "Content is required.";
        isValid = false;
    }

    console.log("Errors:", errors.value);
    return isValid;
};

//Create Post
const handleCreatePost = () => {
    if (!validateForm()) {
        return;
    }
    loading.value = true;

    const formdata = {
        type: type.value,
        title: title.value,
        description: description.value,
        content: content.value,
    };

    axios
        .post(import.meta.env.VITE_BASE_API + "/blog-manager", formdata)
        .then((response) => {
            console.log("handleCreatePost", response);
            alert("Post created successfully");
            router.push("/managerPost");
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

<template>
    <div class="content">
        <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
        </div>

        <h1>Create Post</h1>
        <form @submit.prevent="handleCreatePost">
            <label for="type">Type</label>
            <div class="custom-select">
                <div class="selected" @click="toggleDropdown">
                    {{ selectedType ? selectedType.name : "Select a type" }}
                    <span class="triangle"></span>
                </div>
                <ul v-if="showDropdown" class="options">
                    <li
                        :class="{ active: !selectedType }"
                        @click="selectType(null)"
                    >
                        Select a type
                    </li>
                    <li
                        v-for="type in types"
                        :key="type.id"
                        :class="{
                            active: selectedType && selectedType.id === type.id,
                        }"
                        @click="selectType(type)"
                    >
                        {{ type.name }}
                    </li>
                </ul>
            </div>
            <p v-if="errors.type" class="error-message">{{ errors.type }}</p>
            <div class="input-group">
                <label for="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter title (maximum 300 characters)"
                    v-model="title"
                />
                <small id="title-counter">{{ title.length }}/300</small>
                <p v-if="errors.title" class="error-message">
                    {{ errors.title }}
                </p>
            </div>
            <label for="description">Description</label>
            <textarea
                name="desc"
                id="desc"
                placeholder="Enter a short description"
                v-model="description"
            ></textarea>
            <p v-if="errors.description" class="error-message">
                {{ errors.description }}
            </p>
            <label for="content">Content</label>
            <textarea
                name="content"
                id="content"
                placeholder="Enter detailed content"
                v-model="content"
            ></textarea>
            <p v-if="errors.content" class="error-message">
                {{ errors.content }}
            </p>
            <BaseButton btnTitle="Create Post" variant="primary" />
        </form>
    </div>
</template>

<style scoped>
.content form {
    display: flex;
    flex-direction: column;
    margin: 20px 0 100px 0;
    padding: 50px;
    background-color: #f3eaff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content label {
    font-weight: bold;
    margin: 20px 0 10px 0;
    color: #4a3f72;
}

.content select,
.content input,
.content textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1.6rem;
    background-color: #fff;
}

.content textarea {
    height: 300px;
}

.content .input-group {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.content .input-group small {
    color: #888;
}

.content .base-button {
    width: 150px;
    align-self: center;
    border: none;
    margin-top: 50px;
}

.error-message {
    color: red;
    font-size: 1.2rem;
    margin-top: 5px;
}

.custom-select {
    position: relative;
    width: 100%;
    font-size: 1.6rem;
}

.custom-select .selected {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.custom-select .triangle {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #4a3f72;
    margin-left: 10px;
    transform: rotate(0deg);
    transition: transform 0.3s ease;
}

.custom-select .selected:hover .triangle {
    border-top-color: #6a5b8a;
}
.custom-select .selected.active .triangle {
    transform: rotate(180deg);
}

.custom-select .options {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
}

.custom-select .options li {
    padding: 10px;
    cursor: pointer;
}

.custom-select .options li:hover {
    background-color: #f3eaff;
}

.custom-select .options li.active {
    background-color: var(--purple-color);
    color: white;
    font-weight: bold;
}

.custom-select .selected.active .triangle {
    transform: rotate(180deg);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
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

@media (max-width: 480px) {
    .content select,
    .content input,
    .content textarea,
    .content label {
        font-size: 1.4rem;
    }
}
</style>
