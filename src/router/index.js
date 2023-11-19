import { createRouter, createWebHistory } from "vue-router";
import { useMenuStore } from "../stores/menu";

const routes = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/SignupForm.vue")
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("@/views/FriendsView.vue")
  },
  {
    path: "/friends/discover/:profile_id",
    name: "discover-profile",
    component: () => import("@/views/UserProfileView.vue")
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("@/views/NotificationsView.vue")
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "login"
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "bg-blue-400 rounded"
});

router.beforeEach(async (to, from, next) => {
  const store = useMenuStore();

  if (store.menuOpen) {
    store.menuOpen = false;
  }

  next();
});

export default router;
