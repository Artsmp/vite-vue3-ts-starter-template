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
