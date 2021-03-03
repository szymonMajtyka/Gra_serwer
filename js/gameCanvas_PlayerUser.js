export { PlayerUserType as default }

import PlayerType from "./gameCanvas_Player.js"
import AnimationType from "./gameCanvas_Animation.js"
import Keyboard from "./gameCanvas_Keyboard.js"
import isSegmentsIntersect from "./isSegmentsIntersect.js"
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js"
import getSegmentsIntersection from "./getSegmentsIntersection.js"
import WebSocketPlayerUser from "./gameCanvas_WebSocket.js"

import sounds from "./sounds.js"


const STAND = Symbol("stand"),
    WALK_LEFT = Symbol("walk left"),
    WALK_RIGHT = Symbol("walk right"),
    HIGH_KICK = Symbol("high kick"),
    JUMP = Symbol("jump"),
    vIndex2Symbol = [STAND, WALK_LEFT, WALK_RIGHT, HIGH_KICK, JUMP];

class PlayerUserType extends PlayerType {
    constructor(akvOptionsIn) {
        const kvDefaults = {
            x: 80,
            y: 290,
            nWidth: 70,
            nHeight: 115,
            context: null  
        },
        akvOptions = Object.assign({}, kvDefaults, akvOptionsIn)

        super(akvOptions);

        if (!this.kvOptions.context) {
            throw "Missing context"
        }
        this.ePlayerState = null;
        this.kvPlayerStateToAnim = {};

        const aAnimStand = new AnimationType({
            strURL: "images/bieg1.png",
            context : this.kvOptions.context,
            nRate: 120
        })
        const aAnimWalk = new AnimationType({
            strURL: "images/bieg1.png",
            context: this.kvOptions.context,
            nRate: 120
        })
        const aAnimHighKick = new AnimationType({
            strURL: "images/atak2.png",
            context: this.kvOptions.context,
            nRate: 50,
           
        });
        const aAnimJump = new AnimationType({
            strURL: "images/bieg1.png",
            context: this.kvOptions.context,
            nRate: 120,
            bLoop: false
        });

        aAnimStand.appendFrame(70,0);           


        aAnimWalk.appendFrame(70,0);
        aAnimWalk.appendFrame(140,0);
        aAnimWalk.appendFrame(210,0);
        aAnimWalk.appendFrame(280,0);
        aAnimWalk.appendFrame(350,0);
        aAnimWalk.appendFrame(420,0);
        aAnimWalk.appendFrame(490,0);
        aAnimWalk.appendFrame(560,0);

        
        aAnimHighKick.appendFrame(70, 0);
        aAnimHighKick.appendFrame(140,0);
        aAnimHighKick.appendFrame(210,0);
        aAnimHighKick.appendFrame(280,0);
        aAnimHighKick.appendFrame(350, 0);
        aAnimHighKick.appendFrame(420, 0);
        aAnimHighKick.appendFrame(490, 0);
        aAnimHighKick.appendFrame(560, 0);

        aAnimJump.appendFrame(70,0);



        this.AnimStand = aAnimStand;
        this.AnimWalk = aAnimWalk;
        this.AnimHighKick = aAnimHighKick;
        this.aAnimJump = aAnimJump;
        this.dWalkSpeed = 250.0;
        this.dJumpSpeed = 250.0;
        this.dAccelY = 220.0;
        this.dSpeedX = 0;
        this.dSpeedY = 0;

        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick,
            [JUMP]: aAnimJump
        }

