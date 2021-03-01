<template>
  <div class="record-form">
    <el-row>
      <el-form
        :model="ruleForm"
        :inline="true"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
      >
        <el-col :span="12"
          ><el-form-item label="设备ID" prop="deviceID">
            <el-input v-model="ruleForm.deviceID"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="设备名" prop="deviceName">
            <el-input v-model="ruleForm.deviceName"></el-input> </el-form-item
        ></el-col>

        <el-col :span="12">
          <el-form-item label="设备管理ip" prop="deviceIP">
            <el-input v-model="ruleForm.deviceIP"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="设备状态" prop="deviceState">
            <el-select
              v-model="ruleForm.deviceState"
              placeholder="请选择设备状态"
            >
              <el-option label="正常" value="正常"></el-option>
              <el-option label="异常" value="异常"></el-option>
            </el-select> </el-form-item
        ></el-col>

        <el-col :span="12"
          ><el-form-item label="设备厂商" prop="deviceManufacturer">
            <el-input
              v-model="ruleForm.deviceManufacturer"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="设备型号" prop="deviceType">
            <el-input v-model="ruleForm.deviceType"></el-input> </el-form-item
        ></el-col>

        <el-col :span="12"
          ><el-form-item label="设备所属数据中心" prop="dataCenterName">
            <el-input
              :value="recordFormData.dataCenterName"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="机架的名称" prop="rankName">
            <el-input v-model="ruleForm.rankName"></el-input> </el-form-item
        ></el-col>

        <el-col :span="12">
          <el-form-item label="所属机柜的ID" prop="cabinetID">
            <el-input :value="recordFormData.cabinetID"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="所属机柜的名称" prop="cabinetID">
            <el-input
              :value="recordFormData.cabinetName"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="开始U位" prop="startU">
            <el-input v-model="ruleForm.startU"></el-input> </el-form-item
        ></el-col>

        <el-col :span="12">
          <el-form-item label="结束U位" prop="endU">
            <el-input v-model="ruleForm.endU"></el-input> </el-form-item
        ></el-col>
        <el-col :span="24">
          <p class="tips">
            当前机柜U位状态：总U数 {{ recordFormData.cabinetTotalU }}，占用率
            {{ recordFormData.cabinetRate }}
          </p>
          <el-checkbox-group
            v-model="ruleForm.type"
            :readonly="true"
            class="myUState"
          >
            <el-checkbox
              v-for="(t, i) in recordFormData.uContainer"
              :key="'当前机柜U位' + i"
              :label="isEmpty(i + 1 + 'u', t.isEmpty)"
              name="type"
              :disabled="!t.isEmpty"
              style="margin: 0 5px"
              size="mini"
            ></el-checkbox> </el-checkbox-group
        ></el-col>
        <el-col :span="24" style="text-align: center">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <!-- <el-button @click="resetForm('ruleForm')">取消</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import recordFormConf from "./recordForm.conf";

export default {
  props: {
    showOuterVisible: Boolean,
    recordDeviceUbitDialog: Object,
    recordFormData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ruleForm: recordFormConf.ruleForm,
      rules: recordFormConf.rules,
      cabinetTotalU: 42,
      cabinetRate: 0.5,
      uContainer: [],
      timer: null,
    };
  },
  watch: {
    // recordFormData() {
    //   console.log("this.recordFormData", this.recordFormData);
    //   if ([null, undefined, ""].includes(this.recordFormData)) {
    //     return;
    //   }
    //   const {
    //     cabinetName,
    //     cabinetTotalU,
    //     cabinetRate,
    //     dataCenterName,
    //     machineRoomName,
    //     uContainer,
    //   } = this.recordFormData;
    //   this.ruleForm.cabinetName = cabinetName;
    //   this.ruleForm.dataCenterName = dataCenterName;
    //   this.ruleForm.machineRoomName = machineRoomName;
    //   this.cabinetTotalU = cabinetTotalU;
    //   this.cabinetRate = cabinetRate;
    //   this.uContainer = uContainer;
    // },
  },
  methods: {
    isEmpty(text, isEmpty) {
      if (!isEmpty) {
        text = text + "(占用)";
      }

      return text;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.getSubmitData();
          this.$emit("submitRecordForm", data);
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },

    // 获取要提交的数据
    getSubmitData() {
      const {
        cabinetID,
        cabinetName,
        cabinetTotalU,
        cabinetRate,
        dataCenterName,
        machineRoomName,
        uContainer,
      } = this.recordFormData;
      this.ruleForm.cabinetName = cabinetName;
      this.ruleForm.cabinetID = cabinetID;
      this.ruleForm.dataCenterName = dataCenterName;
      this.ruleForm.machineRoomName = machineRoomName;

      return this.ruleForm
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.record-form {
  .tips {
    margin-left: 20px;
  }
  .myUState {
    margin: 0 20px;
    line-height: 20px;
  }

  .el-input, .el-select {
    width: 250px;
  }
}
</style>