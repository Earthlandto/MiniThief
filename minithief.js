//----------------------------------------------------------------------



//----------------------------------------------------------------------

/**
* @class
* @extends {Vector2}
* @classdesc This class represents a point (x,y) into an 2D space
* @param {Number} x The x component.
* @param {Number} y The y component.
*/
var Point = function (x,y){
    Vector2.call(this,x,y);
};

Point.prototype = new Vector2();
Point.prototype.constructor = Point;

//----------------------------------------------------------------------

/**
 * Enum for shape values.
 * @enum {number}
 */
var Shape = {
  RECTANGLE : 0,
  CIRCLE : 1
};

//----------------------------------------------------------------------

// BEHAVIOURS
/**
* @class
* @extends {Script}
* @classdesc This class represents a behaviour for a GameElement.
* @param {Object} param The parameters of the behaviour.
*/
var Behaviour = function (param) {
    Script.call(this);

    this.gameElement = null;

    if(param !== null){
      this._start = param.start || function(){};
      this._update = param.update || function(){};
      this._onEnterCollision = param.onEnterCollision || function(){};
      this._onExitCollision = param.onExitCollision || function(){};
      this._onDestroy = param.onDestroy || function(){};
    }
};

Behaviour.prototype = new Script();
Behaviour.prototype.constructor = Behaviour;

//----------------------------------------------------------------------

Behaviour.prototype.start = function () {
  this._start();
  this.gameElement.body.getBox2dBody().SetFixedRotation(true);
};

//----------------------------------------------------------------------

Behaviour.prototype.update = function (){
  this._update();
};

//----------------------------------------------------------------------

Behaviour.prototype.onEnterCollision = function (otherGameObject, contact){
  this._onEnterCollision(otherGameObject.getName());
};

//----------------------------------------------------------------------

Behaviour.prototype.onExitCollision = function (otherGameObject, contact){
  this._onExitCollision(otherGameObject.getName());
};

//----------------------------------------------------------------------

Behaviour.prototype.onDestroy = function (){
  this._onDestroy();
};

//----------------------------------------------------------------------


Behaviour.KEY_CONTROL = {
  update: function () {

    var v = 2;

    if (Input.isKeyPressed(37)) {
      // LEFT
      this.gameElement.setVelocity(new Vector2(-v,0));
    }else if (Input.isKeyPressed(38)) {
      // UP
      this.gameElement.setVelocity(new Vector2(0,v));
    }else if (Input.isKeyPressed(39)) {
      // RIGHT
      this.gameElement.setVelocity(new Vector2(v,0));
    }else if (Input.isKeyPressed(40)) {
      // DOWN
      this.gameElement.setVelocity(new Vector2(0,-v));
    }
  }
};

//----------------------------------------------------------------------


/**
* @class
* @extends {Script}
* @classdesc This class represents a GameElement.
* @param {Object} param The parameters of the gameelement.
*/
var GameElement = function (param) {

  if(param !== null){

    var position = param.position || new Point(0,0);
    var texture = param.texture || null;
    var width = param.width || 1;
    var height = param.height || 1;
    var shape = param.shape || Shape.RECTANGLE;
    var behaviour = param.behaviour || {};
    var isStatic = param.isStatic || false;
    var isSensor = param.isSensor || false;
    var name = param.name || null;

    this.spriteBuilder = new SpriteBuilder();

    this.spriteBuilder.create(texture,position,width,height).
      setName(name).
      setStatic(isStatic).
      setRigidBody(1,0.5,0.5); // set physics properties

    var col = null;

    if(shape == Shape.RECTANGLE)
      col = new AABBCollider(width,height,isSensor); // set a Rectangle Collider
    else if(shape == Shape.CIRCLE)
      col = new CircleCollider(Math.max(width,height)/2,isSensor); // set a Circle Collider

    this.spriteBuilder.setCollider(col);

    this.gameObject = this.spriteBuilder.end();

    if(behaviour !== null)
      this.addBehaviour(behaviour);

    // get the transform and the physic body
    this.body = this.gameObject.getComponent(RigidBody);
    this.transform = this.gameObject.getTransform();
  }

};

GameElement.prototype.getName = function () {
  return this.gameObject.getName();
};

GameElement.prototype.getPosition = function () {
  return this.transform.getPosition();
};

GameElement.prototype.moveTo = function (position) {
  this.body.getBox2dBody().SetPosition(new b2Vec2(position.x,position.y));
};

GameElement.prototype.applyForce = function (vector) {
  this.body.getBox2dBody().ApplyForce(new b2Vec2(vector.x,vector.y),this.body.GetWorldCenter());
};

GameElement.prototype.setVelocity = function (vector) {

  var linear = this.body.getBox2dBody().GetLinearVelocity();

  linear.x = vector.x;
  linear.y = vector.y;
};

GameElement.prototype.rotate = function () {

};

GameElement.prototype.addBehaviour = function (behaviourParam) {
  var b = new Behaviour(behaviourParam);
  b.gameElement = this;
  this.gameObject.addComponent(b);
};

GameElement.prototype.destroy = function () {
  this.gameObject.destroy();
};

//----------------------------------------------------------------------

// API

//----------------------------------------------------------------------

var Game = {}; // namespace

//----------------------------------------------------------------------

Game.init = function () {
  // inicializa motor

  Thief.init();
  Thief.createAndSetScene("test");

  // camera

  var canvas = document.getElementById("glcanvas");
  var screenW = canvas.width;
  var screenH = canvas.height;
  var zoom = 5;
  var aspect = (screenW/screenH);
  var w = 1*aspect;
  var h = 1;


  var camBuilder = new CameraBuilder();

  var cam =
  camBuilder.create(new Vector3(0,0,15)).
    setOrtho(w*zoom,h*zoom, -100,100).
  end();

  Thief.addGameObjectToScene(cam);
  Thief.setCamera(cam);
};

//----------------------------------------------------------------------

Game.run = function () {
  Thief.run();
};

//----------------------------------------------------------------------

Game.add = function(elem){
  Thief.addGameObjectToScene(elem.gameObject);
};

//----------------------------------------------------------------------

Game.create = {}; // namespace

//----------------------------------------------------------------------

Game.create.gameElement = function (param){
  return new GameElement(param);
};

//----------------------------------------------------------------------

Game.create.tile = function (position,texture){
  return Game.create.gameElement({
    position : position,
    texture : texture,
    width : 1,
    height : 1,
    shape : Shape.RECTANGLE,
    isStatic : true,
    isSensor : true
  });
};

//----------------------------------------------------------------------
