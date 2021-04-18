import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    name: 'THREE.JS',
    theme: 'pro',
    headerRender: false,
  },
  routes: [
    {
      name: '基础图形',
      path: '/',
      component: '@/pages/base/base',
    },
    {
      name: '场景',
      path: '/scene',
      component: '@/pages/scene/scene'
    },
    {
      name: '光源',
      path: '/light',
      component: '@/pages/light/light'
    },
    {
      name: '材质',
      path: '/material',
      component: '@/pages/material/material'
    }
  ],
  fastRefresh: {},
});
