(function() {
        /**
         * Example of how to make x.x === x in JavaScript.
         */
    var x = function () {
            this.x = this;
        },

        /**
         * Alternative example of how to make x.x === x in JavaScript.
         */
        alternativeSolution = function () {
            var x = { x : x };
            x.x = x;
        };
})()
