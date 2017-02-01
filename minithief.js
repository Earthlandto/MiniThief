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
 * @class
 * @classdesc Enum for shape values.
 * @enum {number}
 */
var Shape = {
  /** @member {number} */
  /** Rectangular shape.*/
  RECTANGLE : 0,
  /** @member {number} */
  /** Circular shape.*/
  CIRCLE : 1
};

//----------------------------------------------------------------------

// BEHAVIOURS
/**
* @class
* @extends {Script}
* @classdesc This class represents a behaviour for a GameElement.
* @param {Object} param The parameters of the behaviour.
* The object param contains these callbacks:
<ul>
<li><strong>start</strong> : This function runs when the engine start at first time.</li>
<li><strong>update</strong> : This function runs each frame.</li>
<li><strong>onEnterCollision</strong> : This function runs when the game element collides with other game element.</li>
<li><strong>onExitCollision</strong> : This function runs when the collision is finished.</li>
<li><strong>onDestroy</strong> : This function runs when the game element is destroyed.</li>
</ul>
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
* The object param contains these fields:
<ul>
<li><strong>position</strong> : {Point} The position.</li>
<li><strong>texture</strong> : {String} The name of the texture.</li>
<li><strong>width</strong> : {Number} The width.</li>
<li><strong>height</strong> : {Number} The height.</li>
<li><strong>shape</strong> : {Shape} The shape.</li>
<li><strong>behaviour</strong> : {Object} The behaviour's parameters.</li>
<li><strong>isStatic</strong> : {Bool} True if static.</li>
<li><strong>isSensor</strong> : {Bool} True if sensor.</li>
<li><strong>name</strong> : {String} The name of the game element.</li>
</ul>
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

/**
* Returns the name of the game element.
* @returns {String} The name.
*/
GameElement.prototype.getName = function () {
  return this.gameObject.getName();
};

/**
* Returns the position of the game element.
* @returns {Point} The name.
*/
GameElement.prototype.getPosition = function () {
  return this.transform.getPosition();
};

/**
* Moves the game element to a position.
* @param {Point} position The new position.
*/
GameElement.prototype.moveTo = function (position) {
  this.body.getBox2dBody().SetPosition(new b2Vec2(position.x,position.y));
};

/**
* Applies a force to the game element.
* @param {Point} vector The force vector.
*/
GameElement.prototype.applyForce = function (vector) {
  this.body.getBox2dBody().ApplyForce(new b2Vec2(vector.x,vector.y),this.body.GetWorldCenter());
};

/**
* Sets the velocity of the game element.
* @param {Point} vector The velocity vector.
*/
GameElement.prototype.setVelocity = function (vector) {

  var linear = this.body.getBox2dBody().GetLinearVelocity();

  linear.x = vector.x;
  linear.y = vector.y;
};

/**
* Rotates the game element.
* @param {number} angle The angle in degrees.
*/
GameElement.prototype.rotate = function (angle) {

};

/**
* Adds a new behaviour to the game element.
* @param {Object} behaviourParam The behaviour's parameters.
*/
GameElement.prototype.addBehaviour = function (behaviourParam) {
  var b = new Behaviour(behaviourParam);
  b.gameElement = this;
  this.gameObject.addComponent(b);
};

/**
* Destroys the game element.
*/
GameElement.prototype.destroy = function () {
  this.gameObject.destroy();
};

//----------------------------------------------------------------------

// API

//----------------------------------------------------------------------

/**
* @namespace
*/
var Game = {}; // namespace

//----------------------------------------------------------------------

/**
* Initializes the engine.
*/
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

/**
* Starts the engine.
*/
Game.run = function () {
  Thief.run();
};

//----------------------------------------------------------------------
/**
* Adds a game element to the the engine.
* @param {GameElement} elem The game element.
*/
Game.add = function(elem){
  Thief.addGameObjectToScene(elem.gameObject);
};

//----------------------------------------------------------------------

/**
* @namespace
*/
Game.create = {}; // namespace

//----------------------------------------------------------------------

/**
* Returns a game element.
* @param {Object} param The parameters of the gameelement.
* The object param contains these fields:
<ul>
<li><strong>position</strong> : {Point} The position.</li>
<li><strong>texture</strong> : {String} The name of the texture.</li>
<li><strong>width</strong> : {Number} The width.</li>
<li><strong>height</strong> : {Number} The height.</li>
<li><strong>shape</strong> : {Shape} The shape.</li>
<li><strong>behaviour</strong> : {Object} The behaviour's parameters.</li>
<li><strong>isStatic</strong> : {Bool} True if static.</li>
<li><strong>isSensor</strong> : {Bool} True if sensor.</li>
<li><strong>name</strong> : {String} The name of the game element.</li>
</ul>
* @returns {GameElement} The game element.
*/
Game.create.gameElement = function (param){
  return new GameElement(param);
};

//----------------------------------------------------------------------

/**
* Returns a tile.
* @param {Point} position The position.
* @param {String} texture The name of the texture.
* @returns {GameElement} The tile.
*/
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
