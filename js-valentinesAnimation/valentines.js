 /*
 * Funny Valentines Day animation of a heart almost piercing an arrow.
 * The KeyframeTweener object was written by:
 *     Dr. John Dionisio of Loyola Marymount University
 * and extended for purposes of this presentation.
 * @author Andrew Won
 */
var KeyframeTweener = {
    linear: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * percentComplete + start;
    },

    quadEaseIn: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * percentComplete * percentComplete + start;
    },

    quadEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return -distance * percentComplete * (percentComplete - 2) + start;
    },

    quadEaseInAndOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / (duration / 2);
        return (percentComplete < 1) ?
                (distance / 2) * percentComplete * percentComplete + start :
                (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
    },

    backEaseInAndOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / (duration / 2),
            overshoot = 1.70158;
        if (percentComplete < 1) {
            return distance / 2 * (percentComplete * percentComplete * ((overshoot *= 1.525) + 1) * percentComplete - overshoot) + start;
        }
        return distance / 2 * ((percentComplete -= 2) * percentComplete * (((overshoot *= 1.525) + 1) * percentComplete + overshoot) + 2) + start;
    },

    bounceEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        if ((percentComplete) < (1 / 2.75)) {
            return distance * (7.5625 * percentComplete * percentComplete) + start;
        } else if (percentComplete < (2 / 2.75)) {
            return distance * (7.5625 * (percentComplete -= (1.5 / 2.75)) * percentComplete + 0.75) + start;
        } else if (percentComplete < (2.5 / 2.75)) {
            return distance * (7.5625 * (percentComplete -= (2.25 / 2.75)) * percentComplete + 0.9375) + start;
        } else {
            return distance * (7.5625 * (percentComplete -= (2.625 / 2.75)) * percentComplete + 0.984375) + start;
        }
    },

    bounceEaseIn: function (currentTime, start, distance, duration) {
        return distance - KeyframeTweener.bounceEaseOut(duration - currentTime, 0, distance, duration) + start;
    },

    bounceEaseInAndOut: function (currentTime, start, distance, duration) {
        if (currentTime < duration / 2) {
            return KeyframeTweener.bounceEaseIn(currentTime * 2, 0, distance, duration) * 0.5 + start;
        }
        return KeyframeTweener.bounceEaseOut(currentTime * 2 - duration, 0, distance, duration) * 0.5 + distance * 0.5 + start;
    },

    initialize: function (settings) {
        var currentFrame = 0,
            renderingContext = settings.renderingContext,
            width = settings.width,
            height = settings.height,
            sprites = settings.sprites;

        setInterval(function () {
            var i,
                j,
                maxI,
                maxJ,
                ease,
                startKeyframe,
                endKeyframe,
                txStart,
                txDistance,
                tyStart,
                tyDistance,
                sxStart,
                sxDistance,
                syStart,
                syDistance,
                rotateStart,
                rotateDistance,
                currentTweenFrame,
                duration;

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);

            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // Look for keyframe pairs such that the current
                    // frame is between their frame numbers.
                    if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                            (currentFrame <= sprites[i].keyframes[j + 1].frame)) {
                        startKeyframe = sprites[i].keyframes[j];
                        endKeyframe = sprites[i].keyframes[j + 1];

                        renderingContext.save();

                        ease = startKeyframe.ease || KeyframeTweener.linear;
                        txStart = startKeyframe.tx || 0;
                        txDistance = (endKeyframe.tx || 0) - txStart;
                        tyStart = startKeyframe.ty || 0;
                        tyDistance = (endKeyframe.ty || 0) - tyStart;
                        sxStart = startKeyframe.sx || 1;
                        sxDistance = (endKeyframe.sx || 1) - sxStart;
                        syStart = startKeyframe.sy || 1;
                        syDistance = (endKeyframe.sy || 1) - syStart;
                        rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180;
                        rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;
                        currentTweenFrame = currentFrame - startKeyframe.frame;
                        duration = endKeyframe.frame - startKeyframe.frame + 1;

                        // Build our transform according to where we should be.
                        renderingContext.translate(
                            ease(currentTweenFrame, txStart, txDistance, duration),
                            ease(currentTweenFrame, tyStart, tyDistance, duration)
                        );
                        renderingContext.scale(
                            ease(currentTweenFrame, sxStart, sxDistance, duration),
                            ease(currentTweenFrame, syStart, syDistance, duration)
                        );
                        renderingContext.rotate(
                            ease(currentTweenFrame, rotateStart, rotateDistance, duration)
                        );

                        sprites[i].draw(renderingContext);
                        renderingContext.restore();
                    }
                }
            }
            currentFrame += 1;
        }, 1000 / (settings.frameRate || 24));
    }
};

