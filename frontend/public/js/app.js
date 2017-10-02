(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BubbleForce = function () {
    function BubbleForce() {
        _classCallCheck(this, BubbleForce);

        this.simulation;
        this.width = 850;
        this.height = 500;

        this.svg;

        this.data;
        this.keys;

        this.xScale;
        this.yScale;
        this.colorScale;
        this.radiusScale;

        this.rDomain;

        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
    }

    _createClass(BubbleForce, [{
        key: "data",
        value: function data(_data) {
            this.data = _data;
            this.keys = this.data.map(function (d) {
                return d["dsModalidadeLicitacao"];
            }).filter(function (item, index, array) {
                return array.indexOf(item) == index;
            });
            this.rDomain = d3.extent(_data, function (d) {
                return d["vlLicitacao"];
            });
        }
    }, {
        key: "init",
        value: function init() {
            this.initScales();

            this.svg = d3.select("#chart").append("svg").attr("width", this.width).attr("height", this.height).append("g").attr("class", "group-chart");
            // .attr("transform", "translate("+[this.width/2, this.height/2]+")");
        }
    }, {
        key: "initScales",
        value: function initScales() {
            this.radiusScale = d3.scaleSqrt().range([1, 50]);
            this.colorScale = d3.scaleOrdinal().range(this.colorSchema);
            this.xScale = d3.scaleBand().range([50, this.width]);
        }
    }, {
        key: "draw",
        value: function draw() {
            var _this2 = this;

            this.radiusScale.domain(this.rDomain);
            this.colorScale.domain(this.keys);
            this.xScale.domain(this.keys);
            var _this = this;
            this.simulation = d3.forceSimulation(this.data).force("collision", d3.forceCollide().radius(function (d) {
                return _this2.radiusScale(d["vlLicitacao"]) + 0.5;
            })).force("x", d3.forceX(this.width).x(function (d) {
                return _this2.xScale(d["dsModalidadeLicitacao"]);
            }).strength(1)).force("y", d3.forceY(this.height).y(function (d) {
                return _this.height / 2;
            }).strength(0.075)).on("tick", function () {
                var u = _this.svg.selectAll("circle").data(_this2.data);
                u.enter().append("circle").attr("r", function (d) {
                    return _this.radiusScale(d["vlLicitacao"]);
                }).merge(u).attr("cx", function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
                }).attr("fill", function (d) {
                    return _this.colorScale(d["dsModalidadeLicitacao"]);
                });
                u.exit().remove();
            });
        }
    }]);

    return BubbleForce;
}();

exports.default = BubbleForce;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BubblePack = function () {
    function BubblePack() {
        _classCallCheck(this, BubblePack);

        this._data = {};
        this.root;
        this.packLayout;
        this.svg;
    }

    _createClass(BubblePack, [{
        key: "data",
        value: function data(_data) {
            this._data.key = "total";
            this._data.values = d3.nest().key(function (d) {
                return d["dsModalidadeLicitacao"];
            }).entries(_data);
            this.root = d3.hierarchy(this._data, function (d) {
                return d.values;
            }).sum(function (d) {
                return d["vlLicitacao"];
            }).sort(function (a, b) {
                return b["vlLicitacao"] - a["vlLicitacao"];
            });
            console.log(this._data);
        }
    }, {
        key: "init",
        value: function init() {
            this.packLayout = d3.pack().size([500, 500]).padding(1);
            this.packLayout(this.root);

            this.svg = d3.select("#chart").append("svg").attr("width", 500).attr("height", 500).append("g").attr("class", "group-chart");
        }
    }, {
        key: "draw",
        value: function draw() {
            this.svg.selectAll("circle").data(this.root.descendants()).enter().append("circle").attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                return d.y;
            }).attr("r", function (d) {
                return d.r;
            }).attr("class", "bubble");
            // console.log(this.root.descendants());
        }
    }]);

    return BubblePack;
}();

