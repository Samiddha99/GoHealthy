var Autocomplete = function() {
    "use strict";
    function t(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    function e(t, e) {
        for (var n = 0; n < e.length; n++) {
            var i = e[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }
    function n(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n, t
    }
    var i = function(t, e) {
            return t.matches ? t.matches(e) : t.msMatchesSelector ? t.msMatchesSelector(e) : t.webkitMatchesSelector ? t.webkitMatchesSelector(e) : null
        },
        s = function(t, e) {
            return t.closest ? t.closest(e) : function(t, e) {
                for (var n = t; n && 1 === n.nodeType;) {
                    if (i(n, e)) return n;
                    n = n.parentNode
                }
                return null
            }(t, e)
        },
        o = function(t) {
            return Boolean(t && "function" == typeof t.then)
        },
        u = function e() {
            var i = this,
                u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                a = u.search,
                l = u.autoSelect,
                r = void 0 !== l && l,
                d = u.setValue,
                c = void 0 === d ? function() {} : d,
                h = u.setAttribute,
                p = void 0 === h ? function() {} : h,
                f = u.onUpdate,
                b = void 0 === f ? function() {} : f,
                v = u.onSubmit,
                g = void 0 === v ? function() {} : v,
                L = u.onShow,
                y = void 0 === L ? function() {} : L,
                w = u.onHide,
                m = void 0 === w ? function() {} : w,
                S = u.onLoading,
                x = void 0 === S ? function() {} : S,
                R = u.onLoaded,
                A = void 0 === R ? function() {} : R;
            t(this, e), n(this, "value", ""), n(this, "searchCounter", 0), n(this, "results", []), n(this, "selectedIndex", -1), n(this, "handleInput", (function(t) {
                var e = t.target.value;
                i.updateResults(e), i.value = e
            })), n(this, "handleKeyDown", (function(t) {
                var e = t.key;
                switch (e) {
                    case "Up":
                    case "Down":
                    case "ArrowUp":
                    case "ArrowDown":
                        var n = "ArrowUp" === e || "Up" === e ? i.selectedIndex - 1 : i.selectedIndex + 1;
                        t.preventDefault(), i.handleArrows(n);
                        break;
                    case "Tab":
                        i.selectResult();
                        break;
                    case "Enter":
                        var s = i.results[i.selectedIndex];
                        i.selectResult(), i.onSubmit(s);
                        break;
                    case "Esc":
                    case "Escape":
                        i.hideResults(), i.setValue();
                        break;
                    default:
                        return
                }
            })), n(this, "handleFocus", (function(t) {
                var e = t.target.value;
                i.updateResults(e), i.value = e
            })), n(this, "handleBlur", (function() {
                i.hideResults()
            })), n(this, "handleResultMouseDown", (function(t) {
                t.preventDefault()
            })), n(this, "handleResultClick", (function(t) {
                var e = t.target,
                    n = s(e, "[data-result-index]");
                if (n) {
                    i.selectedIndex = parseInt(n.dataset.resultIndex, 10);
                    var o = i.results[i.selectedIndex];
                    i.selectResult(), i.onSubmit(o)
                }
            })), n(this, "handleArrows", (function(t) {
                var e = i.results.length;
                i.selectedIndex = (t % e + e) % e, i.onUpdate(i.results, i.selectedIndex)
            })), n(this, "selectResult", (function() {
                var t = i.results[i.selectedIndex];
                t && i.setValue(t), i.hideResults()
            })), n(this, "updateResults", (function(t) {
                var e = ++i.searchCounter;
                i.onLoading(), i.search(t).then((function(t) {
                    e === i.searchCounter && (i.results = t, i.onLoaded(), 0 !== i.results.length ? (i.selectedIndex = i.autoSelect ? 0 : -1, i.onUpdate(i.results, i.selectedIndex), i.showResults()) : i.hideResults())
                }))
            })), n(this, "showResults", (function() {
                i.setAttribute("aria-expanded", !0), i.onShow()
            })), n(this, "hideResults", (function() {
                i.selectedIndex = -1, i.results = [], i.setAttribute("aria-expanded", !1), i.setAttribute("aria-activedescendant", ""), i.onUpdate(i.results, i.selectedIndex), i.onHide()
            })), n(this, "checkSelectedResultVisible", (function(t) {
                var e = t.querySelector('[data-result-index="'.concat(i.selectedIndex, '"]'));
                if (e) {
                    var n = t.getBoundingClientRect(),
                        s = e.getBoundingClientRect();
                    s.top < n.top ? t.scrollTop -= n.top - s.top : s.bottom > n.bottom && (t.scrollTop += s.bottom - n.bottom)
                }
            })), this.search = o(a) ? a : function(t) {
                return Promise.resolve(a(t))
            }, this.autoSelect = r, this.setValue = c, this.setAttribute = p, this.onUpdate = b, this.onSubmit = g, this.onShow = y, this.onHide = m, this.onLoading = x, this.onLoaded = A
        },
        a = 0,
        l = function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            return "".concat(t).concat(++a)
        },
        r = function(t, e) {
            var n = t.getBoundingClientRect(),
                i = e.getBoundingClientRect();
            return n.bottom + i.height > window.innerHeight && window.innerHeight - n.bottom < n.top && window.pageYOffset + n.top - i.height > 0 ? "above" : "below"
        },
        d = function(t, e, n) {
            var i;
            return function() {
                var s = this,
                    o = arguments,
                    u = function() {
                        i = null, n || t.apply(s, o)
                    },
                    a = n && !i;
                clearTimeout(i), i = setTimeout(u, e), a && t.apply(s, o)
            }
        },
        c = function() {
            function n(e, i, s) {
                t(this, n), this.id = "".concat(s, "-result-").concat(e), this.class = "".concat(s, "-result"), this["data-result-index"] = e, this.role = "option", e === i && (this["aria-selected"] = "true")
            }
            var i, s, o;
            return i = n, (s = [{
                key: "toString",
                value: function() {
                    var t = this;
                    return Object.keys(this).reduce((function(e, n) {
                        return "".concat(e, " ").concat(n, '="').concat(t[n], '"')
                    }), "")
                }
            }]) && e(i.prototype, s), o && e(i, o), n
        }();
    return function e(i) {
        var s = this,
            o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            a = o.search,
            h = o.onSubmit,
            p = void 0 === h ? function() {} : h,
            f = o.onUpdate,
            b = void 0 === f ? function() {} : f,
            v = o.baseClass,
            g = void 0 === v ? "autocomplete" : v,
            L = o.autoSelect,
            y = o.getResultValue,
            w = void 0 === y ? function(t) {
                return t
            } : y,
            m = o.renderResult,
            S = o.debounceTime,
            x = void 0 === S ? 0 : S;
        t(this, e), n(this, "expanded", !1), n(this, "loading", !1), n(this, "position", {}), n(this, "resetPosition", !0), n(this, "initialize", (function() {
            s.root.style.position = "relative", s.input.setAttribute("role", "combobox"), s.input.setAttribute("autocomplete", "off"), s.input.setAttribute("autocapitalize", "off"), s.input.setAttribute("autocorrect", "off"), s.input.setAttribute("spellcheck", "false"), s.input.setAttribute("aria-autocomplete", "list"), s.input.setAttribute("aria-haspopup", "listbox"), s.input.setAttribute("aria-expanded", "false"), s.resultList.setAttribute("role", "listbox"), s.resultList.style.position = "absolute", s.resultList.style.zIndex = "1", s.resultList.style.width = "100%", s.resultList.style.boxSizing = "border-box", s.resultList.id || (s.resultList.id = l("".concat(s.baseClass, "-result-list-"))), s.input.setAttribute("aria-owns", s.resultList.id), document.body.addEventListener("click", s.handleDocumentClick), s.input.addEventListener("input", s.core.handleInput), s.input.addEventListener("keydown", s.core.handleKeyDown), s.input.addEventListener("focus", s.core.handleFocus), s.input.addEventListener("blur", s.core.handleBlur), s.resultList.addEventListener("mousedown", s.core.handleResultMouseDown), s.resultList.addEventListener("click", s.core.handleResultClick), s.updateStyle()
        })), n(this, "setAttribute", (function(t, e) {
            s.input.setAttribute(t, e)
        })), n(this, "setValue", (function(t) {
            s.input.value = t ? s.getResultValue(t) : ""
        })), n(this, "renderResult", (function(t, e) {
            return "<li ".concat(e, ">").concat(s.getResultValue(t), "</li>")
        })), n(this, "handleUpdate", (function(t, e) {
            s.resultList.innerHTML = "", t.forEach((function(t, n) {
                var i = new c(n, e, s.baseClass),
                    o = s.renderResult(t, i);
                "string" == typeof o ? s.resultList.insertAdjacentHTML("beforeend", o) : s.resultList.insertAdjacentElement("beforeend", o)
            })), s.input.setAttribute("aria-activedescendant", e > -1 ? "".concat(s.baseClass, "-result-").concat(e) : ""), s.resetPosition && (s.resetPosition = !1, s.position = r(s.input, s.resultList), s.updateStyle()), s.core.checkSelectedResultVisible(s.resultList), s.onUpdate(t, e)
        })), n(this, "handleShow", (function() {
            s.expanded = !0, s.updateStyle()
        })), n(this, "handleHide", (function() {
            s.expanded = !1, s.resetPosition = !0, s.updateStyle()
        })), n(this, "handleLoading", (function() {
            s.loading = !0, s.updateStyle()
        })), n(this, "handleLoaded", (function() {
            s.loading = !1, s.updateStyle()
        })), n(this, "handleDocumentClick", (function(t) {
            s.root.contains(t.target) || s.core.hideResults()
        })), n(this, "updateStyle", (function() {
            s.root.dataset.expanded = s.expanded, s.root.dataset.loading = s.loading, s.root.dataset.position = s.position, s.resultList.style.visibility = s.expanded ? "visible" : "hidden", s.resultList.style.pointerEvents = s.expanded ? "auto" : "none", "below" === s.position ? (s.resultList.style.bottom = null, s.resultList.style.top = "100%") : (s.resultList.style.top = null, s.resultList.style.bottom = "100%")
        })), this.root = "string" == typeof i ? document.querySelector(i) : i, this.input = this.root.querySelector("input"), this.resultList = this.root.querySelector("ul"), this.baseClass = g, this.getResultValue = w, this.onUpdate = b, "function" == typeof m && (this.renderResult = m);
        var R = new u({
            search: a,
            autoSelect: L,
            setValue: this.setValue,
            setAttribute: this.setAttribute,
            onUpdate: this.handleUpdate,
            onSubmit: p,
            onShow: this.handleShow,
            onHide: this.handleHide,
            onLoading: this.handleLoading,
            onLoaded: this.handleLoaded
        });
        x > 0 && (R.handleInput = d(R.handleInput, x)), this.core = R, this.initialize()
    }
}();