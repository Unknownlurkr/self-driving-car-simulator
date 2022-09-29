class Controls{
    constructor(type){
        //default fault- will change depending on what is prssed on keyboard
        //represent arrows
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch (type) {
            case "KEYS":
                //car control type keys move witrh keys
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                //dummy moves forward without keys so move forward true
                this.forward=true;
                break;
        }
        //hashtag infront of method as this is a private method
        //cant access outside of this class
        //this.#addKeyboardListeners();
    }

    //#addKeyboardListeners() private method
    //this stop refering to object controls and actually refers to this function
    #addKeyboardListeners(){
        //add keydown event to doucment
        document.onkeydown=(event)=>{
            //set this event to be = arrow function
            //based on key pressed-set arrow prop to true
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
            //debug the code to see if it works
            //by outputting the entire object in console as table form
            //console.table(this)
        }
        //if the key is not pressed(up) then defaults back to false
        //when false wont move
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
        }
    }
}

