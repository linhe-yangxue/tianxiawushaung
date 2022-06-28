var Greeting = (function() {
    var _hi = 'Hi, ';

    function Greeting(nm) {
        this.name = nm;

        this.say = function() {
            console.log(_hi + this.name);
        };

        this.change = function(word) {
            _hi = word;
        };
    }
    return Greeting;
})();

var a = new Greeting('Jack');
a.say();

var b = new Greeting('Tom');
b.say();

a.change('Hello ,');

a.say();

b.say();

