//linear interperlation function
function lerp(A,B,t){
    //value of a + difference of b-a * precentage t
    //t == 0 then only have A
    // t ==1: -A will cancel out so left with B
    return A+(B-A)*t;
}

//segment intersetion
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1,poly2){
    //loop through all of the points in poly 1
    //for each check all points of poly2
    for(let i=0;i<poly1.length;i++){
        for(let j = 0; j<poly2.length;j++){
            //see if points touch or not
            //compare all  segmentss of polygons  
            const touch = getIntersection(
                poly1[i],
                //makingsegments from one point aftrer the other-% becomes 0
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            //return true if there is a touch 
            if(touch){
                return true;
            }
        }
    }
    //if all checks return null then return false-if polys dont intersect
    return false; 
}


//get RGBA of a value (takes in a value)
function getRGBA(value){
    //obtain aplha by using abs of the value
    //0 cant see connection and greater is more solid-max 255
    //yellow postive values and blue for negative
    const alpha=Math.abs(value);

    //use 0 if value is less than 0 otherwise maxx is 255
    //R is Red, G green same values as R
    //blue opposite of R
    const R= value<0?0:255;
    const G = R;
    const B = value>0?0:255;

    //use colours to draw each connection depending on its wegiht
    //red green blue alpha (transparency)- concat variables
    return "rgba("+R+","+G+","+B+","+alpha+")";
}