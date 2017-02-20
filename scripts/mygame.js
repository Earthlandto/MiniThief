function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomMushroom(minPosX, maxPosX, minPosY, maxPosY) {
  var minX = minPosX || 0;
  var maxX = maxPosX || 10;
  var minY = minPosY || 0;
  var maxY = maxPosY || 10;

  var randX = getRandomArbitrary(minX, maxX);
  var randY = getRandomArbitrary(minY, maxY);

  Game.add(Game.create.gameElement({
    name: 'mushroom',
    position: new Point(randX, randY),
    texture: 'images/mushroom.png',
    width: 1,
    height: 1,
    behaviour: {
      onEnterCollision: function(otherGameElement) {
        if ('player' === otherGameElement) {
          createRandomMushroom(-3, 3, -3, 3);
          this.gameElement.destroy();
        }
      },
    },
    shape: Shape.RECTANGLE,
  }));
}

var run = function() {

  Game.init();

  var player = Game.create.gameElement({
    name: "player",
    position: new Point(2, 2),
    texture: "images/mario.png",
    width: 1,
    height: 1,
    shape: Shape.RECTANGLE,
    behaviour: {
      update: Behaviour.KEY_CONTROL,
    },
    userData: null,
    isStatic: false,
    isSensor: false
  });

  createRandomMushroom(-3, 3, -3, 3);

  Game.add(player);
  Game.run();
};
