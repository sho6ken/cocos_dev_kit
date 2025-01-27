import { EventModule } from "../../event/event_module";
import { Singleton } from "../../singleton/singleton";

const { ccclass, property, menu, disallowMultiple } = cc._decorator;

/**
 * canvas適配
 * @summary https://www.jianshu.com/p/24cba3de1e33
 * 強制使用訂寬高(show all), 方便其他適配元件計算變化
 */
@ccclass
@disallowMultiple
@menu("custom/canvas_adapt")
export class CanvasAdapt extends cc.Component {
    /**
     * 
     */
    protected onLoad(): void {
        // 定寬高
        let canvas = cc.Canvas.instance;
        canvas.fitWidth = true;
        canvas.fitHeight = true; 

        // 視窗變化事件
        cc.view.setResizeCallback(() => {
            Singleton.get(EventModule).emit("ViewResize");
        });
    }
}
