//y axis goes downward
//car constructor
//starts at x and y location
//x of car is the center in the car
//and will have parts from top,bottom, left and right
//x - half of width and y - half of the height
class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        //speed and acceleration attribute
        this.speed=0;
        this.acceleration=0.2;
        //max speed and friction
        //maxSpeed default 3-change in main file
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        //angle defined so car can turn
        this.angle=0;
        //cars not damaged to begin with
        this.damaged=false;

        //define attribute to control car using neural network
        this.useBrain=controlType=="AI";

        //if controlType is not dummy then car will have sensors
        if(controlType!="DUMMY"){
            //define sensor and pass reference to the car
            this.sensor=new Sensor(this);
            //define neural network
            //specify array of neruonCounts the size of the layers
            this.brain= new NeuralNetwork(
                //array will take: the sensor rays, input layer of 6 and output layer of 4 neurons(up,down,left,right)
                [this.sensor.rayCount,6,4]
            );
        }
        //reference instance of constrol constructor
        this.controls=new Controls(controlType);
    }

    //update function used to reference to animate car
    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            //update polygon after car is moved
            //polygon attribute that will be generated this way
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        //only update sensor if it exists (not dummy)
        if(this.sensor){
            //update sensor- Will also precive the traffic
            this.sensor.update(roadBorders,traffic);
            //take offsets from sensor readings(has x,y and offset)
            //map each sensor reading-check if s null if so return 0= no reading:-> return 1 - senmsor.offset
            //want neuron to recieve low values if object is far away and high values close to 1 if object is close
            const offsets=this.sensor.readings.map(s=>s==null?0:1-s.offset);
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            //console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    //assessDamage taking in roadboprders
    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            //roadBorders[i] road segment
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        //loop through road borders
        for(let i=0;i<traffic.length;i++){
            //roadBorders[i] road segment
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        //one point per corner of the car stored as list
        const points=[];
        //radius of triangle / 2 as half is needed
        const rad=Math.hypot(this.width,this.height)/2;
        //the tagnent of the angle-atan2-give angle knowing width and height
        const alpha=Math.atan2(this.width,this.height);
        //points with x: x-sine(angle-alpha)*radius
        //y is the same but it uses cosine
        //1:13:39 in video for image reference
        //top right point 
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            //speed will increase by the acceleration
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            //- indicates the car is going backwards
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        //decrease by friction if greater than 0
        if(this.speed>0){
            //one error had =- changed to -=
            //- indicates the car is going backwards
            this.speed-=this.friction;
        }
        //speed less than 0 and speed increases by friction
        if(this.speed<0){
            this.speed+=this.friction;
        }
        //if speed abs val less than friction then make it default 0
        //this allows the car to turn at an angle than just left to right
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            //depends on speed- flip controls and * by flip
            //so the car moves correct direction
            const flip=this.speed>0?1:-1;
            //define rotations of the angle left and right
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        //rotate based on angle and speed so it doesnt just rotate
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color,drawSensor=false){
        //if car is damaged set car to graty, otherwise fil;style black
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        //move to first pooint in polygon
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        //loop through all of the remaining points
        //i starts at 1 insted of 0 as already moved to first point
        for(let i=1;i<this.polygon.length;i++){
            //lineTo the ith polygon x and y
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        //if sensor will draw it so dummy doesnt have sensors
        if(this.sensor && drawSensor){
            //get car to draw its own sensor
            this.sensor.draw(ctx);
        }
    }
}