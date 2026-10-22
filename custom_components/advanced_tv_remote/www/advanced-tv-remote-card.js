/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, J = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Y.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Y.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (i) => new ut(typeof i == "string" ? i : i + "", void 0, K), ft = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new ut(e, i, K);
}, At = (i, t) => {
  if (J) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = z.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, tt = J ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return yt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: bt, defineProperty: wt, getOwnPropertyDescriptor: Et, getOwnPropertyNames: St, getOwnPropertySymbols: xt, getPrototypeOf: Ct } = Object, g = globalThis, et = g.trustedTypes, Pt = et ? et.emptyScript : "", W = g.reactiveElementPolyfillSupport, O = (i, t) => i, L = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Pt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (i, t) => !bt(i, t), st = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && wt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = Et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const c = n == null ? void 0 : n.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, s = [...St(e), ...xt(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(tt(n));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : L).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const c = s.getPropertyOptions(n), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : L;
      this._$Em = n;
      const d = a.fromAttribute(e, c.type);
      this[n] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    var r;
    if (t !== void 0) {
      const c = this.constructor;
      if (n === !1 && (o = this[t]), s ?? (s = c.getPropertyOptions(t)), !((s.hasChanged ?? F)(o, e) || s.useDefault && s.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(c._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [o, r] of n) {
        const { wrapped: c } = r, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((n) => {
        var o;
        return (o = n.hostUpdate) == null ? void 0 : o.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: E }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, it = (i) => i, I = U.trustedTypes, nt = I ? I.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _t = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + $, Tt = `<${$t}>`, b = document, M = () => b.createComment(""), H = (i) => i === null || typeof i != "object" && typeof i != "function", Q = Array.isArray, Ot = (i) => Q(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, rt = />/g, v = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ct = /"/g, mt = /^(?:script|style|textarea|title)$/i, Ut = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), m = Ut(1), x = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function gt(i, t) {
  if (!Q(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Mt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = T;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let d, p, h = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, p = r.exec(a), p !== null); ) u = r.lastIndex, r === T ? p[1] === "!--" ? r = ot : p[1] !== void 0 ? r = rt : p[2] !== void 0 ? (mt.test(p[2]) && (n = RegExp("</" + p[2], "g")), r = v) : p[3] !== void 0 && (r = v) : r === v ? p[0] === ">" ? (r = n ?? T, h = -1) : p[1] === void 0 ? h = -2 : (h = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? v : p[3] === '"' ? ct : at) : r === ct || r === at ? r = v : r === ot || r === rt ? r = T : (r = v, n = void 0);
    const _ = r === v && i[c + 1].startsWith("/>") ? " " : "";
    o += r === T ? a + Tt : h >= 0 ? (s.push(d), a.slice(0, h) + _t + a.slice(h) + $ + _) : a + $ + (h === -2 ? c : _);
  }
  return [gt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Mt(t, e);
    if (this.el = R.createElement(d, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = y.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(_t)) {
          const u = p[r++], _ = n.getAttribute(h).split($), D = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: D[2], strings: _, ctor: D[1] === "." ? Rt : D[1] === "?" ? Nt : D[1] === "@" ? kt : V }), n.removeAttribute(h);
        } else h.startsWith($) && (a.push({ type: 6, index: o }), n.removeAttribute(h));
        if (mt.test(n.tagName)) {
          const h = n.textContent.split($), u = h.length - 1;
          if (u > 0) {
            n.textContent = I ? I.emptyScript : "";
            for (let _ = 0; _ < u; _++) n.append(h[_], M()), y.nextNode(), a.push({ type: 2, index: ++o });
            n.append(h[u], M());
          }
        }
      } else if (n.nodeType === 8) if (n.data === $t) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf($, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(i, t, e = i, s) {
  var r, c;
  if (t === x) return t;
  let n = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const o = H(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((c = n == null ? void 0 : n._$AO) == null || c.call(n, !1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = C(i, n._$AS(i, t.values), n, s)), t;
}
class Ht {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? b).importNode(e, !0);
    y.currentNode = n;
    let o = y.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Dt(o, this, t)), this._$AV.push(d), a = s[++c];
      }
      r !== (a == null ? void 0 : a.index) && (o = y.nextNode(), r++);
    }
    return y.currentNode = b, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = C(this, t, e), H(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(gt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(e);
    else {
      const r = new Ht(n, this), c = r.u(this.options);
      r.p(e), this.T(c), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = ht.get(t.strings);
    return e === void 0 && ht.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new N(this.O(M()), this.O(M()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = it(t).nextSibling;
      it(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = C(this, t, e, 0), r = !H(t) || t !== this._$AH && t !== x, r && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = C(this, c[s + a], e, a), d === x && (d = this._$AH[a]), r || (r = !H(d) || d !== this._$AH[a]), d === l ? t = l : t !== l && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Nt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class kt extends V {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? l) === x) return;
    const s = this._$AH, n = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== l && (s === l || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let Dt = class {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
};
const Z = U.litHtmlPolyfillSupport;
Z == null || Z(R, N), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const jt = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new N(t.insertBefore(M(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class S extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return x;
  }
}
var pt;
S._$litElement$ = !0, S.finalized = !0, (pt = A.litElementHydrateSupport) == null || pt.call(A, { LitElement: S });
const G = A.litElementPolyfillSupport;
G == null || G({ LitElement: S });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: F }, Lt = (i = zt, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function X(i) {
  return (t, e) => typeof e == "object" ? Lt(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(i) {
  return X({ ...i, state: !0, attribute: !1 });
}
var lt, dt;
(function(i) {
  i.language = "language", i.system = "system", i.comma_decimal = "comma_decimal", i.decimal_comma = "decimal_comma", i.space_comma = "space_comma", i.none = "none";
})(lt || (lt = {})), (function(i) {
  i.language = "language", i.system = "system", i.am_pm = "12", i.twenty_four = "24";
})(dt || (dt = {}));
function It(i) {
  return i.substr(0, i.indexOf("."));
}
var Bt = ["closed", "locked", "off"], B = function(i, t, e, s) {
  s = s || {}, e = e ?? {};
  var n = new Event(t, { bubbles: s.bubbles === void 0 || s.bubbles, cancelable: !!s.cancelable, composed: s.composed === void 0 || s.composed });
  return n.detail = e, i.dispatchEvent(n), n;
}, j = function(i) {
  B(window, "haptic", i);
}, Vt = function(i, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), B(window, "location-changed", { replace: e });
}, Wt = function(i, t, e) {
  e === void 0 && (e = !0);
  var s, n = It(t), o = n === "group" ? "homeassistant" : n;
  switch (n) {
    case "lock":
      s = e ? "unlock" : "lock";
      break;
    case "cover":
      s = e ? "open_cover" : "close_cover";
      break;
    default:
      s = e ? "turn_on" : "turn_off";
  }
  return i.callService(o, s, { entity_id: t });
}, qt = function(i, t) {
  var e = Bt.includes(i.states[t].state);
  return Wt(i, t, e);
}, Zt = function(i, t, e, s) {
  if (s || (s = { action: "more-info" }), !s.confirmation || s.confirmation.exemptions && s.confirmation.exemptions.some(function(o) {
    return o.user === t.user.id;
  }) || (j("warning"), confirm(s.confirmation.text || "Are you sure you want to " + s.action + "?"))) switch (s.action) {
    case "more-info":
      (e.entity || e.camera_image) && B(i, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      s.navigation_path && Vt(0, s.navigation_path);
      break;
    case "url":
      s.url_path && window.open(s.url_path);
      break;
    case "toggle":
      e.entity && (qt(t, e.entity), j("success"));
      break;
    case "call-service":
      if (!s.service) return void j("failure");
      var n = s.service.split(".", 2);
      t.callService(n[0], n[1], s.service_data, s.target), j("success");
      break;
    case "fire-dom-event":
      B(i, "ll-custom", s);
  }
}, Gt = function(i, t, e, s) {
  var n;
  s === "double_tap" && e.double_tap_action ? n = e.double_tap_action : s === "hold" && e.hold_action ? n = e.hold_action : s === "tap" && e.tap_action && (n = e.tap_action), Zt(i, t, e, n);
}, Jt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, f = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Kt(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Jt(t, e, n), n;
};
const Ft = (i, t, e) => i.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
let w = class extends S {
  constructor() {
    super(...arguments), this.channels = [], this.programmes = {}, this.held = !1, this.lastTap = 0;
  }
  setConfig(i) {
    if (!i.config_entry_id) throw new Error("config_entry_id is required");
    this.config = { ...i, channels: i.channels ?? [] }, this.load();
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = window.setInterval(() => this.load(), 6e4);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), super.disconnectedCallback();
  }
  async load() {
    if (!this.hass || !this.config) return;
    const [i, t] = await Promise.all([this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: this.config.config_entry_id }), this.hass.callWS({ type: "advanced_tv_remote/programs", config_entry_id: this.config.config_entry_id, channel_ids: this.config.channels.map((e) => e.channel_id) })]);
    this.channels = i, this.programmes = t;
  }
  action(i, t) {
    var s;
    const e = (s = this.config) == null ? void 0 : s.channels[i];
    e && this.hass && Gt(this, this.hass, e, t);
  }
  down(i) {
    this.held = !1, this.holdTimer = window.setTimeout(() => {
      this.held = !0, this.action(i, "hold");
    }, 500);
  }
  up(i) {
    if (window.clearTimeout(this.holdTimer), this.held) return;
    const t = Date.now();
    t - this.lastTap < 300 ? (this.lastTap = 0, this.action(i, "double_tap")) : (this.lastTap = t, window.setTimeout(() => {
      this.lastTap === t && this.action(i, "tap");
    }, 310));
  }
  render() {
    return this.config ? m`<ha-card><h2>${this.config.title ?? "Guida TV"}</h2><div class="grid">${this.config.channels.map((i, t) => {
      var n, o;
      const e = this.channels.find((r) => r.id === i.channel_id), s = this.programmes[i.channel_id];
      return m`<button @pointerdown=${() => this.down(t)} @pointerup=${() => this.up(t)} @pointercancel=${() => window.clearTimeout(this.holdTimer)}><div class="channel">${e != null && e.icon ? m`<img src=${e.icon}>` : l}<strong>${i.name ?? (e == null ? void 0 : e.name) ?? i.channel_id}</strong></div><div class="show"><b>Ora</b><span>${((n = s == null ? void 0 : s.current) == null ? void 0 : n.title) ?? "Programmazione non disponibile"}</span>${s != null && s.current ? m`<small>${new Date(s.current.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–${new Date(s.current.stop).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>` : l}</div><div class="next"><b>Dopo</b><span>${((o = s == null ? void 0 : s.next) == null ? void 0 : o.title) ?? "—"}</span></div></button>`;
    })}</div></ha-card>` : l;
  }
  static getConfigElement() {
    return document.createElement("advanced-tv-remote-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:advanced-tv-remote-card", config_entry_id: "", channels: [] };
  }
};
w.styles = ft`:host{display:block}ha-card{padding:16px}h2{margin:0 0 12px}.grid{display:grid;gap:10px}button{font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px;text-align:left;display:grid;grid-template-columns:minmax(110px,.7fr) 1.4fr 1fr;gap:16px;cursor:pointer}.channel,.show,.next{display:flex;align-items:center;gap:8px;min-width:0}.show,.next{align-items:flex-start;flex-direction:column}.show span,.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}img{width:42px;height:42px;object-fit:contain}small{color:var(--secondary-text-color)}@media(max-width:600px){button{grid-template-columns:1fr}.next{border-top:1px solid var(--divider-color);padding-top:8px}}`;
f([
  X({ attribute: !1 })
], w.prototype, "hass", 2);
f([
  k()
], w.prototype, "config", 2);
f([
  k()
], w.prototype, "channels", 2);
f([
  k()
], w.prototype, "programmes", 2);
w = f([
  vt("advanced-tv-remote-card")
], w);
let P = class extends S {
  constructor() {
    super(...arguments), this.channels = [];
  }
  setConfig(i) {
    this.config = { ...i, channels: i.channels ?? [] }, this.load();
  }
  async load() {
    var i;
    this.hass && ((i = this.config) != null && i.config_entry_id) && (this.channels = await this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: this.config.config_entry_id }));
  }
  changed(i) {
    this.config = i, Ft(this, "config-changed", { config: i });
  }
  add() {
    var i;
    this.config && this.changed({ ...this.config, channels: [...this.config.channels, { channel_id: ((i = this.channels[0]) == null ? void 0 : i.id) ?? "", tap_action: { action: "none" } }] });
  }
  patch(i, t, e) {
    if (!this.config) return;
    const s = this.config.channels.map((n, o) => o === i ? { ...n, [t]: e } : n);
    this.changed({ ...this.config, channels: s });
  }
  render() {
    return this.config ? m`<div><ha-textfield label="Titolo" .value=${this.config.title ?? ""} @change=${(i) => this.changed({ ...this.config, title: i.target.value })}></ha-textfield>${this.config.channels.map((i, t) => m`<section><ha-select label="Canale" .value=${i.channel_id} @selected=${(e) => this.patch(t, "channel_id", e.target.value)}>${this.channels.map((e) => m`<mwc-list-item .value=${e.id}>${e.name}</mwc-list-item>`)}</ha-select>${["tap_action", "hold_action", "double_tap_action"].map((e) => m`<h4>${e.replaceAll("_", " ")}</h4><hui-action-editor .hass=${this.hass} .config=${i[e] ?? { action: "none" }} @value-changed=${(s) => this.patch(t, e, s.detail.value)}></hui-action-editor>`)}<ha-button @click=${() => this.changed({ ...this.config, channels: this.config.channels.filter((e, s) => s !== t) })}>Rimuovi</ha-button></section>`)}<ha-button @click=${this.add}>Nuovo canale</ha-button></div>` : l;
  }
};
P.styles = ft`div{display:grid;gap:16px}section{border:1px solid var(--divider-color);border-radius:8px;padding:12px;display:grid;gap:8px}`;
f([
  X({ attribute: !1 })
], P.prototype, "hass", 2);
f([
  k()
], P.prototype, "config", 2);
f([
  k()
], P.prototype, "channels", 2);
P = f([
  vt("advanced-tv-remote-card-editor")
], P);
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "advanced-tv-remote-card", name: "Advanced TV Remote", description: "Guida TV italiana con azioni per canale", preview: !0 });
export {
  w as AdvancedTvRemoteCard,
  P as AdvancedTvRemoteCardEditor
};
