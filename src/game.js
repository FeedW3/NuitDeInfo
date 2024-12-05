import * as me from "melonjs";
import resources from "./resources.js";

export default class Game {
    constructor() {
        this.init();
    }

    /**
     * Méthode d'initialisation du jeu
     */
    init() {
        if (!me.video.init(800, 600, {
            parent: "game-container",
            scale: "auto",
            renderer: me.video.CANVAS,
        })) {
            alert("Votre navigateur ne supporte pas le rendu HTML5 Canvas !");
            return;
        }

        me.loader.preload(resources,[
            { name: "player", type: "image", src: "assets/100.png" },
        ], () => {
            me.state.set(me.state.PLAY, new PlayScreen());

            me.state.change(me.state.PLAY);
        });
    }
}

class PlayScreen extends me.Stage {
    /**
     * Méthode appelée lors du démarrage de la scène
     */
    onResetEvent() {

        this.player = new me.Sprite(100, 200, { image: "player", width: 32, height: 32 });
        this.player.scale(0.1, 0.1);

        this.player.body = new me.Body(this.player);
        this.player.body.addShape(new me.Rect(0, 0, 32, 32));
        this.player.body.gravityScale = 1.0;
        this.player.body.collisionType = me.collision.types.PLAYER_OBJECT;

        me.game.world.addChild(this.player);

        this.player.speed = 5;

        this.player.body.onCollision = (response, other) => {
            if (other.body.collisionType === me.collision.types.WORLD_SHAPE) {
                if (response.overlapV.y > 0) {
                    this.player.body.vel.y = 0;
                    this.player.body.pos.y = other.getBounds().top - this.player.height;
                } else if (response.overlapV.x != 0) {
                }
            }
            return true;
        };

        this.loadMap("/assets/map.json");

        this.player.speed = 5;
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
    }

    /**
     * Mise à jour de la scène (déplacements du joueur)
     */
    update() {
        if (me.input.isKeyPressed("left")) {
            this.player.body.vel.x = -this.player.speed;
        } else if (me.input.isKeyPressed("right")) {
            this.player.body.vel.x = this.player.speed;
        } else {
            this.player.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("up") && this.player.body.vel.y === 0) {
            this.player.body.vel.y = -15;
        }

        return true;
    }

    loadMap(mapFile) {
        fetch(mapFile)
            .then((response) => response.json())
            .then((data) => {
                data.platforms.forEach((platformData) => {
                    const platform = new me.Entity(platformData.x, platformData.y, {
                        width: platformData.width,
                        height: platformData.height
                    });

                    platform.body = new me.Body(platform);
                    platform.body.addShape(new me.Rect(0, 0, platformData.width, platformData.height));
                    platform.body.setStatic(true);  // La plateforme est statique
                    platform.body.collisionType = me.collision.types.WORLD_SHAPE;

                    platform.draw = function (renderer) {
                        renderer.setColor("#FF0000");  // Rouge
                        renderer.fillRect(0, 0, this.width, this.height);
                    };

                    me.game.world.addChild(platform);
                });

                console.log("Map chargée avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors du chargement de la map :", error);
            });
    }
}
