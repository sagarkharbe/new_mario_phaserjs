var TAU = require("../const").TAU;

function Dolly(camera) {
  this.movementFactor = 2;
  this.rotationFactor = 4;

  this.camera = camera;
  this.position = camera.displayObject.position;
  this.rotation = camera.displayObject.rotation;
  this.scale = camera.scale;

  this.lockTarget = null;
  this.targetPos = null;
  this.targetAng = null;
  this.targetScale = null;
}

function midpoint(p1, p2) {
  var x = p1.x + (p2.x - p1.x) * game.time.physicsElapsed;
  var y = p1.y + (p2.y - p1.y) * game.time.physicsElapsed;

  return new Phaser.Point(x, y);
}

Dolly.prototype.update = function() {
  if (this.lockTarget) {
    this.targetPos = this.lockTarget.position;
    this.targetAng = this.lockTarget.rotation;
  }

  if (this.targetPos !== null) {
    this.position = midpoint(this.position, this.targetPos);
  }

  if (this.targetAng !== null) {
    while (this.targetAng - this.rotation > Math.PI) this.rotation += TAU;
    while (this.rotation - this.targetAng > Math.PI) this.rotation -= TAU;

    this.rotation +=
      (this.targetAng - this.rotation) *
      game.time.physicsElapsed *
      this.rotationFactor;
  }

  this.camera.displayObject.pivot.x = this.position.x;
  this.camera.displayObject.pivot.y = this.position.y;
  this.camera.displayObject.rotation = TAU - this.rotation;
};

Dolly.prototype.lockTo = function(dispObj) {
  this.lockTarget = dispObj;
};

Dolly.prototype.unlock = function() {
  this.lockTarget = null;
};

Dolly.prototype.screenspaceToWorldspace = function(point) {
  var cosine = Math.cos(TAU - this.rotation),
    sine = Math.sin(TAU - this.rotation);
  var topleft = {
    x:
      this.position.x -
      (cosine * game.camera.width) / 2 -
      (sine * game.camera.height) / 2,
    y:
      this.position.y -
      (cosine * game.camera.height) / 2 +
      (sine * game.camera.width) / 2
  };

  return new Phaser.Point(
    point.x * cosine + point.y * sine + topleft.x,
    point.y * cosine - point.x * sine + topleft.y
  );
};
module.exports = Dolly;