        WebSocketPlayerUser.attachOnReceivedXY(this.onReceivedXY.bind(this))
        WebSocketPlayerUser.attachOnReceivedPlayerState(this.onReceivedPlayerState.bind(this))
    }
    update(adElapsedTime, aTiles) {

        if(WebSocketPlayerUser.isConnected() && (!WebSocketPlayerUser.canControlUser())){
            return;
        }
        let aePlayerState = STAND;
        this.dSpeedX = 0;
        
        if (Keyboard.isJump()) {
            aePlayerState = JUMP
        } else if (Keyboard.isLeft()) {
            aePlayerState = WALK_LEFT
            if(sounds.walk.ended)
            {
                    sounds.walk.play();
            }
        } else if (Keyboard.isRight()) {
            aePlayerState = WALK_RIGHT
            if(sounds.walk.ended)
            {
                   sounds.walk.play();
            }
        } else if (Keyboard.isKick()) {
            aePlayerState = HIGH_KICK
            sounds.attack.play();
        }

        if (aePlayerState !== this.ePlayerState) {
            this.ePlayerState = aePlayerState;
            this.setAnimation(this.kvPlayerStateToAnim[aePlayerState]);
            this.sendPlayerState();

            switch(aePlayerState) {
                case WALK_LEFT:
                    this.setFlipH(true);
                    sounds.walk.play();
                    break;
                case WALK_RIGHT:
                    this.setFlipH(false);
                    sounds.walk.play();
                    break;
                case JUMP:
                    if (0 === this.dSpeedY) {
                        this.dSpeedY = -this.dJumpSpeed;
                        sounds.jump.play();
                    }
                    break;
                default:
                    break;
            }
        }
        else {
            switch (aePlayerState) {
                case WALK_LEFT:
                    this.dSpeedX = -this.dWalkSpeed;
                    break;
                case WALK_RIGHT:
                    this.dSpeedX = this.dWalkSpeed;
                    break;
                default:
                    break;
            }
        }

        const adOrigY = this.getY(), adOrigX = this.getX();
        this.dSpeedY = Math.min(450, Math.max(-450, this.dSpeedY + this.dAccelY * adElapsedTime));

        let adX_new = adOrigX + this.dSpeedX * adElapsedTime,
            adY_new = adOrigY + this.dSpeedY * adElapsedTime;

        let akvBoundingBox = this.getBoundingBox(),
            akvBoundingBox_new = {
               xLeft: adX_new,
               xRight: adX_new + this.getWidth(),
               yTop: adY_new,
               yBottom: adY_new + this.getHeight()
          };
        const avTilesColliding = aTiles.getCollidingTiles(akvBoundingBox_new),
            anTiles = avTilesColliding.length;

        if (0 >= anTiles){
            
            this.setXY(adX_new, adY_new);
            return;
        }
        const adDeltaX = adX_new - adOrigX, adDeltaY = adY_new - adOrigY;
        let aTile;

        if (0 < Math.abs(adDeltaY)) {
            for (let i = 0; i < anTiles; ++i) {

                aTile = avTilesColliding[i];
                const akvBoundingBox_Tile = aTile.getBoundingBox();
                if(!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile)) {
                    continue;
                }
                if(isSegmentsIntersect(
                    akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yBottom,
                    akvBoundingBox.yTop, akvBoundingBox.yBottom
                )) {
                    continue;
                }
                const avSegmentY = getSegmentsIntersection(
                    akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yBottom,
                    akvBoundingBox_new.yTop, akvBoundingBox_new.yBottom
                );

                let adCorrY;

                if(Math.abs(avSegmentY[0] - adY_new) < 0.1) {
                    adCorrY = avSegmentY[1] - avSegmentY[0];
                }
                else {
                    adCorrY = avSegmentY[0] - avSegmentY[1];
                }

                adY_new += adCorrY;

                akvBoundingBox_new.yTop += adCorrY;
                akvBoundingBox_new.yBottom += adCorrY;

                this.dSpeedY = 0;
                break;
            }
        }
        if (0 < Math.abs(adDeltaX)){

            for (let i = 0; i < anTiles; ++i) {

                aTile = avTilesColliding[i];
                const akvBoundingBox_Tile = aTile.getBoundingBox();
                if(!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile)) {
                    continue;
                }
                if(isSegmentsIntersect(
                    akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight,
                    akvBoundingBox.xLeft, akvBoundingBox.xRight
                )) {
                    console.log(akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight,
                        akvBoundingBox.xLeft, akvBoundingBox.xRight);
                    continue;
                }

                const avSegmentX = getSegmentsIntersection(
                    akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight,
                    akvBoundingBox_new.xLeft, akvBoundingBox_new.xRight
                );

                let adCorrX;

                if (Math.abs(avSegmentX[0] - adX_new) < 0.1) {
                    adCorrX = avSegmentX[1] - avSegmentX[0];
                }
                else {
                    adCorrX = avSegmentX[0] - avSegmentX[1];
                }
                adX_new += adCorrX;
                this.dSpeedX = 0;
                break;
            }
        }
        this.setXY(adX_new, adY_new)
    }

    setXY(x, y){
        super.setXY(x, y)
        WebSocketPlayerUser.sendXY(x, y)
    }

    sendPlayerState(){
        WebSocketPlayerUser.sendPlayerState(vIndex2Symbol.indexOf(this.ePlayerState))
    }

    onReceivedXY(x, y){
     if(WebSocketPlayerUser.canControlUser()){
            return
     }
    super.setXY(x, y)
    }

    onReceivedPlayerState(anPlayerState){
        if(WebSocketPlayerUser.canControlUser()){
            return
        }

        const aePlayerState = vIndex2Symbol[anPlayerState]
        this.ePlayerState = aePlayerState;
        this.setAnimation(this.kvPlayerStateToAnim[aePlayerState])

        switch(aePlayerState){
            case WALK_RIGHT:
                this.setFlipH(false)
                break
            case WALK_LEFT:
                this.setFlipH(true)
                break
            default:
                break
        }
    }




}