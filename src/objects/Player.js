import Config from '../utils/Config';

class Player extends Phaser.Sprite {

    /**
     * Player object
     * @param game
     * @param {Phaser.Physics.P2.Material} material
     * @param {Phaser.Physics.P2.CollisionGroup} collisionGroup
     * @param {Phaser.Physics.P2.CollisionGroup|Array} collidesWith
     * @param side
     */
    constructor(game, material, collisionGroup, collidesWith, side) {

        super(game, Config.player[side].x, Config.player[side].y, Config.player[side].sprite);

        this._previousX = this.x;

        this.game = game;
        this.game.physics.p2.enable(this, this.game.debugMode);
        this.body.clearShapes();
        this.body.loadPolygon('playerData', Config.player[side].polygon);
        this.body.fixedRotation = true;
        this.body.mass = 6;
        this.body.setMaterial(material);
        this.body.setCollisionGroup(collisionGroup);
        this.body.collides(collidesWith);
        this.cursors = this.game.input.keyboard.addKeys(Config.player[side].keys);

    }

    update() {
        //stop X motion each frame (if no keys are down)
        this.body.velocity.x = 0;

        let cur = this.cursors;
        if (cur.left.isDown) {
            this.body.velocity.x = -250;
            //player.animations.play('left');
        }
        else if (cur.right.isDown) {
            this.body.velocity.x = 250;
            //player.animations.play('right');
        }
        else {
            //player.animations.stop();
            //this.player.frame = 4;
        }
        //  Allow the player to jump if touching the ground.
        if (cur.up.isDown && this.touchingDown(this)) {
            this.body.velocity.y = -700;
        }

        return super.update();
    }

    touchingDown(someone) {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = this.game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
            if (c.bodyA === someone.body.data || c.bodyB === someone.body.data) {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === someone.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        }
        return result;
    }

}

export default Player;