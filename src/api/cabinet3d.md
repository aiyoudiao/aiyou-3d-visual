## cabinet3d

### 请求获取数据中心列表

> POST 

请求参数

```javascript
{
  input: '', // 搜索的输入框
  pageNumber: 2,
  pageSize: 20
}
```

响应结果

```javascript
{
	"code": 200,
	"message": "OK",
	"data": {
		"columns": [{
			"name": "id",
			"label": "数据中心ID"
		},
		{
			"name": "dataCenterName",
			"label": "数据中心名称"
		},
		{
			"name": "machineRoomTotalCount",
			"label": "数据中心总机房数"
		},
		{
			"name": "cabinetTotalCount",
			"label": "数据中心总机柜数"
		},
		{
			"name": "serverDeviceTotalCount",
			"label": "数据中心总设备服务器数"
		},
		{
			"name": "dataCenterDesc",
			"label": "数据中心描述信息"
		}],
		"rows": [{
			"id": 101,
			"type": "data-center",
			"dataCenterName": "Umocfojky Ssztefqh Ixdtkld Drsnvlb数据中心",
			"machineRoomTotalCount": 5,
			"cabinetTotalCount": 24,
			"serverDeviceTotalCount": 1088,
			"dataCenterDesc": "tetvihco"
		},
		{
			"id": 102,
			"type": "data-center",
			"dataCenterName": "Zhajltnym Pguyxxh Wdije Efed数据中心",
			"machineRoomTotalCount": 9,
			"cabinetTotalCount": 14,
			"serverDeviceTotalCount": 2859,
			"dataCenterDesc": "eocmgxuvn"
		},
		{
			"id": 103,
			"type": "data-center",
			"dataCenterName": "Btxol Pzqgvfmu Traider Juuqgud Qmhosr数据中心",
			"machineRoomTotalCount": 9,
			"cabinetTotalCount": 24,
			"serverDeviceTotalCount": 1225,
			"dataCenterDesc": "qoqqjeppl"
		},
		{
			"id": 104,
			"type": "data-center",
			"dataCenterName": "Oorixtexk Rktjmd Kcghgp Zpxc数据中心",
			"machineRoomTotalCount": 9,
			"cabinetTotalCount": 28,
			"serverDeviceTotalCount": 1152,
			"dataCenterDesc": "yugltrb"
		},
		{
			"id": 105,
			"type": "data-center",
			"dataCenterName": "Kttr Jokigirmt Vtxeupynz Raesyb Gxefs数据中心",
			"machineRoomTotalCount": 7,
			"cabinetTotalCount": 21,
			"serverDeviceTotalCount": 2684,
			"dataCenterDesc": "jmfquukwlv"
		}],
		"total": 100,
		"pageNumber": 1,
		"pageSize": 36
	}
}
```


### 请求获取数据中心下 某个机房的表格

> POST 

请求参数

```javascript
{
  id: 5 // 数据中心的ID
  input: '', // 搜索的输入框
  pageNumber: 2,
  pageSize: 20
}
```

响应结果

```javascript

{
	"code": 200,
	"message": "OK",
	"data": {
		"columns": [{
			"name": "id",
			"label": "机房ID"
		},
		{
			"name": "machineRoomName",
			"label": "机房名称"
		},
		{
			"name": "dataCenterName",
			"label": "所属的数据中心"
		},
		{
			"name": "cabinetCount",
			"label": "当前机房的机柜数"
		},
		{
			"name": "serverDeviceCount",
			"label": "当前机房的设备服务器数"
		},
		{
			"name": "machineRoomDesc",
			"label": "机房描述信息"
		}],
		"rows": [{
			"id": 201,
			"type": "machine-room",
			"machineRoomName": "机房4号",
			"dataCenterName": "Invf Skcgdhexv Nfkoqnmt Fectlcs数据中心",
			"cabinetCount": 21,
			"serverDeviceCount": 193,
			"machineRoomDesc": "dtmus"
		},
		{
			"id": 202,
			"type": "machine-room",
			"machineRoomName": "机房5号",
			"dataCenterName": "Fdcxmx Qefwfx Kkzp Rrupxgzoq Lclfmyq数据中心",
			"cabinetCount": 21,
			"serverDeviceCount": 288,
			"machineRoomDesc": "tmbbnhajtb"
		},
		{
			"id": 203,
			"type": "machine-room",
			"machineRoomName": "机房4号",
			"dataCenterName": "Ftxgvqvrm Fnnbzkv Tppyzupkco数据中心",
			"cabinetCount": 10,
			"serverDeviceCount": 217,
			"machineRoomDesc": "megoxuhc"
		},
		{
			"id": 204,
			"type": "machine-room",
			"machineRoomName": "机房5号",
			"dataCenterName": "Uyonkcd Iqi Jcwc数据中心",
			"cabinetCount": 16,
			"serverDeviceCount": 236,
			"machineRoomDesc": "fgclubpw"
		},
		{
			"id": 205,
			"type": "machine-room",
			"machineRoomName": "机房4号",
			"dataCenterName": "Topuqeuk Icrechlf Twpizryzj Vqj数据中心",
			"cabinetCount": 22,
			"serverDeviceCount": 156,
			"machineRoomDesc": "bkzoollyo"
		}],
		"total": 100,
		"pageNumber": 1,
		"pageSize": 36
	}
}

```

