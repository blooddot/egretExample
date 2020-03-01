/**
 * @author 雪糕 
 * @desc GUI事件
 * @date 2018-04-12 18:13:29 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2019-05-20 11:21:35
 */
class GuiEvent extends egret.Event {
    public static GUI_VIEW_STACK_SHOWED: string = "GUI_VIEW_STACK_SHOWED";
    public static GUI_VIEW_STACK_HIDED: string = "GUI_VIEW_STACK_HIDED";

    public static GUI_NOVICE_INITED: string = "GUI_NOVICE_INITED";
    public static GUI_NOVICE_SHOWED: string = "GUI_NOVICE_SHOWED";
    public static GUI_NOVICE_HIDED: string = "GUI_NOVICE_HIDED";

    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
        super(type, bubbles, cancelable, data);
    }
}