var camper = {
  kind: 'person'
}

// creates a new object which prototype is person
var zack = Object.create(person);

console.log(zack.kind); // => 'person'

// ...

var zack = Object.create(person, {age: {value:  13} });
console.log(zack.age); // => '13'


function Camper(name) {
  this.name = name;
}
Camper.prototype.year = '2017'

var alber = new Camper('Alberto');

alber.year //=> person


alber.__proto__ == Camper.prototype //=> true


var camper = {
  year: '2017'
}
var alber = Object.create(camper);
console.log(alber.year); // => 2017