exports.default = BubblePack;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Formatter = function () {
    function Formatter() {
        _classCallCheck(this, Formatter);

        this.localeTimeFormat = d3.timeFormatLocale({
            "dateTime": "%a %b %e %X %Y",
            "date": "%d/%m/%Y",
            "time": "%H : %M : %S",
            "periods": ["AM", "PM"],
            "days": ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
            "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        });
        this.myFormat = d3.formatLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["R$", ""],
            "dateTime": "%a %b %e %X %Y",
            "date": "%m/%d/%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
            "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        });

        this.formatMillisecond = localeTimeFormat.format(".%L");
        this.formatSecond = localeTimeFormat.format(":%S");
        this.formatMinute = localeTimeFormat.format("%I:%M");
        this.formatHour = localeTimeFormat.format("%I %p");
        this.formatDay = localeTimeFormat.format("%a %d");
        this.formatWeek = localeTimeFormat.format("%b %d");
        this.formatMonth = localeTimeFormat.format("%B");
        this.formatYear = localeTimeFormat.format("%Y");
    }

    _createClass(Formatter, [{
        key: "multiFormat",
        value: function multiFormat(date) {
            return (d3.timeSecond(date) < date ? formatMillisecond : d3.timeMinute(date) < date ? formatSecond : d3.timeHour(date) < date ? formatMinute : d3.timeDay(date) < date ? formatHour : d3.timeMonth(date) < date ? d3.timeWeek(date) < date ? formatDay : formatWeek : d3.timeYear(date) < date ? formatMonth : formatYear)(date);
        }
    }]);

    return Formatter;
}();

exports.default = Formatter;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formatter = require("./formatter.js");

var _formatter2 = _interopRequireDefault(_formatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScatterPlot = function () {
    function ScatterPlot() {
        var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        _classCallCheck(this, ScatterPlot);

        this._data_ = null;
        this.width;
        this.height;
        this.margin;

        this.chartGroup;
        this.circleGroup;
        this.svg;

        this.xScale;
        this.yScale;
        this.colorScale;
        this.radiusScale;

        this.colorDomain;

        this.xAxis;
        this.yAxis;

        this.defaultOpacityCircle = 0.5;
    }

    _createClass(ScatterPlot, [{
        key: "x",
        value: function x(d) {
            return d['dtEdital'];
        }
    }, {
        key: "y",
        value: function y(d) {
            return d["vlLicitacao"];
        }
    }, {
        key: "color",
        value: function color(d) {
            return d['dsModalidadeLicitacao'];
        }
    }, {
        key: "r",
        value: function r(d) {
            return 4;
        }
    }, {
        key: "key",
        value: function key(d) {
            return d["idLicitacao"];
        }
    }, {
        key: "data",
        value: function data(_data) {
            if (!_data) {
                return this.data;
            } else {
                this._data_ = _data.map(this.convertDate);
                this.colorDomain = _data.filter(function (item, index, array) {
                    return array.indexOf(item) === index;
                });
            }

            console.log('data setup');
        }
    }, {
        key: "init",
        value: function init() {
            this.initMargin();
            this.initSVGElements();
            this.initScale();
        }
    }, {
        key: "initMargin",
        value: function initMargin() {
            this.margin = { top: 20, right: 20, bottom: 60, left: 60 };
            this.width = 700 - this.margin.left - this.margin.right;
            this.height = 450 - this.margin.top - this.margin.bottom;
        }
    }, {
        key: "initSVGElements",
        value: function initSVGElements() {
            this.svg = d3.select("#chart").append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom);
            this.chartGroup = this.svg.append("g").attr("class", "group-chart").attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")");

            var clip = this.svg.append("defs").append("svg:clipPath").attr("id", "clip").append("svg:rect").attr("width", this.width + 10).attr("height", this.height + 10).attr("x", -5).attr("y", -5);

            this.circleGroup = this.chartGroup.append("g").attr("clip-path", "url(#clip)").style("clip-path", "url(#clip)").attr("class", "circleGroup");
        }
    }, {
        key: "initScale",
        value: function initScale() {
            this.yScale = d3.scaleLog().range([this.height, 0]);
            this.xScale = d3.scaleTime().range([0, this.width]);

            this.colorScale = d3.scaleOrdinal().range(["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"]);

            this.radiusScale = function (d) {
                return 4;
            };
        }
    }, {
        key: "draw",
        value: function draw() {
            var _this = this;

            if (!this.data) {
                console.log("data is not defined");
                return;
            }
            var extent = d3.extent(this._data_, function (d) {
                return _this.x(d);
            });
            var newYear = d3.timeYear(extent[0]);
            this.xDomain = [];
            this.xDomain[0] = newYear;
            this.xDomain[1] = d3.timeYear.offset(newYear);
            this.xScale.domain(this.xDomain);

            this.yDomain = [0.01, d3.max(this._data_, function (d) {
                return _this.y(d);
            })];
            this.yScale.domain(this.yDomain);
            this.colorScale.domain(this.colorDomain);

            this.drawMarks();
        }
    }, {
        key: "drawMarks",
        value: function drawMarks() {
            var _this2 = this;

            if (!this.data) {
                console.log("data is not defined");
                return;
            }

            var bubbles = this.circleGroup.selectAll(".bubbles").data(this._data_, function (d) {
                return _this2.key(d);
            });

            // UPDATE
            bubbles.transition().ease(d3.easeSinInOut).duration(750).attr("cx", function (d) {
                return xScale(x(d));
            }).attr("cy", function (d) {
                return yScale(y(d));
            });

            //ENTER
            bubbles.enter().append("circle").attr("class", function (d) {
                return "bubbles " + _this2.mapCodeToLetter(_this2.key(d));
            }).attr("cx", function (d) {
                return _this2.xScale(_this2.x(d));
            }).attr("cy", this.height).attr("r", 0).style("fill", function (d) {
                return _this2.colorScale(_this2.color(d));
            }).transition().duration(750).attr("cx", function (d) {
                return _this2.xScale(_this2.x(d));
            }).attr("cy", function (d) {
                return _this2.yScale(_this2.y(d));
            }).attr("r", function (d) {
                return _this2.radiusScale(_this2.r(d));
            }).style("fill", function (d) {
                return _this2.colorScale(_this2.color(d));
            }).style("opacity", this.defaultOpacityCircle);

            // EXIT
            bubbles.exit().remove();
        }

        //HELPERS FUNCTIONS

    }, {
        key: "convertDate",
        value: function convertDate(d) {
            d["dtEdital"] = new Date(d["dtEdital"]);
            d["dtAbertura"] = new Date(d["dtAbertura"]);

            return d;
        }
    }, {
        key: "mapCodeToLetter",
        value: function mapCodeToLetter(codigo) {
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            var number = void 0;
            var word = '';
            for (var i = 0; i < codigo.length; i++) {
                word += letter[+codigo[i]];
            }return word;
        }
    }]);

    return ScatterPlot;
}();

exports.default = ScatterPlot;

},{"./formatter.js":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Treemap = function () {
    function Treemap() {
        _classCallCheck(this, Treemap);

        this._data = {};
        this.root;
        this.treemapLayout;
        this.svg;

        this.colorScale;
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this.keys;
    }

    _createClass(Treemap, [{
        key: "data",
        value: function data(_data) {
            this._data.key = "total";
            this._data.values = d3.nest().key(function (d) {
                return d["dsModalidadeLicitacao"];
            }).entries(_data);
            this.root = d3.hierarchy(this._data, function (d) {
                return d.values;
            }).sum(function (d) {
                return d["vlLicitacao"];
            }).sort(function (a, b) {
                return b['data']["vlLicitacao"] - a['data']["vlLicitacao"] || a['data']["vlLicitacao"] - b['data']["vlLicitacao"];
            });
            // console.log("data",this._data.values);

            this.keys = this._data.values.map(function (d) {
                return d.key;
            });
            this.colorScale = d3.scaleOrdinal().range(this.colorSchema).domain(this.keys);
        }
    }, {
        key: "init",
        value: function init() {
            this.treemapLayout = d3.treemap().size([850, 500]).paddingOuter(5).tile(d3.treemapBinary);
            this.treemapLayout(this.root);

            this.svg = d3.select("#chart").append("svg").attr("width", 850).attr("height", 500).append("g").attr("class", "group-chart");
        }
    }, {
        key: "draw",
        value: function draw() {
            var _this = this;

            this.svg.selectAll("rect").data(this.root.leaves()).enter().append("rect").attr("x", function (d) {
                return d.x0;
            }).attr("y", function (d) {
                return d.y0;
            }).attr("width", function (d) {
                return d.x1 - d.x0;
            }).attr("height", function (d) {
                return d.y1 - d.y0;
            }).attr("class", "tree-layout").attr("fill", function (d) {
                return _this.colorScale(d.data["dsModalidadeLicitacao"]);
            });
            // console.log("root ",this.root.descendants());
        }
    }]);

    return Treemap;
}();

exports.default = Treemap;

},{}],6:[function(require,module,exports){
"use strict";

var _scatterplot = require("./chart/scatterplot.js");

var _scatterplot2 = _interopRequireDefault(_scatterplot);

var _bubblepack = require("./chart/bubblepack.js");

var _bubblepack2 = _interopRequireDefault(_bubblepack);

var _treemap = require("./chart/treemap.js");

var _treemap2 = _interopRequireDefault(_treemap);

var _bubbleforce = require("./chart/bubbleforce.js");

var _bubbleforce2 = _interopRequireDefault(_bubbleforce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var grafico = new _bubbleforce2.default();

    d3.json("http://localhost:8080/licitacoes/412410/2015", start);

    function start(err, received) {
        if (!received.data) {
            return null;
        }

        grafico.data(received.data);
        grafico.init();
        grafico.draw();
    }
};

},{"./chart/bubbleforce.js":1,"./chart/bubblepack.js":2,"./chart/scatterplot.js":4,"./chart/treemap.js":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGNoYXJ0XFxidWJibGVmb3JjZS5qcyIsInNyY1xcY2hhcnRcXGJ1YmJsZXBhY2suanMiLCJzcmNcXGNoYXJ0XFxmb3JtYXR0ZXIuanMiLCJzcmNcXGNoYXJ0XFxzY2F0dGVycGxvdC5qcyIsInNyY1xcY2hhcnRcXHRyZWVtYXAuanMiLCJzcmNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDRXFCLFc7QUFDakIsMkJBQWE7QUFBQTs7QUFDVCxhQUFLLFVBQUw7QUFDQSxhQUFLLEtBQUwsR0FBYSxHQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsR0FBZDs7QUFFQSxhQUFLLEdBQUw7O0FBRUEsYUFBSyxJQUFMO0FBQ0EsYUFBSyxJQUFMOztBQUVBLGFBQUssTUFBTDtBQUNBLGFBQUssTUFBTDtBQUNBLGFBQUssVUFBTDtBQUNBLGFBQUssV0FBTDs7QUFFQSxhQUFLLE9BQUw7O0FBRUEsYUFBSyxXQUFMLEdBQW1CLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsRUFBa0MsU0FBbEMsRUFBNkMsU0FBN0MsRUFBd0QsU0FBeEQsQ0FBbkI7QUFFSDs7Ozs2QkFFSSxLLEVBQUs7QUFDTixpQkFBSyxJQUFMLEdBQVksS0FBWjtBQUNBLGlCQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWU7QUFBQSx1QkFBSyxFQUFFLHVCQUFGLENBQUw7QUFBQSxhQUFmLEVBQ1gsTUFEVyxDQUNILFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXdCO0FBQzdCLHVCQUFPLE1BQU0sT0FBTixDQUFjLElBQWQsS0FBdUIsS0FBOUI7QUFDSCxhQUhXLENBQVo7QUFJQSxpQkFBSyxPQUFMLEdBQWUsR0FBRyxNQUFILENBQVUsS0FBVixFQUFnQjtBQUFBLHVCQUFLLEVBQUUsYUFBRixDQUFMO0FBQUEsYUFBaEIsQ0FBZjtBQUNI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T1MsSUFQVCxDQU9jLFFBUGQsRUFPd0I7QUFBQSx1QkFBTSxFQUFFLEVBQUYsR0FBTyxFQUFFLEVBQWY7QUFBQSxhQVB4QixFQVFTLElBUlQsQ0FRYyxPQVJkLEVBUXNCLGFBUnRCLEVBU1MsSUFUVCxDQVNjLE1BVGQsRUFTc0I7QUFBQSx1QkFBSyxNQUFLLFVBQUwsQ0FBZ0IsRUFBRSxJQUFGLENBQU8sdUJBQVAsQ0FBaEIsQ0FBTDtBQUFBLGFBVHRCO0FBVUE7QUFFSDs7Ozs7O2tCQXJEZ0IsTzs7Ozs7QUNGckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE9BQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3RCLFFBQU0sVUFBVSwyQkFBaEI7O0FBRUEsT0FBRyxJQUFILENBQVEsOENBQVIsRUFBd0QsS0FBeEQ7O0FBRUEsYUFBUyxLQUFULENBQWUsR0FBZixFQUFvQixRQUFwQixFQUE4QjtBQUMxQixZQUFHLENBQUMsU0FBUyxJQUFiLEVBQWtCO0FBQ2QsbUJBQU8sSUFBUDtBQUNIOztBQUVELGdCQUFRLElBQVIsQ0FBYSxTQUFTLElBQXRCO0FBQ0EsZ0JBQVEsSUFBUjtBQUNBLGdCQUFRLElBQVI7QUFDSDtBQUVKLENBZkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWJibGVGb3JjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuc2ltdWxhdGlvbjtcclxuICAgICAgICB0aGlzLndpZHRoID0gODUwO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gNTAwO1xyXG5cclxuICAgICAgICB0aGlzLnN2ZztcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhO1xyXG4gICAgICAgIHRoaXMua2V5cztcclxuXHJcbiAgICAgICAgdGhpcy54U2NhbGU7XHJcbiAgICAgICAgdGhpcy55U2NhbGU7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzU2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuckRvbWFpbjtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclNjaGVtYSA9IFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGF0YShkYXRhKXtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IHRoaXMuZGF0YS5tYXAoIGQgPT4gZFtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXSApXHJcbiAgICAgICAgLmZpbHRlciggKGl0ZW0sIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSA9PSBpbmRleDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJEb21haW4gPSBkMy5leHRlbnQoZGF0YSwgZCA9PiBkW1widmxMaWNpdGFjYW9cIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmluaXRTY2FsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjY2hhcnRcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAodGhpcy53aWR0aCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwodGhpcy5oZWlnaHQpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwLWNoYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK1t0aGlzLndpZHRoLzIsIHRoaXMuaGVpZ2h0LzJdK1wiKVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0U2NhbGVzKCl7XHJcbiAgICAgICAgdGhpcy5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlU3FydCgpLnJhbmdlKFsxLDUwXSk7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlID0gZDMuc2NhbGVPcmRpbmFsKCkucmFuZ2UodGhpcy5jb2xvclNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZUJhbmQoKS5yYW5nZShbNTAsdGhpcy53aWR0aF0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICB0aGlzLnJhZGl1c1NjYWxlLmRvbWFpbih0aGlzLnJEb21haW4pO1xyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZS5kb21haW4odGhpcy5rZXlzKTtcclxuICAgICAgICB0aGlzLnhTY2FsZS5kb21haW4odGhpcy5rZXlzKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbih0aGlzLmRhdGEpXHJcbiAgICAgICAgICAgIC5mb3JjZShcImNvbGxpc2lvblwiLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFkaXVzU2NhbGUoZFtcInZsTGljaXRhY2FvXCJdKSArIDAuNSA7XHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJ4XCIsIGQzLmZvcmNlWCh0aGlzLndpZHRoKS54KCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhTY2FsZShkW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdKTtcclxuICAgICAgICAgICAgfSkuc3RyZW5ndGgoMSkgKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJ5XCIsIGQzLmZvcmNlWSh0aGlzLmhlaWdodCkueSggZCA9PiBfdGhpcy5oZWlnaHQgLyAyICkuc3RyZW5ndGgoMC4wNzUpIClcclxuICAgICAgICAgICAgLm9uKFwidGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdSA9IF90aGlzLnN2Zy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHUuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yYWRpdXNTY2FsZShkW1widmxMaWNpdGFjYW9cIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm1lcmdlKHUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBkID0+IGQueCApXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBkID0+IGQueSApXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIGQgPT4gX3RoaXMuY29sb3JTY2FsZShkW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHUuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9ICk7XHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1YmJsZVBhY2sge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLl9kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5yb290O1xyXG4gICAgICAgIHRoaXMucGFja0xheW91dDtcclxuICAgICAgICB0aGlzLnN2ZztcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuX2RhdGEua2V5ID0gXCJ0b3RhbFwiXHJcbiAgICAgICAgdGhpcy5fZGF0YS52YWx1ZXMgPSBkMy5uZXN0KCkua2V5KCBkID0+IGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl0pLmVudHJpZXMoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gZDMuaGllcmFyY2h5KHRoaXMuX2RhdGEsIGQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZC52YWx1ZXM7XHJcbiAgICAgICAgfSkuc3VtKCBkID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGRbXCJ2bExpY2l0YWNhb1wiXTtcclxuICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGJbXCJ2bExpY2l0YWNhb1wiXSAtIGFbXCJ2bExpY2l0YWNhb1wiXTsgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5fZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMucGFja0xheW91dCA9IGQzLnBhY2soKS5zaXplKFs1MDAsIDUwMF0pLnBhZGRpbmcoMSk7XHJcbiAgICAgICAgdGhpcy5wYWNrTGF5b3V0KHRoaXMucm9vdCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KFwiI2NoYXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICg1MDApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCg1MDApKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJncm91cC1jaGFydFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAuZGF0YSh0aGlzLnJvb3QuZGVzY2VuZGFudHMoKSlcclxuICAgICAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIGQgPT4gZC54IClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZCA9PiBkLnkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIGQgPT4gZC5yIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImJ1YmJsZVwiKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucm9vdC5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm1hdHRlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubG9jYWxlVGltZUZvcm1hdCA9IGQzLnRpbWVGb3JtYXRMb2NhbGUoe1xyXG4gICAgICAgICAgICBcImRhdGVUaW1lXCIgOiBcIiVhICViICVlICVYICVZXCIsXHJcbiAgICAgICAgICAgIFwiZGF0ZVwiIDogXCIlZC8lbS8lWVwiLFxyXG4gICAgICAgICAgICBcInRpbWVcIiA6IFwiJUggOiAlTSA6ICVTXCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kc1wiIDogW1wiQU1cIiwgXCJQTVwiXSxcclxuICAgICAgICAgICAgXCJkYXlzXCIgOiBbXCJEb21pbmdvXCIsIFwiU2VndW5kYS1mZWlyYVwiLCBcIlRlcsOnYS1mZWlyYVwiLCBcIlF1YXJ0YS1mZWlyYVwiLCBcIlF1aW50YS1mZWlyYVwiLCBcIlNleHRhLWZlaXJhXCIsIFwiU8OhYmFkb1wiXSxcclxuICAgICAgICAgICAgXCJzaG9ydERheXNcIiA6IFtcIkRvbVwiLCBcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNhYlwiXSxcclxuICAgICAgICAgICAgXCJtb250aHNcIiA6IFtcIkphbmVpcm9cIiwgXCJGZXZlcmVpcm9cIiwgXCJNYXLDp29cIiwgXCJBYnJpbFwiLCBcIk1haW9cIiwgXCJKdW5ob1wiLCBcIkp1bGhvXCIsIFwiQWdvc3RvXCIsIFwiU2V0ZW1icm9cIiwgXCJPdXR1YnJvXCIsIFwiTm92ZW1icm9cIiwgXCJEZXplbWJyb1wiIF0sXHJcbiAgICAgICAgICAgIFwic2hvcnRNb250aHNcIjogW1wiSmFuXCIsIFwiRmV2XCIsIFwiTWFyXCIsIFwiQWJyXCIsIFwiTWFpb1wiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkFnb1wiLCBcIlNldFwiLCBcIk91dFwiLCBcIk5vdlwiLCBcIkRlelwiXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubXlGb3JtYXQgPSBkMy5mb3JtYXRMb2NhbGUoe1xyXG4gICAgICAgICAgICBcImRlY2ltYWxcIjogXCIsXCIsXHJcbiAgICAgICAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiLFxyXG4gICAgICAgICAgICBcImdyb3VwaW5nXCI6IFszXSxcclxuICAgICAgICAgICAgXCJjdXJyZW5jeVwiOiBbXCJSJFwiLCBcIlwiXSxcclxuICAgICAgICAgICAgXCJkYXRlVGltZVwiOiBcIiVhICViICVlICVYICVZXCIsXHJcbiAgICAgICAgICAgIFwiZGF0ZVwiOiBcIiVtLyVkLyVZXCIsXHJcbiAgICAgICAgICAgIFwidGltZVwiOiBcIiVIOiVNOiVTXCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kc1wiOiBbXCJBTVwiLCBcIlBNXCJdLFxyXG4gICAgICAgICAgICBcImRheXNcIiA6IFtcIkRvbWluZ29cIiwgXCJTZWd1bmRhLWZlaXJhXCIsIFwiVGVyw6dhLWZlaXJhXCIsIFwiUXVhcnRhLWZlaXJhXCIsIFwiUXVpbnRhLWZlaXJhXCIsIFwiU2V4dGEtZmVpcmFcIiwgXCJTw6FiYWRvXCJdLFxyXG4gICAgICAgICAgICBcInNob3J0RGF5c1wiIDogW1wiRG9tXCIsIFwiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU2FiXCJdLFxyXG4gICAgICAgICAgICBcIm1vbnRoc1wiIDogW1wiSmFuZWlyb1wiLCBcIkZldmVyZWlyb1wiLCBcIk1hcsOnb1wiLCBcIkFicmlsXCIsIFwiTWFpb1wiLCBcIkp1bmhvXCIsIFwiSnVsaG9cIiwgXCJBZ29zdG9cIiwgXCJTZXRlbWJyb1wiLCBcIk91dHVicm9cIiwgXCJOb3ZlbWJyb1wiLCBcIkRlemVtYnJvXCIgXSxcclxuICAgICAgICAgICAgXCJzaG9ydE1vbnRoc1wiOiBbXCJKYW5cIiwgXCJGZXZcIiwgXCJNYXJcIiwgXCJBYnJcIiwgXCJNYWlvXCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQWdvXCIsIFwiU2V0XCIsIFwiT3V0XCIsIFwiTm92XCIsIFwiRGV6XCJdXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLmZvcm1hdE1pbGxpc2Vjb25kID0gbG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIuJUxcIik7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdFNlY29uZCA9IGxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiOiVTXCIpO1xyXG4gICAgICAgICAgdGhpcy5mb3JtYXRNaW51dGUgPSBsb2NhbGVUaW1lRm9ybWF0LmZvcm1hdChcIiVJOiVNXCIpO1xyXG4gICAgICAgICAgdGhpcy5mb3JtYXRIb3VyID0gbG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIlSSAlcFwiKTtcclxuICAgICAgICAgIHRoaXMuZm9ybWF0RGF5ID0gbG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIlYSAlZFwiKTtcclxuICAgICAgICAgIHRoaXMuZm9ybWF0V2VlayA9IGxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJWIgJWRcIik7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdE1vbnRoID0gbG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIlQlwiKTtcclxuICAgICAgICAgIHRoaXMuZm9ybWF0WWVhciA9IGxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJVlcIik7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlGb3JtYXQoZGF0ZSl7XHJcbiAgICAgICAgcmV0dXJuIChkMy50aW1lU2Vjb25kKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdE1pbGxpc2Vjb25kXHJcbiAgICAgICAgOiBkMy50aW1lTWludXRlKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFNlY29uZFxyXG4gICAgICAgIDogZDMudGltZUhvdXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0TWludXRlXHJcbiAgICAgICAgOiBkMy50aW1lRGF5KGRhdGUpIDwgZGF0ZSA/IGZvcm1hdEhvdXJcclxuICAgICAgICA6IGQzLnRpbWVNb250aChkYXRlKSA8IGRhdGUgPyAoZDMudGltZVdlZWsoZGF0ZSkgPCBkYXRlID8gZm9ybWF0RGF5IDogZm9ybWF0V2VlaylcclxuICAgICAgICA6IGQzLnRpbWVZZWFyKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdE1vbnRoXHJcbiAgICAgICAgOiBmb3JtYXRZZWFyKShkYXRlKTtcclxuICAgIH0gICAgXHJcbn0iLCJpbXBvcnQgZm9ybWF0dGVyIGZyb20gXCIuL2Zvcm1hdHRlci5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJQbG90IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciA9IFwiXCIpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2RhdGFfID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgdGhpcy5tYXJnaW47XHJcblxyXG4gICAgICAgIHRoaXMuY2hhcnRHcm91cDtcclxuICAgICAgICB0aGlzLmNpcmNsZUdyb3VwO1xyXG4gICAgICAgIHRoaXMuc3ZnO1xyXG5cclxuICAgICAgICB0aGlzLnhTY2FsZTtcclxuICAgICAgICB0aGlzLnlTY2FsZTtcclxuICAgICAgICB0aGlzLmNvbG9yU2NhbGU7XHJcbiAgICAgICAgdGhpcy5yYWRpdXNTY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbjtcclxuXHJcbiAgICAgICAgdGhpcy54QXhpcztcclxuICAgICAgICB0aGlzLnlBeGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRPcGFjaXR5Q2lyY2xlID0gMC41O1xyXG4gICAgfVxyXG5cclxuICAgIHgoZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbJ2R0RWRpdGFsJ107XHJcbiAgICB9XHJcblxyXG4gICAgeShkKXtcclxuICAgICAgICByZXR1cm4gZFtcInZsTGljaXRhY2FvXCJdIDtcclxuICAgIH1cclxuXHJcbiAgICBjb2xvcihkKXtcclxuICAgICAgICByZXR1cm4gZFsnZHNNb2RhbGlkYWRlTGljaXRhY2FvJ107XHJcbiAgICB9XHJcblxyXG4gICAgcihkKXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxuXHJcbiAgICBrZXkoZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbXCJpZExpY2l0YWNhb1wiXTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKF9kYXRhKXtcclxuICAgICAgICBpZighX2RhdGEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhXyA9IF9kYXRhLm1hcCh0aGlzLmNvbnZlcnREYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IF9kYXRhLmZpbHRlcigoaXRlbSwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSA9PT0gaW5kZXg7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdkYXRhIHNldHVwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuaW5pdE1hcmdpbigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNWR0VsZW1lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0TWFyZ2luKCl7XHJcbiAgICAgICAgdGhpcy5tYXJnaW4gPSB7dG9wOiAyMCwgcmlnaHQ6IDIwLCBib3R0b206IDYwLCBsZWZ0OiA2MH07XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDcwMCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0U1ZHRWxlbWVudHMoKXtcclxuICAgICAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdChcIiNjaGFydFwiKS5hcHBlbmQoXCJzdmdcIikuYXR0cihcIndpZHRoXCIsICh0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KSkuYXR0cihcImhlaWdodFwiLCh0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSkpO1xyXG4gICAgICAgIHRoaXMuY2hhcnRHcm91cCA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwiZ3JvdXAtY2hhcnRcIikuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitbdGhpcy5tYXJnaW4ubGVmdCx0aGlzLm1hcmdpbi50b3BdK1wiKVwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNsaXAgPSB0aGlzLnN2Zy5hcHBlbmQoXCJkZWZzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJzdmc6Y2xpcFBhdGhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJpZFwiLFwiY2xpcFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnOnJlY3RcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLndpZHRoKzEwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmhlaWdodCsxMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsLTUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLC01KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNpcmNsZUdyb3VwID0gdGhpcy5jaGFydEdyb3VwLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGlwLXBhdGhcIiwgXCJ1cmwoI2NsaXApXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImNsaXAtcGF0aFwiLCBcInVybCgjY2xpcClcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwiY2lyY2xlR3JvdXBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNjYWxlKCl7XHJcbiAgICAgICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZUxvZygpLnJhbmdlKFt0aGlzLmhlaWdodCwwXSk7XHJcbiAgICAgICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZVRpbWUoKS5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZSA9IGQzLnNjYWxlT3JkaW5hbCgpLnJhbmdlKFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXSk7XHJcblxyXG4gICAgICAgIHRoaXMucmFkaXVzU2NhbGUgPSBmdW5jdGlvbihkKXsgcmV0dXJuIDQ7IH07XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdygpe1xyXG4gICAgICAgIGlmKCF0aGlzLmRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgaXMgbm90IGRlZmluZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGV4dGVudCA9IGQzLmV4dGVudCh0aGlzLl9kYXRhXywgZCA9PiB0aGlzLngoZCkgKTtcclxuICAgICAgICBsZXQgbmV3WWVhciA9ICBkMy50aW1lWWVhcihleHRlbnRbMF0pOyBcclxuICAgICAgICB0aGlzLnhEb21haW4gPSBbXTtcclxuICAgICAgICB0aGlzLnhEb21haW5bMF0gPSBuZXdZZWFyO1xyXG4gICAgICAgIHRoaXMueERvbWFpblsxXSA9IGQzLnRpbWVZZWFyLm9mZnNldChuZXdZZWFyKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMueFNjYWxlLmRvbWFpbih0aGlzLnhEb21haW4pO1xyXG5cclxuICAgICAgICB0aGlzLnlEb21haW4gPSBbMC4wMSwgZDMubWF4KHRoaXMuX2RhdGFfLCBkPT4gdGhpcy55KGQpICldO1xyXG4gICAgICAgIHRoaXMueVNjYWxlLmRvbWFpbih0aGlzLnlEb21haW4pO1xyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZS5kb21haW4odGhpcy5jb2xvckRvbWFpbik7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd01hcmtzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd01hcmtzKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YSBpcyBub3QgZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ1YmJsZXMgPSB0aGlzLmNpcmNsZUdyb3VwLnNlbGVjdEFsbChcIi5idWJibGVzXCIpLmRhdGEodGhpcy5fZGF0YV8sIGQgPT4gdGhpcy5rZXkoZCkgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVUERBVEVcclxuICAgICAgICBidWJibGVzLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgLmVhc2UoZDMuZWFzZVNpbkluT3V0KVxyXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZCA9PiB4U2NhbGUoeChkKSkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBkID0+IHlTY2FsZSh5KGQpKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vRU5URVJcclxuICAgICAgICBidWJibGVzLmVudGVyKClcclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZCA9PiAoXCJidWJibGVzIFwiK3RoaXMubWFwQ29kZVRvTGV0dGVyKHRoaXMua2V5KGQpKSApKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBkID0+IHRoaXMueFNjYWxlKHRoaXMueChkKSkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCB0aGlzLmhlaWdodCApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMCApXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvclNjYWxlKHRoaXMuY29sb3IoZCkpKVxyXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZCA9PiB0aGlzLnhTY2FsZSh0aGlzLngoZCkpIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZCA9PiB0aGlzLnlTY2FsZSh0aGlzLnkoZCkpIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCAgZCA9PiB0aGlzLnJhZGl1c1NjYWxlKHRoaXMucihkKSkgKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBkID0+IHRoaXMuY29sb3JTY2FsZSh0aGlzLmNvbG9yKGQpKSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgdGhpcy5kZWZhdWx0T3BhY2l0eUNpcmNsZSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEVYSVRcclxuICAgICAgICBidWJibGVzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0hFTFBFUlMgRlVOQ1RJT05TXHJcbiAgICBjb252ZXJ0RGF0ZShkKXtcclxuICAgICAgICBkW1wiZHRFZGl0YWxcIl0gPSBuZXcgRGF0ZShkW1wiZHRFZGl0YWxcIl0pXHJcbiAgICAgICAgZFtcImR0QWJlcnR1cmFcIl0gPSBuZXcgRGF0ZShkW1wiZHRBYmVydHVyYVwiXSlcclxuICAgIFxyXG4gICAgICAgIHJldHVybiBkO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcENvZGVUb0xldHRlcihjb2RpZ28pe1xyXG4gICAgICAgIGNvbnN0IGxldHRlciA9IFsnQScsJ0InLCdDJywnRCcsJ0UnLCdGJywnRycsJ0gnLCdJJywnSiddO1xyXG4gICAgICAgIGxldCBudW1iZXJcclxuICAgICAgICBsZXQgd29yZCA9ICcnO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjb2RpZ28ubGVuZ3RoOyBpKyspIHdvcmQgKz0gbGV0dGVyWytjb2RpZ29baV1dXHJcbiAgICAgICAgcmV0dXJuIHdvcmQ7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlbWFwIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMucm9vdDtcclxuICAgICAgICB0aGlzLnRyZWVtYXBMYXlvdXQ7XHJcbiAgICAgICAgdGhpcy5zdmc7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZTtcclxuICAgICAgICB0aGlzLmNvbG9yU2NoZW1hID0gW1wiIzJlY2M3MVwiLCBcIiMyOTgwYjlcIiwgXCIjOGU0NGFkXCIsIFwiI2YxYzQwZlwiLCBcIiNlNjdlMjJcIiwgXCIjZTc0YzNjXCJdO1xyXG4gICAgICAgIHRoaXMua2V5c1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEoZGF0YSl7XHJcbiAgICAgICAgdGhpcy5fZGF0YS5rZXkgPSBcInRvdGFsXCJcclxuICAgICAgICB0aGlzLl9kYXRhLnZhbHVlcyA9IGQzLm5lc3QoKS5rZXkoIGQgPT4gZFtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXSkuZW50cmllcyhkYXRhKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBkMy5oaWVyYXJjaHkodGhpcy5fZGF0YSwgZCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnZhbHVlcztcclxuICAgICAgICB9KS5zdW0oIGQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZFtcInZsTGljaXRhY2FvXCJdO1xyXG4gICAgICAgIH0pLnNvcnQoZnVuY3Rpb24oYSwgYikgeyBcclxuICAgICAgICAgICAgcmV0dXJuIGJbJ2RhdGEnXVtcInZsTGljaXRhY2FvXCJdIC0gYVsnZGF0YSddW1widmxMaWNpdGFjYW9cIl0gfHwgYVsnZGF0YSddW1widmxMaWNpdGFjYW9cIl0gLSBiWydkYXRhJ11bXCJ2bExpY2l0YWNhb1wiXSA7IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YVwiLHRoaXMuX2RhdGEudmFsdWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5rZXlzID0gdGhpcy5fZGF0YS52YWx1ZXMubWFwKCBkID0+IGQua2V5ICk7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlID0gZDMuc2NhbGVPcmRpbmFsKCkucmFuZ2UodGhpcy5jb2xvclNjaGVtYSkuZG9tYWluKHRoaXMua2V5cyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudHJlZW1hcExheW91dCA9IGQzLnRyZWVtYXAoKS5zaXplKFs4NTAsIDUwMF0pLnBhZGRpbmdPdXRlcig1KS50aWxlKGQzLnRyZWVtYXBCaW5hcnkpO1xyXG4gICAgICAgIHRoaXMudHJlZW1hcExheW91dCh0aGlzLnJvb3QpO1xyXG5cclxuICAgICAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdChcIiNjaGFydFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAoODUwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwoNTAwKSlcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZ3JvdXAtY2hhcnRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdygpe1xyXG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5kYXRhKHRoaXMucm9vdC5sZWF2ZXMoKSlcclxuICAgICAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGQgPT4gZC54MCApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZCA9PiBkLnkwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBkID0+IChkLngxIC0gZC54MCkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiAoZC55MSAtIGQueTApIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcInRyZWUtbGF5b3V0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgZCA9PiB0aGlzLmNvbG9yU2NhbGUoZC5kYXRhW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdKSApXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb290IFwiLHRoaXMucm9vdC5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU2NhdHRlclBsb3QgZnJvbSBcIi4vY2hhcnQvc2NhdHRlcnBsb3QuanNcIlxyXG5pbXBvcnQgQnViYmxlUGFjayBmcm9tIFwiLi9jaGFydC9idWJibGVwYWNrLmpzXCJcclxuaW1wb3J0IFRyZWVtYXAgZnJvbSBcIi4vY2hhcnQvdHJlZW1hcC5qc1wiXHJcbmltcG9ydCBCdWJibGVmb3JjZSBmcm9tIFwiLi9jaGFydC9idWJibGVmb3JjZS5qc1wiXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IGdyYWZpY28gPSBuZXcgQnViYmxlZm9yY2UoKTtcclxuXHJcbiAgICBkMy5qc29uKFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpY2l0YWNvZXMvNDEyNDEwLzIwMTVcIiwgc3RhcnQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHN0YXJ0KGVyciwgcmVjZWl2ZWQpIHtcclxuICAgICAgICBpZighcmVjZWl2ZWQuZGF0YSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JhZmljby5kYXRhKHJlY2VpdmVkLmRhdGEpO1xyXG4gICAgICAgIGdyYWZpY28uaW5pdCgpO1xyXG4gICAgICAgIGdyYWZpY28uZHJhdygpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIl19
