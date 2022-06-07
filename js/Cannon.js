class Cannon {
  constructor(x, y, width, height, angle,h,w) { //alterações para publicação na PlayStore
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.cannon_image = loadImage("assets/CANON.png");
    this.cannon_base = loadImage("assets/cannon_base.png");
    this.collisionFilter = {group: -1,   category: 2,   mask: 0,}
  }
  display() {
    if (keyIsDown(RIGHT_ARROW) && this.angle < 0.1) {
      this.angle += 0.01;
    }

    if (keyIsDown(LEFT_ARROW) && this.angle > -1.45) {
      this.angle -= 0.01;
    }

    fill("#676e6a");
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER)
    image(this.cannon_image, 0, 0, this.width, this.height);
    pop();
    image(this.cannon_base, 43, h-235, 62, 62, PI, TWO_PI);  //alterações para publicação na PlayStore
    noFill();
  }
}
