import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/todo',
    component: () => import('@/pages/Todo.vue'),
  },
];

export default routes;
