<template>
  <div class="content-view">
    <!-- 图标应用墙 -->
    <template v-if="selectValue === 'machine-room'">
      <machine-room-table :column-data="columnData" :table-data="contentData" />
    </template>

    <!-- 列表应用墙 -->
    <template v-if="selectValue === 'data-center'">
      <data-center-table :column-data="columnData" :table-data="contentData" />
    </template>

    <!-- 分页条 -->
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      background
      :hide-on-single-page="true"
      :current-page="pageNumber"
      :page-sizes="[36, 72, 108, 216]"
      :page-size="pageSize"
      :total="216"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumberChange"
    />
  </div>
</template>

<script>
import DataCenterTable from './data-center.vue'
import MachineRoomTable from './machine-room.vue'

export default {
  components: {
    'data-center-table': DataCenterTable,
    'machine-room-table': MachineRoomTable
  },
  props: {
    selectValue: String,

    contentList: Array
  },
  computed: {
    contentData () {
      if ([null, undefined].includes(this.contentList) || this.contentList.length < 1) {
        return this.tableData
      }

      return this.contentList
    }
  },
  data() {
    return {
      pageNumber: 1,
      pageSize: 36,
      columnData: [
        '应用系统等级',
        '应用系统名称',
        '是否完成可视化',
        '创建时间',
        '创建人'
      ],
      tableData: Array(36)
        .fill(0)
        .map((value, index) => {
          return {
            id: index + 1,
            应用系统等级: '应用系统等级' + index,
            应用系统名称: '应用系统名称' + index,
            是否完成可视化: '谁知道呢',
            创建时间: new Date().toLocaleDateString(),
            创建人: '沙秀'
          }
        })
    }
  },
  methods: {
    handlePageSizeChange(value) {
      this.$emit('handlePageSizeChange', value)
    },
    handlePageNumberChange(value) {
      this.$emit('handlePageNumberChange', value)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.content-view {
  padding: 0 20px;
  margin: 0px auto 0px auto;
  .el-pagination {
    text-align: center;
  }
}
</style>
