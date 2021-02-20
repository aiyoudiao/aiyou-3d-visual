<template>
  <div class="icon-wall">
    <!-- 每逢六个就是一组 -->
    <div v-for="topItem of [1, 2, 3, 4, 5]" :key="topItem" class="row-group">
      <!-- 有效的卡片 -->
      <el-card
        v-for="item of [1, 2, 3, 4, 5, 6]"
        :key="topItem + '-' + item"
        :class="{normal: cardValid, empty: !cardValid}"
        shadow="hover"
        @click.native="handleCardClick(topItem + '-' + item)"
      >
        <!-- <div slot="header">小卡片</div> -->  
        <div>爱画画的baby{{ topItem + '-' + item }}</div>
      </el-card>
    </div>
    <div v-for="topItem of [6]" :key="topItem" class="row-group">
      <!-- 无效的卡片 -->
      <el-card
        v-for="item of [1, 2, 3, 4, 5]"
        :key="topItem + '-' + item"
        :class="{normal: !cardValid, empty: cardValid}"
        shadow="hover"
        @click.native="createHandleClickEvent(topItem + '-' + item)"
      >
        <!-- <div slot="header">小卡片</div> -->
        <div>不爱画画的baby{{ topItem + '-' + item }}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columnData: {
      type: [Array],
      default: () => []
    },
    tableData: {
      type: [Array],
      defualt: () => []
    }

  },

  data() {
    return {
      /* 卡片是否有效 */
      cardValid: true
    }
  },

  mounted() {
    this.transform3D()
  },

  methods: {
    handleCardClick(data) {
      console.log('data ===>', data)
      alert(data)
    },
    transform3D() {
      const context = document.querySelector('.icon-wall')
      document.querySelector('.icon-wall').onmousemove = function(e) {
        /*              x轴旋转
                    -4
                    -3
                    -2
                    -1
    *   -1 -2 -3 -4  0  1  2  3  4  y轴旋转
                     1
                     2
                     3
                     4
    * */
        const x = (0.5 - e.clientY / window.innerHeight) * 4// -0.5~ 0.5  -2~2
        const y = (e.clientX / window.innerWidth - 0.5) * 4// -0.5~ 0.5  -2~2
        context.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`
      }

      document.querySelector('.icon-wall').onmouseout = function(e) {
        context.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
        context.style.transformStyle = `preserve-3d`
        context.style.transition = `0.5s all linear`
      }
    }
  }
}
</script>

<style  lang="scss">
  .icon-wall {
    margin-bottom: 10px;
    .row-group {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      /* 动态计算每一行卡片的高度 */
      height: calc((81vh - 10px * 5) / 6);
      .el-card {
        /* 动态计算每一个卡片的宽度 */
        width: calc(100% / 6 - 10px + 10px / 5);
        height: 100%;
      }
      /* 卡片都有向右的边距 */
      .el-card {
        margin-right: 10px;
      }
      /* 每一行最后一个，没有向右的边距 */
      .el-card:nth-child(n+6) {
        margin-right: 0px;
      }
    }

  }

  /* 可正常操作的卡片 */
  .el-card.normal {
    background: #5d9cec;
  }

  /* 不可正常操作的卡片 */
  .el-card.empty {
    background: #b5d4df;
  }
</style>
