/**
 * @author 雪糕 
 * @desc 示例基类
 * @date 2020-02-08 16:23:34 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 20:13:23
 */
abstract class BaseExample implements IPool {
    public abstract onInit(...params);

    public abstract onUnInit();
}