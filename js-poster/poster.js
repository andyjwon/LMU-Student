$(function () {
/**
 * poster.js is a text poster that validates user input, provides
 * feedback to users and posts text to an in-page wall.
 *
 * Copyright (c) 2011 by Andrew Won <andyjwon@gmail.com>
 * Computer Science Undergraduate, Class of 2013
 * Loyola Marymount University
 */

    var getFormattedDateString = function () {
            var d = new Date();
            return 'Posted on: ' + (d.getMonth() + 1) + "/" + d.getDate()
                + "/" + d.getFullYear() + " at " + d.getHours() + ":"
                + d.getMinutes() + ":" + d.getSeconds();
        },

        notifyInputValid = function (length) {
            $("#notify")
                .html(length)
                .removeClass("requirement")
                .addClass("approval");
            $("#submit,#clear").removeAttr("disabled");
        },

        notifyInputInvalid = function (length) {
            $("#notify")
                .removeClass("approval")
                .addClass("requirement")
                .html(length);
            $("#submit").attr("disabled", true);
        },

        validateInputLength = function () {
            var length = $("#posting").val().length;

            if (length && length <= 140) {
                notifyInputValid(length);
            } else {
                notifyInputInvalid(length);
                // If length == 0.
                if (!length) {
                    $("#clear").attr({ disabled: "disabled" });
                // If length > 140
                } else {
                    $("#notify").append(" You've entered too much!");
                }
            }
        };

    $("#posting").bind('input', validateInputLength);

    function clearText() {
        $("#posting").val('');
        validateInputLength();
    }

    $("#clear").click(function () {
        if (confirm("Are you sure you want to clear your text?")) {
            clearText();
        }
    });

    $("#submit").click(function () {
        var inputText = $("#posting").val();
        $("#postField").prepend('<div class="post">' + inputText
                + '</div>' + getFormattedDateString());
        clearText();
    });
});