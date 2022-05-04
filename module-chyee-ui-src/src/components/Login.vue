<template>
  <el-dialog v-model="isDialogVisualable" title="初始化" width="40%">
    <div>
      <div class="base">
        <el-select v-model="method" class="method">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
        </el-select>
        <el-input v-model="url" placeholder="请输入URL地址"  class="url" />
      </div>
      <ul class="parameter">
        <li v-for="(item,index) in parameters" :key="index">
          <el-input v-model="item.name" placeholder="参数名称" class="name" />
          <el-input v-model="item.value" placeholder="参数值" class="value" />
          <el-select v-model="item.in" class="in">
            <el-option label="query" value="query" />
            <el-option label="body" value="body" />
          </el-select>
          <el-button type="primary" class="add">增加</el-button>
          <el-button type="danger" class="delete">删除</el-button>
        </li>
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" style="width: 100px;">初始化</el-button>
        <el-button type="primary" @click="isDialogVisualable = false" style="width: 100px;">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, computed, reactive, toRefs } from 'vue'

export default defineComponent({
  name: "Login",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    name: String
  },
  setup(props, context) {
    const state = reactive({
      method: 'GET',
      url: '',
      parameters: [
        { key: '', in: 'query'}
      ]
    })
    const isDialogVisualable = computed({
      get: () => {
        return props.modelValue
      },
      set: (value) => {
        context.emit('update:modelValue',value)
      }
    })

    const parameterName = computed(() => props.name)

    return {
      ...toRefs(state),
      parameterName,
      isDialogVisualable
    }
  }
})
</script>

<style lang="scss">
.base {
  display: flex;
  .method {
    width: 80px;
    .el-input__inner {
      border-radius: 5px 0 0 5px;
    }
  }
  .url {
    flex: 1;
    .el-input__inner {
      border-radius: 0 5px 5px 0;
    }
  }
}
.parameter {
  margin: 15px 0 0 0;
  padding: 0;
  li {
    list-style: none;
    display: flex;
    .name {
      width: 140px
    }
    .value {
      flex: 1;
      padding-left: 10px;
    }
    .in {
      width: 100px;
      padding: 0 10px;
    }
  }
}
</style>