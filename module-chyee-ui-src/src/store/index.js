import { createStore } from 'vuex'

const modulesFiles = require.context('./modules', true, /\.js$/)

const modules={};
modulesFiles.keys().forEach(key => {
  const module= modulesFiles(key).default;
	const moduleName=key.slice(2,-3);//以文件名为模块名，./user.js 截取（user）

  modules[moduleName]=module
});

const store=createStore({
	modules
});

export default store