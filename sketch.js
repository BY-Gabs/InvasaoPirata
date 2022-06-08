const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine,
  world,
  backgroundImg,
  waterSound,
  pirateLaughSound,
  backgroundMusic,
  cannonExplosion;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var score = 0;
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var isGameOver = false;
var isLaughing = false;

var w = window.innerWidth; //alterações para publicação na PlayStore
var h = window.innerHeight; //alterações para publicação na PlayStore

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  backgroundMusic = loadSound("./assets/background_music.mp3");
  waterSound = loadSound("./assets/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
  }



   //***********************************alterações para publicação na PlayStore
  $(document).ready(function() {  
    posicionaBotoes();
  });
  
  function posicionaBotoes() {
    var modal = $("#modal");
    $(".botoes-modal-left").css('right', modal.offset().left + (w-80));
    $(".botoes-modal-left").css('top', modal.offset().top + (h-70));

    $(".botoes-modal-right").css('right', modal.offset().left + (w-150));
    $(".botoes-modal-right").css('top', modal.offset().top + (h-70));

    $(".botoes-modal-fire").css('right', modal.offset().left + 40);
    $(".botoes-modal-fire").css('top', modal.offset().top + (h-70));
  }
 //***********************************alterações para publicação na PlayStore



function setup() {
  //canvas = createCanvas(1200,600);
  createCanvas(w, h); //alterações para publicação na PlayStore
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1); //verificar
  tower = new Tower(70, h-121, 55, 130); //alterações para publicação na PlayStore
  cannon = new Cannon(75, h-205, 60, 40, angle,h,w); //alterações para publicação na PlayStore

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1);
  }

  Engine.update(engine);
  
  ground.display();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {
          if (!boats[j].isBroken && !balls[i].isSink) {
            score += 5;
            boats[j].remove(j);
            j--;
          }

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
        }
      }
    }
  }

  cannon.display();
  tower.display();
   

  fill("#6d4c41");
  textSize(30); //alterações para publicação na PlayStore
  text("Pontuação: "+score, width - 200, 50);
  textAlign(CENTER, CENTER);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  ball.display();
  ball.animate();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    if (!ball.isSink) {
      waterSound.play();
      ball.remove(index);
    }
  }
}

function showBoats() {  
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
      var collision = Matter.SAT.collides(tower.body, boats[i].body);
      if (collision.collided && !boats[i].isBroken) {
         //Adicionar a sinalização isLaughing e definir a configuração como true
         if(!isLaughing && !pirateLaughSound.isPlaying()){
          pirateLaughSound.play();
          isLaughing = true
        }
        isGameOver = true;
        gameOver();
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    cannonExplosion.play();
    balls[balls.length - 1].shoot();
  }
}

function fogo() {  //alterações para publicação na PlayStore
  if (!isGameOver) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
    cannonExplosion.play();
    balls[balls.length - 1].shoot();
  }
}

function btn_left() {  //alterações para publicação na PlayStore
  if (!isGameOver) {
    cannon.angle -= 0.05;
  }
}

function btn_right() {  //alterações para publicação na PlayStore
  if (!isGameOver) {
    cannon.angle += 0.05;
  }
}




function gameOver() {
  swal(//alterações para publicação na PlayStore
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigado por jogar!!",
      confirmButtonText: "Jogar Novamente" 
    },
    function(isConfirm) {
      if (isConfirm) {
        window.location = "https://by-gabs.github.io/invasaoPirata/";
      }
    }
  );
}
