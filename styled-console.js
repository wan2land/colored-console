;(function(global, factory){

    module.exports = factory();

})(this, function() {

    var htmlparser = require('htmlparser2');

    var isString = function(obj) {
        return ({}).toString.call(obj) === '[object String]';
    };
    var clone = function(origin) {
        var i = 0, len = origin.length, target = [];
        for (; i < len; i++) {
            target[i] = origin[i];
        }
        return target;
    };

    var consoleLog = console.log;

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
        if (tag.indexOf('background:') === 0 || tag.indexOf('bg:') === 0) {
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

    var StyledConsole = function(options) {
        if (!(this instanceof StyledConsole)) {
            return new StyledConsole(options);
        }
        options = options || {};
        if (options.autoparse && options.autoparse === true) {
            this.autoParsingOn();
        }
    };


    StyledConsole.prototype = {
        autoParseOn: function() {
            var self = this;
            console.log = function() {
                var i = 0, len = arguments.length, argument;
                for (; i < len; i++) {
                    argument = arguments[i];
                    if (isString(argument)) {
                        arguments[i] = self.parse(argument);
                    }
                }
                consoleLog.apply(console, arguments);
            };
        },
        autoParseOff: function() {
            console.log = consoleLog;
        },
        parse: function(contents) {

            var tagStack = [{
                name: 'root',
                styles: []
            }];

            var parsedContents = '';

            var parser = new htmlparser.Parser({
                onopentag: function(name, attrs) {
                    var currentStack = tagStack[tagStack.length - 1];
                    var currentStyles = clone(currentStack.styles);

                    try {
                        var style = getCodeFromTag(name);
                        if (currentStyles.indexOf(style) === -1) {
                            currentStyles.push(style);
                        }

                        tagStack.push({
                            name: name,
                            styles: currentStyles
                        });

                        parsedContents += "\x1b[" + style + "m";
                    } catch (e) {}
                },
                onclosetag: function(name) {
                    var currentStack = tagStack[tagStack.length - 1];
                    var currentStyles = clone(currentStack.styles);

                    if (currentStack.name === name) {
                        tagStack.pop();

                        var lastStack = tagStack[tagStack.length - 1];
                        var lastStyles = lastStack.styles;

                        parsedContents += "\x1b[0m";
                        if (lastStyles.length > 0) {
                            parsedContents += "\x1b[" + lastStyles.join(';') + "m";
                        }
                    } else {
                        console.log("warning..?");
                    }
                },
                ontext: function(text) {
                    parsedContents += text;
                }
            });
            parser.write(contents);
            parser.end();

            parsedContents = parsedContents.replace('&lt;', '<').replace('&gt;', '>');

            return parsedContents;
        }
    };

    return StyledConsole;
});