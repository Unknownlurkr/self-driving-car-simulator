//road class 
//attributes- centered with x value,width, laneCount default 4 (or 3 )
class Road{
    constructor(x,width,laneCount=3){
        this.x = x;
        this.width = width;

        //number of lanes
        this.laneCount = laneCount;

        //left = x - width/2
        this.left = x-width/2;

        //right = x+width/2
        this.right = x+width/2;

        //road to go infinatley upwards and backwards
        //just use big vsalue for now
        const infinity = 1000000;
        //top -infinity
        this.top = -infinity
        //plus infinity as y grows downwards
        this.bottom = infinity;

        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
        
    }

    //function determine what is the center of a given lane
    //given index start left to right starting at 0
    getLaneCenter(laneIndex){
        //helper variable-lane width
        //4 lanes and offset in middle of the lane
        const laneWidth = this.width/this.laneCount;
        //Math.min(laneIndex,this.laneCount-1)*laneWidth;- rightmost lane no matter what
        return this.left + laneWidth/2+Math.min(laneIndex,this.laneCount-1)*laneWidth;
        //return this.left + laneWidth/2+laneIndex*laneWidth;
    }

    //draw the road
    draw(ctx){
        //thiccc line by draw linewidth of 5 
        ctx.lineWidth=5;
        //make line strokes white
        ctx.strokeStyle="white";

        for(let i = 0; i <= this.laneCount; i++){
            //x cord of each of the lanes being drawn
            //different x values so linear interperlation is used: lerp()
            const x =  lerp(
                //lerp between left and right according to a %
                this.left,
                this.right,
                //%
                i/this.laneCount
            );

            //add dashes in the middle of the lines
            if(i>0 && i < this.laneCount){
                //20px and break of 20px for dashes
                ctx.setLineDash([20,20]);
            }else{
                //boreders
                ctx.setLineDash([]);
            } //if lanedash changed to 4 car isnt centered

            ctx.beginPath();

            //draw white vertical line on left  side of screen
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            //stroke just adds lines rather than draw img/shape
            ctx.stroke(); 
        }
        //ctx.beginPath();
        //draw white vertical line on right side of screen
        //ctx.moveTo(this.right,this.top);
        //ctx.lineTo(this.right,this.bottom);
        //ctx.stroke(); 
    }
}

