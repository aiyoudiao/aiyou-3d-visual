import MachineRoom from "../MachineRoom/MachineRoom"

export default class DataCenter {
    name: string = '数据中心'
    parent: any

    machineRooms: Array<MachineRoom> = []

    constructor(cfgs, three) {
        this.parent = three
        
        const { machineRoomCfgs, name } = cfgs

        machineRoomCfgs.forEach(machineRoomCfg => {
            const machineRoom1 = new MachineRoom(machineRoomCfg, this)
            this.machineRooms.push(machineRoom1)
        })

    }



    show() {
        // 可见性设置
    }

    hide() {
        // 不可见行设置
    }

    dispose() {

    }
}