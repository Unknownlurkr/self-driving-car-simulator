//adding sensors
class Sensor {
  //constructor takes car as thee arugment
  constructor(car) {
    //want sensor to be attach to car and know where car is
    this.car = car;
    //52:09-sensors cast rays (lines) have three for now
    this.rayCount = 5;
    //sensors have a range they can see
    this.rayLength = 150;
    //45 degree pi/4 and pi/2 is 90
    //angle of rays being spread casted by sensor
    this.raySpread = Math.PI / 2;
    //keep each individual ray
    this.rays = [];
    //values for each ray to show border and how border is
    this.readings = [];
  }
  update(roadBorders,traffic) {
    this.#castRays();
    this.readings = [];
    //itterate through all of the rays
    for (let i = 0; i < this.rays.length; i++) {
      //this.#getReading(this.rays[i],roadBorders)
      //fixed as sensors werentr shown
      this.readings.push(
        this.#getReading(this.rays[i],roadBorders,traffic)
        );
    }
  }

  #getReading(ray, roadBorders,traffic) {
    //closes touch will be used
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      //if touch, push touch to touches array
      if (touch) {
        touches.push(touch);
      }
    }

    for(let i=0;i<traffic.length;i++){
      //reduces redundant code creating poly variable
      //so that there is no need to add traffic[i].polygon
      const poly = traffic[i].polygon;
      //go through all points in polygon to get intersection value
      for(let j = 0; j <poly.length;j++){
        const value =getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j+1)%poly.length]
        );
        //if there is a value push to touches
        if(value){
          touches.push(value);
        }
      }
    }

    //no touches with given ray then no reading
    if (touches.length == 0) {
      return null;
    } else {
      //get offsets, goes through touches and takes it offset
      const offsets = touches.map((e) => e.offset);
      //min offset-spread ray in to individual values
      const minOffset = Math.min(...offsets);
      //return touch with minimum offset
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays(){
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      //use lerp function to find out the angle of each ray
      //angle will be between- raySpred/2 - raySpread/2- max val fori is ray count - 1
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          //if ray count is 1 then return half so not 0 and then just 1 ray
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  //draw sensor
  draw(ctx) {
    //loop through all rays
    for (let i = 0; i < this.rayCount; i++) {
      //draw readings
      //endpoint of rays
      let end = this.rays[i][1];
      //if reading,set end to value of reading
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(
        //start
        this.rays[i][0].x,
        this.rays[i][0].y
      );
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(
        //end
        this.rays[i][1].x,
        this.rays[i][1].y
      );
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
