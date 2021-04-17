import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    name: 'THREE.JS',
    theme: 'pro',
  },
  routes: [
    {
      name: '基础图形',
      path: '/',
      component: '@/pages/base/base',
    },
  ],
  fastRefresh: {},
});
