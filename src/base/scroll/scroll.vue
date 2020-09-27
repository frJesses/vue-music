<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default(){
          return []
        }
      },
      pullup: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      // 初始化滚动
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: this.click,
          probeType: this.probeType
        })
        // 1. 监听滚动事件
        if (this.listenScroll) {
          let self = this
          this.scroll.on('scroll', (position) => {
            self.$emit('scroll', position)
          })
        }
        // 2. 监听下拉加载更多
        if (this.pullup) {
          let self = this
          this.scroll.on('scrollEnd', () => {
            self.$emit('pullUp')
          })
        }
      },
      // 刷新
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      // 滚动到指定的元素
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      // 滚动到指定的位置
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>