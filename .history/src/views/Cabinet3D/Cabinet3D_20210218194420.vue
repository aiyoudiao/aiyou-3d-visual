<template>
  <div class="app-wall">
    <div class="nav-view">
      <div class="left-box">
        <el-input
          v-model="searchValue"
          placeholder="请输入内容"
          size="large"
          clearable
          @keydown.enter.native="handleSearchChange"
        />
        <el-button
          type="primary"
          size="mesium"
          round
          @click="handleSearchChange"
          >搜 索</el-button
        >
      </div>
      <div class="right-box">
        <el-select
          v-model="selectValue"
          placeholder="请选择"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <content-view
      :select-value="selectValue"
      :contentList="contentList"
      @handlePageSizeChange="handlePageSizeChange"
      @handlePageNumberChange="handlePageNumberChange"
    />
  </div>
</template>

<script>
import ContentView from "./components/content-view";
import { getList } from "@/api/cabinet3d";

export default {
  name: "Cabinet3D",
  components: {
    "content-view": ContentView,
  },
  data() {
    return {
      timer: 0,
      searchValue: "",
      selectValue: "data-center",
      pageSize: 10,
      pageNumber: 1,
      options: [
        {
          value: "data-center",
          label: "数据中心",
        },
        {
          value: "machine-room",
          label: "机房",
        },
      ],
      contentList: [],
      machineRoomColumn: [""],
      dataCenterColumn: [],
    };
  },
  methods: {
    async handleSearchChange() {
      this.resetAppOrList();
      await this.requestList();
    },
    async handleSelectChange(value) {
      this.resetAppOrList();
      await this.requestList();
    },
    async handlePageSizeChange(value) {
      this.pageSize = value;
      await this.requestList();
    },
    async handlePageNumberChange(value) {
      this.pageNumber = value;
      await this.requestList();
    },

    async resetAppOrList() {
      this.pageSize = 36;
      this.pageNumber = 1;
    },

    async requestList() {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // return {
      //   code: 0,
      //   message: 'OK',
      //   data: {
      //     columns: [],
      //     rows: [],
      //     total: 100,
      //     pageNumber: 2,
      //     pageSize: 20
      //   }
      // }

      this.timer = setTimeout(async () => {
        const data = await getList(
          this.searchValue,
          this.pageSize,
          this.pageNumber
        );
        console.log("data", data);
      }, 3000);
    },
  },
  async created() {
    this.resetAppOrList();
    const data = await getList(
      this.searchValue,
      this.pageSize,
      this.pageNumber
    );
    console.log("data", data);
  },
};
</script>

<style lang="scss">
.app-wall {
  .nav-view {
    padding: 20px;
    display: flex;
    // flex-direction: row;
    // justify-content: space-between;
    // align-items: center;
    .left-box {
      flex: 9;
      .el-input {
        max-width: 70%;
        width: 60%;
        min-width: 50%;
        border-width: 4px;
      }
      .el-input__inner {
        border-width: 2px;
      }
      .el-button {
        margin-left: 2%;
        width: 100px;
      }
    }
    .right-box {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
