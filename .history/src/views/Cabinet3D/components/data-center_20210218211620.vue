<template>
  <div class="list-wall">
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      height="81vh"
      :row-class-name="tableRowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="(items, index) in columnData"
        :key="items"
        fixed
        :label="items"
        :prop="items"
        align="center"
        :resizable="false"
      />
    </el-table>
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
    }
  },

  methods: {
    handleRowClick(row, event, column) {
      debugger
      let info = ''
      Object.values(row).forEach((item, index) => {
        info += columnData[index]
        info += '：'
        info += item
        info += '\r\n'     
      })
      alert(info)

      console.log(row)
    },
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex % 3 === 0 && rowIndex % 5 !== 0) {
      //   return 'normal'
      // } else {
      //   return 'empty'
      // }

      return ''
    }
  }
}
</script>

<style  lang="scss">
  .list-wall {
    margin-bottom: 10px;
  }
  .el-table .normal {
    color: #000;
    font-weight: 700;
  }

  .el-table .empty {
    color: #aaa;
    font-weight: 500;
  }
</style>
