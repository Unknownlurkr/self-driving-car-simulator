//stretch canvas vertical full screen
//get reverence to canvas
//canvas always is required to have a id attribute and width and height
const carCanvas=document.getElementById("carCanvas");

//200px canvas width
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");

//200px canvas width
networkCanvas.width=300;

//drawing co ntext to draw on canvas- 2d
//contain all methods needed to draw what is needed
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
//new road centered in half width of canvas
//and have width of entire canvas width
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

//car for canvas- Car(x,y,width,height) all in pixels
// Car(road.getLaneCenter(3),100,30,50) car on right lane
//lane 1 is center and lane 3 is right most lane
//lanes are array-> 4 lanes so lanes 0,1,2,3 -> 3 lanes 0,1,2
//const car=new Car(road.getLaneCenter(1),100,30,50,"AI");
//1000 or 100 for the AMOUTN OF CARS
const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];

//if best brain is stored in local storage
if(localStorage.getItem("bestBrain")){
    //loop through all cars
    for(let i=0;i<cars.length;i++){
        //set brain of best car to value by parsing JSON string used
    //local storage only uses strings
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            //mutate
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}
//define the traffic stored as an array of cars
//the cars are on same lane but infront of the car
//TODO: fix starting postion of car to center not top center
const traffic=[
    new Car(road.getLaneCenter(1), -100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -700,30,50,"DUMMY",2)
];

animate();

//save cars progress-using local storage(change later)
//serialize the brain to best car brain to serialize to json formart
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log("your progress has been saved");
}

//to discard
function discard(){
    localStorage.removeItem("bestBrain");
    console.log("your progress has been discarded!");
}

//generate cars for parellization
function generateCars(N) {
    const cars =[];
    for(let i = 0; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}


function animate(time){
    //iterate all of the cars in traffic array
    for(let i=0; i<traffic.length;i++){
        //each car to update and be aware of boorders
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        //update car
        cars[i].update(road.borders,traffic);
    }
    //best car-find car where y value = min val of all y values of car
    //new array of only y vals of cars-min value of all the cars y values
    //...spread as Math doesnt work with array
    //variable will replace code that has cars[0]
    //canvas focuses on car that goes upward the most
    bestCar = cars.find( 
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
        //update car
        //car.update(road.borders,traffic);
    //set hieght to full window inner height
    //resize canvas so rectangle doesnt stretch out and moves car (no trail)
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    //why car wasnt in the center
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    //road comes before the car and car pn top of road ctx
    road.draw(carCtx);
    for(let i=0; i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore();
    //implement feedforward algorithm
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    //call animate method many times per second
    //gives movement to the car
    requestAnimationFrame(animate);
}

