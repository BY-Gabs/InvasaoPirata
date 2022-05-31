class Fire {
    constructor(x, y, width, height){
      var options = {
        isStatic: true,
        label: "fire",
        collisionFilter: {group: -1,   category: 2,   mask: 0,}
      };
      this.fireImage = loadImage("assets/fire.png");
      this.width = width;
      this.height = height;
      this.body = Bodies.rectangle(x, y, this.width, this.height, options);
      World.add(world, this.body);
      
    }
    display() {
      var pos = this.body.position;
      var angle = this.body.angle;
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      image(this.fireImage, 0, 0, this.width, this.height);
      pop();
      
    }
        
      
  }
 