document.addEventListener("DOMContentLoaded", onReady)

import PlayerType from "./gameCanvas_Player.js"
import PlayerUserType from "./gameCanvas_PlayerUser.js"
import BackgroundType from "./gameCanvas_Background.js"
import TilesType from "./gameCanvas_Tiles.js"
import AnimationType from "./gameCanvas_Animation.js"

import sounds from "./sounds.js"

function onReady(){


    const aBoard=document.getElementById("idGame")
    const aSplashScreen = document.getElementById("idSplashScreen")

    const aCanvas=document.createElement("canvas")
    aCanvas.setAttribute("id","idCanvas")
    aCanvas.style.display="none"
    aCanvas.width="640"
    aCanvas.height="480"
    aBoard.appendChild(aCanvas)
    const aContext=aCanvas.getContext("2d")
    let aMapTiles_Leve10 = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],   
        [0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,2,2,2,5,5,2,2,2,2,2,2,2,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    
    ];
    
    const aAnimTile0 = new AnimationType({
      strURL: "images/l1.png",
      context: aContext
   
    })
    aAnimTile0.appendFrame(0, 0)
    
    const aAnimTile1 = new AnimationType({
      strURL: "images/l1.png",
      context: aContext
    })
    aAnimTile1.appendFrame(0,0)
    
    
    const aAnimTile2 = new AnimationType({
      strURL: "images/tile1.png",
      context: aContext 
    })
    aAnimTile2.appendFrame(0,0)
    
    const aAnimTile3 = new AnimationType({
      strURL: "images/l1.png",
      context: aContext 
    })
    aAnimTile3.appendFrame(0,0);

    const aAnimTile4 = new AnimationType({
      strURL: "images/water.png",
      context: aContext 
    })
    aAnimTile4.appendFrame(0,0);
    

    
    
    const aTiles = new TilesType({
      nTileWidth: 91,
      nTileHeight: 91,
      vvMapTiles: aMapTiles_Leve10,
      vAnimations: [aAnimTile0, aAnimTile1, aAnimTile2, aAnimTile3, aAnimTile4],
      context: aContext
    })

    const aBackground = new BackgroundType({
        nWorldWidth: 640,
        nWidth: 1200,
        nHeight: 480,
        strURL: "images/game1.jpg",
        context: aContext
      })
      const aBackground2 = new BackgroundType({
        nWorldWidth: 640,
        nWidth: 1280,
        nHeight: 480,
        strURL: "images/l3.png",
        context: aContext
      })
    const aPlayer = new PlayerUserType({
        context : aContext
    }) 

    function gameLoop(adTimestamp) {
        let adElapsedTime = (adTimestamp - adTime) * 0.001
        aPlayer.update(adElapsedTime, aTiles)

        let x = aPlayer.getX(), adOffsetX = 0.0;
        if (200 < x) {
            adOffsetX = x - 200;
        }

        aBackground.draw(adOffsetX * 0.33)
        aBackground2.draw(adOffsetX * 0.67)  
        aTiles.draw(adOffsetX)        
        aPlayer.draw(adOffsetX)
        adTime = adTimestamp
        requestAnimationFrame(gameLoop)
    }    

    let adTime;
    aSplashScreen.onclick = () => {

        aSplashScreen.style.display = "none"
        aCanvas.style.display = "block"

        adTime = performance.now()
        requestAnimationFrame(gameLoop)
    }
    
}