import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import { routes } from "@/routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition; // Quay lại vị trí trước đó khi sử dụng nút back/forward
        } else {
            return { top: 0 }; // Cuộn lên đầu trang khi chuyển route
        }
    },
});

// createApp(App)
const app = createApp(App);
app.use(router);
app.mount("#app");
