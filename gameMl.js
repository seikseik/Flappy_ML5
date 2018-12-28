let mobilenet;
let predictor;
let video;
let value = 0;
let ship;
let pipes = [];
let img;
let font;
let life = [];
let counter = 0;
let score = 0;

function preload(){
	img = loadImage('images/cuore.png');
	font = loadFont('images/8-bit.ttf');
}

function modelReady(){
	console.log("model ready");
	predictor.load("./model/model2.json", customModelReady);
}

function customModelReady(){
	console.log(" custom model ready");
	predictor.predict(gotResults);
}

function videoReady(){
	console.log("video ready");
}

function gotResults(error, result){
	if (error){
		console.log("error");
	}else{
		value = result;
		predictor.predict(gotResults);
	}
}


function setup() {
	createCanvas(900, 900);
	video = createCapture(VIDEO);
	video.hide();
	mobilenet = ml5.featureExtractor("MobileNet",  modelReady);
	predictor = mobilenet.regression(video, videoReady);
	ship = new Ship();
  pipes.push(new Pipe());

for(let i = 0; i < 5; i++){
	life.push(img);
 }

}


function draw() {
	textFont(font);
	textSize(80);
	textAlign(CENTER);
	noStroke();
	background(0,70);
	fill(255);
	ship.show();

	for(let i = pipes.length-1; i >= 0; i-- ){
			pipes[i].update();
			pipes[i].show();

      if (pipes[i].hits(ship)){
          console.log ("hit");
					counter++
					if(counter > 8){
						life.splice(-1,1);
						counter = 0;
					}
      }

      if(pipes[i].offscreen()){
        pipes.splice(i,1);
      }
    }

  if( frameCount % 100 == 0){
    pipes.push(new Pipe());
  }

	let step = 10
	for(let i = 0; i < life.length; i++){
		image(img, step, 25, 25, 25);
		step += 30;
	 }


	if(life.length <= 0){
	fill(255,0,0);
	text("GAMEOVER",width/2,height/2-200);
	textSize(50);
	text(`score : ${Math.round(score/9)} `,width/2,height/2-100);
	funzioneInventataPerBloccareProgramma();
	}

}




function Ship(){
    this.y = 600;
		this.x = width/2;

this.show = function(){
	 this.x = lerp(this.x, value*width, 0.04);
    fill(255);
    ellipse(this.x, this.y, 30,30 );
  }
}



function Pipe(){

	var spacing = random(40, width/3 );
	var centerX = random(0,width/2);

  this.top = centerX-spacing/2;
  this.bottom = width-(centerX+spacing/2);
  this.y = 0;
  this.w = 40;
  this.speed = -4;
  this.highligth = false;

  this.hits = function(bird){

  if(ship.x < this.top || ship.x > width - this.bottom ){
      if(ship.y > this.y &&  ship.y < this.y + this.w){
        this.highligth = true;
        return true;
      }
  	}

		if(ship.x > this.top || ship.x < width - this.bottom ){
				if(ship.y > this.y &&  ship.y < this.y + this.w){
					score++;
					console.log(score);
				}
			}
  return false;
	}

  this.show = function(){
    fill(255);
      if(this.highligth == true){
        fill(255,0,0);
      }
    rect(0, this.y, this.top, this.w);
    rect(width-this.bottom, this.y, this.bottom, this.w);
  }

  this.update = function(){
    this.y -= this.speed;

  }

  this.offscreen = function(){
    if(this.y > height){
      return true;
    }else{
      return false;
    }
  }
}
