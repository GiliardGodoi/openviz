(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BarChartModalidadeAoLongoAno = function () {
    function BarChartModalidadeAoLongoAno() {
        _classCallCheck(this, BarChartModalidadeAoLongoAno);

        this._data_ = null;
        this._meses_ = ['jan', 'fev', 'mar', 'abr', 'maio', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];

        this.width = 900;
        this.height = 600;
        this.miniHeight = null;
        this.miniWidth = null;
        this.padding = 2;

        this.svg = null;

        this.xDomain = null;
        this.yDomain = null;

        this.colorScale = null;
        this.yScale = null;
        this.xScale = null;
    }

    _createClass(BarChartModalidadeAoLongoAno, [{
        key: '_defineMiniChartSize',
        value: function _defineMiniChartSize() {
            this.miniWidth = Math.min(Math.floor(this.width / 4), 200);
            this.miniHeight = Math.min(Math.floor(this.height / 3), 160);
        }
    }, {
        key: '_y',
        value: function _y(v) {
            return (v.value.quantidade % 2 ? 50 : 25) + 15;
        }
    }, {
        key: '_x',
        value: function _x(v) {
            return 0;
        }
    }, {
        key: 'data',
        value: function data(_data) {
            this._modalidades_ = d3.set(_data, function (d) {
                return d['dsModalidadeLicitacao'];
            }).values();
            this._data_ = d3.nest().key(function (d) {
                var day = new Date(d.dtEdital);
                return day.getMonth();
                // return this._meses_[day.getMonth()];
            }).sortKeys(function (a, b) {
                return Number(a) - Number(b);
            }) //d3.ascending
            .key(function (d) {
                return d["dsModalidadeLicitacao"];
            }).rollup(function (values) {
                return {
                    "quantidade": values.length,
                    "totalLicitado": d3.sum(values, function (d) {
                        return d['vlLicitacao'];
                    }),
                    "totalAdquirido": d3.sum(values, function (d) {
                        return d["vlTotalAdquiridoLicitacao"];
                    })
                };
            }).entries(_data);
            console.log(this._data_);
            console.log(this._modalidades_);
        }
    }, {
        key: 'init',
        value: function init() {
            this.svg = d3.select("#chart").append("svg").attr("width", this.width).attr("height", this.height).append("g").attr("class", "group-chart");
            this.colorScale = d3.scaleOrdinal().domain(this._modalidades_).range(this.colorSchema);
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this = this;
            var innerWidth = Math.min(Math.floor(this.width / 4), 200);
            var innerHeight = Math.min(Math.floor(this.height / 3), 160);
            this.svg.selectAll("g").data(this._data_).enter().append("g").attr("class", "mini-chart").each(function (d, i) {
                var x = i % 4;
                var y = (i - x) % 3;
                var mini = d3.select(this);
                mini.attr("transform", "translate(" + [innerWidth * x, innerHeight * y] + ")");
                mini.append("rect").attr("width", innerWidth).attr("height", innerHeight).attr("fill", (x + y) % 2 ? "yellow" : "steelblue");
                // mini.selectAll("rect")
                //     .data(d.values, v => v.key )
                //     .enter()
                //     .append("rect")
                //     .attr("x", (v, i) => 31 * i )
                //     .attr("y", (v, i) => {
                //         return innerHeight - _this._y(v);
                //     })
                //     .attr("width", 30 )
                //     .attr("height", v => _this._y(v) )
                //     .attr("fill", v => _this.colorScale(v.key));
                // console.log(`(x: ${x}, y: ${y})`);
                console.log(d);
            });
        }
    }]);

    return BarChartModalidadeAoLongoAno;
}();

exports.default = BarChartModalidadeAoLongoAno;

},{}],2:[function(require,module,exports){
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

        this._data_;
        this.keys;

        this.xScale;
        this.yScale;
        this.colorScale;
        this.radiusScale;

        this.rDomain;

        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
    }

    _createClass(BubbleForce, [{
        key: "key",
        value: function key(d) {
            return d["dsModalidadeLicitacao"];
        }
    }, {
        key: "radius",
        value: function radius(d) {
            return d["vlLicitacao"];
        }
    }, {
        key: "x",
        value: function x(d) {
            return d["dsModalidadeLicitacao"];
        }
    }, {
        key: "data",
        value: function data(_data) {
            this._data_ = _data;
            this.keys = this._data_.map(function (d) {
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
            this.simulation = d3.forceSimulation(this._data_).force("collision", d3.forceCollide().radius(function (d) {
                return _this2.radiusScale(d["vlLicitacao"]) + 0.5;
            })).force("x", d3.forceX(this.width).x(function (d) {
                return _this2.xScale(d["dsModalidadeLicitacao"]);
            }).strength(1)).force("y", d3.forceY(this.height).y(function (d) {
                return _this.height / 2;
            }).strength(0.075)).on("tick", function () {
                var u = _this.svg.selectAll("circle").data(_this2._data_);
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formatter = require("./formatter.js");

var _formatter2 = _interopRequireDefault(_formatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BubblePack = function () {
    function BubblePack() {
        _classCallCheck(this, BubblePack);

        this._data = {};
        this.root;
        this.nodes;

        this.focus;
        this.view;

        this.margin = 0;
        this.width = 500;
        this.height = 500;
        this.diameter;

        this.packLayout;
        this.svg;
        this.groupChart;
        this.circles;
        this.drawedNodes;

        this.colorDomain;
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this.colorScale;

        //legend
        this.svgLegend;
        this.ordinalLegend;

        //format number
        this.format = new _formatter2.default().getFormater("$,.2f");
    }

    _createClass(BubblePack, [{
        key: "_color",
        value: function _color(d) {
            return d["dsModalidadeLicitacao"];
        }
    }, {
        key: "_size",
        value: function _size(d) {
            return d["vlModalidadeLicitacao"];
        }
    }, {
        key: "_key",
        value: function _key(d) {
            return d["dsModalidadeLicitacao"];
        }
    }, {
        key: "data",
        value: function data(_data) {
            var _this2 = this;

            this._data.key = "total";
            this._data.values = d3.nest().key(function (d) {
                return _this2._key(d);
            }).entries(_data);

            this.root = d3.hierarchy(this._data, function (d) {
                return d.values;
            }).sum(function (d) {
                return d["vlLicitacao"];
            }).sort(function (a, b) {
                return b["dsModalidadeLicitacao"] - a["dsModalidadeLicitacao"];
            }).sort(function (a, b) {
                return b["vlLicitacao"] - a["vlLicitacao"];
            });

            this.colorDomain = _data.map(function (d) {
                return d["dsModalidadeLicitacao"];
            }).filter(function (item, pos, array) {
                return array.indexOf(item) == pos;
            });

            console.log("data ::>> ", this._data);
            console.log("root ::>> ", this.root);
        }
    }, {
        key: "init",
        value: function init() {
            this.svg = d3.select("#chart").append("svg").attr("width", this.width + this.margin).attr("height", this.height + this.margin);
            this.groupChart = this.svg.append("g").attr("class", "group-chart").attr("transform", "translate(" + [this.width / 2, this.width / 2] + ")");

            this.diameter = this.width;

            this.packLayout = d3.pack().size([this.width + this.margin, this.height + this.margin]).padding(1);

            this.packLayout(this.root);

            this.nodes = this.root.descendants();
            this.focus = this.root;

            this.colorScale = d3.scaleOrdinal().range(this.colorSchema).domain(this.colorDomain);

            this.initLegend();
        }
    }, {
        key: "initLegend",
        value: function initLegend() {
            this.ordinalLegend = d3.legendColor().shape("circle").title("Legenda - Modalidades Licitação").scale(this.colorScale);
        }
    }, {
        key: "draw",
        value: function draw() {
            var _this3 = this;

            var _this = this;
            this.circles = this.groupChart.selectAll("circle").data(this.nodes).enter().append("circle").attr("class", function (d) {
                return d.parent ? d.children ? " bubble bubble-middle" : "bubble bubble-leaf" : "bubble bubble-root";
            }).attr("fill", function (d) {
                return d.children ? null : _this3.colorScale(_this3._color(d.data));
            }).on("click", function (d) {
                if (d.height == 0) {
                    if (_this3.focus !== d.parent) {
                        _this3.zoom(d.parent);
                        d3.event.stopPropagation();
                        _this3.showInfo(d.parent);
                    }
                } else if (_this3.focus !== d) {
                    _this3.zoom(d);
                    d3.event.stopPropagation();
                    _this3.showInfo(d);
                }
                // console.log(d);
            });

            this.svg.style("background", "white").on("click", function () {
                _this.zoom(_this.root);
                _this.removeInfo();
                // console.log(_this.root);
            });

            this.drawedNodes = this.svg.selectAll("circle");

            this.zoomTo([this.root.x, this.root.y, this.root.r * 2]); // [ posicao.X , posicao.Y, posicao.RAIO * 2 OU diameter ]

            this.svgLegend = d3.select("#legend-display").append("svg").attr("height", 200).append("g").attr("class", "lengenda").attr("transform", "translate(20,20)").call(this.ordinalLegend);
        }
    }, {
        key: "zoom",
        value: function zoom(d) {
            var _this4 = this;

            this.focus = d;
            var _this = this;
            var transition = d3.transition().duration(750).tween("zoom", function (d) {
                var i = d3.interpolateZoom(_this4.view, [_this4.focus.x, _this4.focus.y, _this4.focus.r * 2]);
                return function (t) {
                    // t pode ser um parâmetro que representa tempo de 0 segundos até 1 segundo
                    return _this.zoomTo(i(t));
                };
            });
        }
    }, {
        key: "zoomTo",
        value: function zoomTo(v) {
            var k = this.diameter / v[2];
            this.view = v;
            // this.drawedNodes.attr("transform", d => {
            this.circles.attr("transform", function (d) {
                return "translate(" + [(d.x - v[0]) * k, (d.y - v[1]) * k] + ")";
            }).attr("r", function (d) {
                return d.r * k;
            });
        }
    }, {
        key: "showInfo",
        value: function showInfo(d) {
            // console.log(d);
            // console.log(this.format(d.value));
            var modalidade = d.data.key ? d.data.key : null;
            var quantidade = d.data.values.length ? d.data.values.length : "";
            var valor = d.value ? this.format(d.value) : "";
            // let t = d3.transition().duration(500); // .transition(t)
            var card = d3.select("#card-display").style("display", "none");

            card = card.append("div").attr("class", "card info-card");
            card.append("div").attr("class", "card-header").style("background-color", this.colorScale(modalidade));

            var body = card.append("div").attr("class", "card-body");
            body.append("p").text("Modalidade: " + modalidade);
            body.append("p").text("Quantidade: " + quantidade);
            body.append("p").text("Total Licitado: " + valor);

            $("#card-display").fadeIn("slow");
        }
    }, {
        key: "removeInfo",
        value: function removeInfo() {
            console.log("removing info card");
            $("#card-display").fadeOut();
            setTimeout(function () {
                return d3.selectAll(".info-card").remove();
            }, 500);
        }
    }]);

    return BubblePack;
}();

exports.default = BubblePack;

},{"./formatter.js":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClusterForce = function () {
    function ClusterForce() {
        _classCallCheck(this, ClusterForce);

        this._data_;

        this.width = 850;
        this.height = 500;
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.clusterPadding = 5;
        this.circlesPadding = 1;
        this.maxRadius = 50;

        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this.svg;
    }

    _createClass(ClusterForce, [{
        key: "data",
        value: function data(_data) {
            this._data_ = _data;
        }
    }, {
        key: "init",
        value: function init() {
            this.svg = d3.select("#chart").append("svg").attr("width", this.width).attr("height", this.height).append("g").attr("class", "group-chart");
        }
    }, {
        key: "draw",
        value: function draw() {}
        // https://bl.ocks.org/shancarter/f621ac5d93498aa1223d8d20e5d3a0f4

    }]);

    return ClusterForce;
}();

exports.default = ClusterForce;

},{}],5:[function(require,module,exports){
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

        this.localeFormat = d3.formatLocale({
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

        this.formatMillisecond = this.localeTimeFormat.format(".%L");
        this.formatSecond = this.localeTimeFormat.format(":%S");
        this.formatMinute = this.localeTimeFormat.format("%I:%M");
        this.formatHour = this.localeTimeFormat.format("%I %p");
        this.formatDay = this.localeTimeFormat.format("%a %d");
        this.formatWeek = this.localeTimeFormat.format("%b %d");
        this.formatMonth = this.localeTimeFormat.format("%B");
        this.formatYear = this.localeTimeFormat.format("%Y");
    }

    _createClass(Formatter, [{
        key: "multiFormat",
        value: function multiFormat(date) {
            var _this = this;
            return (d3.timeSecond(date) < date ? _this.formatMillisecond : d3.timeMinute(date) < date ? _this.formatSecond : d3.timeHour(date) < date ? _this.formatMinute : d3.timeDay(date) < date ? _this.formatHour : d3.timeMonth(date) < date ? d3.timeWeek(date) < date ? _this.formatDay : _this.formatWeek : d3.timeYear(date) < date ? _this.formatMonth : _this.formatYear)(date);
        }
    }, {
        key: "getFormater",
        value: function getFormater(spec) {
            return this.localeFormat.format(spec);
        }
    }, {
        key: "getTimeFormat",
        value: function getTimeFormat() {
            var _this = this;
            return function muiltiTimeFormat(date) {
                return (d3.timeSecond(date) < date ? _this.formatMillisecond : d3.timeMinute(date) < date ? _this.formatSecond : d3.timeHour(date) < date ? _this.formatMinute : d3.timeDay(date) < date ? _this.formatHour : d3.timeMonth(date) < date ? d3.timeWeek(date) < date ? _this.formatDay : _this.formatWeek : d3.timeYear(date) < date ? _this.formatMonth : _this.formatYear)(date);
            };
        }
    }]);

    return Formatter;
}();

exports.default = Formatter;

},{}],6:[function(require,module,exports){
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

        this.colorSchema = ["#1abc9c", "#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#8e44ad"];
        this.colorDomain;
        this.yDomain;
        this.xDomain;

        this.xAxis;
        this.yAxis;
        this.isLogScale = true;

        this.ordinalLegend;
        this.svgLegend;

        this.format = new _formatter2.default();

        this.defaultOpacityCircle = 0.5;
    }

    _createClass(ScatterPlot, [{
        key: "_x_",
        value: function _x_(d) {
            return d['dtEdital'];
        }
    }, {
        key: "_y_",
        value: function _y_(d) {
            return d["vlLicitacao"];
        }
    }, {
        key: "_color_",
        value: function _color_(d) {
            return d['dsModalidadeLicitacao'];
        }
    }, {
        key: "_r_",
        value: function _r_(d) {
            return 4;
        }
    }, {
        key: "_key_",
        value: function _key_(d) {
            return d["idLicitacao"];
        }
    }, {
        key: "data",
        value: function data(_data) {
            if (!_data) {
                return this._data_;
            } else {
                this._data_ = _data.map(this.convertDate);
                this._defineColorDomain();
                this._defineXDomain();
                this._defineYDomain();
            }
        }
    }, {
        key: "_defineYDomain",
        value: function _defineYDomain() {
            var _this = this;

            this.yDomain = [1, d3.max(this._data_, function (d) {
                return _this._y_(d);
            })];
        }
    }, {
        key: "_defineXDomain",
        value: function _defineXDomain() {
            var _this2 = this;

            var extent = d3.extent(this._data_, function (d) {
                return _this2._x_(d);
            });
            var newYear = d3.timeYear(extent[0]);
            this.xDomain = [];
            this.xDomain[0] = newYear;
            this.xDomain[1] = d3.timeYear.offset(newYear);
        }
    }, {
        key: "_defineColorDomain",
        value: function _defineColorDomain() {
            var _this3 = this;

            this.colorDomain = this._data_.map(function (item) {
                return _this3._color_(item);
            }).filter(function (item, index, array) {
                return array.indexOf(item) === index;
            }).sort(function (a, b) {
                return a - b;
            });
        }
    }, {
        key: "init",
        value: function init() {
            this.initMargin();
            this.initSVGElements();
            this.initScale();
            this.initLegend();
        }
    }, {
        key: "initMargin",
        value: function initMargin() {
            this.margin = { top: 20, right: 10, bottom: 60, left: 80 };
            this.width = 750 - this.margin.left - this.margin.right;
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

            this.colorScale = d3.scaleOrdinal().range(this.colorSchema);

            this.radiusScale = function (d) {
                return 4;
            };
        }
    }, {
        key: "initLegend",
        value: function initLegend() {
            this.ordinalLegend = d3.legendColor().shape("circle").title("Legenda - Modalidades Licitação").scale(this.colorScale);
        }
    }, {
        key: "draw",
        value: function draw() {
            if (!this.data) {
                console.log("data is not defined");
                return;
            }

            this.xScale.domain(this.xDomain);
            this.yScale.domain(this.yDomain);
            this.colorScale.domain(this.colorDomain);

            // xAxis
            this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(this.format.getTimeFormat());

            this.chartGroup.append("g").attr("class", "axis axis-x").attr("transform", "translate(" + [0, this.height + 5] + ")").call(this.xAxis);
            // yAxis
            var interpolate = d3.interpolateRound(this.yDomain[0], this.yDomain[1]);
            this.yAxis = d3.axisLeft().scale(this.yScale).ticks(5).tickFormat(this.format.localeFormat.format("$,.2f")); //.tickValues([0,0.01,0.15,0.2,0.75,1].map(i => interpolate(i) ));
            console.log(this.yAxis.tickArguments());
            this.chartGroup.append("g").attr("class", "axis axis-y").attr("transform", "translate(0,0)").call(this.yAxis);

            this.drawMarks();

            this.svgLegend = d3.select("#legend-display").append("svg").attr("height", 200).append("g").attr("class", "lengenda").attr("transform", "translate(20,20)").call(this.ordinalLegend);
        }
    }, {
        key: "drawMarks",
        value: function drawMarks() {
            var _this4 = this;

            if (!this.data) {
                console.log("data is not defined");
                return;
            }

            var bubbles = this.circleGroup.selectAll(".bubbles").data(this._data_, function (d) {
                return _this4._key_(d);
            });

            // UPDATE
            bubbles.transition().ease(d3.easeSinInOut).duration(750).attr("cx", function (d) {
                return xScale(x(d));
            }).attr("cy", function (d) {
                return yScale(y(d));
            });

            //ENTER
            bubbles.enter().append("circle").attr("class", function (d) {
                return "bubbles " + _this4.mapCodeToLetter(_this4._key_(d));
            }).attr("cx", function (d) {
                return _this4.xScale(_this4._x_(d));
            }).attr("cy", this.height).attr("r", 0).style("fill", function (d) {
                return _this4.colorScale(_this4._color_(d));
            }).transition().duration(750).attr("cx", function (d) {
                return _this4.xScale(_this4._x_(d));
            }).attr("cy", function (d) {
                return _this4.yScale(_this4._y_(d));
            }).attr("r", function (d) {
                return _this4.radiusScale(_this4._r_(d));
            }).style("fill", function (d) {
                return _this4.colorScale(_this4._color_(d));
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

},{"./formatter.js":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";

var _scatterplot = require("./chart/scatterplot.js");

var _scatterplot2 = _interopRequireDefault(_scatterplot);

var _bubblepack = require("./chart/bubblepack.js");

var _bubblepack2 = _interopRequireDefault(_bubblepack);

var _treemap = require("./chart/treemap.js");

var _treemap2 = _interopRequireDefault(_treemap);

var _bubbleforce = require("./chart/bubbleforce.js");

var _bubbleforce2 = _interopRequireDefault(_bubbleforce);

var _clusterforce = require("./chart/clusterforce.js");

var _clusterforce2 = _interopRequireDefault(_clusterforce);

var _ModalidadePorAno = require("./chart/ModalidadePorAno.js");

var _ModalidadePorAno2 = _interopRequireDefault(_ModalidadePorAno);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    function start() {
        var grafico = new _ModalidadePorAno2.default();
        d3.json("http://localhost:8080/licitacoes/412410/2016", function (err, received) {
            grafico.data(received.data);
            grafico.init();
            grafico.draw();
        });
    }
    start();
};

},{"./chart/ModalidadePorAno.js":1,"./chart/bubbleforce.js":2,"./chart/bubblepack.js":3,"./chart/clusterforce.js":4,"./chart/scatterplot.js":6,"./chart/treemap.js":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGNoYXJ0XFxNb2RhbGlkYWRlUG9yQW5vLmpzIiwic3JjXFxjaGFydFxcYnViYmxlZm9yY2UuanMiLCJzcmNcXGNoYXJ0XFxidWJibGVwYWNrLmpzIiwic3JjXFxjaGFydFxcY2x1c3RlcmZvcmNlLmpzIiwic3JjXFxjaGFydFxcZm9ybWF0dGVyLmpzIiwic3JjXFxjaGFydFxcc2NhdHRlcnBsb3QuanMiLCJzcmNcXGNoYXJ0XFx0cmVlbWFwLmpzIiwic3JjXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0NxQiw0QjtBQUNqQiw0Q0FBYTtBQUFBOztBQUNULGFBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxhQUFLLE9BQUwsR0FBZSxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixNQUE3QixFQUFxQyxLQUFyQyxFQUE0QyxLQUE1QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxFQUF1RSxLQUF2RSxFQUE4RSxLQUE5RSxDQUFmO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsRUFBa0MsU0FBbEMsRUFBNkMsU0FBN0MsRUFBd0QsU0FBeEQsQ0FBbkI7O0FBRUEsYUFBSyxLQUFMLEdBQWEsR0FBYjtBQUNBLGFBQUssTUFBTCxHQUFjLEdBQWQ7QUFDQSxhQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxhQUFLLE9BQUwsR0FBZSxDQUFmOztBQUVBLGFBQUssR0FBTCxHQUFXLElBQVg7O0FBRUEsYUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBLGFBQUssT0FBTCxHQUFlLElBQWY7O0FBRUEsYUFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGFBQUss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S0FGVCxHQUdTLE1BSFQsQ0FHZ0IsTUFIaEIsRUFJUyxJQUpULENBSWMsR0FKZCxFQUltQjtBQUFBLHVCQUFLLEVBQUUsRUFBUDtBQUFBLGFBSm5CLEVBS1MsSUFMVCxDQUtjLEdBTGQsRUFLbUI7QUFBQSx1QkFBSyxFQUFFLEVBQVA7QUFBQSxhQUxuQixFQU1TLElBTlQsQ0FNYyxPQU5kLEVBTXVCO0FBQUEsdUJBQU0sRUFBRSxFQUFGLEdBQU8sRUFBRSxFQUFmO0FBQUEsYUFOdkIsRUFPUyxJQVBULENBT2MsUUFQZCxFQU93QjtBQUFBLHVCQUFNLEVBQUUsRUFBRixHQUFPLEVBQUUsRUFBZjtBQUFBLGFBUHhCLEVBUVMsSUFSVCxDQVFjLE9BUmQsRUFRc0IsYUFSdEIsRUFTUyxJQVRULENBU2MsTUFUZCxFQVNzQjtBQUFBLHVCQUFLLE1BQUssVUFBTCxDQUFnQixFQUFFLElBQUYsQ0FBTyx1QkFBUCxDQUFoQixDQUFMO0FBQUEsYUFUdEI7QUFVQTtBQUVIOzs7Ozs7a0JBckRnQixPOzs7OztBQ0ZyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE9BQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3RCLGFBQVMsS0FBVCxHQUFnQjtBQUNaLFlBQU0sVUFBVSxnQ0FBaEI7QUFDQSxXQUFHLElBQUgsQ0FBUSw4Q0FBUixFQUF3RCxVQUFVLEdBQVYsRUFBZSxRQUFmLEVBQXlCO0FBQzdFLG9CQUFRLElBQVIsQ0FBYSxTQUFTLElBQXRCO0FBQ0Esb0JBQVEsSUFBUjtBQUNBLG9CQUFRLElBQVI7QUFDSCxTQUpEO0FBS0g7QUFDRDtBQUNILENBVkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhckNoYXJ0TW9kYWxpZGFkZUFvTG9uZ29Bbm8ge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLl9kYXRhXyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbWVzZXNfID0gWydqYW4nLCAnZmV2JywgJ21hcicsICdhYnInLCAnbWFpbycsICdqdW4nLCAnanVsJywgJ2FnbycsICdzZXQnLCAnb3V0Jywnbm92JywgJ2RleiddXHJcbiAgICAgICAgdGhpcy5jb2xvclNjaGVtYSA9IFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDkwMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDYwMDtcclxuICAgICAgICB0aGlzLm1pbmlIZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubWluaVdpZHRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhZGRpbmcgPSAyO1xyXG5cclxuICAgICAgICB0aGlzLnN2ZyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMueERvbWFpbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy55RG9tYWluID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnlTY2FsZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy54U2NhbGUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZWZpbmVNaW5pQ2hhcnRTaXplKCl7XHJcbiAgICAgICAgdGhpcy5taW5pV2lkdGggPSBNYXRoLm1pbihNYXRoLmZsb29yKHRoaXMud2lkdGggLyA0KSwyMDApXHJcbiAgICAgICAgdGhpcy5taW5pSGVpZ2h0ID0gTWF0aC5taW4oTWF0aC5mbG9vcih0aGlzLmhlaWdodCAvIDMgKSwxNjAgKVxyXG4gICAgfVxyXG5cclxuICAgIF95KHYpe1xyXG4gICAgICAgIHJldHVybiAodi52YWx1ZS5xdWFudGlkYWRlICUgMiA/IDUwIDogMjUpICsgMTU7XHJcbiAgICB9XHJcblxyXG4gICAgX3godil7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YShkYXRhKXtcclxuICAgICAgICB0aGlzLl9tb2RhbGlkYWRlc18gPSBkMy5zZXQoZGF0YSwgZCA9PiBkWydkc01vZGFsaWRhZGVMaWNpdGFjYW8nXSkudmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YV8gPSBkMy5uZXN0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmtleSggZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF5ID0gbmV3IERhdGUoZC5kdEVkaXRhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5LmdldE1vbnRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhpcy5fbWVzZXNfW2RheS5nZXRNb250aCgpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnRLZXlzKCAoYSxiKSA9PiBOdW1iZXIoYSkgLSBOdW1iZXIoYikgICkgLy9kMy5hc2NlbmRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmtleSggZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZFtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucm9sbHVwKCB2YWx1ZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aWRhZGVcIiA6IHZhbHVlcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b3RhbExpY2l0YWRvXCIgICA6IGQzLnN1bSh2YWx1ZXMsIGQgPT4gZFsndmxMaWNpdGFjYW8nXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b3RhbEFkcXVpcmlkb1wiICA6IGQzLnN1bSh2YWx1ZXMsIGQgPT4gZFtcInZsVG90YWxBZHF1aXJpZG9MaWNpdGFjYW9cIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRyaWVzKGRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2RhdGFfKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9tb2RhbGlkYWRlc18pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjY2hhcnRcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgKHRoaXMud2lkdGgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCh0aGlzLmhlaWdodCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwLWNoYXJ0XCIpO1xyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZSA9IGQzLnNjYWxlT3JkaW5hbCgpLmRvbWFpbih0aGlzLl9tb2RhbGlkYWRlc18pLnJhbmdlKHRoaXMuY29sb3JTY2hlbWEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGxldCBpbm5lcldpZHRoID0gTWF0aC5taW4oTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gNCksMjAwKVxyXG4gICAgICAgIGxldCBpbm5lckhlaWdodCA9IE1hdGgubWluKE1hdGguZmxvb3IodGhpcy5oZWlnaHQgLyAzICksMTYwIClcclxuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAuZGF0YSh0aGlzLl9kYXRhXylcclxuICAgICAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1pbmktY2hhcnRcIilcclxuICAgICAgICAgICAgICAgIC5lYWNoKCBmdW5jdGlvbihkLCBpKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgeCA9IChpICUgNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSAoaSAtIHgpICUgMztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaSA9IGQzLnNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBtaW5pLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrWyhpbm5lcldpZHRoICogeCksIChpbm5lckhlaWdodCAqIHkpIF0rXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmkuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwid2lkdGhcIiwgaW5uZXJXaWR0aCkuYXR0cihcImhlaWdodFwiLCBpbm5lckhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsICh4K3kpICUgMiA/IFwieWVsbG93XCIgOiBcInN0ZWVsYmx1ZVwiIClcclxuICAgICAgICAgICAgICAgICAgICAvLyBtaW5pLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmRhdGEoZC52YWx1ZXMsIHYgPT4gdi5rZXkgKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAuYXR0cihcInhcIiwgKHYsIGkpID0+IDMxICogaSApXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5hdHRyKFwieVwiLCAodiwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIGlubmVySGVpZ2h0IC0gX3RoaXMuX3kodik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5hdHRyKFwid2lkdGhcIiwgMzAgKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAuYXR0cihcImhlaWdodFwiLCB2ID0+IF90aGlzLl95KHYpIClcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmF0dHIoXCJmaWxsXCIsIHYgPT4gX3RoaXMuY29sb3JTY2FsZSh2LmtleSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAoeDogJHt4fSwgeTogJHt5fSlgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnViYmxlRm9yY2Uge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnNpbXVsYXRpb247XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDg1MDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDUwMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdmc7XHJcblxyXG4gICAgICAgIHRoaXMuX2RhdGFfO1xyXG4gICAgICAgIHRoaXMua2V5cztcclxuXHJcbiAgICAgICAgdGhpcy54U2NhbGU7XHJcbiAgICAgICAgdGhpcy55U2NhbGU7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzU2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuckRvbWFpbjtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclNjaGVtYSA9IFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAga2V5KGQpe1xyXG4gICAgICAgIHJldHVybiBkW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHJhZGl1cyhkKXtcclxuICAgICAgICByZXR1cm4gZFtcInZsTGljaXRhY2FvXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHgoZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl07XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YShkYXRhKXtcclxuICAgICAgICB0aGlzLl9kYXRhXyA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gdGhpcy5fZGF0YV8ubWFwKCBkID0+IGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl0gKVxyXG4gICAgICAgIC5maWx0ZXIoIChpdGVtLCBpbmRleCwgYXJyYXkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgPT0gaW5kZXg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yRG9tYWluID0gZDMuZXh0ZW50KGRhdGEsIGQgPT4gZFtcInZsTGljaXRhY2FvXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5pbml0U2NhbGVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KFwiI2NoYXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgKHRoaXMud2lkdGgpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsKHRoaXMuaGVpZ2h0KSlcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJncm91cC1jaGFydFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitbdGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yXStcIilcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNjYWxlcygpe1xyXG4gICAgICAgIHRoaXMucmFkaXVzU2NhbGUgPSBkMy5zY2FsZVNxcnQoKS5yYW5nZShbMSw1MF0pO1xyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZSA9IGQzLnNjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuY29sb3JTY2hlbWEpO1xyXG4gICAgICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGVCYW5kKCkucmFuZ2UoWzUwLHRoaXMud2lkdGhdKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy5yYWRpdXNTY2FsZS5kb21haW4odGhpcy5yRG9tYWluKTtcclxuICAgICAgICB0aGlzLmNvbG9yU2NhbGUuZG9tYWluKHRoaXMua2V5cyk7XHJcbiAgICAgICAgdGhpcy54U2NhbGUuZG9tYWluKHRoaXMua2V5cyk7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24odGhpcy5fZGF0YV8pXHJcbiAgICAgICAgICAgIC5mb3JjZShcImNvbGxpc2lvblwiLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFkaXVzU2NhbGUoZFtcInZsTGljaXRhY2FvXCJdKSArIDAuNSA7XHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJ4XCIsIGQzLmZvcmNlWCh0aGlzLndpZHRoKS54KCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhTY2FsZShkW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdKTtcclxuICAgICAgICAgICAgfSkuc3RyZW5ndGgoMSkgKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJ5XCIsIGQzLmZvcmNlWSh0aGlzLmhlaWdodCkueSggZCA9PiBfdGhpcy5oZWlnaHQgLyAyICkuc3RyZW5ndGgoMC4wNzUpIClcclxuICAgICAgICAgICAgLm9uKFwidGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdSA9IF90aGlzLnN2Zy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YSh0aGlzLl9kYXRhXyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdS5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJhZGl1c1NjYWxlKGRbXCJ2bExpY2l0YWNhb1wiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubWVyZ2UodSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIGQgPT4gZC54IClcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGQgPT4gZC55IClcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgZCA9PiBfdGhpcy5jb2xvclNjYWxlKGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl0pICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdS5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0gKTtcclxuICAgIH1cclxufSIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSBcIi4vZm9ybWF0dGVyLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWJibGVQYWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMucm9vdDtcclxuICAgICAgICB0aGlzLm5vZGVzO1xyXG5cclxuICAgICAgICB0aGlzLmZvY3VzO1xyXG4gICAgICAgIHRoaXMudmlldztcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW4gPSAwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSA1MDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA1MDA7XHJcbiAgICAgICAgdGhpcy5kaWFtZXRlcjtcclxuXHJcbiAgICAgICAgdGhpcy5wYWNrTGF5b3V0O1xyXG4gICAgICAgIHRoaXMuc3ZnO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBDaGFydDtcclxuICAgICAgICB0aGlzLmNpcmNsZXM7XHJcbiAgICAgICAgdGhpcy5kcmF3ZWROb2RlcztcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbjtcclxuICAgICAgICB0aGlzLmNvbG9yU2NoZW1hID0gW1wiIzJlY2M3MVwiLCBcIiMyOTgwYjlcIiwgXCIjOGU0NGFkXCIsIFwiI2YxYzQwZlwiLCBcIiNlNjdlMjJcIiwgXCIjZTc0YzNjXCJdXHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlO1xyXG5cclxuICAgICAgICAvL2xlZ2VuZFxyXG4gICAgICAgIHRoaXMuc3ZnTGVnZW5kO1xyXG4gICAgICAgIHRoaXMub3JkaW5hbExlZ2VuZDtcclxuXHJcbiAgICAgICAgLy9mb3JtYXQgbnVtYmVyXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBuZXcgRm9ybWF0dGVyKCkuZ2V0Rm9ybWF0ZXIoXCIkLC4yZlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBfY29sb3IoZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl07XHJcbiAgICB9XHJcblxyXG4gICAgX3NpemUoZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbXCJ2bE1vZGFsaWRhZGVMaWNpdGFjYW9cIl07XHJcbiAgICB9XHJcblxyXG4gICAgX2tleShkKXtcclxuICAgICAgICByZXR1cm4gZFtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuX2RhdGEua2V5ID0gXCJ0b3RhbFwiXHJcbiAgICAgICAgdGhpcy5fZGF0YS52YWx1ZXMgPSBkMy5uZXN0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5rZXkoIGQgPT4gdGhpcy5fa2V5KGQpIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRyaWVzKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QgPSBkMy5oaWVyYXJjaHkodGhpcy5fZGF0YSwgZCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnZhbHVlcztcclxuICAgICAgICB9KS5zdW0oIGQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZFtcInZsTGljaXRhY2FvXCJdO1xyXG4gICAgICAgIH0pLnNvcnQoIChhLCBiKSA9PiBiW1wiZHNNb2RhbGlkYWRlTGljaXRhY2FvXCJdIC0gYVtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXSApLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYltcInZsTGljaXRhY2FvXCJdIC0gYVtcInZsTGljaXRhY2FvXCJdOyB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IGRhdGEubWFwKCBkID0+IGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl0gKVxyXG4gICAgICAgIC5maWx0ZXIoIChpdGVtLCBwb3MsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID09IHBvcztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIDo6Pj4gXCIsIHRoaXMuX2RhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicm9vdCA6Oj4+IFwiLCB0aGlzLnJvb3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KFwiI2NoYXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICh0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCh0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luICkpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBDaGFydCA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwLWNoYXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyBbKHRoaXMud2lkdGggLyAyKSwgKHRoaXMud2lkdGggLyAyKV0gK1wiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmRpYW1ldGVyID0gdGhpcy53aWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5wYWNrTGF5b3V0ID0gZDMucGFjaygpLnNpemUoW3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbiwgdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbl0pLnBhZGRpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYWNrTGF5b3V0KHRoaXMucm9vdCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMucm9vdC5kZXNjZW5kYW50cygpO1xyXG4gICAgICAgIHRoaXMuZm9jdXMgPSB0aGlzLnJvb3Q7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZSA9IGQzLnNjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuY29sb3JTY2hlbWEpLmRvbWFpbih0aGlzLmNvbG9yRG9tYWluKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0TGVnZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdExlZ2VuZCgpe1xyXG4gICAgICAgIHRoaXMub3JkaW5hbExlZ2VuZCA9IGQzLmxlZ2VuZENvbG9yKCkuc2hhcGUoXCJjaXJjbGVcIikudGl0bGUoXCJMZWdlbmRhIC0gTW9kYWxpZGFkZXMgTGljaXRhw6fDo29cIikuc2NhbGUodGhpcy5jb2xvclNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlcyA9IHRoaXMuZ3JvdXBDaGFydC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgIC5kYXRhKHRoaXMubm9kZXMpXHJcbiAgICAgICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5wYXJlbnQgPyAoIGQuY2hpbGRyZW4gPyBcIiBidWJibGUgYnViYmxlLW1pZGRsZVwiIDogXCJidWJibGUgYnViYmxlLWxlYWZcIikgOiBcImJ1YmJsZSBidWJibGUtcm9vdFwiO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGQuY2hpbGRyZW4pID8gbnVsbCA6IHRoaXMuY29sb3JTY2FsZSh0aGlzLl9jb2xvcihkLmRhdGEpKSA7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZC5oZWlnaHQgPT0gMCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZvY3VzICE9PSBkLnBhcmVudCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy56b29tKGQucGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SW5mbyhkLnBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih0aGlzLmZvY3VzICE9PSBkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy56b29tKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SW5mbyhkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN2Zy5zdHlsZShcImJhY2tncm91bmRcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy56b29tKF90aGlzLnJvb3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZUluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhfdGhpcy5yb290KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5kcmF3ZWROb2RlcyA9IHRoaXMuc3ZnLnNlbGVjdEFsbChcImNpcmNsZVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnpvb21UbyhbdGhpcy5yb290LngsIHRoaXMucm9vdC55LCB0aGlzLnJvb3QuciAqIDJdKTsgLy8gWyBwb3NpY2FvLlggLCBwb3NpY2FvLlksIHBvc2ljYW8uUkFJTyAqIDIgT1UgZGlhbWV0ZXIgXVxyXG5cclxuICAgICAgICB0aGlzLnN2Z0xlZ2VuZCA9IGQzLnNlbGVjdChcIiNsZWdlbmQtZGlzcGxheVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZW5nZW5kYVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMjAsMjApXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2FsbCh0aGlzLm9yZGluYWxMZWdlbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb20oZCl7XHJcbiAgICAgICAgdGhpcy5mb2N1cyA9IGQ7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0cmFuc2l0aW9uID0gZDMudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbig3NTApXHJcbiAgICAgICAgICAgIC50d2VlbihcInpvb21cIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGQzLmludGVycG9sYXRlWm9vbSh0aGlzLnZpZXcsW3RoaXMuZm9jdXMueCx0aGlzLmZvY3VzLnksIHRoaXMuZm9jdXMuciAqIDJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KXtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0IHBvZGUgc2VyIHVtIHBhcsOibWV0cm8gcXVlIHJlcHJlc2VudGEgdGVtcG8gZGUgMCBzZWd1bmRvcyBhdMOpIDEgc2VndW5kb1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy56b29tVG8oaSh0KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb21Ubyh2KXtcclxuICAgICAgICB2YXIgayA9IHRoaXMuZGlhbWV0ZXIgLyB2WzJdO1xyXG4gICAgICAgIHRoaXMudmlldyA9IHY7XHJcbiAgICAgICAgLy8gdGhpcy5kcmF3ZWROb2Rlcy5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4ge1xyXG4gICAgICAgIHRoaXMuY2lyY2xlcy5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIrWyAoKGQueCAtIHZbMF0pICogayApLCAoKGQueSAtIHZbMV0pICogaykgXStcIilcIjtcclxuICAgICAgICB9KS5hdHRyKFwiclwiLCBkID0+IGQuciAqIGspO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNob3dJbmZvKGQpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZm9ybWF0KGQudmFsdWUpKTtcclxuICAgICAgICBsZXQgbW9kYWxpZGFkZSA9IGQuZGF0YS5rZXkgPyBkLmRhdGEua2V5IDogbnVsbCA7XHJcbiAgICAgICAgbGV0IHF1YW50aWRhZGUgPSBkLmRhdGEudmFsdWVzLmxlbmd0aCA/IGQuZGF0YS52YWx1ZXMubGVuZ3RoIDogXCJcIjtcclxuICAgICAgICBsZXQgdmFsb3IgPSBkLnZhbHVlID8gdGhpcy5mb3JtYXQoZC52YWx1ZSkgOiBcIlwiO1xyXG4gICAgICAgIC8vIGxldCB0ID0gZDMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCk7IC8vIC50cmFuc2l0aW9uKHQpXHJcbiAgICAgICAgbGV0IGNhcmQgPSBkMy5zZWxlY3QoXCIjY2FyZC1kaXNwbGF5XCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIilcclxuICAgICAgICBcclxuICAgICAgICBjYXJkID0gY2FyZC5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIFwiY2FyZCBpbmZvLWNhcmRcIik7XHJcbiAgICAgICAgY2FyZC5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsXCJjYXJkLWhlYWRlclwiKS5zdHlsZShcImJhY2tncm91bmQtY29sb3JcIiwgdGhpcy5jb2xvclNjYWxlKG1vZGFsaWRhZGUpKTtcclxuXHJcbiAgICAgICAgbGV0IGJvZHkgPSBjYXJkLmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJjYXJkLWJvZHlcIik7XHJcbiAgICAgICAgYm9keS5hcHBlbmQoXCJwXCIpLnRleHQoYE1vZGFsaWRhZGU6ICR7bW9kYWxpZGFkZX1gKTtcclxuICAgICAgICBib2R5LmFwcGVuZChcInBcIikudGV4dChgUXVhbnRpZGFkZTogJHtxdWFudGlkYWRlfWApO1xyXG4gICAgICAgIGJvZHkuYXBwZW5kKFwicFwiKS50ZXh0KGBUb3RhbCBMaWNpdGFkbzogJHt2YWxvcn1gKTtcclxuXHJcbiAgICAgICAgJChcIiNjYXJkLWRpc3BsYXlcIikuZmFkZUluKFwic2xvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVJbmZvKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmluZyBpbmZvIGNhcmRcIik7XHJcbiAgICAgICAgJChcIiNjYXJkLWRpc3BsYXlcIikuZmFkZU91dCgpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IGQzLnNlbGVjdEFsbChcIi5pbmZvLWNhcmRcIikucmVtb3ZlKCksIDUwMCApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2x1c3RlckZvcmNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fZGF0YV87XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSA4NTA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA1MDA7XHJcbiAgICAgICAgdGhpcy5tYXJnaW4gPSB7dG9wOiAxMCwgcmlnaHQ6IDEwLCBib3R0b206IDEwLCBsZWZ0OiAxMH07XHJcbiAgICAgICAgdGhpcy5jbHVzdGVyUGFkZGluZyA9IDU7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVzUGFkZGluZyA9IDE7XHJcbiAgICAgICAgdGhpcy5tYXhSYWRpdXMgPSA1MDtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclNjaGVtYSA9IFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXTtcclxuICAgICAgICB0aGlzLnN2ZztcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuX2RhdGFfID0gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjY2hhcnRcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLHRoaXMud2lkdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZ3JvdXAtY2hhcnRcIilcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gaHR0cHM6Ly9ibC5vY2tzLm9yZy9zaGFuY2FydGVyL2Y2MjFhYzVkOTM0OThhYTEyMjNkOGQyMGU1ZDNhMGY0XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm1hdHRlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubG9jYWxlVGltZUZvcm1hdCA9IGQzLnRpbWVGb3JtYXRMb2NhbGUoe1xyXG4gICAgICAgICAgICBcImRhdGVUaW1lXCIgOiBcIiVhICViICVlICVYICVZXCIsXHJcbiAgICAgICAgICAgIFwiZGF0ZVwiIDogXCIlZC8lbS8lWVwiLFxyXG4gICAgICAgICAgICBcInRpbWVcIiA6IFwiJUggOiAlTSA6ICVTXCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kc1wiIDogW1wiQU1cIiwgXCJQTVwiXSxcclxuICAgICAgICAgICAgXCJkYXlzXCIgOiBbXCJEb21pbmdvXCIsIFwiU2VndW5kYS1mZWlyYVwiLCBcIlRlcsOnYS1mZWlyYVwiLCBcIlF1YXJ0YS1mZWlyYVwiLCBcIlF1aW50YS1mZWlyYVwiLCBcIlNleHRhLWZlaXJhXCIsIFwiU8OhYmFkb1wiXSxcclxuICAgICAgICAgICAgXCJzaG9ydERheXNcIiA6IFtcIkRvbVwiLCBcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNhYlwiXSxcclxuICAgICAgICAgICAgXCJtb250aHNcIiA6IFtcIkphbmVpcm9cIiwgXCJGZXZlcmVpcm9cIiwgXCJNYXLDp29cIiwgXCJBYnJpbFwiLCBcIk1haW9cIiwgXCJKdW5ob1wiLCBcIkp1bGhvXCIsIFwiQWdvc3RvXCIsIFwiU2V0ZW1icm9cIiwgXCJPdXR1YnJvXCIsIFwiTm92ZW1icm9cIiwgXCJEZXplbWJyb1wiIF0sXHJcbiAgICAgICAgICAgIFwic2hvcnRNb250aHNcIjogW1wiSmFuXCIsIFwiRmV2XCIsIFwiTWFyXCIsIFwiQWJyXCIsIFwiTWFpb1wiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkFnb1wiLCBcIlNldFwiLCBcIk91dFwiLCBcIk5vdlwiLCBcIkRlelwiXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxvY2FsZUZvcm1hdCA9IGQzLmZvcm1hdExvY2FsZSh7XHJcbiAgICAgICAgICAgIFwiZGVjaW1hbFwiOiBcIixcIixcclxuICAgICAgICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCIsXHJcbiAgICAgICAgICAgIFwiZ3JvdXBpbmdcIjogWzNdLFxyXG4gICAgICAgICAgICBcImN1cnJlbmN5XCI6IFtcIlIkXCIsIFwiXCJdLFxyXG4gICAgICAgICAgICBcImRhdGVUaW1lXCI6IFwiJWEgJWIgJWUgJVggJVlcIixcclxuICAgICAgICAgICAgXCJkYXRlXCI6IFwiJW0vJWQvJVlcIixcclxuICAgICAgICAgICAgXCJ0aW1lXCI6IFwiJUg6JU06JVNcIixcclxuICAgICAgICAgICAgXCJwZXJpb2RzXCI6IFtcIkFNXCIsIFwiUE1cIl0sXHJcbiAgICAgICAgICAgIFwiZGF5c1wiIDogW1wiRG9taW5nb1wiLCBcIlNlZ3VuZGEtZmVpcmFcIiwgXCJUZXLDp2EtZmVpcmFcIiwgXCJRdWFydGEtZmVpcmFcIiwgXCJRdWludGEtZmVpcmFcIiwgXCJTZXh0YS1mZWlyYVwiLCBcIlPDoWJhZG9cIl0sXHJcbiAgICAgICAgICAgIFwic2hvcnREYXlzXCIgOiBbXCJEb21cIiwgXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTYWJcIl0sXHJcbiAgICAgICAgICAgIFwibW9udGhzXCIgOiBbXCJKYW5laXJvXCIsIFwiRmV2ZXJlaXJvXCIsIFwiTWFyw6dvXCIsIFwiQWJyaWxcIiwgXCJNYWlvXCIsIFwiSnVuaG9cIiwgXCJKdWxob1wiLCBcIkFnb3N0b1wiLCBcIlNldGVtYnJvXCIsIFwiT3V0dWJyb1wiLCBcIk5vdmVtYnJvXCIsIFwiRGV6ZW1icm9cIiBdLFxyXG4gICAgICAgICAgICBcInNob3J0TW9udGhzXCI6IFtcIkphblwiLCBcIkZldlwiLCBcIk1hclwiLCBcIkFiclwiLCBcIk1haW9cIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBZ29cIiwgXCJTZXRcIiwgXCJPdXRcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMuZm9ybWF0TWlsbGlzZWNvbmQgPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiLiVMXCIpO1xyXG4gICAgICAgICAgdGhpcy5mb3JtYXRTZWNvbmQgPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiOiVTXCIpO1xyXG4gICAgICAgICAgdGhpcy5mb3JtYXRNaW51dGUgPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJUk6JU1cIik7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdEhvdXIgPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJUkgJXBcIik7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdERheSA9IHRoaXMubG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIlYSAlZFwiKTtcclxuICAgICAgICAgIHRoaXMuZm9ybWF0V2VlayA9IHRoaXMubG9jYWxlVGltZUZvcm1hdC5mb3JtYXQoXCIlYiAlZFwiKTtcclxuICAgICAgICAgIHRoaXMuZm9ybWF0TW9udGggPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJUJcIik7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdFllYXIgPSB0aGlzLmxvY2FsZVRpbWVGb3JtYXQuZm9ybWF0KFwiJVlcIik7XHJcblxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aUZvcm1hdChkYXRlKXtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiAoZDMudGltZVNlY29uZChkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRNaWxsaXNlY29uZFxyXG4gICAgICAgIDogZDMudGltZU1pbnV0ZShkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRTZWNvbmRcclxuICAgICAgICA6IGQzLnRpbWVIb3VyKGRhdGUpIDwgZGF0ZSA/IF90aGlzLmZvcm1hdE1pbnV0ZVxyXG4gICAgICAgIDogZDMudGltZURheShkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRIb3VyXHJcbiAgICAgICAgOiBkMy50aW1lTW9udGgoZGF0ZSkgPCBkYXRlID8gKGQzLnRpbWVXZWVrKGRhdGUpIDwgZGF0ZSA/IF90aGlzLmZvcm1hdERheSA6IF90aGlzLmZvcm1hdFdlZWspXHJcbiAgICAgICAgOiBkMy50aW1lWWVhcihkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRNb250aFxyXG4gICAgICAgIDogX3RoaXMuZm9ybWF0WWVhcikoZGF0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEZvcm1hdGVyKHNwZWMpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZUZvcm1hdC5mb3JtYXQoc3BlYyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGltZUZvcm1hdCgpe1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG11aWx0aVRpbWVGb3JtYXQoZGF0ZSl7XHJcbiAgICAgICAgICAgIHJldHVybiAoZDMudGltZVNlY29uZChkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRNaWxsaXNlY29uZFxyXG4gICAgICAgICAgICA6IGQzLnRpbWVNaW51dGUoZGF0ZSkgPCBkYXRlID8gX3RoaXMuZm9ybWF0U2Vjb25kXHJcbiAgICAgICAgICAgIDogZDMudGltZUhvdXIoZGF0ZSkgPCBkYXRlID8gX3RoaXMuZm9ybWF0TWludXRlXHJcbiAgICAgICAgICAgIDogZDMudGltZURheShkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXRIb3VyXHJcbiAgICAgICAgICAgIDogZDMudGltZU1vbnRoKGRhdGUpIDwgZGF0ZSA/IChkMy50aW1lV2VlayhkYXRlKSA8IGRhdGUgPyBfdGhpcy5mb3JtYXREYXkgOiBfdGhpcy5mb3JtYXRXZWVrKVxyXG4gICAgICAgICAgICA6IGQzLnRpbWVZZWFyKGRhdGUpIDwgZGF0ZSA/IF90aGlzLmZvcm1hdE1vbnRoXHJcbiAgICAgICAgICAgIDogX3RoaXMuZm9ybWF0WWVhcikoZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tIFwiLi9mb3JtYXR0ZXIuanNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2F0dGVyUGxvdCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIgPSBcIlwiKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9kYXRhXyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgIHRoaXMubWFyZ2luO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXJ0R3JvdXA7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVHcm91cDtcclxuICAgICAgICB0aGlzLnN2ZztcclxuXHJcbiAgICAgICAgdGhpcy54U2NhbGU7XHJcbiAgICAgICAgdGhpcy55U2NhbGU7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzU2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3JTY2hlbWEgPSBbXCIjMWFiYzljXCIsIFwiIzJlY2M3MVwiLFwiIzM0OThkYlwiLFwiI2YxYzQwZlwiLFwiI2U3NGMzY1wiLCBcIiM4ZTQ0YWRcIl07XHJcbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbjtcclxuICAgICAgICB0aGlzLnlEb21haW47XHJcbiAgICAgICAgdGhpcy54RG9tYWluO1xyXG5cclxuICAgICAgICB0aGlzLnhBeGlzO1xyXG4gICAgICAgIHRoaXMueUF4aXM7XHJcbiAgICAgICAgdGhpcy5pc0xvZ1NjYWxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5vcmRpbmFsTGVnZW5kO1xyXG4gICAgICAgIHRoaXMuc3ZnTGVnZW5kO1xyXG5cclxuICAgICAgICB0aGlzLmZvcm1hdCA9IG5ldyBGb3JtYXR0ZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZhdWx0T3BhY2l0eUNpcmNsZSA9IDAuNTtcclxuICAgIH1cclxuXHJcbiAgICBfeF8oZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbJ2R0RWRpdGFsJ107XHJcbiAgICB9XHJcblxyXG4gICAgX3lfKGQpe1xyXG4gICAgICAgIHJldHVybiBkW1widmxMaWNpdGFjYW9cIl0gO1xyXG4gICAgfVxyXG5cclxuICAgIF9jb2xvcl8oZCl7XHJcbiAgICAgICAgcmV0dXJuIGRbJ2RzTW9kYWxpZGFkZUxpY2l0YWNhbyddO1xyXG4gICAgfVxyXG5cclxuICAgIF9yXyhkKXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxuXHJcbiAgICBfa2V5XyhkKXtcclxuICAgICAgICByZXR1cm4gZFtcImlkTGljaXRhY2FvXCJdO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZGF0YShkYXRhKXtcclxuICAgICAgICBpZighZGF0YSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhXztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YV8gPSBkYXRhLm1hcCh0aGlzLmNvbnZlcnREYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lQ29sb3JEb21haW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lWERvbWFpbigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVZRG9tYWluKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9kZWZpbmVZRG9tYWluKCl7XHJcbiAgICAgICAgdGhpcy55RG9tYWluID0gWzEsIGQzLm1heCh0aGlzLl9kYXRhXywgZD0+IHRoaXMuX3lfKGQpICldO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZWZpbmVYRG9tYWluKCl7XHJcbiAgICAgICAgbGV0IGV4dGVudCA9IGQzLmV4dGVudCh0aGlzLl9kYXRhXywgZCA9PiB0aGlzLl94XyhkKSApO1xyXG4gICAgICAgIGxldCBuZXdZZWFyID0gIGQzLnRpbWVZZWFyKGV4dGVudFswXSk7IFxyXG4gICAgICAgIHRoaXMueERvbWFpbiA9IFtdO1xyXG4gICAgICAgIHRoaXMueERvbWFpblswXSA9IG5ld1llYXI7XHJcbiAgICAgICAgdGhpcy54RG9tYWluWzFdID0gZDMudGltZVllYXIub2Zmc2V0KG5ld1llYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZWZpbmVDb2xvckRvbWFpbigpe1xyXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLl9kYXRhXy5tYXAoIGl0ZW0gPT4gdGhpcy5fY29sb3JfKGl0ZW0pICkuZmlsdGVyKChpdGVtLCBpbmRleCwgYXJyYXkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgPT09IGluZGV4O1xyXG4gICAgICAgIH0pLnNvcnQoIChhLGIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmluaXRNYXJnaW4oKTtcclxuICAgICAgICB0aGlzLmluaXRTVkdFbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0TGVnZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdE1hcmdpbigpe1xyXG4gICAgICAgIHRoaXMubWFyZ2luID0ge3RvcDogMjAsIHJpZ2h0OiAxMCwgYm90dG9tOiA2MCwgbGVmdDogODB9O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSA3NTAgLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTAgLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNWR0VsZW1lbnRzKCl7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjY2hhcnRcIikuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCAodGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCkpLmF0dHIoXCJoZWlnaHRcIiwodGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pKTtcclxuICAgICAgICB0aGlzLmNoYXJ0R3JvdXAgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwLWNoYXJ0XCIpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrW3RoaXMubWFyZ2luLmxlZnQsdGhpcy5tYXJnaW4udG9wXStcIilcIik7XHJcblxyXG4gICAgICAgIGxldCBjbGlwID0gdGhpcy5zdmcuYXBwZW5kKFwiZGVmc1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnOmNsaXBQYXRoXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIixcImNsaXBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInN2ZzpyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy53aWR0aCsxMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5oZWlnaHQrMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLC01KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwtNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaXJjbGVHcm91cCA9IHRoaXMuY2hhcnRHcm91cC5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xpcC1wYXRoXCIsIFwidXJsKCNjbGlwKVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJjbGlwLXBhdGhcIiwgXCJ1cmwoI2NsaXApXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImNpcmNsZUdyb3VwXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRTY2FsZSgpe1xyXG4gICAgICAgIHRoaXMueVNjYWxlID0gZDMuc2NhbGVMb2coKS5yYW5nZShbdGhpcy5oZWlnaHQsMF0pO1xyXG4gICAgICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGVUaW1lKCkucmFuZ2UoWzAsIHRoaXMud2lkdGhdKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbG9yU2NhbGUgPSBkMy5zY2FsZU9yZGluYWwoKS5yYW5nZSh0aGlzLmNvbG9yU2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5yYWRpdXNTY2FsZSA9IGZ1bmN0aW9uKGQpeyByZXR1cm4gNDsgfTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0TGVnZW5kKCl7XHJcbiAgICAgICAgdGhpcy5vcmRpbmFsTGVnZW5kID0gZDMubGVnZW5kQ29sb3IoKS5zaGFwZShcImNpcmNsZVwiKS50aXRsZShcIkxlZ2VuZGEgLSBNb2RhbGlkYWRlcyBMaWNpdGHDp8Ojb1wiKS5zY2FsZSh0aGlzLmNvbG9yU2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICBpZighdGhpcy5kYXRhKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIGlzIG5vdCBkZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy54U2NhbGUuZG9tYWluKHRoaXMueERvbWFpbik7XHJcbiAgICAgICAgdGhpcy55U2NhbGUuZG9tYWluKHRoaXMueURvbWFpbik7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlLmRvbWFpbih0aGlzLmNvbG9yRG9tYWluKTtcclxuXHJcbiAgICAgICAgLy8geEF4aXNcclxuICAgICAgICB0aGlzLnhBeGlzID0gZDMuYXhpc0JvdHRvbSgpLnNjYWxlKHRoaXMueFNjYWxlKS50aWNrRm9ybWF0KCB0aGlzLmZvcm1hdC5nZXRUaW1lRm9ybWF0KCkgKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNoYXJ0R3JvdXAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXMgYXhpcy14XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitbMCwodGhpcy5oZWlnaHQgKyA1KV0rXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuY2FsbCh0aGlzLnhBeGlzKTtcclxuICAgICAgICAvLyB5QXhpc1xyXG4gICAgICAgIGxldCBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlUm91bmQodGhpcy55RG9tYWluWzBdLHRoaXMueURvbWFpblsxXSk7XHJcbiAgICAgICAgdGhpcy55QXhpcyA9IGQzLmF4aXNMZWZ0KCkuc2NhbGUodGhpcy55U2NhbGUpLnRpY2tzKDUpLnRpY2tGb3JtYXQoIHRoaXMuZm9ybWF0LmxvY2FsZUZvcm1hdC5mb3JtYXQoXCIkLC4yZlwiKSkvLy50aWNrVmFsdWVzKFswLDAuMDEsMC4xNSwwLjIsMC43NSwxXS5tYXAoaSA9PiBpbnRlcnBvbGF0ZShpKSApKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnlBeGlzLnRpY2tBcmd1bWVudHMoKSk7XHJcbiAgICAgICAgdGhpcy5jaGFydEdyb3VwLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzIGF4aXMteVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxyXG4gICAgICAgICAgICAgICAgLmNhbGwodGhpcy55QXhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd01hcmtzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ZnTGVnZW5kID0gZDMuc2VsZWN0KFwiI2xlZ2VuZC1kaXNwbGF5XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlbmdlbmRhXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgyMCwyMClcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYWxsKHRoaXMub3JkaW5hbExlZ2VuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd01hcmtzKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YSBpcyBub3QgZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ1YmJsZXMgPSB0aGlzLmNpcmNsZUdyb3VwLnNlbGVjdEFsbChcIi5idWJibGVzXCIpLmRhdGEodGhpcy5fZGF0YV8sIGQgPT4gdGhpcy5fa2V5XyhkKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVQREFURVxyXG4gICAgICAgIGJ1YmJsZXMudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAuZWFzZShkMy5lYXNlU2luSW5PdXQpXHJcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oNzUwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBkID0+IHhTY2FsZSh4KGQpKSApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGQgPT4geVNjYWxlKHkoZCkpICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9FTlRFUlxyXG4gICAgICAgIGJ1YmJsZXMuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkID0+IChcImJ1YmJsZXMgXCIrdGhpcy5tYXBDb2RlVG9MZXR0ZXIodGhpcy5fa2V5XyhkKSkgKSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZCA9PiB0aGlzLnhTY2FsZSh0aGlzLl94XyhkKSkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCB0aGlzLmhlaWdodCApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMCApXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvclNjYWxlKHRoaXMuX2NvbG9yXyhkKSkpXHJcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oNzUwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBkID0+IHRoaXMueFNjYWxlKHRoaXMuX3hfKGQpKSApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGQgPT4gdGhpcy55U2NhbGUodGhpcy5feV8oZCkpIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCAgZCA9PiB0aGlzLnJhZGl1c1NjYWxlKHRoaXMuX3JfKGQpKSApXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvclNjYWxlKHRoaXMuX2NvbG9yXyhkKSkpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIHRoaXMuZGVmYXVsdE9wYWNpdHlDaXJjbGUgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBFWElUXHJcbiAgICAgICAgYnViYmxlcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9IRUxQRVJTIEZVTkNUSU9OU1xyXG4gICAgY29udmVydERhdGUoZCl7XHJcbiAgICAgICAgZFtcImR0RWRpdGFsXCJdID0gbmV3IERhdGUoZFtcImR0RWRpdGFsXCJdKVxyXG4gICAgICAgIGRbXCJkdEFiZXJ0dXJhXCJdID0gbmV3IERhdGUoZFtcImR0QWJlcnR1cmFcIl0pXHJcbiAgICBcclxuICAgICAgICByZXR1cm4gZDtcclxuICAgIH1cclxuXHJcbiAgICBtYXBDb2RlVG9MZXR0ZXIoY29kaWdvKXtcclxuICAgICAgICBjb25zdCBsZXR0ZXIgPSBbJ0EnLCdCJywnQycsJ0QnLCdFJywnRicsJ0cnLCdIJywnSScsJ0onXTtcclxuICAgICAgICBsZXQgbnVtYmVyXHJcbiAgICAgICAgbGV0IHdvcmQgPSAnJztcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY29kaWdvLmxlbmd0aDsgaSsrKSB3b3JkICs9IGxldHRlclsrY29kaWdvW2ldXVxyXG4gICAgICAgIHJldHVybiB3b3JkO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJlZW1hcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcclxuICAgICAgICB0aGlzLnJvb3Q7XHJcbiAgICAgICAgdGhpcy50cmVlbWFwTGF5b3V0O1xyXG4gICAgICAgIHRoaXMuc3ZnO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yU2NhbGU7XHJcbiAgICAgICAgdGhpcy5jb2xvclNjaGVtYSA9IFtcIiMyZWNjNzFcIiwgXCIjMjk4MGI5XCIsIFwiIzhlNDRhZFwiLCBcIiNmMWM0MGZcIiwgXCIjZTY3ZTIyXCIsIFwiI2U3NGMzY1wiXTtcclxuICAgICAgICB0aGlzLmtleXNcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuX2RhdGEua2V5ID0gXCJ0b3RhbFwiXHJcbiAgICAgICAgdGhpcy5fZGF0YS52YWx1ZXMgPSBkMy5uZXN0KCkua2V5KCBkID0+IGRbXCJkc01vZGFsaWRhZGVMaWNpdGFjYW9cIl0pLmVudHJpZXMoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gZDMuaGllcmFyY2h5KHRoaXMuX2RhdGEsIGQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZC52YWx1ZXM7XHJcbiAgICAgICAgfSkuc3VtKCBkID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGRbXCJ2bExpY2l0YWNhb1wiXTtcclxuICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgXHJcbiAgICAgICAgICAgIHJldHVybiBiWydkYXRhJ11bXCJ2bExpY2l0YWNhb1wiXSAtIGFbJ2RhdGEnXVtcInZsTGljaXRhY2FvXCJdIHx8IGFbJ2RhdGEnXVtcInZsTGljaXRhY2FvXCJdIC0gYlsnZGF0YSddW1widmxMaWNpdGFjYW9cIl0gOyBcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGFcIix0aGlzLl9kYXRhLnZhbHVlcyk7XHJcblxyXG4gICAgICAgIHRoaXMua2V5cyA9IHRoaXMuX2RhdGEudmFsdWVzLm1hcCggZCA9PiBkLmtleSApO1xyXG4gICAgICAgIHRoaXMuY29sb3JTY2FsZSA9IGQzLnNjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuY29sb3JTY2hlbWEpLmRvbWFpbih0aGlzLmtleXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLnRyZWVtYXBMYXlvdXQgPSBkMy50cmVlbWFwKCkuc2l6ZShbODUwLCA1MDBdKS5wYWRkaW5nT3V0ZXIoNSkudGlsZShkMy50cmVlbWFwQmluYXJ5KTtcclxuICAgICAgICB0aGlzLnRyZWVtYXBMYXlvdXQodGhpcy5yb290KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjY2hhcnRcIilcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgKDg1MCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsKDUwMCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwLWNoYXJ0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuZGF0YSh0aGlzLnJvb3QubGVhdmVzKCkpXHJcbiAgICAgICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBkID0+IGQueDAgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGQgPT4gZC55MClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZCA9PiAoZC54MSAtIGQueDApIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQgPT4gKGQueTEgLSBkLnkwKSApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJ0cmVlLWxheW91dFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvclNjYWxlKGQuZGF0YVtcImRzTW9kYWxpZGFkZUxpY2l0YWNhb1wiXSkgKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm9vdCBcIix0aGlzLnJvb3QuZGVzY2VuZGFudHMoKSk7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNjYXR0ZXJQbG90IGZyb20gXCIuL2NoYXJ0L3NjYXR0ZXJwbG90LmpzXCJcclxuaW1wb3J0IEJ1YmJsZVBhY2sgZnJvbSBcIi4vY2hhcnQvYnViYmxlcGFjay5qc1wiXHJcbmltcG9ydCBUcmVlbWFwIGZyb20gXCIuL2NoYXJ0L3RyZWVtYXAuanNcIlxyXG5pbXBvcnQgQnViYmxlZm9yY2UgZnJvbSBcIi4vY2hhcnQvYnViYmxlZm9yY2UuanNcIlxyXG5pbXBvcnQgQ2x1c3RlckZvcmNlIGZyb20gXCIuL2NoYXJ0L2NsdXN0ZXJmb3JjZS5qc1wiXHJcbmltcG9ydCBCYXJjaGFydCBmcm9tICcuL2NoYXJ0L01vZGFsaWRhZGVQb3JBbm8uanMnXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgIGZ1bmN0aW9uIHN0YXJ0KCl7XHJcbiAgICAgICAgY29uc3QgZ3JhZmljbyA9IG5ldyBCYXJjaGFydCgpO1xyXG4gICAgICAgIGQzLmpzb24oXCJodHRwOi8vbG9jYWxob3N0OjgwODAvbGljaXRhY29lcy80MTI0MTAvMjAxNlwiLCBmdW5jdGlvbiAoZXJyLCByZWNlaXZlZCkge1xyXG4gICAgICAgICAgICBncmFmaWNvLmRhdGEocmVjZWl2ZWQuZGF0YSk7XHJcbiAgICAgICAgICAgIGdyYWZpY28uaW5pdCgpO1xyXG4gICAgICAgICAgICBncmFmaWNvLmRyYXcoKTsgXHJcbiAgICAgICAgfSApO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKTtcclxufSJdfQ==
