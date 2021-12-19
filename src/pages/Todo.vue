<template>
  <div class="todo-wrapper">
    <div class="tabs">
      <a :class="{ active: filter === 'all' }" @click="showList('all')">所有</a>
      <a :class="{ active: filter === 'finished' }" @click="showList('finished')">完成</a>
      <a :class="{ active: filter === 'unfinished' }" @click="showList('unfinished')">未完成</a>
    </div>
    <div class="input-wrapper">
      <input
        v-model="todoText"
        type="text"
        placeholder="请在此输入任务"
        @keydown.enter="onAddTodo"
      />
    </div>
    <div
      v-for="item in filteredTodos"
      :key="item.id"
      class="todo-item"
      :class="{ finished: filter === 'all' && item.isFinished }"
      @click="changeStatus(item.id)"
    >
      <input v-model="item.isFinished" type="checkbox" />
      <label>{{ item.text }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useTodos } from '@/store/module/useTodoStore';
  import { storeToRefs } from 'pinia';
  const todoStore = useTodos();
  const { filteredTodos, filter } = storeToRefs(todoStore);

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
</script>

<style lang="scss" scoped>
  .todo-wrapper {
    width: 300px;
    margin: 50px auto;
  }
  .tabs {
    margin-bottom: 10px;
    a {
      margin: 0 10px;
      color: royalblue;
      cursor: pointer;
      &.active {
        color: salmon;
      }
      &:hover {
        opacity: 0.5;
      }
    }
  }
  .todo-item {
    &.finished {
      text-decoration: line-through;
    }
  }
  .input-wrapper {
    margin-bottom: 15px;
  }
</style>
