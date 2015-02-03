;(function(global, factory){
    if (typeof exports === "object") {
        module.exports = factory();
    }
    else if ( typeof define === 'function' && define.amd ) {
        define(factory);
    }
    else {
        global.StyleSplitter = factory();
    }
})(this, function() {

    var fontColorCodes = {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        purple: 35,
        cyan: 36,
        gray: 37,
        sblack: 90,
        sred: 91,
        sgreen: 92,
        syellow: 93,
        sblue: 94,
        spurple: 95,
        scyan: 96,
        sgray: 97
    };

    var backgroundColorCodes = {
        black: 40,
        red: 41,
        green: 42,
        yellow: 43,
        blue: 44,
        purple: 45,
        cyan: 46,
        gray: 47,
        sblack: 100,
        sred: 101,
        sgreen: 102,
        syellow: 103,
        sblue: 104,
        spurple: 105,
        scyan: 106,
        sgray: 107
    };

    var pattern = /\<([a-zA-Z0-9_-]+(?:\:[a-zA-Z0-9_-]+)?)\>([^\<]*)\<\/\1\>/;

    var getCodeFromTag = function(tag) {
        tag = tag.trim();
        switch (tag) {
            case "strong":
            case "b":
                return 1;
            case "underline":
            case "u":
                return 4;
        }
        if (tag.indexOf('color:') === 0 || tag.indexOf('c:') === 0) {
            return getFontColorCodeFromTag(tag);
        }
        if (tag.indexOf('background:') === 0 || tag.indexOf('b:') === 0) {
            return getBackgroundColorCodeFromTag(tag);
        }
        throw new {
            message: "the tag named '{tag}' does not exist.",
            code: 1
        };
    };

    var getFontColorCodeFromTag = function(tag)
    {
        var color = tag.substr(tag.indexOf(':') + 1);

        if (!fontColorCodes[color]) {
            throw new {
                message: "the font color named '" + color + "' does not exist.'", 
                code: 2
            };
        }
        return fontColorCodes[color];
    };

    var getBackgroundColorCodeFromTag = function(tag)
    {
        var color = tag.substr(tag.indexOf(':') + 1);

        if (!backgroundColorCodes[color]) {
            throw new {
                message: "the background color named '" + color + "' does not exist.'", 
                code: 4
            };
        }
        return backgroundColorCodes[color];
    };

    var ColoredConsole = function(contents) {
        if (!(this instanceof ColoredConsole)) {
            return new ColoredConsole(contents);
        }
        this.parsedContents = null;
        this.contents = contents;
    };

    var arrayClone = function(arr) {
        var i = 0, ilen = arr.length, carr = [];
        for (; i < ilen; i++) {
            carr[i] = arr[i];
        }
        return carr;
    };

    ColoredConsole.prototype = {
        parse: function() {
            if (this.parsedContents === null) {
                this.parsedContents = '';
                
                var tagStack = [];

                tagStack.push({
                    name: 'root',
                    styles: []
                });

                while (this.contents !== '') {

                    var currentStack = tagStack[tagStack.length - 1];
                    var currentStyles = arrayClone(currentStack.styles);
                    var matches = null;

                    if (matches = this.contents.match(/^<([^>\/]+)>/)) {
                        try {
                            var style = getCodeFromTag(matches[1]);
                            if (currentStyles.indexOf(style) === -1) {
                                currentStyles.push(style);
                            }

                            tagStack.push({
                                name: matches[1],
                                styles: currentStyles
                            });

                            this.parsedContents += "\x1b[" + style + "m";
                        } catch (e) {}

                        this.contents = this.contents.substr(matches[0].length);

                    } else if (matches = this.contents.match(/^<\/([^>]+)>/)) {

                        if (currentStack.name === matches[1]) {
                            tagStack.pop();

                            var lastStack = tagStack[tagStack.length - 1];
                            var lastStyles = lastStack.styles;

                            this.parsedContents += "\x1b[0m";
                            if (lastStyles.length > 0) {
                                this.parsedContents += "\x1b[" + lastStyles.join(';') + "m";
                            }
                        }

                        this.contents = this.contents.substr(matches[0].length);

                    // first 
                    } else if (matches = this.contents.match(/<([^>]+)>/)) {
                        var searched = matches.index;

                        this.parsedContents += this.contents.substr(0, searched);
                        this.contents = this.contents.substr(searched);

                    } else {
                        this.parsedContents += this.contents;
                        if (currentStyles.length > 0) {
                            this.parsedContents += "\x1b[0m";
                        }
                        this.contents = '';
                    }

                    matches = null;
                }
                this.parsedContents = this.parsedContents.replace('&lt;', '<').replace('&gt;', '>');
            }

            return this.parsedContents;
        }
    };

    return ColoredConsole;
});