import request from '@/utils/request'

export const swaggerResource = async () => request({ url: 'swagger-resources' })

export const swaggerApi = async (url) => request({ url: url })