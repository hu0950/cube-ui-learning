> pages/toolbar.vue

more控制是否显示"更多操作提示icon"，在switch-option组件中，点击时改变checked状态，使用watch监听变量checked，当checked的值改变时，触发事件update:value，并更新more值
```
<cube-page type="toolbar" title="Toolbar" class="option-demo">
    <div slot="content">
      <div class="options">
        <div class="option-list">
          <div class="group">
            <switch-option class="item" name="More Actions" :value="more"
              @update:value="updateMore"></switch-option>
          </div>
        </div>
      </div>
      <!--action属性传入基本操作列表，more-actions属性当全局变量more为true时传入更多操作列表，否则传入undefined-->
      <cube-toolbar
        :actions="actions"
        :more-actions="more ? moreActions : undefined"
        @click="clickHandler"
      >
      </cube-toolbar>
    </div>
</cube-page>
```

>toolbar/toolbar.vue
```
<div class="cube-toolbar">
    <!--展示更多操作-->
    <ul
      class="cube-toolbar-group cube-toolbar-group-more"
      v-if="moreActions"
      v-show="showMore">
      <!--当点击"更多操作提示icon"时，showMore为true，则显示更多操作列表-->
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
```

```
export default {
    name: COMPONENT_NAME,
    components: {
      CubeToolbarItem
    },
    props: {
      actions: {
        type: Array,
        default() {
          /* istanbul ignore next */
          return []
        }
      },
      moreActions: {
        type: Array
      }
    },
    data() {
      return {
        showMore: false
      }
    },
    computed: {
      basicActions() {
        const basicActions = this.actions.slice()
        // 当需有更多操作列表，即moreActions为true时，增加"更多操作的提示"
        this.moreActions && basicActions.push({
          icon: 'cubeic-more',
          $cubeMore: true
        })
        return basicActions
      }
    },
    methods: {
      itemClick(action) {
          // action.$cubeMore用来标识是否当前点击的是"更多操作提示符"
        if (action.$cubeMore) {
          // 若点击"更多操作提示"，展示更多操作列表，并触发事件more-click，并绑定参数showMore对外暴露
          this.showMore = !this.showMore
          this.$emit(EVENT_MORE_CLICK, this.showMore)
        } else {
          // 点击其它按钮，触发事件click，并绑定参数action对外暴露
          this.$emit(EVENT_CLICK, action)
        }
      }
    }
  }
```



>toolbar/toolbar-item.vue

根据action的type值判断是否需要显示checkbox
```
<li class="cube-toolbar-item border-right-1px">
    <cube-button :icon="action.icon">
      <cube-checkbox
        class="cube-toolbar-chb"
        v-model="action.checked"
        v-if="action.type == 'checkbox'"
        :label="action.text">
      </cube-checkbox>
      <span v-else v-html="action.text"></span>
    </cube-button>
    <i class="cube-toolbar-down"></i>
  </li>
```

