//define a neural network composed of many levels (leevel class)
class NeuralNetwork{
    //constructor will get an array of neuron counts
    //the number of the neruons within each layer
    constructor(neuronCounts){
        //define levels-NN out of array of levels
        this.levels=[];
        //for each level specify input and output count
        for(let i=0;i<neuronCounts.length-1;i++){
            //specifiy input and output count
            //push new level at neuronCounts[i] and neruonCounts[i+1]
            this.levels.push(
                new Level(
                    neuronCounts[i], 
                    neuronCounts[i+1]
                )
            );
        }
    }

    //feedforward algorithm for neural network
    //putting the output of previous level into the new level as the input
    static feedForward(givenInputs,network){
        //get outputs by calling feedford method from levels class
        //feedford takes givenInputs and the networks first level (network.levels[0])
        //call first level to produce its outputs
        let outputs =  Level.feedForward(
            givenInputs, 
            network.levels[0]
        );

        //loop through remaining levels-i starts at 1
        for(let i = 1; i <network.levels.length;i++){
            //upate outputs with feedFordward result from the final level
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }
        //return final outputs-tells the direction (controls) the car will move
        return outputs;
    }

    //mutating the network
    static mutate(network,amount=1){
        //forEach to go through all of the levels within the network
        //loop throug all biases- ith bias will be lerp
        //lerp between current val of bias & random val between -1 and 1
        network.levels.forEach(level =>{
            for(let i = 0; i < level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                );
            }
            //replicating the code above but for the weights
            for(let i = 0; i<level.weights.length;i++){
                for(let j =0; j<level.weights[i].length;j++){
                    //weights i and j lerp between current val of weight
                    //and random val between -1 and 1
                    level.weights[i][j]=lerp(level.weights[i][j],Math.random()*2-1,amount);
                }
            }
        });
    }
}


//level class representing the layers
class Level{
    //constructor that counts input and output neurons
    constructor(inputCount,outputCount){
        //use simple arrays of values to define actual neurons
        //input values retrived from cars sensors
        this.inputs = new Array(inputCount);

        //compute outputs using weights and biases that are defined
        this.outputs = new Array(outputCount);

        //each output Neruon has a Bias
        this.biases = new Array(outputCount);

        //weights to represent each connection-stored as empty array
        this.weights=[];

        //going through all inputs prepare empty array that is the size of the outputCount
        //for eahc input node will have output count number of connections
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        //need values for weights and biases 
        //start with a random brain for now
        Level.#randomize(this);

    }

    //defining a static randomize method for random brain- takes level as parameter
    //methods dont serialize- needs to be static so randomize method can be serialized later
    static #randomize(level){
        //given a level-loop through inputs
        for(let i=0; i <level.inputs.length;i++){
            //nested loop- for each input loop through its outputs (levels outputs)
            for(let j=0; j < level.outputs.length;j++){
                //for every input and output pair:
                //set the weight to random value between -1 and 1
                //Math.random gives a random value between 0 and 1, * 2 value between 0 and 2, then  - 1 so between -1 and 1 (*2-1)
                level.weights[i][j] = Math.random()*2-1;
            }
        }
        //biases will be in the same range of the weights (between -1 and 1)
        for(let i=0; i<level.biases.length;i++){
            //no nested loop as biases focuses on the output layer
            //biases between -1 and 1
            level.biases[i]=Math.random()*2-1;
        }
    }

    //computing the output using a feedfordward algorithm (check notes in notebook feedford first step for Neural Network to execute)
    //this is why weights are random and why needs to be static for serialization
    //function params: given some inputs and the level
    static feedForward(givenInputs,level){
        //loop through all level inputs
        for(let i=0; i <level.inputs.length;i++){
            //set values from sensor class to given inputs
            level.inputs[i]= givenInputs[i];
        }
        //get outputs by looping through everyoutput
        for(let i = 0; i < level.outputs.length;i++){
          //calculate sum of value of inpouts and the weights
          //set sum as 0 as default
          let sum=0;
          //nested loop iterator j loop through inputs, sum then adds product
          for(let j = 0; j<level.inputs.length; j++){
            // sum will incrmenet  by getting the product of the level between the j input and  the weight between jth input and ith output
            //will repeat with every input neuron
            sum+=level.inputs[j]*level.weights[j][i];
          }
          //in the end- check if sum is greater than the bias of output neuron- biases[i]
          if(sum > level.biases[i]){
            //set output neruon to 1 to turn it on
            level.outputs[i]=1;
          }else{
            //output neuron set to 0 to turn it off
            level.outputs[i]=0;
          }
        }
        return level.outputs;
    }

}