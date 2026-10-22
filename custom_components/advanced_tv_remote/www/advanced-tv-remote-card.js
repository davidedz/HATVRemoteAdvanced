/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, J = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), tt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const wt = (i) => new mt(typeof i == "string" ? i : i + "", void 0, K), ft = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new mt(e, i, K);
}, At = (i, t) => {
  if (J) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = D.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, et = J ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return wt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Et, defineProperty: St, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: xt, getOwnPropertySymbols: Pt, getPrototypeOf: Tt } = Object, y = globalThis, st = y.trustedTypes, Ot = st ? st.emptyScript : "", W = y.reactiveElementPolyfillSupport, k = (i, t) => i, j = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ot : null;
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
} }, X = (i, t) => !Et(i, t), it = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && St(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = Ct(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const a = n == null ? void 0 : n.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = Tt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, s = [...xt(e), ...Pt(e)];
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
      for (const n of s) e.unshift(et(n));
    } else t !== void 0 && e.push(et(t));
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
      const r = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : j).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = s.getPropertyOptions(n), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : j;
      this._$Em = n;
      const h = c.fromAttribute(e, a.type);
      this[n] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? X)(o, e) || s.useDefault && s.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
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
        const { wrapped: a } = r, c = this[o];
        a !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, r, c);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[k("elementProperties")] = /* @__PURE__ */ new Map(), C[k("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: C }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, nt = (i) => i, L = U.trustedTypes, ot = L ? L.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _t = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + v, kt = `<${gt}>`, S = document, H = () => S.createComment(""), R = (i) => i === null || typeof i != "object" && typeof i != "function", Y = Array.isArray, Ut = (i) => Y(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, at = />/g, w = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ht = /"/g, $t = /^(?:script|style|textarea|title)$/i, Ht = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), f = Ht(1), P = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function vt(i, t) {
  if (!Y(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Rt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = O;
  for (let a = 0; a < e; a++) {
    const c = i[a];
    let h, p, d = -1, m = 0;
    for (; m < c.length && (r.lastIndex = m, p = r.exec(c), p !== null); ) m = r.lastIndex, r === O ? p[1] === "!--" ? r = rt : p[1] !== void 0 ? r = at : p[2] !== void 0 ? ($t.test(p[2]) && (n = RegExp("</" + p[2], "g")), r = w) : p[3] !== void 0 && (r = w) : r === w ? p[0] === ">" ? (r = n ?? O, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, h = p[1], r = p[3] === void 0 ? w : p[3] === '"' ? ht : ct) : r === ht || r === ct ? r = w : r === rt || r === at ? r = O : (r = w, n = void 0);
    const $ = r === w && i[a + 1].startsWith("/>") ? " " : "";
    o += r === O ? c + kt : d >= 0 ? (s.push(h), c.slice(0, d) + _t + c.slice(d) + v + $) : c + v + (d === -2 ? a : $);
  }
  return [vt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, c = this.parts, [h, p] = Rt(t, e);
    if (this.el = M.createElement(h, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = A.nextNode()) !== null && c.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(_t)) {
          const m = p[r++], $ = n.getAttribute(d).split(v), I = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: o, name: I[2], strings: $, ctor: I[1] === "." ? Nt : I[1] === "?" ? It : I[1] === "@" ? zt : V }), n.removeAttribute(d);
        } else d.startsWith(v) && (c.push({ type: 6, index: o }), n.removeAttribute(d));
        if ($t.test(n.tagName)) {
          const d = n.textContent.split(v), m = d.length - 1;
          if (m > 0) {
            n.textContent = L ? L.emptyScript : "";
            for (let $ = 0; $ < m; $++) n.append(d[$], H()), A.nextNode(), c.push({ type: 2, index: ++o });
            n.append(d[m], H());
          }
        }
      } else if (n.nodeType === 8) if (n.data === gt) c.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(v, d + 1)) !== -1; ) c.push({ type: 7, index: o }), d += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(i, t, e = i, s) {
  var r, a;
  if (t === P) return t;
  let n = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const o = R(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = T(i, n._$AS(i, t.values), n, s)), t;
}
class Mt {
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
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    A.currentNode = n;
    let o = A.nextNode(), r = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let h;
        c.type === 2 ? h = new N(o, o.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (h = new Dt(o, this, t)), this._$AV.push(h), c = s[++a];
      }
      r !== (c == null ? void 0 : c.index) && (o = A.nextNode(), r++);
    }
    return A.currentNode = S, n;
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
    t = T(this, t, e), R(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ut(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(vt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(e);
    else {
      const r = new Mt(n, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    Y(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new N(this.O(H()), this.O(H()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = nt(t).nextSibling;
      nt(t).remove(), t = n;
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
    if (o === void 0) t = T(this, t, e, 0), r = !R(t) || t !== this._$AH && t !== P, r && (this._$AH = t);
    else {
      const a = t;
      let c, h;
      for (t = o[0], c = 0; c < o.length - 1; c++) h = T(this, a[s + c], e, c), h === P && (h = this._$AH[c]), r || (r = !R(h) || h !== this._$AH[c]), h === l ? t = l : t !== l && (t += (h ?? "") + o[c + 1]), this._$AH[c] = h;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class It extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class zt extends V {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? l) === P) return;
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
    T(this, t);
  }
};
const G = U.litHtmlPolyfillSupport;
G == null || G(M, N), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const jt = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new N(t.insertBefore(H(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class x extends C {
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
    return P;
  }
}
var ut;
x._$litElement$ = !0, x.finalized = !0, (ut = E.litElementHydrateSupport) == null || ut.call(E, { LitElement: x });
const Z = E.litElementPolyfillSupport;
Z == null || Z({ LitElement: x });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: X }, qt = (i = Lt, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(r, c, i, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, i, a), a;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(a) {
      const c = this[r];
      t.call(this, a), this.requestUpdate(r, c, i, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Q(i) {
  return (t, e) => typeof e == "object" ? qt(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(i) {
  return Q({ ...i, state: !0, attribute: !1 });
}
var dt, pt;
(function(i) {
  i.language = "language", i.system = "system", i.comma_decimal = "comma_decimal", i.decimal_comma = "decimal_comma", i.space_comma = "space_comma", i.none = "none";
})(dt || (dt = {})), (function(i) {
  i.language = "language", i.system = "system", i.am_pm = "12", i.twenty_four = "24";
})(pt || (pt = {}));
function Vt(i) {
  return i.substr(0, i.indexOf("."));
}
var Wt = ["closed", "locked", "off"], q = function(i, t, e, s) {
  s = s || {}, e = e ?? {};
  var n = new Event(t, { bubbles: s.bubbles === void 0 || s.bubbles, cancelable: !!s.cancelable, composed: s.composed === void 0 || s.composed });
  return n.detail = e, i.dispatchEvent(n), n;
}, z = function(i) {
  q(window, "haptic", i);
}, Bt = function(i, t, e) {
  e === void 0 && (e = !1), e ? history.replaceState(null, "", t) : history.pushState(null, "", t), q(window, "location-changed", { replace: e });
}, Gt = function(i, t, e) {
  e === void 0 && (e = !0);
  var s, n = Vt(t), o = n === "group" ? "homeassistant" : n;
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
}, Zt = function(i, t) {
  var e = Wt.includes(i.states[t].state);
  return Gt(i, t, e);
}, Ft = function(i, t, e, s) {
  if (s || (s = { action: "more-info" }), !s.confirmation || s.confirmation.exemptions && s.confirmation.exemptions.some(function(o) {
    return o.user === t.user.id;
  }) || (z("warning"), confirm(s.confirmation.text || "Are you sure you want to " + s.action + "?"))) switch (s.action) {
    case "more-info":
      (e.entity || e.camera_image) && q(i, "hass-more-info", { entityId: e.entity ? e.entity : e.camera_image });
      break;
    case "navigate":
      s.navigation_path && Bt(0, s.navigation_path);
      break;
    case "url":
      s.url_path && window.open(s.url_path);
      break;
    case "toggle":
      e.entity && (Zt(t, e.entity), z("success"));
      break;
    case "call-service":
      if (!s.service) return void z("failure");
      var n = s.service.split(".", 2);
      t.callService(n[0], n[1], s.service_data, s.target), z("success");
      break;
    case "fire-dom-event":
      q(i, "ll-custom", s);
  }
}, Jt = function(i, t, e, s) {
  var n;
  s === "double_tap" && e.double_tap_action ? n = e.double_tap_action : s === "hold" && e.hold_action ? n = e.hold_action : s === "tap" && e.tap_action && (n = e.tap_action), Ft(i, t, e, n);
};
function F(i, t) {
  const e = i == null ? void 0 : i[`${t}_action`];
  return !!e && e.action !== "none";
}
async function Kt(i, t, e, s) {
  const n = `${s}_action`, o = e[n];
  if (!o || o.action === "none") return;
  let r = o;
  if (o.action === "perform-action" || o.action === "call-service") {
    const h = o.perform_action ?? o.service;
    if (!h || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(h))
      throw new Error("Seleziona un’azione Home Assistant valida (dominio.servizio).");
    r = {
      ...o,
      action: "call-service",
      service: h,
      service_data: o.data ?? o.service_data
    };
  }
  let a;
  const c = Object.create(t);
  Object.defineProperty(c, "callService", {
    value: (...h) => (a = t.callService(...h), a)
  }), Jt(i, c, {
    ...e,
    entity: o.entity ?? e.entity,
    [n]: r
  }, s), await a;
}
var Xt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, u = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Yt(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Xt(t, e, n), n;
};
const bt = (i, t, e) => i.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
let b = class extends x {
  constructor() {
    super(...arguments), this.channels = [], this.programmes = {}, this.sourceRequired = !1, this.tapTimers = /* @__PURE__ */ new Map();
  }
  setConfig(i) {
    this.clearGestures(), this.config = { ...i, channels: i.channels ?? [] }, this.load();
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = window.setInterval(() => this.load(), 6e4);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), this.clearGestures(), super.disconnectedCallback();
  }
  updated(i) {
    i.has("hass") && this.load();
  }
  async load() {
    if (!this.hass || !this.config) return;
    let i = this.config.config_entry_id;
    if (!i) {
      const s = await this.hass.callWS({ type: "advanced_tv_remote/sources" });
      if (s.length === 1) i = s[0].entry_id;
      else {
        this.sourceRequired = !0;
        return;
      }
    }
    this.sourceRequired = !1;
    const [t, e] = await Promise.all([this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: i }), this.hass.callWS({ type: "advanced_tv_remote/programs", config_entry_id: i, channel_ids: this.config.channels.map((s) => s.channel_id) })]);
    this.channels = t, this.programmes = e;
  }
  async action(i, t) {
    var s;
    const e = (s = this.config) == null ? void 0 : s.channels[i];
    if (!(!e || !this.hass))
      try {
        await Kt(this, this.hass, e, t);
      } catch (n) {
        bt(this, "hass-notification", {
          message: `Impossibile eseguire il comando TV: ${n instanceof Error ? n.message : String(n)}`
        });
      }
  }
  clearGestures() {
    window.clearTimeout(this.holdTimer), this.press = void 0, this.suppressedClick = void 0, this.tapTimers.forEach((i) => window.clearTimeout(i)), this.tapTimers.clear();
  }
  down(i, t) {
    var e;
    t.button !== 0 || !t.isPrimary || (window.clearTimeout(this.holdTimer), this.suppressedClick = void 0, this.press = { index: i, pointerId: t.pointerId, x: t.clientX, y: t.clientY }, F((e = this.config) == null ? void 0 : e.channels[i], "hold") && (this.holdTimer = window.setTimeout(() => {
      var s;
      ((s = this.press) == null ? void 0 : s.index) !== i || this.press.pointerId !== t.pointerId || (this.suppressedClick = i, this.action(i, "hold"));
    }, 500)));
  }
  up(i, t) {
    var e;
    ((e = this.press) == null ? void 0 : e.index) !== i || this.press.pointerId !== t.pointerId || (window.clearTimeout(this.holdTimer), this.press = void 0);
  }
  cancelPress(i, t) {
    var e;
    ((e = this.press) == null ? void 0 : e.index) !== i || this.press.pointerId !== t.pointerId || (window.clearTimeout(this.holdTimer), this.press = void 0, this.suppressedClick = i);
  }
  move(i, t) {
    var e;
    ((e = this.press) == null ? void 0 : e.index) === i && Math.hypot(t.clientX - this.press.x, t.clientY - this.press.y) > 12 && this.cancelPress(i, t);
  }
  handleClick(i, t) {
    var s;
    if (t.detail !== 0 && this.suppressedClick === i) {
      this.suppressedClick = void 0;
      return;
    }
    if (t.detail === 0 || !F((s = this.config) == null ? void 0 : s.channels[i], "double_tap")) {
      this.action(i, "tap");
      return;
    }
    const e = this.tapTimers.get(i);
    if (e !== void 0) {
      window.clearTimeout(e), this.tapTimers.delete(i), this.action(i, "double_tap");
      return;
    }
    this.tapTimers.set(i, window.setTimeout(() => {
      this.tapTimers.delete(i), this.action(i, "tap");
    }, 300));
  }
  render() {
    return this.config ? f`<ha-card><h2>${this.config.title ?? "Guida TV"}</h2>${this.sourceRequired ? f`<p class="warning">Seleziona una sorgente EPG nell'editor della card.</p>` : l}<div class="grid">${this.config.channels.map((i, t) => {
      var n, o, r;
      const e = this.channels.find((a) => a.id === i.channel_id), s = this.programmes[i.channel_id];
      return f`<button type="button"
      @pointerdown=${(a) => this.down(t, a)}
      @pointerup=${(a) => this.up(t, a)}
      @pointermove=${(a) => this.move(t, a)}
      @pointercancel=${(a) => this.cancelPress(t, a)}
      @pointerleave=${(a) => this.cancelPress(t, a)}
      @click=${(a) => this.handleClick(t, a)}
      @contextmenu=${(a) => {
        var c;
        F((c = this.config) == null ? void 0 : c.channels[t], "hold") && a.preventDefault();
      }}><div class="channel">${e != null && e.icon ? f`<img src=${e.icon}>` : l}<strong>${((n = i.name) == null ? void 0 : n.trim()) || (e == null ? void 0 : e.name) || i.channel_id}</strong></div><div class="show"><b>Ora</b><span>${((o = s == null ? void 0 : s.current) == null ? void 0 : o.title) ?? "Programmazione non disponibile"}</span>${s != null && s.current ? f`<small>${new Date(s.current.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–${new Date(s.current.stop).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>` : l}</div><div class="next"><b>Dopo</b><span>${((r = s == null ? void 0 : s.next) == null ? void 0 : r.title) ?? "—"}</span></div></button>`;
    })}</div></ha-card>` : l;
  }
  static getConfigElement() {
    return document.createElement("advanced-tv-remote-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:advanced-tv-remote-card", channels: [] };
  }
};
b.styles = ft`:host{display:block}ha-card{padding:16px}h2{margin:0 0 12px}.warning{color:var(--error-color);margin:8px 0}.grid{display:grid;gap:10px}button{font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px;text-align:left;display:grid;grid-template-columns:minmax(110px,.7fr) 1.4fr 1fr;gap:16px;cursor:pointer;touch-action:manipulation;user-select:none}.channel,.show,.next{display:flex;align-items:center;gap:8px;min-width:0}.show,.next{align-items:flex-start;flex-direction:column}.show span,.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}img{width:42px;height:42px;object-fit:contain}small{color:var(--secondary-text-color)}@media(max-width:600px){button{grid-template-columns:1fr}.next{border-top:1px solid var(--divider-color);padding-top:8px}}`;
u([
  Q({ attribute: !1 })
], b.prototype, "hass", 2);
u([
  g()
], b.prototype, "config", 2);
u([
  g()
], b.prototype, "channels", 2);
u([
  g()
], b.prototype, "programmes", 2);
u([
  g()
], b.prototype, "sourceRequired", 2);
b = u([
  yt("advanced-tv-remote-card")
], b);
let _ = class extends x {
  constructor() {
    super(...arguments), this.channels = [], this.sources = [], this.expanded = /* @__PURE__ */ new Set(), this.componentError = !1, this.loadSequence = 0, this.label = (i) => ({
      title: "Titolo",
      config_entry_id: "Sorgente EPG",
      channel_id: "Canale",
      name: "Nome personalizzato",
      tap_action: "Tocco",
      hold_action: "Pressione prolungata",
      double_tap_action: "Doppio tocco"
    })[i.name] ?? i.name, this.helper = (i) => i.name === "name" ? "Facoltativo. Lascia vuoto per usare il nome della guida TV." : void 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadComponents();
  }
  async loadComponents() {
    if (!customElements.get("ha-form"))
      try {
        await (await (await window.loadCardHelpers()).createCardElement({ type: "entities", entities: [] })).constructor.getConfigElement(), await customElements.whenDefined("ha-form"), this.componentError = !1;
      } catch {
        this.componentError = !0;
      }
  }
  setConfig(i) {
    this.config = { ...i, channels: i.channels ?? [] }, this.load();
  }
  updated(i) {
    i.has("hass") && this.load();
  }
  async load() {
    if (!this.hass || !this.config) return;
    const i = ++this.loadSequence, t = await this.hass.callWS({ type: "advanced_tv_remote/sources" });
    if (i !== this.loadSequence) return;
    this.sources = t;
    let e = this.config.config_entry_id;
    if (!e && t.length === 1 && (e = t[0].entry_id, this.changed({ ...this.config, config_entry_id: e })), !e) {
      this.channels = [];
      return;
    }
    const s = await this.hass.callWS({
      type: "advanced_tv_remote/channels",
      config_entry_id: e
    });
    i === this.loadSequence && (this.channels = s);
  }
  changed(i) {
    this.config = i, bt(this, "config-changed", { config: i });
  }
  generalChanged(i) {
    if (i.stopPropagation(), !this.config) return;
    const t = i.detail.value, e = t.config_entry_id, s = typeof e == "string" && e !== this.config.config_entry_id;
    s && (this.channels = [], this.expanded = /* @__PURE__ */ new Set()), this.changed({
      ...this.config,
      ...t,
      channels: s ? [] : this.config.channels
    }), s && this.load();
  }
  channelChanged(i, t) {
    var s;
    if (t.stopPropagation(), !this.config) return;
    const e = { ...this.config.channels[i], ...t.detail.value };
    (s = e.name) != null && s.trim() || delete e.name, this.changed({ ...this.config, channels: this.config.channels.map((n, o) => o === i ? e : n) });
  }
  toggle(i, t) {
    t.stopPropagation();
    const e = new Set(this.expanded);
    t.detail.expanded ? e.add(i) : e.delete(i), this.expanded = e;
  }
  add() {
    !this.config || !this.channels.length || (this.expanded = /* @__PURE__ */ new Set([...this.expanded, this.config.channels.length]), this.changed({ ...this.config, channels: [...this.config.channels, {
      channel_id: this.channels[0].id,
      tap_action: { action: "none" }
    }] }));
  }
  removeChannel(i) {
    this.config && (this.expanded = new Set([...this.expanded].filter((t) => t !== i).map((t) => t > i ? t - 1 : t)), this.changed({ ...this.config, channels: this.config.channels.filter((t, e) => e !== i) }));
  }
  channelSchema(i, t) {
    var s, n;
    const e = this.channels.map((o) => ({ value: o.id, label: o.name }));
    return i.channel_id && !e.some((o) => o.value === i.channel_id) && e.unshift({ value: i.channel_id, label: i.channel_id }), [{
      name: "",
      type: "expandable",
      flatten: !0,
      title: ((s = i.name) == null ? void 0 : s.trim()) || ((n = this.channels.find((o) => o.id === i.channel_id)) == null ? void 0 : n.name) || i.channel_id || `Canale ${t + 1}`,
      expanded: this.expanded.has(t),
      schema: [
        { name: "channel_id", required: !0, selector: { select: { mode: "dropdown", options: e } } },
        { name: "name", selector: { text: {} } },
        ...["tap_action", "hold_action", "double_tap_action"].map((o) => ({
          name: o,
          selector: { ui_action: { default_action: "none" } }
        }))
      ]
    }];
  }
  render() {
    return this.config ? f`<div class="editor">
      ${this.componentError ? f`<p>Impossibile caricare i controlli di Home Assistant.</p>
        <ha-button @click=${() => this.loadComponents()}>Riprova</ha-button>` : l}
      <ha-form .hass=${this.hass} .data=${this.config}
        .schema=${[
      { name: "title", selector: { text: {} } },
      { name: "config_entry_id", required: !0, selector: { select: {
        mode: "dropdown",
        options: this.sources.map((i) => ({ value: i.entry_id, label: i.title }))
      } } }
    ]}
        .computeLabel=${this.label}
        @value-changed=${this.generalChanged}></ha-form>
      ${this.config.channels.map((i, t) => f`<section>
        <ha-form .hass=${this.hass} .data=${i}
          .schema=${this.channelSchema(i, t)}
          .computeLabel=${this.label} .computeHelper=${this.helper}
          @expanded-changed=${(e) => this.toggle(t, e)}
          @value-changed=${(e) => this.channelChanged(t, e)}></ha-form>
        ${this.expanded.has(t) ? f`<ha-button class="remove"
          @click=${() => this.removeChannel(t)}>Rimuovi canale</ha-button>` : l}
      </section>`)}
      <ha-button .disabled=${!this.config.config_entry_id || !this.channels.length}
        @click=${this.add}>Nuovo canale</ha-button>
    </div>` : l;
  }
};
_.styles = ft`
    .editor { display: grid; gap: 16px; }
    section, ha-form { min-width: 0; }
    .remove { display: block; margin-top: 8px; --primary-color: var(--error-color); }
  `;
u([
  Q({ attribute: !1 })
], _.prototype, "hass", 2);
u([
  g()
], _.prototype, "config", 2);
u([
  g()
], _.prototype, "channels", 2);
u([
  g()
], _.prototype, "sources", 2);
u([
  g()
], _.prototype, "expanded", 2);
u([
  g()
], _.prototype, "componentError", 2);
_ = u([
  yt("advanced-tv-remote-card-editor")
], _);
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "advanced-tv-remote-card", name: "Advanced TV Remote", description: "Guida TV italiana con azioni per canale", preview: !0 });
export {
  b as AdvancedTvRemoteCard,
  _ as AdvancedTvRemoteCardEditor
};
