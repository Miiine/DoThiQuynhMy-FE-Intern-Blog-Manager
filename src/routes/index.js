import HomePage from "@/pages/HomePage.vue";
import DetailPage from "@/pages/DetailPage.vue";
import AddPost from "@/pages/AddPost.vue";
import EditPost from "@/pages/EditPost.vue";
import ManagerPost from "@/pages/ManagerPost.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

export const routes = [
    {
        path: "/",
        component: DefaultLayout,
        children: [
            {
                path: "/",
                name: "HomePage",
                component: HomePage,
            },
            {
                path: "/post/:id",
                name: "DetailPage",
                component: DetailPage,
            },
            {
                path: "/managerPost",
                name: "ManagerPost",
                component: ManagerPost,
            },
            {
                path: "/addPost",
                name: "AddPost",
                component: AddPost,
            },
            {
                path: "/editPost/:id",
                name: "EditPost",
                component: EditPost,
            },
        ],
    },
];
