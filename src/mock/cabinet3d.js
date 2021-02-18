import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = {
    'data-center': {columns:[], rows: []},
    'machine-room': {columns:[], rows: []}
}
const count = 100

// const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

// for (let i = 0; i < count; i++) {
//     List.push(Mock.mock({
//         id: '@increment',
//         timestamp: +Mock.Random.date('T'),
//         author: '@first',
//         reviewer: '@first',
//         title: '@title(5, 10)',
//         content_short: '我是测试数据',
//         content: baseContent,
//         forecast: '@float(0, 100, 2, 2)',
//         importance: '@integer(1, 3)',
//         'type|1': ['CN', 'US', 'JP', 'EU'],
//         'status|1': ['published', 'draft', 'deleted'],
//         display_time: '@datetime',
//         comment_disabled: true,
//         pageviews: '@integer(300, 5000)',
//         image_uri,
//         platforms: ['a-platform']
//     }))
// }

List['data-center'].columns = [
    {
        name: 'id',
        label: '数据中心ID'
    },
    {
        name: 'dataCenterName',
        label: '数据中心名称'
    },
    {
        name: 'machineRoomTotalCount',
        label: '数据中心总机房数'
    },
    {
        name: 'cabinetTotalCount',
        label: '数据中心总机柜数'
    },
    {
        name: 'serverDeviceTotalCount',
        label: '数据中心总设备服务器数'
    },
    {
        name: 'dataCenterDesc',
        label: '数据中心描述信息'
    },
]
List['data-center'].rows = Array(count).fill(1).map(item => {
    return Mock.mock({
        id: '@increment',
        type: 'data-center',
        dataCenterName: Mock.Random.title(3, 5) + '数据中心',
        machineRoomTotalCount: Mock.Random.natural(1, 10),
        cabinetTotalCount: Mock.Random.natural(10, 30),
        serverDeviceTotalCount: Mock.Random.natural(1000, 3000),
        dataCenterDesc: Mock.Random.word(5, 10)
    })
})

List['machine-room'].columns = [
    {
        name: 'id',
        label: '机房ID'
    },
    {
        name: 'machineRoomName',
        label: '机房名称'
    },
    {
        name: 'dataCenterName',
        label: '所属的数据中心'
    },
    {
        name: 'cabinetCount',
        label: '当前机房的机柜数'
    },
    {
        name: 'serverDeviceCount',
        label: '当前机房的设备服务器数'
    },
    {
        name: 'machineRoomDesc',
        label: '机房描述信息'
    },
]
List['machine-room'].rows = Array(count).fill(1).map(item => {
    return Mock.mock({
        id: '@increment',
        type: 'machine-room',
        machineRoomName: '机房' + Mock.Random.natural(3, 5) + '号' ,
        dataCenterName: Mock.Random.title(3, 5) + '数据中心',
        cabinetCount: Mock.Random.natural(10, 30),
        serverDeviceCount: Mock.Random.natural(100, 300),
        machineRoomDesc: Mock.Random.word(5, 10)
    })
})

export default {

    getTableList: config => {
        const { input = '', pageNumber = 1, pageSize = 20, type = 'machine-room'} = JSON.parse(config.body)

        const start = (pageNumber - 1) * pageSize
        const end = pageNumber * pageSize
        const columns = List[type].columns
        const rows = List[type].rows.slice(start, end)


        return {
            code: 200,
            message: 'OK',
            data: {
                columns: columns,
                rows: rows,
                total: List[type].rows.length,
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        }
    },
    getLis2: config => {
        const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

        let mockList = List.filter(item => {
            if (importance && item.importance !== +importance) return false
            if (type && item.type !== type) return false
            if (title && item.title.indexOf(title) < 0) return false
            return true
        })

        if (sort === '-id') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

        return {
            code: 0,
            message: 'OK',
            data: {
                total: mockList.length,
                // users: pageList,
                items: pageList
            }
        }
    },
    getPv: () => ({
        pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
    }),
    getArticle: (config) => {
        const { id } = param2Obj(config.url)
        for (const article of List) {
            if (article.id === +id) {
                return article
            }
        }
    },
    createArticle: () => ({
        data: 'success'
    }),
    updateArticle: () => ({
        data: 'success'
    })
}
