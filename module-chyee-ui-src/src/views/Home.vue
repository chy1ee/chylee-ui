<template>
  <div>
    <div class="row">
      <div class="title">简介</div>
      <div class="description">{{ api?.info?.description }}</div>
    </div>
    <div class="row">
      <div class="title">作者</div>
      <div class="description">{{ api?.info?.contact?.name }}</div>
    </div>
    <div class="row">
      <div class="title">版本</div>
      <div class="description">{{ api?.info?.version }}</div>
    </div>
    <div class="row">
      <div class="title">HOST</div>
      <div class="description">
        <span v-for="(item,index) in api?.servers" :key="index">{{ (index > 0 ? ',' : '') + item.url }}</span>
      </div>
    </div>
    <div class="row">
      <div class="title">baseURL</div>
      <div class="description">{{ api?.basePath }}</div>
    </div>
    <div class="row">
      <div class="title">分组名称</div>
      <div class="description">{{ group?.name }}</div>
    </div>
    <div class="row">
      <div class="title">分组URL</div>
      <div class="description">{{ group?.url }}</div>
    </div>
    <div class="row" v-if="securitySchemes.length > 0">
      <div class="title">全局参数</div>
      <div class="description security">
        <el-table :data="securitySchemes">
          <el-table-column label="名称" prop="name" width="160px" header-align="center" />
          <el-table-column label="值" prop="value" header-align="center">
            <template #default="scope">
              <el-input v-model="scope.row.value" placeholder="请输入全局参数值" @change="(val)=>{definitionChangeHandler(val, scope.row.name)}" />
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="in" width="160px" align="center" />
        </el-table>
      </div>
    </div>
    
    <div class="row">
      <div class="title">接口统计信息</div>
      <div class="description api">
        <div v-for="(menu,index) in menus" :key="index" class="row">
          <div class="title" v-text="index"></div>
          <div clss="description" v-text="menu"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, computed, defineComponent, toRefs } from 'vue'
import store from '@/store'
import { Session } from '@/utils/storage'

export default defineComponent({
  name: 'Home',
  setup() {
    const state = reactive({
      isLoginVisuable: false,
      parameterName: '',
      group: computed(() => store.state.api.defaultGroup),
      api: computed(() => {
        return state.group ? store.state.api.apiInfo[state.group.name] : {}
      }),
      securitySchemes: computed(() => {
        const securitySchemes = []
        for (const key in state?.api?.components?.securitySchemes) {
          const securityScheme = state.api.components.securitySchemes[key]
          securitySchemes.push({
            name: securityScheme.name,
            in: securityScheme.in,
            value: Session.get(securityScheme.name)
          })
        }
        return securitySchemes
      }),
      menus: computed(() => {
        const result = {}
        const menus = store.state.api.menus
        menus.forEach(function(item) {
          if (item.children) {
            item.children.forEach(function(children) {
              if (result[children.method]) result[children.method]++
              else result[children.method] = 1
            })
          }
        })
        return result
      })
    })
    
    const definitionChangeHandler = (value, name) => {
      Session.set(name, value)
    }

    return {
      ...toRefs(state),
      definitionChangeHandler
    }
  }
})
</script>
<style lang="scss">
.row {
  display: flex;
  border-bottom: 1px solid #ddd;
}
.api .row:last-child {
  border-bottom: 0;
}
.title {
  display: inline-block;
  flex: 0 0 20%;
  line-height: 49px;
  -webkit-user-select: none;
  user-select: none;
  font-weight: 500;
}
.description {
  flex: 1;
  display: inline-block;
  line-height: 49px;
}
.security {
	.el-table {
		background-color: #f8f8f8;
		thead, tr, th.el-table__cell {
			padding: 0;
			font-weight: 500;
			color: #333;
			height: 49px;
			line-height: 49px;
			background-color: #f8f8f8;
		}
		.el-table__empty-block {
			min-height: 0;
			.el-table__empty-text {
				line-height: 41px;
			}
		}
	}
	.el-table--fit {
		border-bottom: 0;
	}
	.cell {
		padding: 0;
	}
}
</style>