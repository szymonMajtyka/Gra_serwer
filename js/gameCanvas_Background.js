export { BackgroundType as default }

import PlayerType from "./gameCanvas_Player.js"
import AnimationType from "./gameCanvas_Animation.js"

class BackgroundType extends PlayerType {
    constructor(akvOptionsIn) {
        const kvDefaults = {
            nWorldWidth : 1,
            strURL: null,
            context: null
        }
        let akvOptions = Object.assign({}, kvDefaults, akvOptionsIn)

        super(akvOptions);

        if (!this.kvOptions.context) {
            throw "Missing context"
        }
        let {strURL: astrURL, context: aContext } = this.kvOptions

        const aAnimBackground = new AnimationType({
            strURL: astrURL,
            context: aContext
        })
        aAnimBackground.appendFrame(0,0)

        this.setAnimation(aAnimBackground)
    }
    draw(adWorldOffsetX) {
        super.draw(adWorldOffsetX)

    }
}