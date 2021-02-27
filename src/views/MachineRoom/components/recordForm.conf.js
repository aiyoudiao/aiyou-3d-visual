export default {
    columns: [
        {
            name: "deviceID",
            label: "设备ID",
        },
        {
            name: "deviceName",
            label: "设备名",
        },
        {
            name: "deviceIP",
            label: "设备管理ip",
        },
        {
            name: "deviceState",
            label: "设备状态",
        },
        {
            name: "deviceManufacturer",
            label: "设备厂商",
        },
        {
            name: "deviceType",
            label: "设备型号",
        },
        {
            name: "dataCenterName",
            label: "设备所属数据中心",
        },
        {
            name: "rankName",
            label: "机架的名称",
        },
        {
            name: "cabinetID",
            label: "所属机柜的ID",
        },
        {
            name: "cabinetName",
            label: "所属机柜的名称",
        },
        {
            name: "startU",
            label: "开始U位",
        },
        {
            name: "endU",
            label: "结束U位",
        },
    ],
    ruleForm: {
        deviceID: "",
        deviceName: "",
        deviceIP: "",
        deviceState: "",
        deviceManufacturer: "",
        deviceType: "",
        dataCenterName: "",
        rankName: "",
        cabinetID: "",
        cabinetName: "",
        startU: "",
        endU: "",
        type: [],
    },
    rules: {
        // deviceID: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // deviceName: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // deviceIP: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // deviceState: [
        //     { required: true, message: "请选择活动区域", trigger: "change" },
        // ],
        // deviceManufacturer: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // deviceType: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],

        // dataCenterName: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // rankName: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // cabinetID: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // cabinetName: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // startU: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // endU: [
        //     { required: true, message: "请输入活动名称", trigger: "blur" },
        //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],

        // type: [
        //     {
        //         type: "array",
        //         required: true,
        //         message: "请至少选择一个活动性质",
        //         trigger: "change",
        //     },
        // ],

    },
}