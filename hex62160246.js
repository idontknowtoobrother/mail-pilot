
// For restart game .
restartGame = () => {
    document.body.innerHTML = `
        <div id="gameBoard"> Score: 0 | Time: 0.0 | Multiply Score: 1</div>
        <div id="heartTotal"> <img src="heart.png" width="24px" alt=""> x<span style="color: lime;"> 0</span></div>
    `
    init()
}

generateSpriteWithFunction = (createExec, max, soundHitArrs) => {
    // Init Manage
    var data = {
        sprites: [],
        soundsHit: [],
        update: function(){
            this.sprites.forEach(sprite => {
                sprite.update()
            })
        },
        reset: function(){
            this.sprites.forEach(sprite => {
                sprite.reset()
            })
        },
        isHitAndGetScore: function(checkSprite){
            var scoreAdd = -1
            this.sprites.forEach(sprite => {
                if(checkSprite.collidesWith(sprite)){
                    scoreAdd = sprite.scoreEffectValue
                    this.soundsHit.forEach(sound => {
                        sound.play()
                    })
                    sprite.reset()
                    return
                }
            })

            return scoreAdd
        }
    }

    // Init sprite to arrs
    for(var i = 0; i < max; i++){
        data.sprites.push(new createExec())
    }

    // Init sound to arrs
    soundHitArrs.forEach(soundPath => {
        data.soundsHit.push(new Audio(soundPath))
    })    
    

    return data
}

// Generate Islands
generateIslands = (maxIslands) => {
    var islandsData = {
        islands: [],
        update: function(){
            this.islands.forEach(island => {
                island.update()
            })
        }
    }
    
    for(var i = 0; i < maxIslands; i++){
        islandsData.islands.push(new Island())
    }
}

// Game update clouds .


// Create Class 'GameBoard'
function GameBoard(maxHeart){

    this.score = 0              // คะแนน
    this.time = -1              // เวลา
    this.mutiply = 1.0          // จำนวนการคูณคะแนนเมื่อชนเมฆ
    this.heart = maxHeart       // จะถูกลดลงต่อการชน เกาะ 1 ครั้ง
    this.timeIncreaseAt = 2     // หากเวลา 'time' modular 2 ลงตัวจะอัพเกรดการคูณ score
    this.timer = new Timer()
    
    this.reset = function(reason){
        document.body.innerHTML = `
        
            <div id="reset-info">
                ${reason}
            </div>
            <button class="restart-btn" onclick="restartGame()">Restart</button>
        
        `
        this.score = 0
        this.time = -1
        this.heart = maxHeart
        this.timeIncreaseAt = -1
        this.mutiply = 1.0
        this.timer = new Timer()
    }

    this.dbg = function(/**Args */){
        console.log('[ hex debug ]\n   ', arguments)
    }

    this.updateMultiply = function(){
        if(this.time%this.timeIncreaseAt != 0)return;
        // When 'time' modular 2 equal 0 then multiply+= 0.1
        this.mutiply+=0.1
    }
  
    this.tickTime = function(){
        // Multiply will add 0.1 when player stay alive more than 5 secs
        this.updateMultiply()
        this.time = this.timer.getElapsedTime() 
    }
    
    this.decreaseHeart = function(scene){
        this.heart--;
        this.dbg(`Heart: ${this.heart}`)
        if(this.heart>0)return
        this.reset(`
            <span style="color: #DC143C">Game Over !</span><br>
            ${this.getScoreInfo(false)}
        `)
        scene.stop()
    }
  
    this.addScore = function(n){
      this.score+=Math.floor(n*this.mutiply)
    }

    this.getScoreInfo = function(isMultiply){
        var info = ''
        var point2Time = (Math.round(this.time * 100) / 100).toFixed(2)
        var point2Score = (Math.round(this.score * 100) / 100).toFixed(2)
        info += `Score: <span style="color: gold">${point2Score}</span> | Time:  <span style="color: lightblue">${point2Time}</span>`;
        if(!isMultiply)return info;

        var point1Multiply = (Math.round(this.mutiply * 100) / 100).toFixed(1)
        info += `| Multiply Score:  <span style="color: red">${point1Multiply}</span>`
        return info
    }
  
    this.updateBoardUI = function(boardId, heartId){
        document.getElementById(heartId).innerHTML = `<img src="heart.png" width="24px" alt=""> x<span style="color: lime;"> ${this.heart}</span>`
        document.getElementById(boardId).innerHTML = this.getScoreInfo(true) // Update score 'UI'
    }
  
    return this
}

