/**
 * spine模擬器
 * @summary 在editor中即時播放spine, 將此腳本放置在專案內即可生效
 */
if (CC_EDITOR) {
    sp.Skeleton.prototype['update'] = function(dt) {
        if (CC_EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }

        if (this.paused) {
            return;
        }

        dt *= this.timeScale * sp['timeScale'];

        if (this.isAnimationCached()) {
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    let cache = this._frameCache;

                    if (cache && cache.isInvalid()) {
                        cache.updateToFrame();
                        let frames = cache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }

                    return;
                }

                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift();
                }

                this._accTime += dt;

                if (this._accTime > this._headAniInfo.delay) {
                    let info = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, info.animationName, info.loop);
                }

                return;
            }

            this._updateCache(dt);
        }
        else {
            this._updateRealtime(dt);
        }
    }
}
