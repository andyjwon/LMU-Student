/*
 * charToHex.js takes a string and converts each character into its
 * respective ASCII / Unicode code point separated by a specified
 * delimiter.
 *
 * This file requires that JQuery be included in the calling
 * HTML file. This can be done by adding the following line
 * before the end of your HTML file (before the </body> tag):
 * <script src="http://code.jquery.com/jquery-latest.min.js"></script>
 *
 * Created in 2012 by Andrew Won <andyjwon@gmail.com>
 * Computer Science Undergraduate, Class of 2013
 * Loyola Marymount University
 */
$(function () {
    // Not a constant, but keeping upper-case reminds me to not change
    var BASE = 16,
        clearInput = function () {
            $("#uri").val('');
        };

    $("#submit").bind('mousedown', function () {
        var i,
            hexUri = "",
            toConvert = $("#uri").val();

        for (i = 0; i < toConvert.length; i += 1) {
            hexUri += ($("#delimiter").val() +
                toConvert.charCodeAt(i).toString(BASE));
        }
        // hexUri is the final output string.
        // I could add an upper-case option.
        $("#testArea").append(hexUri);
        clearInput();
    });

    $("#clear").bind('mousedown', function () {
        $("#testArea").text('');
        clearInput();
    });
});