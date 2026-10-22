/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, J = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Y.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Y.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (s) => new ut(typeof s == "string" ? s : s + "", void 0, K), ft = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[o + 1], s[0]);
  return new ut(e, s, K);
}, bt = (s, t) => {
  if (J) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = j.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
  }
}, tt = J ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return yt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: At, defineProperty: wt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: Et, getOwnPropertySymbols: St, getPrototypeOf: Ct } = Object, m = globalThis, et = m.trustedTypes, Pt = et ? et.emptyScript : "", B = m.reactiveElementPolyfillSupport, U = (s, t) => s, L = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Pt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (s, t) => !At(s, t), it = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && wt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: o } = xt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const c = n == null ? void 0 : n.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, i = [...Et(e), ...St(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(tt(n));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return bt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var o;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : L).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const c = i.getPropertyOptions(n), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : L;
      this._$Em = n;
      const d = a.fromAttribute(e, c.type);
      this[n] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, o) {
    var r;
    if (t !== void 0) {
      const c = this.constructor;
      if (n === !1 && (o = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? F)(o, e) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
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
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
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
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[U("elementProperties")] = /* @__PURE__ */ new Map(), S[U("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: S }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, st = (s) => s, I = R.trustedTypes, nt = I ? I.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, _t = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + $, Tt = `<${gt}>`, w = document, k = () => w.createComment(""), M = (s) => s === null || typeof s != "object" && typeof s != "function", Q = Array.isArray, Ot = (s) => Q(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", V = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, rt = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ct = /"/g, $t = /^(?:script|style|textarea|title)$/i, Ut = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), u = Ut(1), P = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), b = w.createTreeWalker(w, 129);
function mt(s, t) {
  if (!Q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Rt = (s, t) => {
  const e = s.length - 1, i = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = O;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let d, p, l = -1, _ = 0;
    for (; _ < a.length && (r.lastIndex = _, p = r.exec(a), p !== null); ) _ = r.lastIndex, r === O ? p[1] === "!--" ? r = ot : p[1] !== void 0 ? r = rt : p[2] !== void 0 ? ($t.test(p[2]) && (n = RegExp("</" + p[2], "g")), r = y) : p[3] !== void 0 && (r = y) : r === y ? p[0] === ">" ? (r = n ?? O, l = -1) : p[1] === void 0 ? l = -2 : (l = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? y : p[3] === '"' ? ct : at) : r === ct || r === at ? r = y : r === ot || r === rt ? r = O : (r = y, n = void 0);
    const g = r === y && s[c + 1].startsWith("/>") ? " " : "";
    o += r === O ? a + Tt : l >= 0 ? (i.push(d), a.slice(0, l) + _t + a.slice(l) + $ + g) : a + $ + (l === -2 ? c : g);
  }
  return [mt(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Rt(t, e);
    if (this.el = H.createElement(d, i), b.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = b.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith(_t)) {
          const _ = p[r++], g = n.getAttribute(l).split($), D = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: o, name: D[2], strings: g, ctor: D[1] === "." ? Mt : D[1] === "?" ? Ht : D[1] === "@" ? Nt : q }), n.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: o }), n.removeAttribute(l));
        if ($t.test(n.tagName)) {
          const l = n.textContent.split($), _ = l.length - 1;
          if (_ > 0) {
            n.textContent = I ? I.emptyScript : "";
            for (let g = 0; g < _; g++) n.append(l[g], k()), b.nextNode(), a.push({ type: 2, index: ++o });
            n.append(l[_], k());
          }
        }
      } else if (n.nodeType === 8) if (n.data === gt) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = n.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = w.createElement("template");
    return i.innerHTML = t, i;
  }
}
function T(s, t, e = s, i) {
  var r, c;
  if (t === P) return t;
  let n = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((c = n == null ? void 0 : n._$AO) == null || c.call(n, !1), o === void 0 ? n = void 0 : (n = new o(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = T(s, n._$AS(s, t.values), n, i)), t;
}
class kt {
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
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? w).importNode(e, !0);
    b.currentNode = n;
    let o = b.nextNode(), r = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Dt(o, this, t)), this._$AV.push(d), a = i[++c];
      }
      r !== (a == null ? void 0 : a.index) && (o = b.nextNode(), r++);
    }
    return b.currentNode = w, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = T(this, t, e), M(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(mt(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(e);
    else {
      const r = new kt(n, this), c = r.u(this.options);
      r.p(e), this.T(c), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const o of t) n === e.length ? e.push(i = new N(this.O(k()), this.O(k()), this, this.options)) : i = e[n], i._$AI(o), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = st(t).nextSibling;
      st(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = T(this, t, e, 0), r = !M(t) || t !== this._$AH && t !== P, r && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = T(this, c[i + a], e, a), d === P && (d = this._$AH[a]), r || (r = !M(d) || d !== this._$AH[a]), d === h ? t = h : t !== h && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ht extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Nt extends q {
  constructor(t, e, i, n, o) {
    super(t, e, i, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? h) === P) return;
    const i = this._$AH, n = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== h && (i === h || n);
    n && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let Dt = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    T(this, t);
  }
};
const G = R.litHtmlPolyfillSupport;
G == null || G(H, N), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.3");
const zt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new N(t.insertBefore(k(), o), o, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class C extends S {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zt(e, this.renderRoot, this.renderOptions);
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
    return P;
  }
}
var pt;
C._$litElement$ = !0, C.finalized = !0, (pt = A.litElementHydrateSupport) == null || pt.call(A, { LitElement: C });
const Z = A.litElementPolyfillSupport;
Z == null || Z({ LitElement: C });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: F }, Lt = (s = jt, t, e) => {
  const { kind: i, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, s, c), c;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function X(s) {
  return (t, e) => typeof e == "object" ? Lt(s, t, e) : ((i, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function E(s) {
  return X({ ...s, state: !0, attribute: !1 });
}
var ht, dt;
(function(s) {
  s.language = "language", s.system = "system", s.comma_decimal = "comma_decimal", s.decimal_comma = "decimal_comma", s.space_comma = "space_comma", s.none = "none";
})(ht || (ht = {})), (function(s) {
  s.language = "language", s.system = "system", s.am_pm = "12", s.twenty_four = "24";
})(dt || (dt = {}));
function It(s) {
  return s.substr(0, s.indexOf("."));
}
var Wt = ["closed", "locked", "off"], W = function(s, t, e, i) {
  i = i || {}, e = e ?? {};
  var n = new Event(t, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return n.detail = e, s.dispatchEvent(n), n;
}, z = function(s) {
  W(window, "haptic", s);
}, qt = function(s, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), W(window, "location-changed", { replace: e });
}, Bt = function(s, t, e) {
  e === void 0 && (e = !0);
  var i, n = It(t), o = n === "group" ? "homeassistant" : n;
  switch (n) {
    case "lock":
      i = e ? "unlock" : "lock";
      break;
    case "cover":
      i = e ? "open_cover" : "close_cover";
      break;
    default:
      i = e ? "turn_on" : "turn_off";
  }
  return s.callService(o, i, { entity_id: t });
}, Vt = function(s, t) {
  var e = Wt.includes(s.states[t].state);
  return Bt(s, t, e);
}, Gt = function(s, t, e, i) {
  if (i || (i = { action: "more-info" }), !i.confirmation || i.confirmation.exemptions && i.confirmation.exemptions.some(function(o) {
    return o.user === t.user.id;
  }) || (z("warning"), confirm(i.confirmation.text || "Are you sure you want to " + i.action + "?"))) switch (i.action) {
    case "more-info":
      (e.entity || e.camera_image) && W(s, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      i.navigation_path && qt(0, i.navigation_path);
      break;
    case "url":
      i.url_path && window.open(i.url_path);
      break;
    case "toggle":
      e.entity && (Vt(t, e.entity), z("success"));
      break;
    case "call-service":
      if (!i.service) return void z("failure");
      var n = i.service.split(".", 2);
      t.callService(n[0], n[1], i.service_data, i.target), z("success");
      break;
    case "fire-dom-event":
      W(s, "ll-custom", i);
  }
}, Zt = function(s, t, e, i) {
  var n;
  i === "double_tap" && e.double_tap_action ? n = e.double_tap_action : i === "hold" && e.hold_action ? n = e.hold_action : i === "tap" && e.tap_action && (n = e.tap_action), Gt(s, t, e, n);
}, Jt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, f = (s, t, e, i) => {
  for (var n = i > 1 ? void 0 : i ? Kt(t, e) : t, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(t, e, n) : r(n)) || n);
  return i && n && Jt(t, e, n), n;
};
const Ft = (s, t, e) => s.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
let v = class extends C {
  constructor() {
    super(...arguments), this.channels = [], this.programmes = {}, this.sourceRequired = !1, this.held = !1, this.lastTap = 0;
  }
  setConfig(s) {
    this.config = { ...s, channels: s.channels ?? [] }, this.load();
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = window.setInterval(() => this.load(), 6e4);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), super.disconnectedCallback();
  }
  updated(s) {
    s.has("hass") && this.load();
  }
  async load() {
    if (!this.hass || !this.config) return;
    let s = this.config.config_entry_id;
    if (!s) {
      const i = await this.hass.callWS({ type: "advanced_tv_remote/sources" });
      if (i.length === 1) s = i[0].entry_id;
      else {
        this.sourceRequired = !0;
        return;
      }
    }
    this.sourceRequired = !1;
    const [t, e] = await Promise.all([this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: s }), this.hass.callWS({ type: "advanced_tv_remote/programs", config_entry_id: s, channel_ids: this.config.channels.map((i) => i.channel_id) })]);
    this.channels = t, this.programmes = e;
  }
  action(s, t) {
    var i;
    const e = (i = this.config) == null ? void 0 : i.channels[s];
    e && this.hass && Zt(this, this.hass, e, t);
  }
  down(s) {
    this.held = !1, this.holdTimer = window.setTimeout(() => {
      this.held = !0, this.action(s, "hold");
    }, 500);
  }
  up(s) {
    if (window.clearTimeout(this.holdTimer), this.held) return;
    const t = Date.now();
    t - this.lastTap < 300 ? (this.lastTap = 0, this.action(s, "double_tap")) : (this.lastTap = t, window.setTimeout(() => {
      this.lastTap === t && this.action(s, "tap");
    }, 310));
  }
  render() {
    return this.config ? u`<ha-card><h2>${this.config.title ?? "Guida TV"}</h2>${this.sourceRequired ? u`<p class="warning">Seleziona una sorgente EPG nell'editor della card.</p>` : h}<div class="grid">${this.config.channels.map((s, t) => {
      var n, o;
      const e = this.channels.find((r) => r.id === s.channel_id), i = this.programmes[s.channel_id];
      return u`<button @pointerdown=${() => this.down(t)} @pointerup=${() => this.up(t)} @pointercancel=${() => window.clearTimeout(this.holdTimer)}><div class="channel">${e != null && e.icon ? u`<img src=${e.icon}>` : h}<strong>${s.name ?? (e == null ? void 0 : e.name) ?? s.channel_id}</strong></div><div class="show"><b>Ora</b><span>${((n = i == null ? void 0 : i.current) == null ? void 0 : n.title) ?? "Programmazione non disponibile"}</span>${i != null && i.current ? u`<small>${new Date(i.current.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–${new Date(i.current.stop).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>` : h}</div><div class="next"><b>Dopo</b><span>${((o = i == null ? void 0 : i.next) == null ? void 0 : o.title) ?? "—"}</span></div></button>`;
    })}</div></ha-card>` : h;
  }
  static getConfigElement() {
    return document.createElement("advanced-tv-remote-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:advanced-tv-remote-card", channels: [] };
  }
};
v.styles = ft`:host{display:block}ha-card{padding:16px}h2{margin:0 0 12px}.warning{color:var(--error-color);margin:8px 0}.grid{display:grid;gap:10px}button{font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px;text-align:left;display:grid;grid-template-columns:minmax(110px,.7fr) 1.4fr 1fr;gap:16px;cursor:pointer}.channel,.show,.next{display:flex;align-items:center;gap:8px;min-width:0}.show,.next{align-items:flex-start;flex-direction:column}.show span,.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}img{width:42px;height:42px;object-fit:contain}small{color:var(--secondary-text-color)}@media(max-width:600px){button{grid-template-columns:1fr}.next{border-top:1px solid var(--divider-color);padding-top:8px}}`;
f([
  X({ attribute: !1 })
], v.prototype, "hass", 2);
f([
  E()
], v.prototype, "config", 2);
f([
  E()
], v.prototype, "channels", 2);
f([
  E()
], v.prototype, "programmes", 2);
f([
  E()
], v.prototype, "sourceRequired", 2);
v = f([
  vt("advanced-tv-remote-card")
], v);
let x = class extends C {
  constructor() {
    super(...arguments), this.channels = [], this.sources = [];
  }
  setConfig(s) {
    this.config = { ...s, channels: s.channels ?? [] }, this.load();
  }
  updated(s) {
    s.has("hass") && this.load();
  }
  async load() {
    if (!this.hass || !this.config) return;
    this.sources = await this.hass.callWS({ type: "advanced_tv_remote/sources" });
    let s = this.config.config_entry_id;
    !s && this.sources.length === 1 && (s = this.sources[0].entry_id, this.changed({ ...this.config, config_entry_id: s })), s && (this.channels = await this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: s }));
  }
  async selectSource(s) {
    this.config && (this.channels = [], this.changed({ ...this.config, config_entry_id: s, channels: [] }), this.hass && s && (this.channels = await this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: s })));
  }
  changed(s) {
    this.config = s, Ft(this, "config-changed", { config: s });
  }
  add() {
    var s;
    this.config && this.changed({ ...this.config, channels: [...this.config.channels, { channel_id: ((s = this.channels[0]) == null ? void 0 : s.id) ?? "", tap_action: { action: "none" } }] });
  }
  patch(s, t, e) {
    if (!this.config) return;
    const i = this.config.channels.map((n, o) => o === s ? { ...n, [t]: e } : n);
    this.changed({ ...this.config, channels: i });
  }
  render() {
    return this.config ? u`<div><ha-textfield label="Titolo" .value=${this.config.title ?? ""} @change=${(s) => this.changed({ ...this.config, title: s.target.value })}></ha-textfield><label class="select-field"><span>Sorgente EPG</span><select .value=${this.config.config_entry_id ?? ""} @change=${(s) => this.selectSource(s.target.value)}><option value="" .selected=${!this.config.config_entry_id} disabled>Seleziona una sorgente EPG</option>${this.sources.map((s) => u`<option .value=${s.entry_id} .selected=${s.entry_id === this.config.config_entry_id}>${s.title}</option>`)}</select></label>${this.config.channels.map((s, t) => u`<section><label class="select-field"><span>Canale</span><select .value=${s.channel_id} @change=${(e) => this.patch(t, "channel_id", e.target.value)}><option value="" .selected=${!s.channel_id} disabled>Seleziona un canale</option>${s.channel_id && !this.channels.some((e) => e.id === s.channel_id) ? u`<option .value=${s.channel_id} selected>${s.channel_id}</option>` : h}${this.channels.map((e) => u`<option .value=${e.id} .selected=${e.id === s.channel_id}>${e.name}</option>`)}</select></label>${["tap_action", "hold_action", "double_tap_action"].map((e) => u`<h4>${e.replaceAll("_", " ")}</h4><hui-action-editor .hass=${this.hass} .config=${s[e] ?? { action: "none" }} @value-changed=${(i) => this.patch(t, e, i.detail.value)}></hui-action-editor>`)}<ha-button @click=${() => this.changed({ ...this.config, channels: this.config.channels.filter((e, i) => i !== t) })}>Rimuovi</ha-button></section>`)}<ha-button .disabled=${!this.config.config_entry_id} @click=${this.add}>Nuovo canale</ha-button></div>` : h;
  }
};
x.styles = ft`div{display:grid;gap:16px}section{border:1px solid var(--divider-color);border-radius:8px;padding:12px;display:grid;gap:8px;min-width:0}.select-field{display:flex;flex-direction:column;gap:6px;min-width:0;padding:10px 12px;background:var(--secondary-background-color);border-radius:4px;border-bottom:1px solid var(--secondary-text-color)}.select-field span{font-size:12px;color:var(--secondary-text-color)}select{box-sizing:border-box;width:100%;min-width:0;min-height:32px;font:inherit;color:var(--primary-text-color);background:var(--secondary-background-color);border:0;cursor:pointer}select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}option{font:inherit;color:var(--primary-text-color);background:var(--card-background-color)}`;
f([
  X({ attribute: !1 })
], x.prototype, "hass", 2);
f([
  E()
], x.prototype, "config", 2);
f([
  E()
], x.prototype, "channels", 2);
f([
  E()
], x.prototype, "sources", 2);
x = f([
  vt("advanced-tv-remote-card-editor")
], x);
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "advanced-tv-remote-card", name: "Advanced TV Remote", description: "Guida TV italiana con azioni per canale", preview: !0 });
export {
  v as AdvancedTvRemoteCard,
  x as AdvancedTvRemoteCardEditor
};