(function () {
    var canvas = document.getElementById("canvas"),
        shapes = {
            arrow: function (renderingContext) {
                renderingContext.strokeStyle = "brown";
                renderingContext.lineWidth=(5);
                renderingContext.save();
                renderingContext.moveTo(0, 0);
                renderingContext.lineTo(10, 20);
                renderingContext.lineTo(0, 40);
                renderingContext.moveTo(7, 0);
                renderingContext.lineTo(17, 20);
                renderingContext.lineTo(7, 40);
                renderingContext.moveTo(14, 0);
                renderingContext.lineTo(24, 20);
                renderingContext.lineTo(14, 40);
                renderingContext.lineTo(24, 20);
                renderingContext.lineTo(120, 20);
                renderingContext.restore();
                renderingContext.moveTo(120, 20);                    
                renderingContext.lineTo(100, 0);
                renderingContext.moveTo(120, 20); 
                renderingContext.lineTo(100, 40);            
                renderingContext.stroke();
            },

            /*
             * There are three separate "heart" sprites titled heart, heartTwo and
             * heartThree. Each heart draws an identical shape but contains 
             * different text. This is not the most efficient way of doing
             * this, but it was the quickest for an impromptu demonstration.
             */
            heart: function (renderingContext) {
                renderingContext.strokeStyle = "black";
                renderingContext.fillStyle= "red";
                renderingContext.beginPath();
                renderingContext.moveTo(0, 90);
                renderingContext.lineTo(40, 150);
                renderingContext.lineTo(80, 90);
                renderingContext.bezierCurveTo(100, 50, 60, 40, 40, 70);
                renderingContext.moveTo(0, 90);
                renderingContext.bezierCurveTo(-20, 50, 20, 40, 40, 70);
                renderingContext.shadowOffsetX = 3;
                renderingContext.shadowOffsetY = 4;
                renderingContext.shadowBlur = 5;
                renderingContext.shadowColor = "black";
                renderingContext.fill();
                renderingContext.shadowOffsetX = 0;
                renderingContext.shadowOffsetY = 0;
                renderingContext.shadowBlur = 0;
    
                // Added text to center of heart.
                renderingContext.fillStyle = "white";
                renderingContext.font = "12pt Arial";
                renderingContext.textAlign = "center";
                renderingContext.fillText("Be Mine!", 40, 95);
                renderingContext.stroke();
            },
    
            heartTwo: function (renderingContext) {
                renderingContext.strokeStyle = "black";
                renderingContext.fillStyle= "red";
                renderingContext.beginPath();
                renderingContext.moveTo(0, 90);
                renderingContext.lineTo(40, 150);
                renderingContext.lineTo(80, 90);
                renderingContext.bezierCurveTo(100, 50, 60, 40, 40, 70);
                renderingContext.moveTo(0, 90);
                renderingContext.bezierCurveTo(-20, 50, 20, 40, 40, 70);
                renderingContext.shadowOffsetX = 3;
                renderingContext.shadowOffsetY = 4;
                renderingContext.shadowBlur = 5;
                renderingContext.shadowColor = "black";
                renderingContext.fill();
                renderingContext.shadowOffsetX = 0;
                renderingContext.shadowOffsetY = 0;
                renderingContext.shadowBlur = 0;
    
                // Added text to center of heart.
                renderingContext.fillStyle = "white";
                renderingContext.font = "12pt Arial";
                renderingContext.textAlign = "center";
                renderingContext.fillText("Maybe?", 40, 95);
                renderingContext.stroke();
            },
    
            heartThree: function (renderingContext) {
                renderingContext.strokeStyle = "black";
                renderingContext.fillStyle= "red";
                renderingContext.beginPath();
                renderingContext.moveTo(0, 90);
                renderingContext.lineTo(40, 150);
                renderingContext.lineTo(80, 90);
                renderingContext.bezierCurveTo(100, 50, 60, 40, 40, 70);
                renderingContext.moveTo(0, 90);
                renderingContext.bezierCurveTo(-20, 50, 20, 40, 40, 70);
                renderingContext.shadowOffsetX = 3;
                renderingContext.shadowOffsetY = 4;
                renderingContext.shadowBlur = 5;
                renderingContext.shadowColor = "black";
                renderingContext.fill();
                renderingContext.shadowOffsetX = 0;
                renderingContext.shadowOffsetY = 0;
                renderingContext.shadowBlur = 0;
    
                // Added text to center of heart.
                renderingContext.fillStyle = "white";
                renderingContext.font = "bold 5.3pt Arial";
                renderingContext.textAlign = "center";
                renderingContext.fillText("Happy Valentines Day!", 40, 85);
                renderingContext.stroke();
            }
        },

        sprites = [
            {
                draw: shapes.arrow,
                keyframes: [
                    {
                        frame: 0,
                        tx: -50,
                        ty: 240,
                        rotate: -10
                    },
                    {
                        frame: 40,
                        tx: -58,
                        ty: 250,
                        rotate: -15,
                        ease: KeyframeTweener.linear
                    },
                    {
                        frame: 50,
                        tx: 40,
                        ty: 230,
                        rotate: -5,
                        ease: KeyframeTweener.linear
                    },
                    {
                        frame: 70,
                        tx: 400,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseInOut
                    },
                    {
                        frame: 100,
                        tx: 1000,
                        ty: 280,
                        rotate: 20,
                        ease: KeyframeTweener.quadEaseInOut
                    }
                ]
            },

            {
                draw: shapes.heart,
                keyframes: [
                    {
                        frame: 0,
                        tx: 400,
                        ty: 100
                    },
                    {
                        frame: 40,
                        tx: 400,
                        ty: 100,
                        ease: KeyframeTweener.quadEaseOut
                    },
                    {
                        frame: 55,
                        tx: 400,
                        ty: 120,
                        sy: 0.75,
                        ease: KeyframeTweener.quadEaseOut
                    },
                    {
                        frame: 70,
                        tx: 400,
                        ty: 100,
                        sy: 0.5,
                        ease: KeyframeTweener.bounceEaseOut
                    },
                    {
                        frame: 85,
                        tx: 400,
                        ty: 120,
                        //sx: 0.5,
                        //sy: 0.5,
                        ease: KeyframeTweener.quadEaseOut
                    },
                ]
            },

            {
                draw: shapes.heartTwo,
                keyframes: [
                    {
                        frame: 85,
                        tx: 400,
                        ty: 120,
                        ease: KeyframeTweener.quadEaseOut
                    },
                    {
                        frame: 100,
                        tx: 400,
                        ty: 130,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 140,
                        tx: 400,
                        ty: 120,
                        ease: KeyframeTweener.bounceEaseIn
                    }
                ]
            },

            {
                draw: shapes.heartThree,
                keyframes: [
                    {
                        frame: 140,
                        tx: 400,
                        ty: 120,
                        ease: KeyframeTweener.bounceEaseIn
                    },
                    {
                        frame: 180,
                        tx: 320,
                        ty: 10,
                        sx: 3,
                        sy: 3
                    },
                    {
                        frame: 190,
                        tx: 316,
                        ty: 7,
                        sx: 3.1,
                        sy: 3.1
                    },
                    {
                        frame: 210,
                        tx: 324,
                        ty: 13,
                        sx: 2.9,
                        sy: 2.9
                    },
                    {
                        frame: 240,
                        tx: 320,
                        ty: 10,
                        sx: 3,
                        sy: 3
                    },
                    {
                        frame: 12000000,
                        tx: 320,
                        ty: 10,
                        sx: 3,
                        sy: 3
                    }
                ]
            }
        ];

    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());