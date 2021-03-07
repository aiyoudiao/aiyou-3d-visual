<template>
  <div class="panel-box">
    <div style="position: absolute; left: 0px; top: 0px">
      <img
        :src="require('@/assets/picture/2.png')"
        alt=""
        :style="{width: 300 + 'px', height: height + 'px', opacity: 1}"
      />
    </div>
    <!-- 下面是详细信息展示 -->
    <template v-for="(item, index) in dataSet">
      <div
        v-if="item.vip"
        class="box-flag"
        :style="{ top: '60px', ...item.style }"
        :key="item.label"
      >
        {{ item.label }}：{{ item.content }}
      </div>
      <div
        v-else
        class="box-desc"
        :style="{ top: 100 + (index - 1) * 30 + 'px', ...item.style }"
        :key="item.label"
      >
        {{ item.label }}：{{ item.content }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "panel-box",
  props: {
    dataSet: {
      type: Array,
      default: () => {
        return [
          {
            vip: true,
            label: "机号",
            content: "JG-01",
            style: {},
          },
          {
            vip: true,
            label: "所属数据中心",
            content: "腾讯数据中心",
            style: {},
          },
        ];
      },
    },
    height: {
      type: Number,
      default: () => {
        return 400
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.panel-box {
  position: relative;
  left: -15px;
  top: -15px;
  width: 263px;
  height: 400px;
}

.box-flag {
  position: absolute;
  left: 25px;
  font-size: 16px;
}

.box-desc {
  position: absolute;
  left: 25px;
  font-size: 14px;
}
</style>