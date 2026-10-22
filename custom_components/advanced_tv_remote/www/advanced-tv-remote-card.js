/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, J = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), ee = /* @__PURE__ */ new WeakMap();
let me = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (J && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const we = (i) => new me(typeof i == "string" ? i : i + "", void 0, K), fe = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new me(t, i, K);
}, Ae = (i, e) => {
  if (J) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), n = D.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = t.cssText, i.appendChild(s);
  }
}, te = J ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return we(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xe, defineProperty: Ee, getOwnPropertyDescriptor: Se, getOwnPropertyNames: Ce, getOwnPropertySymbols: Pe, getPrototypeOf: Te } = Object, w = globalThis, ie = w.trustedTypes, ke = ie ? ie.emptyScript : "", B = w.reactiveElementPolyfillSupport, U = (i, e) => i, j = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? ke : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, X = (i, e) => !xe(i, e), se = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && Ee(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: n, set: o } = Se(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: n, set(r) {
      const c = n == null ? void 0 : n.call(this);
      o == null || o.call(this, r), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const e = Te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const t = this.properties, s = [...Ce(t), ...Pe(t)];
      for (const n of s) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, n] of t) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const n = this._$Eu(t, s);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const n of s) t.unshift(te(n));
    } else e !== void 0 && t.push(te(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ae(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var o;
    const s = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : j).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, r;
    const s = this.constructor, n = s._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const c = s.getPropertyOptions(n), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : j;
      this._$Em = n;
      const l = a.fromAttribute(t, c.type);
      this[n] = l ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, n = !1, o) {
    var r;
    if (e !== void 0) {
      const c = this.constructor;
      if (n === !1 && (o = this[e]), s ?? (s = c.getPropertyOptions(e)), !((s.hasChanged ?? X)(o, t) || s.useDefault && s.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(c._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), o !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((n) => {
        var o;
        return (o = n.hostUpdate) == null ? void 0 : o.call(n);
      }), this.update(t)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[U("elementProperties")] = /* @__PURE__ */ new Map(), C[U("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: C }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, ne = (i) => i, q = M.trustedTypes, oe = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ge = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, _e = "?" + b, Oe = `<${_e}>`, S = document, H = () => S.createComment(""), R = (i) => i === null || typeof i != "object" && typeof i != "function", Y = Array.isArray, Ue = (i) => Y(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", V = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, re = /-->/g, ae = />/g, A = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, le = /"/g, $e = /^(?:script|style|textarea|title)$/i, Me = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), m = Me(1), T = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), x = S.createTreeWalker(S, 129);
function ve(i, e) {
  if (!Y(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const He = (i, e) => {
  const t = i.length - 1, s = [];
  let n, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = O;
  for (let c = 0; c < t; c++) {
    const a = i[c];
    let l, u, h = -1, g = 0;
    for (; g < a.length && (r.lastIndex = g, u = r.exec(a), u !== null); ) g = r.lastIndex, r === O ? u[1] === "!--" ? r = re : u[1] !== void 0 ? r = ae : u[2] !== void 0 ? ($e.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = A) : u[3] !== void 0 && (r = A) : r === A ? u[0] === ">" ? (r = n ?? O, h = -1) : u[1] === void 0 ? h = -2 : (h = r.lastIndex - u[2].length, l = u[1], r = u[3] === void 0 ? A : u[3] === '"' ? le : ce) : r === le || r === ce ? r = A : r === re || r === ae ? r = O : (r = A, n = void 0);
    const _ = r === A && i[c + 1].startsWith("/>") ? " " : "";
    o += r === O ? a + Oe : h >= 0 ? (s.push(l), a.slice(0, h) + ge + a.slice(h) + b + _) : a + b + (h === -2 ? c : _);
  }
  return [ve(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: e, _$litType$: t }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = e.length - 1, a = this.parts, [l, u] = He(e, t);
    if (this.el = z.createElement(l, s), x.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = x.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(ge)) {
          const g = u[r++], _ = n.getAttribute(h).split(b), p = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: p[2], strings: _, ctor: p[1] === "." ? ze : p[1] === "?" ? Ne : p[1] === "@" ? Ie : W }), n.removeAttribute(h);
        } else h.startsWith(b) && (a.push({ type: 6, index: o }), n.removeAttribute(h));
        if ($e.test(n.tagName)) {
          const h = n.textContent.split(b), g = h.length - 1;
          if (g > 0) {
            n.textContent = q ? q.emptyScript : "";
            for (let _ = 0; _ < g; _++) n.append(h[_], H()), x.nextNode(), a.push({ type: 2, index: ++o });
            n.append(h[g], H());
          }
        }
      } else if (n.nodeType === 8) if (n.data === _e) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(b, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += b.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = S.createElement("template");
    return s.innerHTML = e, s;
  }
}
function k(i, e, t = i, s) {
  var r, c;
  if (e === T) return e;
  let n = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const o = R(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((c = n == null ? void 0 : n._$AO) == null || c.call(n, !1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = n : t._$Cl = n), n !== void 0 && (e = k(i, n._$AS(i, e.values), n, s)), e;
}
class Re {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? S).importNode(t, !0);
    x.currentNode = n;
    let o = x.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let l;
        a.type === 2 ? l = new N(o, o.nextSibling, this, e) : a.type === 1 ? l = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (l = new De(o, this, e)), this._$AV.push(l), a = s[++c];
      }
      r !== (a == null ? void 0 : a.index) && (o = x.nextNode(), r++);
    }
    return x.currentNode = S, n;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class N {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, n) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = k(this, e, t), R(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== T && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ue(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: s } = e, n = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = z.createElement(ve(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(t);
    else {
      const r = new Re(n, this), c = r.u(this.options);
      r.p(t), this.T(c), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = he.get(e.strings);
    return t === void 0 && he.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    Y(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, n = 0;
    for (const o of e) n === t.length ? t.push(s = new N(this.O(H()), this.O(H()), this, this.options)) : s = t[n], s._$AI(o), n++;
    n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const n = ne(e).nextSibling;
      ne(e).remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, n, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(e, t = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) e = k(this, e, t, 0), r = !R(e) || e !== this._$AH && e !== T, r && (this._$AH = e);
    else {
      const c = e;
      let a, l;
      for (e = o[0], a = 0; a < o.length - 1; a++) l = k(this, c[s + a], t, a), l === T && (l = this._$AH[a]), r || (r = !R(l) || l !== this._$AH[a]), l === d ? e = d : e !== d && (e += (l ?? "") + o[a + 1]), this._$AH[a] = l;
    }
    r && !n && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ze extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ne extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Ie extends W {
  constructor(e, t, s, n, o) {
    super(e, t, s, n, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = k(this, e, t, 0) ?? d) === T) return;
    const s = this._$AH, n = e === d && s !== d || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== d && (s === d || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
let De = class {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    k(this, e);
  }
};
const G = M.litHtmlPolyfillSupport;
G == null || G(z, N), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.3");
const je = (i, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = n = new N(e.insertBefore(H(), o), o, void 0, t ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class P extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return T;
  }
}
var ue;
P._$litElement$ = !0, P.finalized = !0, (ue = E.litElementHydrateSupport) == null || ue.call(E, { LitElement: P });
const F = E.litElementPolyfillSupport;
F == null || F({ LitElement: P });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = (i) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(i, e);
  }) : customElements.define(i, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: X }, Le = (i = qe, e, t) => {
  const { kind: s, metadata: n } = t;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(t.name, i), s === "accessor") {
    const { name: r } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(c) {
      const a = this[r];
      e.call(this, c), this.requestUpdate(r, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Q(i) {
  return (e, t) => typeof t == "object" ? Le(i, e, t) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $(i) {
  return Q({ ...i, state: !0, attribute: !1 });
}
var de, pe;
(function(i) {
  i.language = "language", i.system = "system", i.comma_decimal = "comma_decimal", i.decimal_comma = "decimal_comma", i.space_comma = "space_comma", i.none = "none";
})(de || (de = {})), (function(i) {
  i.language = "language", i.system = "system", i.am_pm = "12", i.twenty_four = "24";
})(pe || (pe = {}));
function We(i) {
  return i.substr(0, i.indexOf("."));
}
var Be = ["closed", "locked", "off"], L = function(i, e, t, s) {
  s = s || {}, t = t ?? {};
  var n = new Event(e, { bubbles: s.bubbles === void 0 || s.bubbles, cancelable: !!s.cancelable, composed: s.composed === void 0 || s.composed });
  return n.detail = t, i.dispatchEvent(n), n;
}, I = function(i) {
  L(window, "haptic", i);
}, Ve = function(i, e, t) {
  t === void 0 && (t = !1), t ? history.replaceState(null, "", e) : history.pushState(null, "", e), L(window, "location-changed", { replace: t });
}, Ge = function(i, e, t) {
  t === void 0 && (t = !0);
  var s, n = We(e), o = n === "group" ? "homeassistant" : n;
  switch (n) {
    case "lock":
      s = t ? "unlock" : "lock";
      break;
    case "cover":
      s = t ? "open_cover" : "close_cover";
      break;
    default:
      s = t ? "turn_on" : "turn_off";
  }
  return i.callService(o, s, { entity_id: e });
}, Fe = function(i, e) {
  var t = Be.includes(i.states[e].state);
  return Ge(i, e, t);
}, Ze = function(i, e, t, s) {
  if (s || (s = { action: "more-info" }), !s.confirmation || s.confirmation.exemptions && s.confirmation.exemptions.some(function(o) {
    return o.user === e.user.id;
  }) || (I("warning"), confirm(s.confirmation.text || "Are you sure you want to " + s.action + "?"))) switch (s.action) {
    case "more-info":
      (t.entity || t.camera_image) && L(i, "hass-more-info", { entityId: t.entity ? t.entity : t.camera_image });
      break;
    case "navigate":
      s.navigation_path && Ve(0, s.navigation_path);
      break;
    case "url":
      s.url_path && window.open(s.url_path);
      break;
    case "toggle":
      t.entity && (Fe(e, t.entity), I("success"));
      break;
    case "call-service":
      if (!s.service) return void I("failure");
      var n = s.service.split(".", 2);
      e.callService(n[0], n[1], s.service_data, s.target), I("success");
      break;
    case "fire-dom-event":
      L(i, "ll-custom", s);
  }
}, Je = function(i, e, t, s) {
  var n;
  s === "double_tap" && t.double_tap_action ? n = t.double_tap_action : s === "hold" && t.hold_action ? n = t.hold_action : s === "tap" && t.tap_action && (n = t.tap_action), Ze(i, e, t, n);
};
function Z(i, e) {
  const t = i == null ? void 0 : i[`${e}_action`];
  return !!t && t.action !== "none";
}
async function Ke(i, e, t, s) {
  const n = `${s}_action`, o = t[n];
  if (!o || o.action === "none") return;
  let r = o;
  if (o.action === "perform-action" || o.action === "call-service") {
    const l = o.perform_action ?? o.service;
    if (!l || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(l))
      throw new Error("Seleziona un’azione Home Assistant valida (dominio.servizio).");
    r = {
      ...o,
      action: "call-service",
      service: l,
      service_data: o.data ?? o.service_data
    };
  }
  let c;
  const a = Object.create(e);
  Object.defineProperty(a, "callService", {
    value: (...l) => (c = e.callService(...l), c)
  }), Je(i, a, {
    ...t,
    entity: o.entity ?? t.entity,
    [n]: r
  }, s), await c;
}
var Xe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, f = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? Ye(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && Xe(e, t, n), n;
};
const be = (i, e, t) => i.dispatchEvent(new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 }));
let v = class extends P {
  constructor() {
    super(...arguments), this.channels = [], this.programmes = {}, this.sourceRequired = !1, this.now = Date.now(), this.failedIcons = /* @__PURE__ */ new Set(), this.tapTimers = /* @__PURE__ */ new Map();
  }
  setConfig(i) {
    this.clearGestures(), this.config = { ...i, channels: i.channels ?? [] }, this.load();
  }
  connectedCallback() {
    super.connectedCallback(), this.now = Date.now(), this.timer = window.setInterval(() => this.load(), 6e4), this.progressTimer = window.setInterval(() => {
      this.now = Date.now();
    }, 15e3);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), window.clearInterval(this.progressTimer), this.clearGestures(), super.disconnectedCallback();
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
    const [e, t] = await Promise.all([this.hass.callWS({ type: "advanced_tv_remote/channels", config_entry_id: i }), this.hass.callWS({ type: "advanced_tv_remote/programs", config_entry_id: i, channel_ids: this.config.channels.map((s) => s.channel_id) })]);
    this.channels = e, this.programmes = t;
  }
  async action(i, e) {
    var s;
    const t = (s = this.config) == null ? void 0 : s.channels[i];
    if (!(!t || !this.hass))
      try {
        await Ke(this, this.hass, t, e);
      } catch (n) {
        be(this, "hass-notification", {
          message: `Impossibile eseguire il comando TV: ${n instanceof Error ? n.message : String(n)}`
        });
      }
  }
  clearGestures() {
    window.clearTimeout(this.holdTimer), this.press = void 0, this.suppressedClick = void 0, this.tapTimers.forEach((i) => window.clearTimeout(i)), this.tapTimers.clear();
  }
  down(i, e) {
    var t;
    e.button !== 0 || !e.isPrimary || (window.clearTimeout(this.holdTimer), this.suppressedClick = void 0, this.press = { index: i, pointerId: e.pointerId, x: e.clientX, y: e.clientY }, Z((t = this.config) == null ? void 0 : t.channels[i], "hold") && (this.holdTimer = window.setTimeout(() => {
      var s;
      ((s = this.press) == null ? void 0 : s.index) !== i || this.press.pointerId !== e.pointerId || (this.suppressedClick = i, this.action(i, "hold"));
    }, 500)));
  }
  up(i, e) {
    var t;
    ((t = this.press) == null ? void 0 : t.index) !== i || this.press.pointerId !== e.pointerId || (window.clearTimeout(this.holdTimer), this.press = void 0);
  }
  cancelPress(i, e) {
    var t;
    ((t = this.press) == null ? void 0 : t.index) !== i || this.press.pointerId !== e.pointerId || (window.clearTimeout(this.holdTimer), this.press = void 0, this.suppressedClick = i);
  }
  move(i, e) {
    var t;
    ((t = this.press) == null ? void 0 : t.index) === i && Math.hypot(e.clientX - this.press.x, e.clientY - this.press.y) > 12 && this.cancelPress(i, e);
  }
  handleClick(i, e) {
    var s;
    if (e.detail !== 0 && this.suppressedClick === i) {
      this.suppressedClick = void 0;
      return;
    }
    if (e.detail === 0 || !Z((s = this.config) == null ? void 0 : s.channels[i], "double_tap")) {
      this.action(i, "tap");
      return;
    }
    const t = this.tapTimers.get(i);
    if (t !== void 0) {
      window.clearTimeout(t), this.tapTimers.delete(i), this.action(i, "double_tap");
      return;
    }
    this.tapTimers.set(i, window.setTimeout(() => {
      this.tapTimers.delete(i), this.action(i, "tap");
    }, 300));
  }
  time(i) {
    var t, s;
    if (!i) return "—";
    const e = new Date(i);
    return Number.isFinite(e.getTime()) ? e.toLocaleTimeString((s = (t = this.hass) == null ? void 0 : t.locale) == null ? void 0 : s.language, { hour: "2-digit", minute: "2-digit", hour12: !1 }) : "—";
  }
  progress(i) {
    if (!i) return;
    const e = Date.parse(i.start), t = Date.parse(i.stop);
    if (!(!Number.isFinite(e) || !Number.isFinite(t) || t <= e))
      return Math.max(0, Math.min(100, (this.now - e) / (t - e) * 100));
  }
  render() {
    var i;
    return this.config ? m`<ha-card>
      ${(i = this.config.title) != null && i.trim() ? m`<h2>${this.config.title}</h2>` : d}
      ${this.sourceRequired ? m`<p class="warning">Seleziona una sorgente EPG nell’editor della card.</p>` : d}
      <div class="channels">${this.config.channels.map((e, t) => {
      var g, _;
      const s = this.channels.find((p) => p.id === e.channel_id), n = ((g = e.name) == null ? void 0 : g.trim()) || (s == null ? void 0 : s.name) || e.channel_id, o = this.programmes[e.channel_id], r = o == null ? void 0 : o.current, c = o == null ? void 0 : o.next, a = this.progress(r), l = s != null && s.icon && !this.failedIcons.has(s.icon) ? s.icon : void 0, u = this.time(c == null ? void 0 : c.start), h = `${n}. ${r != null && r.title ? `Ora: ${r.title}.` : "Programmazione non disponibile."}${a !== void 0 ? ` Avanzamento ${Math.round(a)}%.` : ""}${c ? ` Alle ${u}: ${c.title}.` : ""}`;
      return m`<button type="button" class="channel-row" aria-label=${h} title=${h}
          @pointerdown=${(p) => this.down(t, p)}
          @pointerup=${(p) => this.up(t, p)}
          @pointermove=${(p) => this.move(t, p)}
          @pointercancel=${(p) => this.cancelPress(t, p)}
          @pointerleave=${(p) => this.cancelPress(t, p)}
          @click=${(p) => this.handleClick(t, p)}
          @contextmenu=${(p) => {
        Z(e, "hold") && p.preventDefault();
      }}>
          <span class="channel-logo">
            ${l ? m`<img src=${l} alt=${n} loading="lazy" decoding="async"
              @error=${() => {
        this.failedIcons = /* @__PURE__ */ new Set([...this.failedIcons, l]);
      }}>` : m`<span class="logo-fallback">${n}</span>`}
          </span>
          <span class="programme">
            ${(_ = this.config) != null && _.show_channel_names ? m`<span class="channel-name">${n}</span>` : d}
            <span class="current-title">${(r == null ? void 0 : r.title) || "Programmazione non disponibile"}</span>
            <span class="progress-track" aria-hidden="true">
              ${a !== void 0 ? m`<span class="progress-fill" style=${`width:${a}%`}></span>` : d}
            </span>
            <span class="next-programme">
              ${c ? m`<time datetime=${c.start}>${u}</time><span class="next-title">${c.title}</span>` : m`<span class="next-title unavailable">Prossimo programma non disponibile</span>`}
            </span>
            ${a !== void 0 ? m`<span class="sr-only">Programma completato al ${Math.round(a)}%.</span>` : d}
          </span>
        </button>`;
    })}</div>
    </ha-card>` : d;
  }
  static getConfigElement() {
    return document.createElement("advanced-tv-remote-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:advanced-tv-remote-card", channels: [] };
  }
};
v.styles = fe`
    :host { display: block; --tv-accent: var(--primary-color, #03a9f4); }
    ha-card { overflow: hidden; padding: 4px 0; }
    h2 { margin: 0; padding: 12px 14px 8px; font-size: 15px; font-weight: 600; line-height: 1.3; letter-spacing: -.2px; }
    .warning { margin: 10px 14px; color: var(--error-color); font-size: 13px; }
    .channels { display: grid; }
    .channel-row {
      box-sizing: border-box; width: 100%; min-width: 0; min-height: 58px;
      display: grid; grid-template-columns: 36px minmax(0, 1fr); align-items: center; gap: 12px;
      margin: 0; padding: 8px 14px; border: 0; border-radius: 0;
      background: transparent; color: var(--primary-text-color); font: inherit; text-align: start;
      cursor: pointer; touch-action: manipulation; user-select: none; -webkit-tap-highlight-color: transparent;
      transition: background-color 120ms ease;
    }
    .channel-row + .channel-row { border-top: 1px solid color-mix(in srgb, var(--divider-color, #888) 45%, transparent); }
    @media (hover: hover) { .channel-row:hover { background: color-mix(in srgb, var(--tv-accent) 5%, transparent); } }
    .channel-row:active { background: color-mix(in srgb, var(--tv-accent) 10%, transparent); }
    .channel-row:focus-visible { outline: 2px solid var(--tv-accent); outline-offset: -2px; border-radius: 4px; }
    .channel-logo { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; }
    img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .logo-fallback { max-width: 100%; font-size: 10px; font-weight: 600; line-height: 1.15; text-align: center; overflow-wrap: anywhere; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
    .programme { display: block; min-width: 0; }
    .current-title, .channel-name, .next-title { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .current-title { font-size: 13px; line-height: 17px; font-weight: 550; letter-spacing: -.1px; }
    .channel-name { margin-bottom: 2px; color: var(--secondary-text-color); font-size: 10px; line-height: 12px; }
    .progress-track { display: block; height: 2px; margin: 4px 0 4px; overflow: hidden; border-radius: 4px; background: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
    .progress-fill { display: block; height: 100%; border-radius: inherit; background: var(--tv-accent); transition: width 1s linear; }
    .next-programme { display: flex; align-items: baseline; gap: 7px; min-width: 0; color: var(--secondary-text-color); font-size: 11px; line-height: 14px; }
    time { flex: 0 0 auto; color: var(--tv-accent); font-size: 10px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .next-title { flex: 1; }
    .unavailable { opacity: .7; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    @media (prefers-reduced-motion: reduce) { .channel-row, .progress-fill { transition: none; } }
  `;
f([
  Q({ attribute: !1 })
], v.prototype, "hass", 2);
f([
  $()
], v.prototype, "config", 2);
f([
  $()
], v.prototype, "channels", 2);
f([
  $()
], v.prototype, "programmes", 2);
f([
  $()
], v.prototype, "sourceRequired", 2);
f([
  $()
], v.prototype, "now", 2);
f([
  $()
], v.prototype, "failedIcons", 2);
v = f([
  ye("advanced-tv-remote-card")
], v);
let y = class extends P {
  constructor() {
    super(...arguments), this.channels = [], this.sources = [], this.expanded = /* @__PURE__ */ new Set(), this.componentError = !1, this.loadSequence = 0, this.label = (i) => ({
      title: "Titolo",
      config_entry_id: "Sorgente EPG",
      channel_id: "Canale",
      show_channel_names: "Mostra nomi dei canali",
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
    const i = ++this.loadSequence, e = await this.hass.callWS({ type: "advanced_tv_remote/sources" });
    if (i !== this.loadSequence) return;
    this.sources = e;
    let t = this.config.config_entry_id;
    if (!t && e.length === 1 && (t = e[0].entry_id, this.changed({ ...this.config, config_entry_id: t })), !t) {
      this.channels = [];
      return;
    }
    const s = await this.hass.callWS({
      type: "advanced_tv_remote/channels",
      config_entry_id: t
    });
    i === this.loadSequence && (this.channels = s);
  }
  changed(i) {
    this.config = i, be(this, "config-changed", { config: i });
  }
  generalChanged(i) {
    if (i.stopPropagation(), !this.config) return;
    const e = i.detail.value, t = e.config_entry_id, s = typeof t == "string" && t !== this.config.config_entry_id;
    s && (this.channels = [], this.expanded = /* @__PURE__ */ new Set()), this.changed({
      ...this.config,
      ...e,
      channels: s ? [] : this.config.channels
    }), s && this.load();
  }
  channelChanged(i, e) {
    var s;
    if (e.stopPropagation(), !this.config) return;
    const t = { ...this.config.channels[i], ...e.detail.value };
    (s = t.name) != null && s.trim() || delete t.name, this.changed({ ...this.config, channels: this.config.channels.map((n, o) => o === i ? t : n) });
  }
  toggle(i, e) {
    e.stopPropagation();
    const t = new Set(this.expanded);
    e.detail.expanded ? t.add(i) : t.delete(i), this.expanded = t;
  }
  add() {
    !this.config || !this.channels.length || (this.expanded = /* @__PURE__ */ new Set([...this.expanded, this.config.channels.length]), this.changed({ ...this.config, channels: [...this.config.channels, {
      channel_id: this.channels[0].id,
      tap_action: { action: "none" }
    }] }));
  }
  removeChannel(i) {
    this.config && (this.expanded = new Set([...this.expanded].filter((e) => e !== i).map((e) => e > i ? e - 1 : e)), this.changed({ ...this.config, channels: this.config.channels.filter((e, t) => t !== i) }));
  }
  channelSchema(i, e) {
    var s, n;
    const t = this.channels.map((o) => ({ value: o.id, label: o.name }));
    return i.channel_id && !t.some((o) => o.value === i.channel_id) && t.unshift({ value: i.channel_id, label: i.channel_id }), [{
      name: "",
      type: "expandable",
      flatten: !0,
      title: ((s = i.name) == null ? void 0 : s.trim()) || ((n = this.channels.find((o) => o.id === i.channel_id)) == null ? void 0 : n.name) || i.channel_id || `Canale ${e + 1}`,
      expanded: this.expanded.has(e),
      schema: [
        { name: "channel_id", required: !0, selector: { select: { mode: "dropdown", options: t } } },
        { name: "name", selector: { text: {} } },
        ...["tap_action", "hold_action", "double_tap_action"].map((o) => ({
          name: o,
          selector: { ui_action: { default_action: "none" } }
        }))
      ]
    }];
  }
  render() {
    return this.config ? m`<div class="editor">
      ${this.componentError ? m`<p>Impossibile caricare i controlli di Home Assistant.</p>
        <ha-button @click=${() => this.loadComponents()}>Riprova</ha-button>` : d}
      <ha-form .hass=${this.hass} .data=${this.config}
        .schema=${[
      { name: "title", selector: { text: {} } },
      { name: "show_channel_names", selector: { boolean: {} } },
      { name: "config_entry_id", required: !0, selector: { select: {
        mode: "dropdown",
        options: this.sources.map((i) => ({ value: i.entry_id, label: i.title }))
      } } }
    ]}
        .computeLabel=${this.label}
        @value-changed=${this.generalChanged}></ha-form>
      ${this.config.channels.map((i, e) => m`<section>
        <ha-form .hass=${this.hass} .data=${i}
          .schema=${this.channelSchema(i, e)}
          .computeLabel=${this.label} .computeHelper=${this.helper}
          @expanded-changed=${(t) => this.toggle(e, t)}
          @value-changed=${(t) => this.channelChanged(e, t)}></ha-form>
        ${this.expanded.has(e) ? m`<ha-button class="remove"
          @click=${() => this.removeChannel(e)}>Rimuovi canale</ha-button>` : d}
      </section>`)}
      <ha-button .disabled=${!this.config.config_entry_id || !this.channels.length}
        @click=${this.add}>Nuovo canale</ha-button>
    </div>` : d;
  }
};
y.styles = fe`
    .editor { display: grid; gap: 16px; }
    section, ha-form { min-width: 0; }
    .remove { display: block; margin-top: 8px; --primary-color: var(--error-color); }
  `;
f([
  Q({ attribute: !1 })
], y.prototype, "hass", 2);
f([
  $()
], y.prototype, "config", 2);
f([
  $()
], y.prototype, "channels", 2);
f([
  $()
], y.prototype, "sources", 2);
f([
  $()
], y.prototype, "expanded", 2);
f([
  $()
], y.prototype, "componentError", 2);
y = f([
  ye("advanced-tv-remote-card-editor")
], y);
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "advanced-tv-remote-card", name: "Advanced TV Remote", description: "Guida TV italiana con azioni per canale", preview: !0 });
export {
  v as AdvancedTvRemoteCard,
  y as AdvancedTvRemoteCardEditor
};
