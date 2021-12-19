## 配置代码规范和风格

#### 安装插件

```bash
pnpm add -D eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue prettier vue-eslint-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### 新增如下三个文件

`.eslintrc.json` ：

```json
{
  "root": true,
  "env": {
    "es2021": true,
    "node": true,
    "browser": true
  },
  "globals": {
    "node": true
  },
  "extends": [
    //    "plugin:vue/essential",
    /** @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs */
    //    "plugin:@typescript-eslint/recommended",
    //    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    /**@see https://github.com/prettier/eslint-plugin-prettier#recommended-configuration */
    "plugin:prettier/recommended"
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "ignorePatterns": ["types/env.d.ts", "node_modules/**", "**/dist/**"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/no-v-html": "off",

    //    "space-before-blocks": "warn",
    //    "space-before-function-paren": "error",
    //    "space-in-parens": "warn",
    //    "no-whitespace-before-property": "off",
    /**
     * Having a semicolon helps the optimizer interpret your code correctly.
     * This avoids rare errors in optimized code.
     * @see https://twitter.com/alex_kozack/status/1364210394328408066
     */
    "semi": ["error", "always"]
    /**
     * This will make the history of changes in the hit a little cleaner
     */
    //    "comma-dangle": ["warn", "always-multiline"],
    /**
     * Just for beauty
     */
    //    "quotes": ["warn", "single"]
  }
}
```

`.editorconfig`：

```
root = true

[*]
charset = utf-8
# end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
ij_html_quote_style = double
max_line_length = 120
tab_width = 2
trim_trailing_whitespace = true
```

`.prettierrc.json`：

```json
{
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false,
    "semi": true,
    "vueIndentScriptAndStyle": true,
    "singleQuote": true,
    "quoteProps": "as-needed",
    "bracketSpacing": true,
    "trailingComma": "es5",
    "jsxBracketSameLine": true,
    "jsxSingleQuote": false,
    "arrowParens": "always",
    "insertPragma": false,
    "requirePragma": false,
    "proseWrap": "never",
    "htmlWhitespaceSensitivity": "ignore",
    "endOfLine": "auto",
    "rangeStart": 0
  }
```

## 配置路由

#### 安装

```bash
pnpm add vue-router@4
```

#### 配置

在 `src/router/index.ts` 中插入如下内容：

```ts
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [];
// vite：https://cn.vitejs.dev/guide/features.html#glob-import
const modules = import.meta.globEager('./module/*.ts');
for (const path in modules) {
  routes.push(...modules[path].default); // .default 代表引用到默认导出的值
}

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
```

在 `src/router/module/xxx.ts` 中写入如下：

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../../pages/Front.vue'),
  },
];

export default routes;
```

## 配置别名

在 `vite.config.js` 中：

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

const resolve = (p: string) => {
  return path.resolve(__dirname, p);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('./src'), // 配置别名
    },
  },
});
```

## 配置智能提示使用设置的别名

在 `tsconfig.json` 中配置如下：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 使用 `pinia`：

#### 安装

```bash
pnpm add pinia
```

#### 使用

1. 在 src/store/module/useTodoStore.ts 中：

```ts
import { TODOS } from '@/app/keys';
import { defineStore } from 'pinia';

interface Todo {
  text: string;
  id: number;
  isFinished: boolean;
}

interface TodoStore {
  todos: Todo[];
  filter: 'all' | 'finished' | 'unfinished';
  nextId: number;
}

export const useTodos = defineStore(TODOS, {
  state: (): TodoStore => ({
    todos: [],
    filter: 'all',
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      return state.todos.filter((todo) => todo.isFinished);
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished);
    },
    filteredTodos(): Todo[] {
      if (this.filter === 'finished') {
        return this.finishedTodos;
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos;
      } else {
        return this.todos;
      }
    },
  },
  actions: {
    addTodo(text: string) {
      this.todos.push({ text, id: this.nextId++, isFinished: false });
    },
  },
});

const todos = useTodos();

// 订阅器，state每一次变化都会执行回调函数，在此设置到本地缓存
todos.$subscribe((mutation, state) => {
  console.log(mutation.type);
  console.log(mutation.storeId);

  localStorage.setItem(TODOS, JSON.stringify({ ...state }));
});
// 初始化时，将本地缓存的内容赋值给store

const old = localStorage.getItem(TODOS);
if (old) {
  todos.$state = JSON.parse(old);
}
```

2. 在 `Todo.vue` 页面中使用：

```ts
import { ref } from 'vue';
import { useTodos } from '@/store/module/useTodoStore';
import { storeToRefs } from 'pinia';

