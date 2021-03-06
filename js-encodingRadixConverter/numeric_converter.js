/*
 * Numeric Converter Library
 * http://my.cs.lmu.edu/~awon/misc/numeric_converter/numeric_converter.html
 *
 * numeric_converter.js provides a library of decimal,
 * hexadecimal, and binary conversions and arithmetic
 * functions. Also included is a byte converter that
 * converts to kibi, mebi, gibi, etc. bytes.
 *
 * Copyright (c) 2012 by Andrew Won <andyjwon@gmail.com>
 * Computer Science Undergraduate, Class of 2013
 * Loyola Marymount University
 */
$(function () {
    var WARNING = "<strong>Warning!</strong> ",
        UNRECOGNIZED_INPUT = WARNING + "I can't recognize your number.",
        NUMBER_OUT_OF_RANGE = WARNING + "Your value does not fit in a {0} {1}.",
        INVALID_UTF = WARNING + "Your number does not represent a {0} encoding.",
        MISSING_FIELD = WARNING + "Please fill in both fields.",

        lastConverted = "",
        lastBytesEntered = "",

        /*
         * Clears all commentary fields on the page.
         */
        clearOutput = function () {
            $("#conversionError").html('');
            $("#conversionError").hide();
            $("#adderError").html('');
            $("#adderError").hide();
            $("#subtractorError").html('');
            $("#subtractorError").hide();
            $("#utfError").html('');
            $("#utfError").hide();
            $("#bytesError").html('');
            $("#bytesError").hide();

            $("#hexAddOutput").html('');
            $("#hexSubtractOutput").html('');
        },

        /*
         * Clears inputs in the Number Conversion table.
         */
        clearInputs = function () {
            $("#udec").val('');
            $("#hex").val('');
            $("#bin").val('');
            if ($("#sdec").val() !== '-') {
                $("#sdec").val('');
            }
        },

        /*
         * Takes a decimal integer and the largest possible decimal integer
         * with the bytes you are working with, and returns the signed
         * decimal value of the integer.
         */
        getSignedDec = function (newValue, maxNum) {
            return (newValue >= maxNum / 2 ? newValue - maxNum : newValue);
        },

        /*
         * Takes a signed decimal integer and the largest possible decimal
         * integer with the bytes you are working with, and returns an
         * unsigned decimal integer.
         */
        getUnsignedDec = function (newValue, maxNum) {
            if ((newValue < maxNum / 2) &&
                    (newValue >= 0 ||
                    newValue < -(maxNum / 2))) {
                return newValue;
            }

            return (newValue >= maxNum / 2 || newValue < -(maxNum / 2)) ?
                    maxNum : newValue + maxNum;
        },

        /*
         * Takes two decimal integers and returns the first power of two
         * greater than the larger of the two input integers.
         */
        getLowestPowerOf2 = function (val1, val2) {
            var i = 1,
                biggestNum = Math.pow(2,
                    Math.ceil(Math.log(Math.max(val1, val2)) / Math.log(2)));

            while (Math.pow(2, i) < biggestNum) {
                i *= 2;
            }

            return Math.pow(2, i);
        },

        /*
         * Takes one decimal integer and updates input fields of Number
         * Conversion table with varying representations of that integer.
         */
        updateConversionFields = function (newValue) {
            var numBits = $("#bitSelect").val(),
                maxNum = Math.pow(2, numBits);

            clearOutput();

            if (isNaN(newValue)) {
                $("#conversionError")
                    .append(UNRECOGNIZED_INPUT);
                $('#conversionError').show();
            } else if (newValue > maxNum - 1 || newValue < 0) {
                $("#conversionError")
                    .append(NUMBER_OUT_OF_RANGE.format([numBits], ["bit system"]));
                $('#conversionError').show();
            } else {
                $("#udec").val(newValue.toString(10));
                $("#hex").val(newValue.toString(16).toUpperCase());
                $("#bin").val(newValue.toString(2));
                $("#sdec").val(getSignedDec(newValue, maxNum));
            }
        },

        /*
         * Takes two decimal integers and a decimal value representing
         * the radix number system. Performs addition of
         * integers in either unsigned, modular, or saturated format as
         * indicated by radio buttons with id="addType".
         *
         * Returns a three element array with string representation of sum
         * in indicated radix number system, a boolean value indicating whether
         * overflow occurred, and a boolean value indicating if carry occurred;
         * respective to indices 0, 1, 2.
         */
        adder = function (val1, val2, radix) {
            var addType = $("input:radio[name=addType]:checked").val(),
                // First power of 2 larger than inputs to adder()
                maxAddNum,
                val1Sign,
                val2Sign,
                biggerNum,
                smallerNum,
                sum;

            if (addType === "unsigned") {
                return [(val1 + val2).toString(radix), false, false];
            }

            maxAddNum = getLowestPowerOf2(val1, val2);

            val1Sign = getSignedDec(val1, maxAddNum);
            val2Sign = getSignedDec(val2, maxAddNum);
            if (val1Sign > val2Sign) {
                biggerNum = val1Sign;
                smallerNum = val2Sign;
            } else {
                biggerNum = val2Sign;
                smallerNum = val1Sign;
            }

            sum = biggerNum + smallerNum;
            // If both numbers are positive
            if (smallerNum >= 0) {
                if (sum > maxAddNum / 2 - 1) {
                    if (addType === "saturated") {
                        return [(maxAddNum / 2 - 1).toString(radix)
                                .toUpperCase(), true, false];
                    }
                    if (addType === "modular") {
                        return [(sum % maxAddNum).toString(radix)
                                .toUpperCase(), true, false];
                    }
                }
                return [sum.toString(radix).toUpperCase(), false, false];
            }
            // If both numbers are negative
            if (biggerNum < 0) {
                if (sum < -maxAddNum / 2) {
                    if (addType === "saturated") {
                        return [(maxAddNum / 2).toString(radix).toUpperCase(),
                                true,
                                true];
                    }
                    if (addType === "modular") {
                        return [(Math.abs(sum + maxAddNum)).toString(radix)
                                .toUpperCase(), true, true];
                    }
                }
                return [(sum + maxAddNum).toString(radix).toUpperCase(),
                        false, true];
            }
            // Now we cannot have any overflow
            return sum > 0 ? [sum.toString(radix).toUpperCase(), false, true] :
                    [getUnsignedDec(sum, maxAddNum).toString(radix)
                        .toUpperCase(), false, false];
        },

        /*
         * Takes two decimal integers and calculates difference
         * of integers in signed, radix-complement number system.
         * Returns an unsigned decimal integer.
         */
        subtractor = function (val1, val2) {
            var maxSubNum; // First power of 2 larger than any input to addHex()

            maxSubNum = getLowestPowerOf2(val1, val2);

            return getUnsignedDec((getSignedDec(val1, maxSubNum) -
                    getSignedDec(val2, maxSubNum)), maxSubNum);
        },

        validateUtfInput = function (val) {
            clearOutput();
            if (isNaN(val)) {
                $("#utfError")
                    .append(UNRECOGNIZED_INPUT);
                $('#utfError').show();
                return 0;
            }
            return 1;
        },

        updateUtf32to16 = function (dec) {
            var tempString,
                buildString = "110110";
            if (dec < 65536) {
                // If <= FFFF
                tempString = dec.toString(2);
                while (tempString.length < 16) {
                    tempString = "0".concat(tempString);
                }
                $("#utf16Hex")
                    .val(parseInt(tempString, 2).toString(16).toUpperCase());
                $("#utf16Bin").val(tempString);
            } else if (dec < 1114112) {
                dec -= 65536;
                // If <= 10FFFF
                tempString = dec.toString(2);
                while (tempString.length < 20) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat(tempString.substring(0, 10));
                buildString = buildString.concat("110111");
                buildString = buildString.concat(tempString.substring(10, 20));
                $("#utf16Hex")
                    .val(parseInt(buildString, 2).toString(16).toUpperCase());
                $("#utf16Bin").val(buildString);
            } else {
                $("#utfError")
                    .append(NUMBER_OUT_OF_RANGE.format(["UTF-16"], ["encoding"]));
                $('#utfError').show();
            }
        },

        updateUtf32to8 = function (dec) {
            var tempString = dec.toString(2),
                buildString = "";

            if (dec < 128) {
                // If <= 7F
                while (tempString.length < 7) {
                    tempString = "0".concat(tempString);
                }
                $("#utf8Hex").val(parseInt(tempString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(tempString);
            } else if (dec < 2048) {
                // If <= 07FF
                while (tempString.length < 11) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat("110");
                buildString = buildString.concat(tempString.substring(0, 5));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(5, 11));
                $("#utf8Hex").val(parseInt(buildString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(buildString);
            } else if (dec < 65536) {
                // If <= FFFF
                while (tempString.length < 16) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat("1110");
                buildString = buildString.concat(tempString.substring(0, 4));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(4, 10));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(10, 16));
                $("#utf8Hex").val(parseInt(buildString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(buildString);
            } else if (dec < 2097152) {
                // If <= 1FFFFF
                while (tempString.length < 21) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat("11110");
                buildString = buildString.concat(tempString.substring(0, 3));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(3, 9));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(9, 15));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(15, 21));
                $("#utf8Hex").val(parseInt(buildString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(buildString);
            } else if (dec < 67108864) {
                // If <= 3FFFFFF
                while (tempString.length < 26) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat("111110");
                buildString = buildString.concat(tempString.substring(0, 2));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(2, 8));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(8, 14));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(14, 20));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(20, 26));
                $("#utf8Hex").val(parseInt(buildString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(buildString);
            } else if (dec < 2147483648) {
                // If <= 7FFFFFFF
                while (tempString.length < 31) {
                    tempString = "0".concat(tempString);
                }
                buildString = buildString.concat("1111110");
                buildString = buildString.concat(tempString.substring(0, 1));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(1, 7));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(7, 13));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(13, 19));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(19, 25));
                buildString = buildString.concat("10");
                buildString = buildString.concat(tempString.substring(25, 31));
                $("#utf8Hex").val(parseInt(buildString, 2).toString(16)
                    .toUpperCase());
                $("#utf8Bin").val(buildString);
            } else {
                $("#utfError")
                    .append(NUMBER_OUT_OF_RANGE.format(["UTF-8"], ["encoding"]));
                $('#utfError').show();
            }
        },

        updateUtf16 = function (bin) {
            var binString = bin.toString(2),
                numBits = binString.length,
                bin32String = "",
                hex32;
            if (numBits <= 16) {
                $("#utf32Bin").val(binString);
                $("#utf32Hex").val(bin.toString(16).toUpperCase());
                updateUtf32to8(bin);
            } else if (numBits === 32 &&
                       binString.substring(0, 6) === "110110" &&
                       binString.substring(16, 22) === "110111") {
                bin32String = bin32String.concat(binString.substring(6, 16));
                bin32String = bin32String.concat(binString.substring(22, 32));
                hex32 = parseInt(parseInt(bin32String, 2).toString(16), 16);
                hex32 += parseInt("10000", 16);
                bin32String = hex32.toString(2);
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(hex32.toString(16).toUpperCase());
                updateUtf32to8(parseInt(bin32String, 2));
            } else {
                $("#utfError")
                    .append(INVALID_UTF.format(["UTF-16"]));
                $('#utfError').show();
            }
        },

        updateUtf8 = function (bin) {
            var binString = bin.toString(2),
                numBits = binString.length,
                bin32String = "";

            if (numBits === 7) {
                $("#utf32Bin").val(binString);
                $("#utf32Hex").val(bin.toString(16).toUpperCase());
                updateUtf32to16(bin);
            } else if (numBits === 16 &&
                       binString.substring(0, 3) === "110" &&
                       binString.substring(8, 10) === "10") {
                bin32String = bin32String.concat(binString.substring(3, 8));
                bin32String = bin32String.concat(binString.substring(10, 16));
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(parseInt(bin32String, 2).toString(16)
                    .toUpperCase());
                updateUtf32to16(parseInt(bin32String, 2));
            } else if (numBits === 24 &&
                       binString.substring(0, 4) === "1110" &&
                       binString.substring(8, 10) === "10" &&
                       binString.substring(16, 18) === "10") {
                bin32String = bin32String.concat(binString.substring(4, 8));
                bin32String = bin32String.concat(binString.substring(10, 16));
                bin32String = bin32String.concat(binString.substring(18, 24));
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(parseInt(bin32String, 2).toString(16)
                    .toUpperCase());
                updateUtf32to16(parseInt(bin32String, 2));
            } else if (numBits === 32 &&
                       binString.substring(0, 5) === "11110" &&
                       binString.substring(8, 10) === "10" &&
                       binString.substring(16, 18) === "10" &&
                       binString.substring(24, 26) === "10") {
                bin32String = bin32String.concat(binString.substring(5, 8));
                bin32String = bin32String.concat(binString.substring(10, 16));
                bin32String = bin32String.concat(binString.substring(18, 24));
                bin32String = bin32String.concat(binString.substring(26, 32));
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(parseInt(bin32String, 2).toString(16)
                    .toUpperCase());
                updateUtf32to16(parseInt(bin32String, 2));
            } else if (numBits === 40 &&
                       binString.substring(0, 6) === "111110" &&
                       binString.substring(8, 10) === "10" &&
                       binString.substring(16, 18) === "10" &&
                       binString.substring(24, 26) === "10" &&
                       binString.substring(32, 34) === "10") {
                bin32String = bin32String.concat(binString.substring(6, 8));
                bin32String = bin32String.concat(binString.substring(10, 16));
                bin32String = bin32String.concat(binString.substring(18, 24));
                bin32String = bin32String.concat(binString.substring(26, 32));
                bin32String = bin32String.concat(binString.substring(34, 40));
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(parseInt(bin32String, 2).toString(16)
                    .toUpperCase());
                updateUtf32to16(parseInt(bin32String, 2));
            } else if (numBits === 48 &&
                       binString.substring(0, 7) === "1111110" &&
                       binString.substring(8, 10) === "10" &&
                       binString.substring(16, 18) === "10" &&
                       binString.substring(24, 26) === "10" &&
                       binString.substring(32, 34) === "10" &&
                       binString.substring(40, 42) === "10") {
                bin32String = bin32String.concat(binString.substring(7, 8));
                bin32String = bin32String.concat(binString.substring(10, 16));
                bin32String = bin32String.concat(binString.substring(18, 24));
                bin32String = bin32String.concat(binString.substring(26, 32));
                bin32String = bin32String.concat(binString.substring(34, 40));
                bin32String = bin32String.concat(binString.substring(42, 48));
                $("#utf32Bin").val(bin32String);
                $("#utf32Hex").val(parseInt(bin32String, 2).toString(16)
                    .toUpperCase());
                updateUtf32to16(parseInt(bin32String, 2));
            } else {
                $("#utfError")
                    .append(INVALID_UTF.format(["UTF-8"]));
                $('#utfError').show();
            }
        };

    /******************** Input Handler for Subtractor ***********************/
    $("input:radio[name=subtractRadix], input:radio[name=subtractType]")
            .on('change', function () {
            $("#hexSubtract1").trigger('input');
        });
    $("#hexSubtract2").on('input', function () {
        $("#hexSubtract1").trigger('input');
    });
    $("#hexSubtract1").on('input', function () {
        var val1 = $("#hexSubtract1").val(),
            val2 = $("#hexSubtract2").val(),
            radix = $("input:radio[name=subtractRadix]:checked").val();

        clearOutput();
        if (!val1 || !val2) {
            $("#subtractorError")
                .append(MISSING_FIELD);
            $('#subtractorError').show();
        } else {
            val1 = parseInt(val1, radix);
            val2 = parseInt(val2, radix);
            if (isNaN(val1) || isNaN(val2)) {
                $("#subtractorError")
                    .append(UNRECOGNIZED_INPUT);
                $('#subtractorError').show();
            } else if ($("input:radio[name=subtractType]:checked").val() ===
                    "unsigned") {
                $("#hexSubtractOutput")
                    .append((val1 - val2).toString(radix).toUpperCase());
            } else {
                $("#hexSubtractOutput")
                    .append(subtractor(val1, val2).toString(radix)
                        .toUpperCase());
            }
        }
    });
    /****************** End Input Handler for Subtractor *********************/

    /*********************** Input Handler for Adder *************************/
    $("input:radio[name=addRadix], input:radio[name=addType]")
            .on('change', function () {
            $("#hexAdd1").trigger('input');
        });
    $("#hexAdd2").on('input', function () {
        $("#hexAdd1").trigger('input');
    });
    $("#hexAdd1").on('input', function () {
        var val1 = $("#hexAdd1").val(),
            val2 = $("#hexAdd2").val(),
            radix = $("input:radio[name=addRadix]:checked").val(),
            result;

        clearOutput();
        if (!val1 || !val2) {
            $("#adderError")
                .append(MISSING_FIELD);
            $('#adderError').show();
        } else {
            val1 = parseInt(val1, radix);
            val2 = parseInt(val2, radix);
            if (isNaN(val1) || isNaN(val2)) {
                $("#adderError")
                    .append(UNRECOGNIZED_INPUT);
                $('#adderError').show();
            } else {
                result = adder(val1, val2, radix);
                $("#hexAddOutput").append(result[0]);
                if (result[1]) {
                    $("#hexAddOutput").append("<br />Overflow.");
                }
                if (result[2]) {
                    $("#hexAddOutput").append("<br />Carry.");
                }
            }
        }
    });
    /********************* End Input Handler for Adder ***********************/

    /***************** Input Handlers for Conversion Table *******************/
    $("#bitSelect").on('change', function () {
        if (lastConverted !== "") {
            $("#" + lastConverted).trigger('input');
        }
    });
    $("#udec").on('input', function () {
        if ($("#udec").val()) {
            updateConversionFields(parseInt($("#udec").val(), 10));
            lastConverted = "udec";
        }
    });
    $("#sdec").on('input', function () {
        if ($("#sdec").val()) {
            updateConversionFields(getUnsignedDec(parseInt($("#sdec").val(), 10),
                Math.pow(2, $("#bitSelect").val())));
            lastConverted = "sdec";
        }
    });
    $("#hex").on('input', function () {
        if ($("#hex").val()) {
            updateConversionFields(parseInt($("#hex").val(), 16));
            lastConverted = "hex";
        }
    });
    $("#bin").on('input', function () {
        if ($("#bin").val()) {
            updateConversionFields(parseInt($("#bin").val(), 2));
            lastConverted = "bin";
        }
    });
    /*************** End Input Handlers for Conversion Table *****************/

    /***************** Input Handlers for Bytes Conversion *******************/
    $("#tensBytes").on('change', function () {
        if (lastBytesEntered !== "") {
            $("#" + lastBytesEntered).trigger('input');
        }
    });
    $("#twosBytes").on('change', function () {
        if (lastBytesEntered !== "") {
            $("#" + lastBytesEntered).trigger('input');
        }
    });
    $("#tensTwoPowerByteInput").on('input', function () {
        clearOutput();
        lastBytesEntered = "tensTwoPowerByteInput";
        var tens,
            tensUnits,
            twosUnits,
            power = parseInt($("#tensTwoPowerByteInput").val(), 10);
        if (power) {
            if (isNaN(power)) {
                $("#bytesError")
                    .append(UNRECOGNIZED_INPUT);
                $('#bytesError').show();
            } else {
                tens = Math.pow(2, power);
                tensUnits = parseInt($("#tensBytes").val(), 10);
                twosUnits = parseInt($("#twosBytes").val(), 10);
                $("#tensByteInput").val(tens.toString());
                $("#twosByteInput")
                    .val((tens * tensUnits) / twosUnits);
            }
        }
    });
    $("#tensByteInput").on('input', function () {
        clearOutput();
        lastBytesEntered = "tensByteInput";
        var tens = parseInt($("#tensByteInput").val(), 10);
        if (tens) {
            if (isNaN(tens)) {
                $("#bytesError")
                    .append(UNRECOGNIZED_INPUT);
                $('#bytesError').show();
            } else {
                $("#tensTwoPowerByteInput")
                    .val(Math.log(tens) / Math.log(2));
                $("#twosByteInput").val((tens *
                    parseInt($("#tensBytes").val(), 10)) /
                    parseInt($("#twosBytes").val(), 10));
            }
        }
    });
    $("#twosByteInput").on('input', function () {
        clearOutput();
        lastBytesEntered = "twosByteInput";
        var twos = parseInt($("#twosByteInput").val(), 10),
            tens;
        if (twos) {
            if (isNaN(twos)) {
                $("#bytesError")
                    .append(UNRECOGNIZED_INPUT);
                $('#bytesError').show();
            } else {
                tens = (twos * parseInt($("#twosBytes").val(), 10)) /
                    parseInt($("#tensBytes").val(), 10);
                $("#tensTwoPowerByteInput").val(Math.log(tens) /
                    Math.log(2));
                $("#tensByteInput").val(tens);
            }
        }
    });
    /*************** End Input Handlers for Bytes Conversion *****************/

    /******************* Input Handlers for UTF Encodings ********************/
    $("#utf32Hex").on('input', function () {
        var hex32 = parseInt($("#utf32Hex").val(), 16);
        if (validateUtfInput(hex32)) {
            updateUtf32to16(parseInt(hex32.toString(10), 10));
            updateUtf32to8(parseInt(hex32.toString(10), 10));
            $("#utf32Bin").val(hex32.toString(2));
        }
    });
    $("#utf32Bin").on('input', function () {
        var bin32 = parseInt($("#utf32Bin").val(), 2);
        if (validateUtfInput(bin32)) {
            updateUtf32to16(parseInt(bin32.toString(10), 10));
            updateUtf32to8(parseInt(bin32.toString(10), 10));
            $("#utf32Hex").val(bin32.toString(16).toUpperCase());
        }
    });
    $("#utf16Hex").on('input', function () {
        var hex16 = parseInt($("#utf16Hex").val(), 16);
        if (validateUtfInput(hex16)) {
            updateUtf16(parseInt(hex16.toString(2), 2));
            $("#utf16Bin").val(hex16.toString(2));
        }
    });
    $("#utf16Bin").on('input', function () {
        var bin16 = parseInt($("#utf16Bin").val(), 2);
        if (validateUtfInput(bin16)) {
            updateUtf16(bin16);
            $("#utf16Hex").val(bin16.toString(16).toUpperCase());
        }
    });
    $("#utf8Hex").on('input', function () {
        var hex8 = parseInt($("#utf8Hex").val(), 16);
        if (validateUtfInput(hex8)) {
            updateUtf8(parseInt(hex8.toString(2), 2), 8);
            $("#utf8Bin").val(hex8.toString(2));
        }
    });
    $("#utf8Bin").on('input', function () {
        var bin8 = parseInt($("#utf8Bin").val(), 2);
        if (validateUtfInput(bin8)) {
            updateUtf8(bin8, 8);
            $("#utf8Hex").val(bin8.toString(16).toUpperCase());
        }
    });
    /***************** End Input Handlers for UTF Encodings ******************/

    /**
     * String format utility function
     */
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }

    $('.accordion').on('show hide', function (n) {
        $(n.target).siblings('.accordion-heading').find('.accordion-toggle i').toggleClass('icon-chevron-up icon-chevron-down');
    });
});
