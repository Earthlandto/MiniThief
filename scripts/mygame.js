var run = function() {

  Game.init();

  var mario1 = Game.create.gameElement({
    name: "player",
    position: new Point(2, 2),
    texture: "images/mario.png",
    width: 1,
    height: 1,
    shape: Shape.RECTANGLE,
    behaviour: Behaviour.KEY_CONTROL,
    isStatic: false,
    isSensor: false
  });

  var mario2 = Game.create.gameElement({
    texture: "images/mario.png",
    behaviour: {
      onEnterCollision: function(otherName) {
        if (otherName == "player") {
          this.gameElement.destroy();
        }
      }
    }
  });

  var mario3 = Game.create.gameElement({
    position: new Point(-2, 2),
    texture: "images/mario.png"
  });


  var size = 20;
  for (var i = -(size / 2); i < size / 2; i++) {
    for (var j = -(size / 2); j < size / 2; j++) {
      Game.add(Game.create.tile(new Point(i, j), "images/sand.png"));
    }
  }

  Game.add(mario1);
  Game.add(mario2);
  Game.add(mario3);



  Game.run();


};