const todoStore = useTodos(); // 先use一下，actions 和实例方法不能通过解构得到，得用实例点的方式
const { filteredTodos, filter } = storeToRefs(todoStore); // 这样解构不影响数据响应式：state和getters能被解构

const changeStatus = (id: number) => {
    const target = filteredTodos.value.find((item) => item.id === id);
    if (target) {
        target.isFinished = !target.isFinished;
    }
};

const showList = (f: 'all' | 'finished' | 'unfinished') => {
    filter.value = f;
};

const todoText = ref('');
const onAddTodo = () => {
    todoStore.addTodo(todoText.value);
    todoText.value = '';
};
```

## 使用 windicss

#### 安装

```
pnpm i -D vite-plugin-windicss windicss
```

#### 配置

看官方文档即可：[Integration for Vite | Windi CSS](https://windicss.org/integrations/vite.html)

## 使用 naive ui

#### 安装

```
pnpm i -D naive-ui vfonts unplugin-vue-components unplugin-auto-import
```

#### 配置自动按需导入

在 `vite.config.ts` 中：

```ts
// 按需引入NaiveUI
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  plugins: [
    ...
    AutoImport({
      resolvers: [NaiveUiResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  ...
})
```

## 使用 xicons 图标库

#### 安装

```
pnpm i -D @vicons/ionicons5
```

#### 使用

```vue
<template>
  <div class="py-4">
    <n-icon size="40">
      <game-controller-outline />
    </n-icon>
    <n-icon size="40" color="#0e7a0d">
      <game-controller />
    </n-icon>
  </div>
</template>

<script setup lang="ts">
  import {} from 'vue';
  import { GameControllerOutline, GameController } from '@vicons/ionicons5';
</script>

<style lang="scss" scoped></style>
```

## 配置全局 scss 样式文件

> 组件中那个不再需要任何引入即可使用该文件中的变量等全局内容

1. 创建 `style/main.scss` 文件
2. 在 `vite.config.ts` 中配置：

```ts
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/style/main.scss";',
            },
        },
    },
})
```

## vite配置环境变量

> https://cn.vitejs.dev/guide/env-and-mode.html

在 `package.json` 文件中修改如下：

```json
{
    "scripts": {
      - "dev": "vite",
      - "build": "vue-tsc --noEmit && vite build",
      + "dev": "vite --mode dev",
      + "build": "vue-tsc --noEmit && vite build --mode prod",
        "preview": "vite preview"
    },
}
```

在项目根目录下创建如下两个文件：

`.env.dev` ：

```
VITE_APP_API_URL='/api'
```

`.env.prod` ：

```
VITE_APP_API_URL='/prod-api'
```

配置 ts 智能提示，在 env.d.ts 中新增如下内容：

```ts
......

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 请求封装

#### 安装

```
pnpm add axios nprogress
pnpm add @types/nprogress -D
```

新建 `api/http.ts` ：

```ts
import { HTTP_OK, NO_PERMISSION } from '@/app/keys';
import router from '@/router';
import axios from 'axios';
import nProgress from 'nprogress';

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => error
);

request.interceptors.response.use((response) => {
  const { code, msg } = response.data || {};
  if (code === HTTP_OK) {
    return Promise.reject(msg);
  }
  if (code === NO_PERMISSION) {
    router.push({ name: 'Login' }).then();
    return Promise.reject(msg);
  }
  return response;
});

export interface ResType<T> {
  code: number;
  data?: T;
  msg: string;
  err?: string;
}

export interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>;
  post<T>(url: string, data?: unknown): Promise<ResType<T>>;
  upload<T>(url: string, data?: unknown): Promise<ResType<T>>;
  download(url: string): void;
}

const http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      nProgress.start();
      request
        .get(url, { params })
        .then((res) => {
          nProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          nProgress.done();
          reject(err.data);
        });
    });
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      nProgress.start();
      request
        .post(url, data)
        .then((res) => {
          nProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          nProgress.done();
          reject(err.data);
        });
    });
  },
  upload(url, file) {
    return new Promise((resolve, reject) => {
      nProgress.start();
      request
        .post(url, file, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          nProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          nProgress.done();
          reject(err.data);
        });
    });
  },
  download(url) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.onload = () => {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },
};

export default http;
```

新建 `api/login/login.ts and types.ts` ：

```ts
// login.ts
import http from '../http';
import type * as T from './types';

const loginApi: T.ILoginApi = {
  login(params) {
    return http.post('/login', params);
  },
};
export default loginApi;

// types.ts
export interface ILoginParams {
  username: string;
  password: string | number;
}
export interface ILoginApi {
  login: (params: ILoginParams) => Promise<any>;
}
```

> 还可以使用现有的轮子：[VueRequest](https://www.attojs.com/)

