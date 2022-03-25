<template>
  <div id="detail">
    <detail-nav-bar ref="nav" @titleClick="titleClick"/>
    <!-- 属性：topImages 传入值：top-images -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper ref="base" :images="images"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--<toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll"
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";

  // import Toast from "components/common/toast/Toast";

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";


  import {getDetail, getRecommend, Goods, GoodsParam} from "network/detail"
  import {Shop} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      BackTop,
      GoodsList,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        images: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 2.1.获取结果
        const data = res.result

        // 2.2.获取顶部的图片轮播数据
        this.images = data.itemInfo.topImages

        // 2.3获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 2.4获取商店信息
        this.shop = new Shop(data.shopInfo)

        // 2.5获取商品信息
        this.detailInfo = data.detailInfo

        // 2.6保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 2.7取出评论的信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // 1.第一次获取，值不对
        // 原因：this.$refs.params.$el压根没有渲染，值为undefined
        /*this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs)*/

        /*this.$nextTick(() => {
          // 2.第二次获取：值不对
          // 值不对原因：此时图片依然是还没有加载完，offsetTop不正确
          // 根据最新的数据，DOM已经渲染完毕了
          // 此时图片依然是还没有加载完（获取到的offsetTop依旧是错的）
          // offsetTop错误都是由于图片的原因
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          console.log(this.themeTopYs)
        })*/
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      // 4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      })
    },
    mounted() {
    },
    updated() {
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      // ...mapActions['addCart'],
      ...mapActions({
        addCart : 'addCart'
      }),
      detailImageLoad() {
        // this.$refs.scroll.refresh();
        this.newRefresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中的值进行对比
        // 【0，7938，9120，9452】
        // positionY 在 0 和 7938 之间，index = 0
        // positionY 在 7938 和 9120 之间，index = 1
        // positionY 在 9120 和 9452 之间，index = 2

        // positionY 超过9452，index = 3
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }

          /*if (
            this.currentIndex !== i
            &&
            (
              (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
              ||
              (i === length - 1 && positionY >= this.themeTopYs[i])
            )
            ){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }*/
        }
        // 3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.images[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.newPrice
        product.iid = this.iid
        product.newPrice = this.goods.nowPrice

        // 2.将商品添加到购物车中
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart', product)
        this.addCart(product).then(res => {
          /*this.show = true
          this.message = res

          setTimeout(() => {
            this.show = false
            this.message = ''
          }, 1500)*/
          this.$toast.show(res, 2000)
        })

        /*this.$store.dispatch('addCart', product).then(res => {
          console.log(res)
        })*/
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    position: absolute;
    height: calc(100% - 44px - 49px);
  }

</style>