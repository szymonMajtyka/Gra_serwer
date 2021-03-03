
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_E = 69;
const KEY_UP = 38;

class KeyboardType {
    constructor(akvOptionsIn) {
        this.kvKeys = {};

        [KEY_LEFT,KEY_UP, KEY_RIGHT, KEY_E].forEach(aKey => {
            this.kvKeys[aKey] = false
        })

        document.onkeydown = event => { 
            if(event.keyCode in this.kvKeys) {
                this.kvKeys[event.keyCode] = true
            }
        }
        document.onkeyup = event => {
            if (event.keyCode in this.kvKeys) {
                this.kvKeys[event.keyCode] = false
            }
        }
    }

isLeft() {
    return this.kvKeys[KEY_LEFT] && !this.kvKeys[KEY_RIGHT]
}
isRight() {
    return this.kvKeys[KEY_RIGHT] && !this.kvKeys[KEY_LEFT]
}
isKick() {
    return this.kvKeys[KEY_E] 
}
isJump() {
    return this.kvKeys[KEY_UP]
}
}
var Keyboard = new KeyboardType()

export { Keyboard as default }
