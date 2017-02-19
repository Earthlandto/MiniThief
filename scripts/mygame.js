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
      update: function () {
        console.log(this.gameElement.userData);
      },
    },
    userData: 'Hello World',
    isStatic: false,
    isSensor: false
  });

  var mushroom = Game.create.gameElement({
    name: 'mushroom',
    position: new Point(0,0),
    texture: 'images/mushroom.png',
    width: 1,
    height: 1,
    shape: Shape.RECTANGLE,
  });

  Game.add(mushroom);
  Game.add(player);
  Game.run();
};
