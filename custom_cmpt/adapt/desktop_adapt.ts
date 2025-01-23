import { eventClass, eventFunc } from "../../event/event_attr";

const { ccclass, property, menu } = cc._decorator;

/**
 * 背景適配
 * @summary https://www.jianshu.com/p/24cba3de1e33
 * 強制使用訂寬高(show all), 方便其他適配元件計算變化
 */
@ccclass
@menu("custom cmpt/desktop adapt")
@eventClass()
export class DesktopAdapt extends cc.Component {
    /**
     * 
     */
    protected onLoad(): void {
        this.adjust(); 
    }

    /**
     * 校正
     */
    @eventFunc("ViewResize")
    private adjust(): void {
        let size = cc.view.getCanvasSize();
        let canvasW = size.width;
        let canvasH = size.height;

        // 先找到show all模式適配後, 此節點的實際寬高以及初始縮放值
        let scale = Math.min(
            canvasW / this.node.width,
            canvasH / this.node.height,
        );

        let realW = this.node.width * scale;
        let realH = this.node.height * scale;

        // 基於第一步計算的數據, 再做適配縮放
        this.node.scale = Math.max(
            canvasW / realW,
            canvasH / realH,
        );
    }
}
