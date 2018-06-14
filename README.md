
```
<template>
  <div class="cube-toolbar">
    <!--展示更多操作-->
    <ul
      class="cube-toolbar-group cube-toolbar-group-more"
      v-if="moreActions"
      v-show="showMore">
      <cube-toolbar-item
        v-for="(action, index) in moreActions"
        :key="index"
        :action="action"
        @click.native="itemClick(action)"></cube-toolbar-item>
    </ul>
    <!--仅展示基础操作-->
    <ul class="cube-toolbar-group">
      <cube-toolbar-item
        v-for="(action, index) in basicActions"
        :key="index"
        :action="action"
        @click.native="itemClick(action)"></cube-toolbar-item>
    </ul>
  </div>
</template>
```
