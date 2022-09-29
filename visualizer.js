class Visualizer {
  //static method to draw network using the context and network
  static drawNetwork(ctx, network) {
    //small margin
    const margin = 50;
    //helper variables
    const left = margin;
    const top = margin;
    //width is canvas width - margin(50px) * 2 same with height
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    //get height of each level: height/ number of levels
    const levelHeight=height/network.levels.length;

    //loop through each level
    for(let i=network.levels.length-1;i>=0;i--){
        //top of each level offset by the top takingmargin in consideration
        //interpelate between height-lvl height,0,network level (dont / by 0)
        //in center if there is only one level that needs to be drawn
        const levelTop=top+
            lerp(
                height-levelHeight,
                0,
                network.levels.length==1
                    ?0.5
                    :i/(network.levels.length-1)
            );
            
        ctx.setLineDash([7,3]);
        //draw level and specify values
        Visualizer.drawLevel(ctx,network.levels[i],
            left,levelTop,
            width,levelHeight,
            i==network.levels.length-1
                ?['🠉','🠈','🠊','🠋']
                :[]
        );
    }

    //visualize a single level of the network
    //using same context and 1st level of the network
    //Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
  }

  //draw lvl on context given a level and helper variables
  static drawLevel(ctx, level, left, top, width, height,outputLabels) {
    //helper variables
    const right = left + width;
    const bottom = top + height;

    //variable to define input and output nodes for each level
    //aslo weights and biases
    //so code doesnt get redundant
    const { inputs, outputs,weights,biases } = level;

    //defining the connections between nodes in the network object
    //for each of the inputs and for each output
    //before the nodesa so connections are drawn first so they are behind the nodes
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < outputs.length; j++) {
          //draw line between input and output (between nodes)
          //begin path
          ctx.beginPath();
          //move to first cordinate of first input
          ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
  
          //lineto get node x of the jth output also forom left to right
          ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
  
          ctx.lineWidth = 2;
          
          //ref getRGBA function usign weights at i and j as the value
          ctx.strokeStyle = getRGBA(weights[i][j]);
          
          ctx.stroke();
  
        }
      }
    //size of the nodes- radius as they are cricles
    const nodeRadius = 18;

    //loop through all of the inputs
    for (let i = 0; i < inputs.length; i++) {
      //x cordinate for each of the inputs using lerp utility function
      //lerp takes left,right depending on inputs length of 1 and return00.5 or / inputs length -1
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      //full radius
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      //black
      ctx.beginPath();
      //60% radius
      ctx.arc(x, bottom, nodeRadius*0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]); "white";
      ctx.fill();
    }

    //loop through all of the outputs
     //in car nodecount output layer is currenty set to 6
    for (let i = 0; i < outputs.length; i++) {
      //x cordinate for each of the outputs using lerp utility function
      //lerp takes left,right depending on outputslength of 1
      //return 0.5 or / outputs length -1
      const x = Visualizer.#getNodeX(outputs, i, left, right)
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius*0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();
    
      //for biases-same values as weights (between -1 and 1)
      ctx.beginPath();
      ctx.lineWidth=2;
      //bias radius will be half-way at 80%
      ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
      //call utility function that takes biases at i as value
      ctx.strokeStyle = getRGBA(biases[i]);
      //dashes close to 1 and none close to -1
      ctx.setLineDash([3,3]);
      ctx.stroke();
      //reset line desh to empty array
      ctx.setLineDash([]);

      //if there is outputlabeel for ith output that os drawn
      if(outputLabels[i]){
        ctx.beginPath();
        //draw text center middle
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        //black field
        ctx.fillStyle="black";
        //stroke to white so its visible
        ctx.strokeStyle="white";
        //font size and font family
        ctx.font=(nodeRadius*1.5)+"px Arial";
        //fill text using output label
        ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1);                ctx.lineWidth=0.5;
        ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
      }
    }
  }

  //return getting x value node depending on left,right and index
  //nodes length 1 is o.5 otherwise index/(nodes.length -1)
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
