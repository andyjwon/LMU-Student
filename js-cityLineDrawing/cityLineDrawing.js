/**
 *  Draws a randomized city skyline scene, where black buildings with yellow-lit
 *      windows are set against a dark blue sky.
 *  Created by Andrew Won and last updated on 01-26-2012
 */
(function () {
    var canvas = $('#canvas')[0],
        renderingContext = canvas.getContext("2d"),
        Y_UNIT = canvas.height / 20,
        X_UNIT = 20,
        MOON_RADIUS = 15,
        color = {
            BUILDING: "black",
            BUILDING_SHADOW: "rgba(0, 0, 0, 0.5)",
            SKY: "rgb(40, 40, 70)",
            WINDOW: "yellow",
            FLOOR: "rgb(15,100,10)",
            MOON: {
                stroke: "rgb(170, 170, 170)",
                stop1: "rgb(254, 254, 254)",
                stop2: "rgb(160, 160, 160)",
                stop3: "rgb(100, 100, 100)"
            }
        },
        currentWidth,
        currentHeight,
        moonX = Math.floor(Math.random() * canvas.width - MOON_RADIUS),
        moonY = canvas.height / 5,
        x = 5, // hard coding a 5 unit offset on left edge of buildings
        gradient,
        iterX,
        iterY,

        drawBuilding = function (x, y, height, width) {
            // Setup our building shadow
            renderingContext.shadowOffsetX = 0;
            renderingContext.shadowOffsetY = height / 3;
            renderingContext.shadowBlur = 4;
            renderingContext.shadowColor = color.BUILDING_SHADOW;

            renderingContext.beginPath();
            renderingContext.fillStyle = color.BUILDING;
            renderingContext.fillRect(x, y - height,
                    width, height);

            // Turn off shadows for windows
            renderingContext.shadowOffsetX = 0;
            renderingContext.shadowOffsetY = 0;
            renderingContext.shadowBlur = 0;

            // Draw windows, sometimes
            renderingContext.fillStyle = color.WINDOW;
            for (iterX = x; iterX < x + width; iterX += X_UNIT) {
                for (iterY = y + 3; iterY > y - height + 3; iterY -= Y_UNIT) {
                    if (Math.random() < 0.5) {
                        renderingContext.fillRect(
                            iterX + X_UNIT / 4,
                            iterY - Y_UNIT * 4 / 5,
                            X_UNIT / 2,
                            Y_UNIT / 5
                        );
                    }
                }
            }
            renderingContext.closePath();
        };

    // Begin sky
    renderingContext.save();
    // Specify color of our sky, dark blue here
    renderingContext.fillStyle = color.SKY;
    renderingContext.fillRect(0, 0, canvas.width, 0.9 * canvas.height);
    renderingContext.restore();

    // Begin moon
    gradient = renderingContext.createRadialGradient(
            moonX - MOON_RADIUS * 0.2,
            moonY - MOON_RADIUS * 0.1,
            10, moonX - MOON_RADIUS * 0.1,
            moonY - MOON_RADIUS * 0.2,
            MOON_RADIUS * 1.3
        );
    gradient.addColorStop(0, color.MOON.stop1);
    gradient.addColorStop(0.5, color.MOON.stop2);
    gradient.addColorStop(1, color.MOON.stop3);
    renderingContext.fillStyle = gradient;
    renderingContext.beginPath();
    renderingContext.strokeStyle = color.MOON.stroke;
    renderingContext.arc(moonX, moonY, MOON_RADIUS, 0, Math.PI * 2, true);
    renderingContext.fill();
    renderingContext.closePath();

    // Begin floor
    renderingContext.save();
    renderingContext.fillStyle = color.FLOOR;
    renderingContext.fillRect(
            0,
            0.9 * canvas.height,
            canvas.width,
            0.1 * canvas.height
        );
    renderingContext.restore();

    while (x + X_UNIT < canvas.width) {
        // Handling width at the right edge of canvas
        if (x + 2 * X_UNIT > canvas.width) {
            currentWidth = X_UNIT;
        } else if (x + 3 * X_UNIT > canvas.width) {
            currentWidth = 2 * X_UNIT;
        } else {
            currentWidth = Math.ceil(Math.random() * 3) * X_UNIT;
        }
        currentHeight = Y_UNIT * Math.ceil(Math.random() * 7);
        drawBuilding(x, (canvas.height * 0.9) - 1, currentHeight, currentWidth);
        x += currentWidth + 3;
    }

    $('#reload').on('click', function() {
        location.reload();
    });
}());