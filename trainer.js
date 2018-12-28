let mobilenet;
let predictor;
let video;
let value = 0;
let slider;
let addButton;
let train;
let save;

function modelReady(){
	console.log("model ready");
}
function videoReady(){
	console.log("video ready");
}

function whileTraining(loss){
		if(loss == null){
			console.log("complete");
			predictor.predict(gotResults);
		}else{console.log(loss);
		}
}


function gotResults(error, result){
	if (error){
		console.log(error);
	}else{
		value = result;
		predictor.predict(gotResults);
	}
}


function setup() {
	createCanvas(800, 600);
	video = createCapture(VIDEO);
	video.hide();
	mobilenet = ml5.featureExtractor("MobileNet",  modelReady);
	predictor = mobilenet.regression(video, videoReady);

			slider = createSlider(0,1, 0.5, 0.01);

			addButton = createButton("esempio")
			addButton.mousePressed(function(){
				predictor.addImage(slider.value());
			})

			train = createButton("train");
			train.mousePressed(function(){
				predictor.train(whileTraining);
			});


			save = createButton("save");
			save.mousePressed(function(){
				predictor.save();
			});
}



function draw() {
	background(0);
	rectMode(CENTER);
	fill(255);
	image(video, 0, 0);
	rect(value*width, height/2, 50,50);
	fill(255);
	textSize(32);
	text(value, 10, height-20);
}
