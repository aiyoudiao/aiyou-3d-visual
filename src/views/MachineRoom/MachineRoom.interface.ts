
/**
 * interface：菜单项的option
 */
export interface MenuItem {
    label: string;
    content: Array<any>;
    size: string;
    disabled: boolean; // false
    type: string; // = "el-checkbox"
}