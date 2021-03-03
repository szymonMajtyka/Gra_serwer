export { AnimationType as default }

class AnimationType{
    constructor(akvOptionsIn){
        const kvDefaults={
            strURL:null,
            context:null,
            nCurrentFrame:0,
            nRate:60,
            bLoop: true
        }
        this.kvOptions=Object.assign({},kvDefaults,akvOptionsIn)
        this.vFrames=[]
        this.Image=new Image()
        this.Image.src=this.kvOptions.strURL
    }

    appendFrame(x,y){
        this.vFrames.push({x,y})
    }
    getNumFrames(){
        return this.vFrames.length
    }
    getInterval(){
        return this.kvOptions.nRate
    }
    setCurrentFrameIndex(anIndex){
        this.kvOptions.nCurrentFrame=anIndex
    }
    getCurrentFrameIndex(){
        return this.kvOptions.nCurrentFrame
    }
    isLoop()
    {
        return this.kvOptions.bLoop
    }

    draw(x,y,nWidth,nHeight,bFlipH){
        const {kvOptions:{context:aContext}}=this
        const aFrame=this.vFrames[this.kvOptions.nCurrentFrame]

        if(bFlipH){
            aContext.save()
            aContext.scale(-1,1)
            aContext.translate(-nWidth,0)

            aContext.drawImage(this.Image,aFrame.x,aFrame.y,nWidth,nHeight,-x,y,nWidth,nHeight)
            aContext.restore()
        }else{
            aContext.drawImage(this.Image,aFrame.x,aFrame.y,nWidth,nHeight,x,y,nWidth,nHeight)
        }
    }
}