
class WebSocketType{
    constructor(){
        this.bOnline = false
        this.bControlUser = false
        this.sentX = null
        this.sentY = null
        this.onReceivedXY = null
        this.onReceivedPlayerState = null

        const aWebSocket = new WebSocket("ws://127.0.0.1:8888")
        this.WebSocket = aWebSocket

        aWebSocket.onopen = () => this.onOpen()
        aWebSocket.onclose = () => this.onClose()
        aWebSocket.onmessage = (e) => this.onMessage(e)
    }

    onOpen(){
        console.log("Connection established")
        this.bOnline = true;
    }

    onClose(){
        this.bOnline = false
        this.bControlUser = false
        this.sentX = null
        this.sentY = null
        
    }

    onMessage(event){
        if("string" !== typeof event.data){
            return
        }
        let akvData;
        try {
            akvData = JSON.parse(event.data)
        } catch (e) {
            console.log(e)
        }
        if(!akvData){
            return
        }
        switch(akvData.id){
            case 1:
                this.bControlUser = true
                break
            case 2:
                if(this.onReceivedXY){
                    this.onReceivedXY(akvData.x, akvData.y)
                }
                break
            case 3:
                if(this.onReceivedPlayerState){
                    this.onReceivedPlayerState(akvData.PlayerState)
                }
                break
            default:
                break
        }
    }

    attachOnReceivedXY(onReceivedXY){
        this.onReceivedXY = onReceivedXY
    }


    attachOnReceivedPlayerState(onReceivedPlayerState){
        this.onReceivedPlayerState = onReceivedPlayerState
    }


    isConnected(){
        return this.bOnline
    }

    canControlUser(){
        return this.bControlUser
    }

    sendXY(x, y){
        if(this.isConnected() && this.canControlUser() && ((1e-5 < Math.abs(x - this.sentX)) || (1e-5 < Math.abs(y - this.sentY)))){
            const akvData = {
                id: 2,
                x, y
            };

            this.WebSocket.send(JSON.stringify(akvData))
            this.sentX = x
            this.sentY = y
        }
    }

    sendPlayerState(anPlayerState){
        if(this.isConnected() && this.canControlUser()){
            const akvData = {
                id: 3,
                PlayerState: anPlayerState
            };

            this.WebSocket.send(JSON.stringify(akvData))
        }
    }
}

const WebSocketPlayerUser = new WebSocketType();

export { WebSocketPlayerUser as default}