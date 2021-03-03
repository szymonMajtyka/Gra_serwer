export { PlayerType as default }

class PlayerType {
    constructor(akvOptionsIn){
        const kvDefaults={
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false
        }
        this.kvOptions=Object.assign({}, kvDefaults, akvOptionsIn)
        this.repeat = this.kvOptions.repeat || 0;
        this.hAnimation=null
        this.AnimationCurrent=null
    }

    setAnimation(aAnimation) {

        if(this.hAnimation) {
            clearInterval(this.hAnimation)
            this.hAnimation=null
        }
        this.AnimationCurrent = aAnimation

        const anNumFrames=aAnimation.getNumFrames()
        aAnimation.setCurrentFrameIndex(0)

        if(1<anNumFrames){
            //aAnimation.setCurrentFrameIndex(0)
            this.hAnimation=setInterval(()=>{
                let anCurrentFrameIndex = aAnimation.getCurrentFrameIndex() + 1;
                if((!aAnimation.isLoop()) && (anCurrentFrameIndex >= anNumFrames)) {
                    clearInterval(this.hAnimation)
                    this.hAnimation = null
                } else {
                    aAnimation.setCurrentFrameIndex(anCurrentFrameIndex % anNumFrames)         
                }
            },aAnimation.getInterval())
         }
        }
        
    draw(adOffsetX){
        if(!this.AnimationCurrent){
            return
        }
        let {x,y,nWidth,nHeight,bFlipH}=this.kvOptions
        if(this.repeat > 0)
        {
            for(let i = 0; i <= this.repeat; i++ ){
                this.AnimationCurrent.draw(((x-adOffsetX) +(nWidth * i)),y,nWidth,nHeight,bFlipH);
            }

        }
        else{
            this.AnimationCurrent.draw(x - adOffsetX,y,nWidth,nHeight,bFlipH);
        }
    }
    setFlipH(abFlip) {
        this.kvOptions.bFlipH = abFlip
    }
    setX(x) {
        this.kvOptions.x = x
    }
    setY(y) {
        this.kvOptions.y = y
    }
    getX() {
        return this.kvOptions.x
    }
    getY() {
        return this.kvOptions.y
    }
    getWidth() {
        return this.kvOptions.nWidth
    }
    getHeight() {
        return this.kvOptions.nHeight
    }
    getBoundingBox() {
        return {
            xLeft: this.kvOptions.x,
            xRight: this.kvOptions.x + this.kvOptions.nWidth,
            yTop: this.kvOptions.y,
            yBottom: this.kvOptions.y + this.kvOptions.nHeight
        }
    }

    setXY(x, y) {
        this.kvOptions.x = x
        this.kvOptions.y = y
    }
}