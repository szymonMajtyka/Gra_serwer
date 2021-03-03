export { sounds as default }
let walk = new Audio(),
    jump = new Audio(),
    attack = new Audio();

walk.src = "wind-sand.wav";
jump.src = "jump1.wav";
attack.src = "PUNCH.wav";

const sounds = {
    walk: walk,
    jump: jump,
    attack: attack,
    
}