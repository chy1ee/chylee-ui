<template>
  <div class="api-doc" v-if="path">
    <div class="title" v-text="path.content.summary"></div>
    <div class="subtitle" v-text="group"></div>
    <div class="summary">
      <span class="method" v-text="path.method.toUpperCase()"></span>
      <el-input v-model="path.url" class="path" />
      <el-dropdown split-button type="danger" trigger="click" class="btn" @click="debugClickHandler">
        测 试
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>空</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="api-title">接口描述</div>
    <div>
      <span v-if="path?.content?.description" v-text="path.content.description" />
      <span v-else>无</span>
    </div>
    <div class="api-title">全局参数</div>
    <div class="globals" v-if="path?.content?._globals">
      <el-table :data="path.content._globals">
        <el-table-column label="名称" width="200" prop="name" />
        <el-table-column label="类型" width="200" prop="type" />
        <el-table-column label="值">
          <template #default="scope">
            <el-input v-model="scope.row.value" placeholder="请输入值" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="globals" v-else>无</div>
    <div class="api-title">请求参数</div>
    <div class="request">
      <el-table :data="path?.content?._parameters" row-key="name" default-expand-all>
        <el-table-column label="参数名称" width="280" prop="name" />
        <el-table-column label="参数说明" width="200" prop="description" />
        <el-table-column label="值">
          <template #default="scope">
            <el-input v-model="scope.row.value" v-if="scope.row.in" placeholder="请输入值" />
          </template>
        </el-table-column>
        <el-table-column label="请求类型"  width="120" prop="in" />
        <el-table-column label="是否必须" width="120">
          <template #default="scope">
            <span v-if="scope.row.required" style="color: red" v-text="scope.row.required"></span>
            <span v-else v-text="scope.row.required"></span>
          </template>
        </el-table-column>
        <el-table-column label="数据类型"  width="200">
          <template #default="scope">
            <span>{{ scope.row.type || scope.row.schema?.type }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="api-title">响应状态</div>
    <div class="responses" v-if="path?.content?._responses?.codes">
      <el-table :data="path.content._responses.codes" row-key="name" default-expand-all>
        <el-table-column label="状态码" prop="name" />
        <el-table-column label="说明" prop="description" />
        <el-table-column label="返回类型" prop="type" />
        <el-table-column label="schema" prop="schema"></el-table-column>
      </el-table>
    </div>
    <div class="responses" v-else>无</div>
    <div class="api-title">响应参数</div>
    <div v-if="path.content?._responses?.response">
      <el-table :data="path.content._responses.response" row-key="name" default-expand-all>
        <el-table-column label="参数名称" prop="name" />
        <el-table-column label="说明" prop="description" />
        <el-table-column label="数据类型" prop="type" />
        <el-table-column label="schema" prop="schema"></el-table-column>
      </el-table>
    </div>
    <div v-else>无</div>

    <Debug v-model="isDebugShowing" v-model:data="debugData" />

    <drag-ball value="测试" @click="debugClickHandler">
      <template v-slot:value>
        <img src="@/assets/logo.png" style="width: 4em; height: 4em; margin-top: 3px;">
      </template>
    </drag-ball>
  </div>
  <div v-else class="api-doc">
    <div class="error">接口信息不存在</div>
  </div>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
import { Session } from '@/utils/storage'
import Debug from './Debug.vue'
import DragBall from '@/components/DragBall'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: "ApiInfo",
  components: {
    Debug, DragBall
  },
  setup() {
    const route = useRoute()
    const isDebugShowing = ref(false)
    const debugData = ref({
      url: '',
      method: '',
      headers: {},
      data: {},
      params: {}
    })
    const name = route.params.name
    const group = route.params.group
    const path = computed(() => {
      const apiInfo = store.state.api.apiInfo[group]
      const paths = apiInfo?.paths
      if (paths) {
        for (const url in paths) {
          const p = paths[url]
          for (const method in p) {
            const content = p[method]
            if (content.operationId === name) {

              const _parameters = []
              if (content.parameters) {
                _parameters.push({
                  name: 'application/x-www-form-urlencoded',
                  children: content.parameters
                })
              }

              if (content.requestBody) {
                for (const type in content.requestBody.content) {
                  _parameters.push({
                    name: type,
                    children: schemasToList(apiInfo, content.requestBody.content[type].schema.$ref, 'body')
                  })
                }
              }

              content._parameters = _parameters

              if (content.security) {
                const globals = globalsFromSecurity(apiInfo?.components?.securitySchemes, content.security)
                if (globals) content._globals = globals
              }

              if (content.responses) {
                  const responses = responsesWithDefinition(apiInfo, content.responses)
                  if (responses) content._responses = responses
              }

              return {
                url,
                method,
                content
              }
            }
          }
        }
      }
      return null
    })

    const responsesWithDefinition = (apiInfo, responses) => {
      const result = {
        codes: [],
        response: []
      }
      for(const code in responses) {
        const response = {
          name: code,
          description: responses[code].description,
        }
        const content = responses[code].content
        if (content) {
          for (const key in content) {
            response.type = key
            const schema = content[key].schema
            if (schema.type)
              response.schema = schema.type
            else {
              const ref = content[key].schema.$ref
              const schema = ref.substring(ref.lastIndexOf('/') + 1, ref.length)
              response.schema = schema
              result.response.push({
                name: schema,
                children: schemasToList(apiInfo, ref)
              })
            }
          }
        }
        result.codes.push(response)
      }
      return result
    }

    const globalsFromSecurity = (securitySchemes, security) => {
      const result = []
      if (securitySchemes) {
        security.forEach((item) => {
          for(const k in item) {
            if (item[k].indexOf('global') > -1) {
              const securityDefinition = securitySchemes[k]
              result.push({
                name: securityDefinition.name,
                type: securityDefinition.in,
                value: Session.get(securityDefinition.name)
              })
            }
          }
        })
      }
      return result.length > 0 ? result : null
    }

    const schemasToList = (apiInfo, name, in2) => {
      if (!name.startsWith('#/'))
        return null

      const names = name.replace('#/', '').split('/')
      let schema = apiInfo
      names.forEach((item) => {
        schema = schema[item]
      })

      const children = []
      for (const property in schema.properties) {
        const property_ = schema.properties[property]
        const _property = {
          name: property,
          description: property_.description,
          type: property_.type,
          required: property_.required||false,
        }
        if (in2) _property.in = in2
        if (property_.$ref) {
          const schema = property_.$ref.substring(property_.$ref.lastIndexOf('/') + 1, property_.$ref.length)
          _property.type = schema
          _property.schema = schema
          const _children = schemasToList(apiInfo, property_.$ref)
          if (_children) _property.children = _children
        }
        children.push(_property)
      }
      if (children.length > 1) return children
    }

    const debugClickHandler = () => {
      try {
        const _parameters = {}
        const parameters = path.value?.content?._parameters
        if (parameters) {
          for (const key in parameters) {
            parameters[key].children.forEach((item) => {
              if (item.required && (item.value == null || item.value.trim().length == 0))
                throw new Error('参数'+item.name+'为必填参数，不允许空值')
              _parameters[item.name] = item.value || null
              if (item.in === 'body') 
                debugData.value.data[item.name] = item.value || null
              else
                debugData.value.params[item.name] = item.value || null
            })
          }
        }

        const global = path.value?.content?._globals
        if (global) {
          global.forEach((item) => {
            if (item.type === 'header')
              debugData.value.headers[item.name] = item.value || null
            else if (item.type === 'body')
              debugData.value.data[item.name] = item.value || null
            else
              debugData.value.params[item.name] = item.value || null
          })
        }
        
        if (path.value.url.indexOf("{") > -1) 
          debugData.value.url = format(path.value.url, _parameters)
        else
          debugData.value.url = path.value.url
        debugData.value.method = path.value.method

        isDebugShowing.value = true
      } catch(e) {
        ElMessageBox.alert(e.message, "错误", { type: 'error' })
      }
    }

    const format = (s, j) => {
      return s.replace(/{(\w+)}/g, function (match, key) {
        console.log(j[key])
        return typeof j[key] != 'undefined' ? j[key] : "";
      })
    }

    return {
      name,
      group,
      path,
      isDebugShowing,
      debugData,
      debugClickHandler
    }
  }
})
</script>