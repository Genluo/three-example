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
    },
    {
      name: '粒子和精灵',
      path: '/particle',
      routes: [
        {
          name: '基础',
          path: '/particle/particle',
          component: '@/pages/particle/particle',
        },
        {
          name: '水滴',
          path: '/particle/raindrops',
          component: '@/pages/particle/raindrops'
        },
      ]
    },
    {
      name: '几何体',
      path: '/geometry',
      component: '@/pages/geometry/geometry',
    },
    {
      name: "高阶组件",
      path: '/graphics',
      routes: [
        {
          name: '组合&合并',
          path: "/graphics/base",
          component: '@/pages/graphics/base'
        },
        {
          name: '基础模型',
          path: "/graphics/model",
          component: '@/pages/graphics/model'
        },
        {
          name: '汽车模型',
          path: "/graphics/carModel",
          component: '@/pages/graphics/carModel'
        }
      ]
    },
    {
      name: '动画',
      path: '/animate',
      routes: [
        {
          name: '鼠标事件',
          path: '/animate/base',
          component: '@/pages/animate/base'
        },
        {
          name: '变形&骨骼动画',
          path: '/animate/animate',
          component: '@/pages/animate/animate'
        }
      ]
    },
    {
      name: '初始化',
      path: '/init',
      routes: [{
        name: '点的绘制',
        path: '/init/webgl',
        component: '@/pages/init/index'
      }, {
        name: '三角形绘制',
        path: '/init/triangles',
        component: '@/pages/init/triangles'
      }, {
        name: '图片绘制',
        path: '/init/pic',
        component: '@/pages/init/pic'
      }]
    }
  ],
  fastRefresh: {},
});
