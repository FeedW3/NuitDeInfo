import * as me from "melonjs";

window.onload = function () {
    // Initialisation du canvas
    if (!me.video.init(window.innerWidth, window.innerHeight, {
        parent: "game-container",
        scale: "auto",
        renderer: me.video.CANVAS,
    })) {
        alert("Votre navigateur ne supporte pas le rendu HTML5 Canvas !");
        return;
    }

    me.loader.preload([
        { name: "player", type: "image", src: "/assets/100.png" }
    ], () => {
        class PlayScreen extends me.Stage {
            /**
             * Méthode appelée lorsque la scène est démarrée
             */
            onResetEvent() {
                this.platform = new me.Entity(0, 500, {
                    width: me.game.viewport.width,
                    height: 50,
                });

                this.platform.body = new me.Body(this.platform);
                this.platform.body.addShape(new me.Rect(0, 0, this.platform.width, this.platform.height));
                this.platform.body.setStatic(true);
                this.platform.body.collisionType = me.collision.types.WORLD_SHAPE;

                this.platform.draw = function (renderer) {
                    renderer.setColor("#FF0000"); // Rouge
                    renderer.fillRect(0, 0, this.width, this.height);
                };

                me.game.world.addChild(this.platform);

                console.log("Plateforme ajoutée au monde !");

                this.player = new me.Sprite(400, 300, {
                    image: "player",
                    width: 32,
                    height: 32
                });

                this.player.scale(0.1, 0.1);

                this.player.body = new me.Body(this.player);
                this.player.body.addShape(new me.Rect(0, 0, 32, 32));
                this.player.body.gravityScale = 1.0;
                this.player.body.collisionType = me.collision.types.PLAYER_OBJECT;

                this.player.body.onCollision = (response, other) => {
                    if (other.body.collisionType === me.collision.types.WORLD_SHAPE) {
                        this.player.body.vel.y = 0;
                        this.player.body.pos.y = other.getBounds().top - this.player.height;
                    }
                    return true;
                };

                me.game.world.addChild(this.player);

                this.player.speed = 5;
                me.input.bindKey(me.input.KEY.LEFT, "left");
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.UP, "up");

            }

            update() {
                if (me.input.isKeyPressed("left")) {
                    this.player.body.vel.x = -this.player.speed;
                } else if (me.input.isKeyPressed("right")) {
                    this.player.body.vel.x = this.player.speed;
                } else {
                    this.player.body.vel.x = 0;
                    if (me.input.isKeyPressed("up") && this.player.body.onFloor()) {
                        this.player.body.vel.y = -15;
                    }

                    return true;
                }
            }
        }

        me.state.set(me.state.PLAY, new PlayScreen());

        me.state.change(me.state.PLAY);
    });
}
