import React, { useEffect, useRef } from "react";
import * as me from "melonjs";

const Game = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        // Initialisation de MelonJS
        if (!me.video.init(800, 600, {
            parent: gameRef.current,
            scale: "auto",
            renderer: me.video.CANVAS,
        })) {
            alert("Votre navigateur ne supporte pas le rendu HTML5 Canvas !");
            return;
        }

        me.loader.preload([
            { name: "player", type: "image", src: "assets/100.png" },
        ], () => {
            console.log("Ressource Chargées");
            me.state.set(me.state.PLAY, new (me.Stage.extend({
                /**
                 * Initialisation de la scène
                 */
                onResetEvent: () => {
                    // Exemple de joueur basique (ajoutez-le à la scène)
                    const player = new me.Entity(400, 300, {
                        width: 32,
                        height: 32,
                        image: "player",
                    });

                    // Ajout du joueur dans le gestionnaire de jeu
                    me.game.world.addChild(player);
                },
            }))());

            // Passez à l'état PLAY
            me.state.change(me.state.PLAY);
        });

        return () => {
            // Nettoyage lorsque le composant est démonté
            me.video.stop();
        };
    }, []);

    return <div ref={gameRef} style={{ width: "100%", height: "100%" }} />;
};

export default Game;
