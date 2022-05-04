<template>
  <el-dialog v-model="isDialogVisualable" title="调试器" width="60%" @close="closeHandler">
    <el-tabs v-model="activeName" class="result-tab">
      <el-tab-pane label="请求参数" name="parameter">
        <json-editor-vue v-model="parameter" />
      </el-tab-pane>
      <el-tab-pane label="请求结果" name="result" class="result">        
        <json-editor-vue v-model="response" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="testClickHandler" style="width: 100px;">测 试</el-button>
        <el-button type="primary" @click="isDialogVisualable = false" style="width: 100px;">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs, computed } from 'vue'
import debug from '@/utils/debug'

export default defineComponent({
  name: "Result",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    data: Object
  },
  setup(props, context) {
    const state = reactive({
      activeName: "parameter",
      parameter: props.data,
      response: {}
    })

    const isDialogVisualable = computed({
      get: () => {
        return props.modelValue
      },
      set: (value) => {
        context.emit('update:modelValue',value)
      }
    })

    const testClickHandler = () => {
      debug(state.parameter).then(res => {
        state.response = res.data || {}
        state.activeName = 'result'
      }).catch(e => {
        state.response = e
        state.activeName = 'result'
      })
    }

    const closeHandler = () => {
      state.activeName = 'parameter'
    }

    return {
      testClickHandler,
      closeHandler,
      isDialogVisualable,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="scss">
.jv-node .jv-node {
  margin: 5px 0;
}
.container {
  height: 300px;
  .json-editor-vue {
    .jsoneditor-poweredBy {
      display: none;
    }
    .full-screen {
      right: 0
    }
  }
}
</style>