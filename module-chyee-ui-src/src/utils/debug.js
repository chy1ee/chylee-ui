import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, 
  timeout: 5000 // request timeout
})

service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) 
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
