/**
 * @author 雪糕 
 * @desc 对象池行为组件 挂载在BehaviorOwner上 一般只需要继承onAdd onDestory
 *  !!!使用对象池 一定要在onDestory 或者 onUnInit 还原属性 时序：onInit->onAdd->onDestory->onUnInit
 * @date 2020-02-08 17:47:41 
 * @Last Modified by 雪糕 
 * @Last Modified time 2020-02-08 17:47:41 
 */
class BehaviorPoolComponent extends BehaviorComponent implements IPool {
    /**业务层不使用 给Owner使用 */
    public $destory() {
        super.$destory();

        pool.push(this);
    }

    /**对象池中取出初始化 一般业务层直接用onAdd*/
    public onInit() {

    }

    /**对象池回收 一般业务层直接用onDestory */
    public onUnInit() {

    }
}