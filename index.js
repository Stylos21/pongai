class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;

    }
}

class Rect{
    constructor(w, h){
        this.pos = new Vector;
        this.vel = new Vector;

        this.size = new Vector(w, h);
    }
   
    get left(){
        return this.pos.x;
    }

    get right(){
        return this.pos.x + this.size.w;

    }
    get down(){
        return this.pos.y + this.size.h;
    }

    get up(){
        return this.pos.y;
    }
}

class Player extends Rect{
    constructor(){
        super(20, 500);

        this.score = 0;
        
        this.predictionData = this.pos.y;

    }
    
}

class Ball extends Rect{
    constructor(){
        super(20, 20);
    }
    
    
}

// class Player extends Rect{
//     constructor(){
//         super(20, 500);

//     }
// }

class Pong{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.ball = new Ball(20, 20);
        this.ai = new Player;
        this.player = new Player
        this.ai.pos.x = 40;
        this.ai.pos.y = this.canvas.height - 40;
        this.player.pos.x = 40;
        this.player.pos.y = 20;
        this.player.size.w = 200;
        this.player.size.h = 20;
        this.ai.size.w = 200;
        this.ai.size.h = 20;
        this.ball.pos.x = canvas.width / 2;
        this.ball.pos.y = canvas.height / 2;
        this.ball.size.w = 20;
        this.ball.size.h = 20;
        this.ball.vel.x = -2;
        this.ball.vel.y = -2;
        let lastTime;
        const callback = millis => {
            if(lastTime){
                this.update();
            }
            requestAnimationFrame(callback);
            lastTime = millis
        } 
        callback();    
    }

    draw(rect){
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.pos.x, rect.pos.y, rect.size.w, rect.size.h)
    }

    drawText(){
        this.context.fillStyle = "white";
        this.context.font = "bold 32px Arial";
        this.context.fillText(`${this.player.score} - ${this.ai.score}`, (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    }

    reset(){
        this.ball.pos.x = canvas.width / 2;
        this.ball.pos.y = canvas.height / 2;
        this.ai.pos.x = 40;
        this.ai.pos.y = this.canvas.height - 40;

    }

    resetGame(){
        if(this.player.score == 5 || this.ai.score == 5){
            this.reset();
            this.player.score = 0;
            this.ai.score = 0;
            
        }
    }

    collide(player, ai, ball){
        // console.log(ai.pos.x - ball.pos.x);

        if(player.left < ball.right && player.right > ball.left &&
            player.up < ball.down && player.down > ball.up){
                
            this.ball.vel.y = -this.ball.vel.y;
            // this.ball.vel.x++

            this.ball.vel.x = -this.ball.vel.x;
            // console.log('hello hi');
        }
        else if(ai.left < ball.right && ai.right > ball.left &&
            ai.up < ball.down && ai.down > ball.up){
            this.ball.vel.y = -this.ball.vel.y - 1;
            // this.ball.vel.x--;
            this.ball.vel.x = -this.ball.vel.x  - 1;
        }
        
    }

   

     async update(){
        
        let xs = [this.ball.pos.y];
        let ys = [this.player.pos.x];


        
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw(this.ball);
        this.draw(this.ai);
        this.draw(this.player);
        this.drawText();
        // this.ai.pos.y = this.ball.pos.y;
        
        this.ball.pos.x += this.ball.vel.x;
        this.ball.pos.y += this.ball.vel.y;
        // console.log(this.ball.pos);
        if(this.ball.pos.y  <= 10){
            // this.ball.vel.x = -this.ball.vel.x;

           
            this.ai.score++;
            this.reset();

            
        }
        else if(this.ball.pos.y >= 800){
            
            this.player.score++;


            this.reset();


        }
        else if(this.ball.pos.x > this.canvas.width || this.ball.pos.x <= 0){
            this.ball.pos.x = -this.ball.vel.x
            this.ball.pos.y = -this.ball.vel.y

            // this.reset();
            
        }
        if(this.ai.pos.x <= 10 || this.ai.pos.x >= canvas.width){

            this.ai.pos.x = -this.ai.vel.x
        }



        this.collide(this.player, this.ai, this.ball);
        this.resetGame();
        
       
        
        // xs.print();
        // console.log(xs.length)
        // console.log(xs.size, ys.size)
        console.log(tf.memory().numTensors)


        let model = tf.sequential();
        model.add(tf.layers.dense({
            units:1,
            inputShape: [1],
            activation:'relu'
        }))
        model.add(tf.layers.dense({
            units:1,
            inputShape: [1],
            activation:'relu'
        }))
        model.add(tf.layers.dense({
            units:1,

            activation:'linear'
        }))
     
        
        // tf.tidy(() => {
            let xxs = tf.tensor2d([xs])
            let yys = tf.tensor2d([ys])
            xxs.dispose();
            yys.dispose();
            model.compile({loss:'meanSquaredError', optimizer:'adam'});
            // model.fit(xxs, yys, {epochs:10}).then(async () => {
                 await model.save('localstorage://model.json');

                model =  await tf.loadLayersModel('localstorage://model.json')
              
                  const res =  model.predict(tf.tensor2d([[this.ball.pos.y]])).dataSync()[0];
              //  console.log(res)
  
       
  
               
                  
  
                  this.ai.vel.x = res * 0.45;
                  this.ai.pos.x += this.ai.vel.x
                return;

            // })
             

                


            // });
        // })
    
        // })
        
        
    }
    
}

const canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 800;

const pong = new Pong(canvas);


document.addEventListener('mousemove', e => {
    const keyCode = e.clientX;

    pong.player.pos.x = keyCode;



})