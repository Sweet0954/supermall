import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {
  /*addCart(state, payload) {
      // payload为新添加的商品
      /!*let oldProduct = null
      for (let item of state.cartList) {
        if (item.iid === payload.iid) {
          oldProduct = item
        }
      }*!/
      // 1.查找oldProduct
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct
      if (oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }
    }
    */
  // mutations唯一的目的就是修改state中状态
  // mutations中的每个方法尽可能完成的事件比较单一一点
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}