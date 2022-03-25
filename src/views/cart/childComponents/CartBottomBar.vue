<template>
  <div class="bottom-menu">
    <CheckButton
            class="select-all"
            :is-checked="isSelectAll"
            @click.native="checkClick"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product" @click="calcClick">去计算({{cartCount}})</span>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";

  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters({
        cartLength: 'cartLength',
        cartList: 'cartList',
        cartCount: 'cartCount'
      }),
      totalPrice() {
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.newPrice * item.count
        }, 0).toFixed(2)
      },
      isSelectAll() {
        // 1.使用filter
        /*return this.cartList.length && this.cartList.length === this.cartList.filter(item => {
          return item.checked
        }).length*/

        /*if (this.cartLength === 0) return false
        return !(this.cartList.filter(item => !item.checked).length)*/

        // 2.使用find
        if (this.cartLength === 0) return false
        return !(this.cartList.find(item => !item.checked))

      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) { // 全部选中
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }

        // this.cartList.forEach(item => item.checked = !this.isSelectAll)
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-menu {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 50px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-menu .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-menu .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-menu .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>