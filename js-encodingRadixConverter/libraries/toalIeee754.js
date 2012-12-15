/*
 * The following Javascript and commentary is authored by Dr. Ray Toal of
 * Loyola Marymount University, with minor change and addition by
 * Andrew Won on March 17, 2012
 * Computer Science Undergraduate, Class of 2013
 * Loyola Marymount University.
 *
 * A script that operates a form in which a user can 
 *
 * (1) type in a hexadecimal value for an IEEE-754 single- or double-precision value and have 
 *     it shown in binary (with sign, exponent, and mantissa highlighted) and its approximate
 *     decimal value; and
 * (2) type in a decimal value and see its IEEE-754 hexadecimal encodings in both single- and
 *     double-precision.
 */
$(function () {
    // It's little endian if integer 1 is encoded as 01.00.00.00
    var littleEndian = !!(new Uint8Array((new Uint32Array([1])).buffer))[0],
        allZeros = /^0+$/,
        allOnes = /^1+$/,

        // I probably should just use .toString(2) for these....
        translate = [
            "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111",
            "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"
        ],

        /*
         * Return a string of the form "(1.f)_2 x 2^e" where the fractional part has no trailing
         * zeros.
         */
        formatExactValue = function (fraction, exponent) {
            return "(1." + (fraction.replace(/0+$/, "") || "0") + ")<sub>2</sub>"
                + " &times; 2<sup>" + exponent + "</sup>";
        },

        /*
         * Produces a hexidecimal string for a Uint8Array.
         */
        byteArrayToHex = function (b) {
            var i,
                hex,
                array = [];

            for (i = 0; i < b.length; i += 1) {
                array[littleEndian ? "unshift" : "push"](b[i]); // couldn't resist writing this.
            }
            return array.map(function (byte) {
                hex = byte.toString(16);
                return hex.length === 1 ? "0" + hex : "" + hex;
            }).join("");
        },

        /*
         * Determine the various interpretations of the given hex value and render them into the
         * document.
         */
        decodeAndUpdate = function (h) {
            // Render in binary.  Hackish.
            var i,
                b = "",
                s,
                e,
                m,
                n,
                value = 0,
                text,
                multiplier,
                firstOneIndex,
                exponent,
                mantissa,

                // Determine configuration.  This could have all been precomputed but it is fast enough.
                exponentBits = h.length === 8 ? 8 : 11,
                mantissaBits = (h.length * 4) - exponentBits - 1,
                bias = Math.pow(2, exponentBits - 1) - 1,
                minExponent = 1 - bias - mantissaBits;

            for (i = 0, n = h.length; i < n; i += 1) {
                b += translate["0123456789ABCDEF".indexOf(h.charAt(i))];
            }

            // Break up the binary representation into its pieces for easier processing.
            s = b[0];
            e = b.substring(1, exponentBits + 1);
            m = b.substring(exponentBits + 1);

            text = (s === "0" ? "+" : "-");
            multiplier = (s === "0" ? 1 : -1);

            if (allZeros.test(e)) {
                // Zero or denormalized
                if (allZeros.test(m)) {
                    text += " Zero";
                } else {
                    firstOneIndex = m.indexOf("1");
                    text += formatExactValue(m.substring(firstOneIndex + 1), -bias-firstOneIndex);
                    value = parseInt(m, 2) * Math.pow(2, minExponent);
                }

            } else if (allOnes.test(e)) {
                // Infinity or NaN
                if (allZeros.test(m)) {
                    text += "&#x221E;";
                    value = Infinity;
                } else {
                    text = "NaN";
                    value = NaN;
                }

            } else {
                // Normalized
                exponent = parseInt(e, 2) - bias;
                mantissa = parseInt(m, 2);
                text += formatExactValue(m, exponent);
                value = (1 + (mantissa * Math.pow(2, -mantissaBits))) * Math.pow(2, exponent);
            }

            // All done computing, render everything.
            $("#sign").html(s);
            $("#exp").html(e);
            $("#mantissa").html(m);
            $("#description").html(text);
            $("#decimal").html(value * multiplier);
        },

        /**
         * Here's the code for encoding decimal values into hex.  Here we let JavaScript do all
         * the work.
         */
        encodeAndUpdate = function (d) {
            $("#32hex").html(byteArrayToHex(new Uint8Array((new Float32Array([d])).buffer)));
            $("#64hex").html(byteArrayToHex(new Uint8Array((new Float64Array([d])).buffer)));
            $("#printed").html(+d);
        };

    // Prohibit non-hex digits from even being entered into the textfield.
    $("#hex754").keypress(function (e) {
        var testChar = String.fromCharCode(e.which);
        if (! /[\dA-Fa-f]/.test(testChar)) {
            e.preventDefault();
        }
    });

    // Update the display after something has been entered in the decoding section.
    $("#hex754").keyup(function (e) {
        var h = $("#hex754").val().toUpperCase();
        if (h.length === 8 || h.length === 16) {
            decodeAndUpdate(h);
        } else {
            // Erase all the computed fields from the section
            $("#decoder span").html("");
        }
    });

    // Update the display after something has been entered in the encoding section.
    $("#dec").keyup(function (e) {
        var d = $("#dec").val();
        if (/^-?\d+(\.\d*)?([Ee][+-]?\d+)?$/.test(d)) {
            encodeAndUpdate(d);
        } else {
            // Erase all the computed fields from the section
            $("#encoder span").html("");
        }
    });
    $("#formulaInput").bind('input', function () {
        var e = eval($("#formulaInput").val());
        $("#dec").val(e.toString(10));
        $("#dec").trigger('keyup');
    });
});