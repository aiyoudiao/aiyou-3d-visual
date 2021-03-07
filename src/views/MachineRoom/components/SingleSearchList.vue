<template>
  <div class="single-search-list">
    <div class="head-container">
      <el-input
        v-model="filterText"
        :placeholder="placeholder"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px"
      />

      <el-tree
        highlight-current
        node-key="id"
        class="filter-tree"
        :data="treeList"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleTreeClick"
        ref="tree"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleSearchList",
  props: {
    treeList: Array, // 树的命令集
    placeholder: {
      type: String,
      default: () => {
        return "请输入名称";
      },
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      filterText: "",
      realtimeDeviceAndIpList: [], // 实时命令集页面的设备及IP列表
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    filterNode(query, item) {
      if (!query) return true;
      return item.label.indexOf(query) > -1;
    },
    handleTreeClick(data) {
      const { id, label } = data;

      this.$emit("tree-row-click", {
        id: id,
        label: label,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.single-search-list {
  .head-container {
    .el-input {
      margin-bottom: 10px !important;
    }
    .el-tree {
      width: 100%;
      height: 80vh;
      overflow: auto;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding-top: 5px;

      .el-tree-node:focus > .el-tree-node__content {
        background-color: pink !important;
      }
    }
  }
}
</style>