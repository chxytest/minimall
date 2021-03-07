import request from './network'

export function getCategory() {
  return request({
    url: "/category"
  })
}
