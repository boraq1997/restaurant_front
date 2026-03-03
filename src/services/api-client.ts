import http from './http'

export default {
  get(url: string, params?: Record<string, any>) {
    return http.get(url, { params }).then(res => res.data)
  },
  post(url: string, data: any) {
    return http.post(url, data).then(res => res.data)
  },
  put(url: string, data: any) {
    return http.put(url, data).then(res => res.data)
  },
  delete(url: string) {
    return http.delete(url).then(res => res.data)
  },
}