### 请求获取某个机柜下 的机柜及设备信息


> POST 

请求参数

```javascript
{
  id: 5 // 机房的ID
}
```


响应结果


```javascript
{
	"code": 200,
	"message": "OK",
	"data": {
		cabinets: {
			title: [{
				name: 'id',
				label: '机柜ID'
			} {
				name: 'cabinetName',
				label: '机柜名称',
			} {
				name: 'cabinetTotalU',
				label: '机柜U数',
			} {
				name: 'dataCenterName',
				label: '所属数据中心名称',
			} {
				name: 'machineRoomName',
				label: '当前机房名称',
			} {
				name: 'cabinetRate',
				label: '当前机柜利用率 (已使用的机柜U数 / 总机柜的U数)'
			} {
				name: 'uBitLength',
				label: '每一U的长度'
			}] list: [
                {
				id: 2,
				cabinetName: '3号机柜',
				cabinetTotalU: 42,
				dataCenterName: '张数据中心',
				machineRoomName: '2号机房',
				cabinetRate: 0.82,
				uBitLength: 6
			}],
			total: 23
		},
		serverDeviceList: {
			title: [{
				name: 'id',
				label: '设备ID'
			},
			{
				name: 'deviceName',
				label: '设备名'
			},
			{
				name: 'deviceIP',
				label: '设备管理ip'
			},
			{
				name: 'deviceState',
				label: '设备状态'
			},
			{
				name: 'deviceManufacturer',
				label: '设备厂商'
			},
			{
				name: 'deviceType',
				label: '设备型号'
			},
			{
				name: 'dataCenterName：',
				label: '设备所属数据中心'
			},
			{
				name: 'rankName',
				label: '机架的名称'
			},
			{
				name: 'cabinetID',
				label: '所属机柜的ID'
			},
			{
				name: 'startU',
				label: '开始U位'
			},
			{
				name: 'endU',
				label: '结束U位'
			}],
			list: [
                {
                    id: 4,
                    deviceName: '初等设备',
                    deviceIP: '127.0.0.1',
                    deviceState: '正常',
                    deviceManufacturer: '思科公司',
                    deviceType: '思科2021',
                    dataCenterName:'张江数据中心',
                    rankName: '2号机架',
                    cabinetID: '6',
                    startU: 20,
                    endU: 22
                }
            ],
			total: 100
		}
	}
}

```


### 提交某个机房下的机柜的设备录入信息


> POST 

请求参数

```javascript
{
	"machineRoomId": 1,
	"deviceID": "Cisco001",
	"deviceName": "思科设备",
	"deviceIP": "127.0.0.1",
	"deviceState": "正常",
	"deviceManufacturer": "思科防火墙",
	"deviceType": "思科001",
	"dataCenterName": "Vxomh Afbfhsc数据中心",
	"rankName": "RANK-001",
	"cabinetID": 13,
	"cabinetName": "13号机柜",
	"startU": "42",
	"endU": "45",
	"machineRoomName": "机房3号"
}
```


响应结果


```javascript
{
	"code": 200,
	"message": "OK"
}

```
