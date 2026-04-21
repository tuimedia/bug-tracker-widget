/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new r(i,e,s)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,g=f?f.emptyScript:"",b=u.reactiveElementPolyfillSupport,m=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},v=(e,t)=>!n(e,t),x={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const a=i?.call(this);r?.call(this,t),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const e=this.properties,t=[...c(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(t,s.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=i;const a=r.fromAttribute(t,e.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(void 0!==e){const a=this.constructor;if(!1===i&&(r=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??v)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[m("elementProperties")]=new Map,$[m("finalized")]=new Map,b?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y=globalThis,w=e=>e,k=y.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+E,C=`<${T}>`,P=document,U=()=>P.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,z="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,D=/>/g,H=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,j=/"/g,F=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),L=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,V=P.createTreeWalker(P,129);function G(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const J=(e,t)=>{const s=e.length-1,i=[];let r,a=2===t?"<svg>":3===t?"<math>":"",o=R;for(let t=0;t<s;t++){const s=e[t];let n,l,d=-1,c=0;for(;c<s.length&&(o.lastIndex=c,l=o.exec(s),null!==l);)c=o.lastIndex,o===R?"!--"===l[1]?o=B:void 0!==l[1]?o=D:void 0!==l[2]?(F.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=H):void 0!==l[3]&&(o=H):o===H?">"===l[0]?(o=r??R,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?H:'"'===l[3]?j:N):o===j||o===N?o=H:o===B||o===D?o=R:(o=H,r=void 0);const h=o===H&&e[t+1].startsWith("/>")?" ":"";a+=o===R?s+C:d>=0?(i.push(n),s.slice(0,d)+S+s.slice(d)+E+h):s+E+(-2===d?t:h)}return[G(e,a+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class K{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,a=0;const o=e.length-1,n=this.parts,[l,d]=J(e,t);if(this.el=K.createElement(l,s),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&n.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(S)){const t=d[a++],s=i.getAttribute(e).split(E),o=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?se:X}),i.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:r}),i.removeAttribute(e));if(F.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],U()),V.nextNode(),n.push({type:2,index:++r});i.append(e[t],U())}}}else if(8===i.nodeType)if(i.data===T)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)n.push({type:7,index:r}),e+=E.length-1}r++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}}function Y(e,t,s=e,i){if(t===L)return t;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const a=O(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(e),r._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??P).importNode(t,!0);V.currentNode=i;let r=V.nextNode(),a=0,o=0,n=s[0];for(;void 0!==n;){if(a===n.index){let t;2===n.type?t=new Q(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new ie(r,this,e)),this._$AV.push(t),n=s[++o]}a!==n?.index&&(r=V.nextNode(),a++)}return V.currentNode=P,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),O(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==L&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=K.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new K(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new Q(this.O(U()),this.O(U()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=w(e).nextSibling;w(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(e,t=this,s,i){const r=this.strings;let a=!1;if(void 0===r)e=Y(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==L,a&&(this._$AH=e);else{const i=e;let o,n;for(e=r[0],o=0;o<r.length-1;o++)n=Y(this,i[s+o],t,o),n===L&&(n=this._$AH[o]),a||=!O(n)||n!==this._$AH[o],n===q?e=q:e!==q&&(e+=(n??"")+r[o+1]),this._$AH[o]=n}a&&!i&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class te extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class se extends X{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??q)===L)return;const s=this._$AH,i=e===q&&s!==q||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const re=y.litHtmlPolyfillSupport;re?.(K,Q),(y.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let oe=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=s?.renderBefore??null;i._$litPart$=r=new Q(t.insertBefore(U(),e),e,void 0,s??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const ne=ae.litElementPolyfillSupport;ne?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=1;class de{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==le||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return L}}),he="bug-tracker-widget";class pe extends oe{static properties={_menuOpen:{state:!0},_view:{state:!0},_user:{state:!0},_title:{state:!0},_stepsToReproduce:{state:!0},_expectedBehaviour:{state:!0},_actualBehaviour:{state:!0},_submittedUrl:{state:!0},_browser:{state:!0},_attachedFiles:{state:!0},_formStatus:{state:!0},_formError:{state:!0},_tickets:{state:!0},_ticketsStatus:{state:!0},_ticketsPage:{state:!0},_ticketsTotal:{state:!0},_selectedTicket:{state:!0},_selectedTicketStatus:{state:!0},_showTechDetails:{state:!0},_isDragging:{state:!0},_isOpen:{state:!0}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(he)||"{}")}catch{return{}}}();this._menuOpen=!1,this._view="form",this._user=null,this._title=e.title||"",this._stepsToReproduce=e.stepsToReproduce||"",this._expectedBehaviour=e.expectedBehaviour||"",this._actualBehaviour=e.actualBehaviour||"",this._submittedUrl=e.submittedUrl||"",this._browser=e.browser||"",this._attachedFiles=[],this._formStatus="idle",this._formError="",this._tickets=[],this._ticketsStatus="idle",this._ticketsPage=1,this._ticketsTotal=0,this._selectedTicket=null,this._selectedTicketStatus="idle",this._showTechDetails=!1,this._isDragging=!1,this._isOpen=!1}connectedCallback(){super.connectedCallback(),this._fetchUser()}_persist(){var e;e={title:this._title,stepsToReproduce:this._stepsToReproduce,expectedBehaviour:this._expectedBehaviour,actualBehaviour:this._actualBehaviour,submittedUrl:this._submittedUrl,browser:this._browser},localStorage.setItem(he,JSON.stringify(e))}async _fetchUser(){try{const e=await fetch("/api/me",{credentials:"include"});e.ok&&(this._user=await e.json())}catch{}}_openForm(){this._submittedUrl=window.location.href,this._browser||(this._browser=function(){const e=navigator.userAgent,t=[[/Edg\/(\d+)/,"Edge"],[/OPR\/(\d+)/,"Opera"],[/Chrome\/(\d+)/,"Chrome"],[/Firefox\/(\d+)/,"Firefox"],[/Safari\/(\d+)/,"Safari"]];for(const[s,i]of t){const t=e.match(s);if(t)return`${i} ${t[1]}`}return""}()),this._persist(),this._view="form",this._menuOpen=!1,this._isOpen=!0}async _openIssues(){this._view="issues",this._menuOpen=!1,this._isOpen=!0,await this._fetchTickets()}async _fetchTickets(){if(this._user?.email){this._ticketsStatus="loading";try{const e=`/api/feedback/tickets/mine?reporterEmail=${encodeURIComponent(this._user.email)}&page=${this._ticketsPage}&limit=10`,t=await fetch(e,{credentials:"include"});if(!t.ok)throw new Error;const s=await t.json();this._tickets=s.data??s,this._ticketsTotal=s.total??this._tickets.length,this._ticketsStatus="idle"}catch{this._ticketsStatus="error"}}}async _goToPage(e){this._ticketsPage=e,await this._fetchTickets()}async _selectTicket(e){this._selectedTicket=null,this._selectedTicketStatus="loading",this._showTechDetails=!1,this._view="issue-detail";try{const t=await fetch(`/api/feedback/tickets/mine/${e}`,{credentials:"include"});if(!t.ok)throw new Error;this._selectedTicket=await t.json(),this._selectedTicketStatus="idle"}catch{this._selectedTicketStatus="error"}}_resetForm(){this._title="",this._stepsToReproduce="",this._expectedBehaviour="",this._actualBehaviour="",this._submittedUrl="",this._browser="",this._attachedFiles=[],this._formError="",this._persist()}async _submit(e){e.preventDefault(),this._formStatus="submitting",this._formError="";try{const e=await Promise.all(this._attachedFiles.map(async e=>{const t=await fetch("/api/feedback/attachments/presign",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:e.name,contentType:e.type})});if(!t.ok)throw new Error("Failed to get upload URL");const{url:s,s3Key:i}=await t.json();if(!(await fetch(s,{method:"PUT",headers:{"Content-Type":e.type},body:e.data})).ok)throw new Error("Screenshot upload failed");return i}));let t;window.Sentry?.captureMessage&&(t=window.Sentry.captureMessage(this._title,{level:"info",tags:{source:"bug-tracker-widget"},extra:{submittedUrl:this._submittedUrl}}));const s={title:this._title,stepsToReproduce:this._stepsToReproduce,...this._expectedBehaviour?{expectedBehaviour:this._expectedBehaviour}:{},...this._actualBehaviour?{actualBehaviour:this._actualBehaviour}:{},submittedUrl:this._submittedUrl,reporterEmail:this._user?.email??null,reporterName:this._user?.displayName??null,browser:this._browser||void 0,viewport:`${window.innerWidth}x${window.innerHeight}`,userAgent:navigator.userAgent,...t?{sentryEventId:t}:{},...e.length?{attachmentS3Keys:e}:{}},i=await fetch("/api/feedback/tickets",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!i.ok){const e=await i.json().catch(()=>({}));throw new Error(e.detail||`Unexpected error (${i.status})`)}this._resetForm(),this._formStatus="success"}catch(e){this._formStatus="error",this._formError=e.message||"Something went wrong. Please try again."}}_handleFileSelect(e){for(const t of e){if(!t.type.startsWith("image/"))continue;const e=new FileReader;e.onload=e=>{this._attachedFiles=[...this._attachedFiles,{name:t.name,type:t.type,data:t,preview:e.target.result}]},e.readAsDataURL(t)}}_removeAttachment(e){this._attachedFiles=this._attachedFiles.filter((t,s)=>s!==e)}get _openTicketCount(){return this._tickets.filter(e=>"open"===e.status).length}get _ticketsPageCount(){return Math.ceil(this._ticketsTotal/10)||1}get _iconMessage(){return I`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M12 8v4"/><path d="M12 16h.01"/>
    </svg>`}get _iconCheck(){return I`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>`}render(){return this._user?.isAdmin?I`
      ${this._isOpen?I``:this._renderLauncher()}
      ${this._isOpen?this._renderPopup():I``}
    `:I``}_renderLauncher(){return I`
      <div class="launcher">
        ${this._menuOpen?I`
          <div class="menu" role="menu">
            <button class="menu-item" role="menuitem" @click=${this._openForm}>
              ${this._iconMessage}
              Report an issue
            </button>
            <button class="menu-item" role="menuitem" @click=${this._openIssues}>
              ${this._iconCheck}
              My issues
              ${this._openTicketCount>0?I`<span class="menu-badge">${this._openTicketCount}</span>`:""}
            </button>
          </div>
        `:""}
        <button
          class="trigger"
          @click=${()=>{this._menuOpen=!this._menuOpen}}
          aria-expanded=${this._menuOpen}
          aria-label="Issue tracker menu"
        >
          ${this._iconMessage}
          <span>Report issue <span class="trigger-sub">(admin only)</span></span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class=${ce({chevron:!0,"chevron--up":this._menuOpen})}>
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      </div>
    `}_renderPopup(){return I`
      <div class="popup" role="dialog" aria-label="Report an issue">
        ${this._renderHeader()}
        ${"issues"===this._view?this._renderIssues():""}
        ${"issue-detail"===this._view?this._renderIssueDetail():""}
        ${"form"===this._view&&"success"===this._formStatus?this._renderSuccess():""}
        ${"form"===this._view&&"success"!==this._formStatus?this._renderForm():""}
      </div>
    `}_renderHeader(){const e="issues"===this._view?"My issues":"issue-detail"===this._view?this._selectedTicket?.title??"Issue":"Report an issue";return I`
      <div class="header">
        <div class="header-left">
          ${"issue-detail"===this._view?I`
            <button class="back-btn" @click=${()=>{this._view="issues"}} aria-label="Back to issues">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M19 12H5m7-7-7 7 7 7"/>
              </svg>
            </button>
          `:I`
            <span class="header-icon">${this._iconMessage}</span>
          `}
          <span class="header-title">${e}</span>
        </div>
        <button class="minimise-btn" @click=${()=>{this._isOpen=!1}} aria-label="Minimise">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>
    `}_renderSuccess(){return I`
      <div class="success">
        <div class="success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p class="success-title">Report submitted</p>
        <p class="success-body">Thanks — we'll look into it.</p>
        <button class="btn-primary" style="margin-top:1.5rem" @click=${()=>{this._formStatus="idle",this._isOpen=!1}}>Done</button>
      </div>
    `}_renderForm(){return I`
      <form class="form" @submit=${this._submit} novalidate>
        <div class="form-body">
          <div class="field">
            <label class="field-label" for="bt-url">Page URL <span class="field-required" aria-hidden="true">*</span></label>
            <input id="bt-url" class="field-input field-input--mono" type="url" .value=${this._submittedUrl}
              @input=${e=>{this._submittedUrl=e.target.value,this._persist()}}
              placeholder="https://…" required autocomplete="off" />
            <p class="field-hint">Auto-filled from your current page — edit if different.</p>
          </div>

          <div class="field">
            <label class="field-label" for="bt-title">Title <span class="field-required" aria-hidden="true">*</span></label>
            <input id="bt-title" class="field-input" type="text" .value=${this._title}
              @input=${e=>{this._title=e.target.value,this._persist()}}
              placeholder="Brief description of the problem" maxlength="500" required autocomplete="off" />
          </div>

          <div class="form-cols">
            <div class="form-col">
              <div class="field">
                <label class="field-label" for="bt-expected">What did you expect to happen? <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-expected" class="field-input field-textarea" .value=${this._expectedBehaviour}
                  @input=${e=>{this._expectedBehaviour=e.target.value,this._persist()}}
                  placeholder="Describe what you thought would happen…" rows="4" required></textarea>
              </div>
              <div class="field">
                <label class="field-label" for="bt-actual">What actually happened? <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-actual" class="field-input field-textarea" .value=${this._actualBehaviour}
                  @input=${e=>{this._actualBehaviour=e.target.value,this._persist()}}
                  placeholder="Describe what you saw instead…" rows="4" required></textarea>
              </div>
            </div>
            <div class="form-col">
              <div class="field field--stretch">
                <label class="field-label" for="bt-steps">Steps to reproduce <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-steps" class="field-input field-textarea field-textarea--stretch" .value=${this._stepsToReproduce}
                  @input=${e=>{this._stepsToReproduce=e.target.value,this._persist()}}
                  placeholder="1. Go to…&#10;2. Click…&#10;3. Notice that…" rows="10" required></textarea>
              </div>
            </div>
          </div>

          <div class="field">
            <span class="field-label">Screenshots <span class="field-optional">optional</span></span>
            ${this._attachedFiles.length?I`
              <div class="attachment-grid">
                ${this._attachedFiles.map((e,t)=>I`
                  <div class="attachment-item">
                    <img src=${e.preview} alt=${e.name} class="attachment-thumb" />
                    <button type="button" class="attachment-remove" @click=${()=>this._removeAttachment(t)} aria-label="Remove ${e.name}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                `)}
              </div>
            `:""}
            <div
              class=${ce({"drop-zone":!0,"drop-zone--active":this._isDragging})}
              @click=${()=>this.shadowRoot.getElementById("bt-file").click()}
              @dragover=${e=>{e.preventDefault(),this._isDragging=!0}}
              @dragleave=${()=>{this._isDragging=!1}}
              @drop=${e=>{e.preventDefault(),this._isDragging=!1,this._handleFileSelect(e.dataTransfer.files)}}
              role="button" tabindex="0"
              @keydown=${e=>("Enter"===e.key||" "===e.key)&&this.shadowRoot.getElementById("bt-file").click()}
              aria-label="Upload screenshots"
            >
              <input id="bt-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="sr-only" multiple
                @change=${e=>{this._handleFileSelect(e.target.files),e.target.value=""}} tabindex="-1" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-icon" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <p class="drop-label"><span class="drop-link">Choose files</span> or drag them here</p>
              <p class="drop-hint">PNG, JPG, WebP or GIF</p>
            </div>
          </div>

          ${"error"===this._formStatus?I`
            <div class="error-banner" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              ${this._formError}
            </div>
          `:""}
        </div>

        <div class="footer">
          <button type="button" class="btn-secondary" @click=${()=>{this._isOpen=!1}}>Cancel</button>
          <button type="submit" class="btn-primary" ?disabled=${"submitting"===this._formStatus}>
            ${"submitting"===this._formStatus?I`<span class="spinner" aria-hidden="true"></span>`:""}
            ${"submitting"===this._formStatus?"Submitting…":"Submit report"}
          </button>
        </div>
      </form>
    `}_renderIssues(){return I`
      <div class="issues">
        ${"loading"===this._ticketsStatus?I`
          <div class="issues-empty"><span class="spinner spinner--dark" aria-hidden="true"></span> Loading…</div>
        `:"error"===this._ticketsStatus?I`
          <div class="issues-empty">Failed to load issues.</div>
        `:this._tickets.length?I`
          <div class="issues-list">
            ${this._tickets.map(e=>I`
              <div class="issue-row" role="button" tabindex="0"
                @click=${()=>this._selectTicket(e.id)}
                @keydown=${t=>"Enter"===t.key&&this._selectTicket(e.id)}
              >
                <div class="issue-row-main">
                  <span class="issue-title">${e.title}</span>
                  <span class="issue-date">${new Date(e.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
                  <span class="status-badge status-badge--${e.status}">${e.status}</span>
                </div>
              </div>
            `)}
          </div>
          ${this._ticketsPageCount>1?I`
            <div class="pagination">
              <button class="page-btn" ?disabled=${1===this._ticketsPage} @click=${()=>this._goToPage(this._ticketsPage-1)}>←</button>
              <span class="page-label">${this._ticketsPage} / ${this._ticketsPageCount}</span>
              <button class="page-btn" ?disabled=${this._ticketsPage>=this._ticketsPageCount} @click=${()=>this._goToPage(this._ticketsPage+1)}>→</button>
            </div>
          `:""}
        `:I`
          <div class="issues-empty">No issues.</div>
        `}
        <div class="footer">
          <button type="button" class="btn-secondary" @click=${this._openForm}>+ Report an issue</button>
          <button type="button" class="btn-secondary" @click=${()=>{this._isOpen=!1}}>Close</button>
        </div>
      </div>
    `}_renderIssueDetail(){const e=this._selectedTicket,t=e=>`/api/feedback${e.replace(/^\/api/,"")}`;return I`
      <div class="issues">
        ${"loading"===this._selectedTicketStatus?I`
          <div class="issues-empty"><span class="spinner spinner--dark" aria-hidden="true"></span> Loading…</div>
        `:"error"===this._selectedTicketStatus?I`
          <div class="issues-empty">Failed to load issue.</div>
        `:e?I`
          <div class="detail-body">
            <div class="detail-meta">
              <span class="status-badge status-badge--${e.status}">${e.status}</span>
              ${e.environment?I`<span class="detail-env">${e.environment}</span>`:""}
              <span class="detail-date" style="margin-left:auto">${new Date(e.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>
            </div>
            ${e.submittedUrl?I`
              <div class="detail-field">
                <span class="detail-label">Page</span>
                <span class="detail-value detail-value--mono">${e.submittedUrl}</span>
              </div>
            `:""}
            <div class="detail-cols">
              ${e.expectedBehaviour?I`
                <div class="detail-field">
                  <span class="detail-label">Expected</span>
                  <span class="detail-value detail-value--pre">${e.expectedBehaviour}</span>
                </div>
              `:""}
              ${e.actualBehaviour?I`
                <div class="detail-field">
                  <span class="detail-label">Actual</span>
                  <span class="detail-value detail-value--pre">${e.actualBehaviour}</span>
                </div>
              `:""}
            </div>
            ${e.stepsToReproduce?I`
              <div class="detail-field">
                <span class="detail-label">Steps to reproduce</span>
                <span class="detail-value detail-value--pre">${e.stepsToReproduce}</span>
              </div>
            `:""}
            ${e.attachments?.length?I`
              <div class="detail-field">
                <span class="detail-label">Screenshots</span>
                <div class="detail-attachments">
                  ${e.attachments.map(e=>I`
                    <a href=${t(e.url)} target="_blank" rel="noopener">
                      <img src=${t(e.url)} alt=${e.filename} class="detail-thumb" />
                    </a>
                  `)}
                </div>
              </div>
            `:""}
            ${e.browser||e.viewport||e.userAgent?I`
              <div class="detail-field">
                <button class="tech-toggle" @click=${()=>{this._showTechDetails=!this._showTechDetails}}>
                  ${this._showTechDetails?"Hide":"Show"} technical details
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class=${ce({chevron:!0,"chevron--up":this._showTechDetails})}>
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                </button>
                ${this._showTechDetails?I`
                  <div class="detail-cols" style="margin-top:8px">
                    ${e.browser?I`<div class="detail-field"><span class="detail-label">Browser</span><span class="detail-value">${e.browser}</span></div>`:""}
                    ${e.viewport?I`<div class="detail-field"><span class="detail-label">Viewport</span><span class="detail-value">${e.viewport}</span></div>`:""}
                    ${e.userAgent?I`<div class="detail-field" style="grid-column:1/-1"><span class="detail-label">User agent</span><span class="detail-value detail-value--mono" style="font-size:11px;word-break:break-all">${e.userAgent}</span></div>`:""}
                  </div>
                `:""}
              </div>
            `:""}
            ${e.ghIssueUrl?I`
              <div class="detail-field">
                <a href=${e.ghIssueUrl} target="_blank" rel="noopener" class="gh-link">View GitHub issue ↗</a>
              </div>
            `:""}
          </div>
        `:""}
      </div>
    `}static styles=a`
    :host { font-family: system-ui, -apple-system, sans-serif; }

    /* ── Launcher ── */
    .launcher { position: fixed; bottom: 1rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .menu { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); min-width: 200px; }
    .menu-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 11px 14px; background: none; border: none; color: #374151; font-family: inherit; font-size: 13.5px; text-align: left; cursor: pointer; transition: background 0.12s; }
    .menu-item:hover { background: #f9fafb; }
    .menu-item + .menu-item { border-top: 1px solid #f3f4f6; }
    .menu-badge { margin-left: auto; background: #ef4444; color: #fff; font-size: 11px; font-weight: 600; padding: 1px 6px; border-radius: 100px; line-height: 1.6; }
    .trigger { display: flex; align-items: center; gap: 6px; padding: 8px 14px 8px 10px; background: #fff; color: #111; border: 1px solid rgba(0,0,0,0.12); border-radius: 100px; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
    .trigger:hover { background: #f9fafb; transform: translateY(-1px); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .trigger:active { transform: translateY(0); }
    .trigger-sub { background: #f3f4f6; border-radius: 4px; padding: 1px 6px; font-size: 11px; font-weight: 500; color: #6b7280; }
    .chevron { transition: transform 0.2s; }
    .chevron--up { transform: rotate(180deg); }

    /* ── Popup ── */
    .popup { position: fixed; bottom: 1rem; right: 1rem; z-index: 9999; width: calc(100vw - 2rem); max-width: 640px; max-height: calc(100vh - 2rem); background: #fff; color: #111; display: flex; flex-direction: column; border-radius: 14px; box-shadow: 0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06); overflow: hidden; }

    /* ── Header ── */
    .header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
    .header-left { display: flex; align-items: center; gap: 9px; }
    .header-icon { color: #9ca3af; flex-shrink: 0; display: flex; }
    .header-title { font-size: 14px; font-weight: 600; color: #111; letter-spacing: 0.01em; }
    .back-btn, .minimise-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; border-radius: 6px; background: transparent; color: #9ca3af; cursor: pointer; transition: background 0.12s, color 0.12s; }
    .back-btn:hover, .minimise-btn:hover { background: #f3f4f6; color: #111; }

    /* ── Form ── */
    .form { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .form-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 18px; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .form-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-col { display: flex; flex-direction: column; gap: 14px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field--stretch { flex: 1; display: flex; flex-direction: column; }
    .field-label { font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 4px; }
    .field-required { color: #ef4444; }
    .field-optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #9ca3af; font-size: 11px; }
    .field-hint { font-size: 11.5px; color: #6b7280; line-height: 1.5; margin: 0; }
    .field-input { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 14px; color: #111; outline: none; transition: border-color 0.15s, background 0.15s; width: 100%; box-sizing: border-box; }
    .field-input::placeholder { color: #d1d5db; }
    .field-input:focus { border-color: #6b7280; background: #fff; }
    .field-input--mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12.5px; }
    .field-textarea { resize: vertical; line-height: 1.6; min-height: 120px; }
    .field-textarea--stretch { flex: 1; resize: none; }

    /* ── Drop zone ── */
    .drop-zone { border: 1px dashed #d1d5db; border-radius: 8px; padding: 20px 16px; text-align: center; cursor: pointer; background: #f9fafb; transition: border-color 0.15s, background 0.15s; }
    .drop-zone:hover, .drop-zone--active { border-color: #6b7280; background: #f3f4f6; }
    .drop-icon { color: #d1d5db; margin: 0 auto 8px; display: block; }
    .drop-label { font-size: 13px; color: #6b7280; margin: 0 0 3px; }
    .drop-link { color: #374151; text-decoration: underline; text-underline-offset: 2px; }
    .drop-hint { font-size: 11.5px; color: #9ca3af; margin: 0; }

    /* ── Attachments ── */
    .attachment-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
    .attachment-item { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
    .attachment-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; }
    .attachment-remove { position: absolute; top: -6px; right: -6px; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: none; border-radius: 50%; background: #ef4444; color: #fff; cursor: pointer; padding: 0; transition: background 0.12s; }
    .attachment-remove:hover { background: #dc2626; }

    /* ── Error ── */
    .error-banner { display: flex; align-items: flex-start; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #b91c1c; line-height: 1.5; }

    /* ── Footer ── */
    .footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid #f3f4f6; flex-shrink: 0; background: #fff; }
    .btn-secondary { padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: transparent; font-family: inherit; font-size: 13.5px; color: #6b7280; cursor: pointer; transition: border-color 0.12s, color 0.12s, background 0.12s; }
    .btn-secondary:hover { border-color: #9ca3af; color: #374151; background: #f9fafb; }
    .btn-primary { display: flex; align-items: center; gap: 8px; padding: 8px 20px; border: none; border-radius: 8px; background: #111; font-family: inherit; font-size: 13.5px; font-weight: 600; color: #fff; cursor: pointer; transition: opacity 0.12s, transform 0.12s; }
    .btn-primary:hover:not(:disabled) { opacity: 0.85; }
    .btn-primary:active:not(:disabled) { transform: scale(0.98); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Spinner ── */
    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
    .spinner--dark { border-color: #e5e7eb; border-top-color: #6b7280; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Success ── */
    .success { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .success-icon { width: 52px; height: 52px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; display: flex; align-items: center; justify-content: center; color: #16a34a; margin-bottom: 1.25rem; }
    .success-title { font-size: 16px; font-weight: 600; color: #111; margin: 0 0 0.5rem; }
    .success-body { font-size: 14px; color: #6b7280; margin: 0; }

    /* ── Issues list ── */
    .issues { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .issues-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .issues-empty { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; color: #9ca3af; font-size: 13.5px; padding: 2rem; text-align: center; }
    .issue-row { display: flex; align-items: center; padding: 12px 20px; border-bottom: 1px solid #f3f4f6; font-size: 13.5px; cursor: pointer; transition: background 0.1s; }
    .issue-row:hover { background: #f9fafb; }
    .issue-row:first-child { margin-top: 8px; }
    .issue-row-main { display: flex; align-items: center; gap: 8px; width: 100%; }
    .issue-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #111; }
    .issue-date { flex-shrink: 0; font-size: 11.5px; color: #9ca3af; }

    /* ── Status badges ── */
    .status-badge { flex-shrink: 0; font-size: 11px; font-weight: 600; text-transform: capitalize; padding: 2px 8px; border-radius: 100px; letter-spacing: 0.03em; }
    .status-badge--open { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .status-badge--closed { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
    .status-badge--in_progress { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }

    /* ── Pagination ── */
    .pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 10px; border-top: 1px solid #f3f4f6; flex-shrink: 0; }
    .page-btn { background: none; border: 1px solid #e5e7eb; border-radius: 6px; color: #6b7280; font-family: inherit; font-size: 13px; width: 28px; height: 28px; cursor: pointer; transition: background 0.12s, color 0.12s; }
    .page-btn:hover:not(:disabled) { background: #f3f4f6; color: #111; }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .page-label { font-size: 12.5px; color: #9ca3af; min-width: 40px; text-align: center; }

    /* ── Issue detail ── */
    .detail-body { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .detail-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .detail-date { font-size: 12px; color: #9ca3af; }
    .detail-env { font-size: 11px; font-weight: 600; text-transform: capitalize; padding: 2px 8px; border-radius: 100px; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
    .detail-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .detail-field { display: flex; flex-direction: column; gap: 5px; }
    .detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; }
    .detail-value { font-size: 13.5px; color: #374151; line-height: 1.5; }
    .detail-value--mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; word-break: break-all; }
    .detail-value--pre { white-space: pre-wrap; }
    .detail-attachments { display: flex; flex-wrap: wrap; gap: 8px; }
    .detail-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; transition: opacity 0.12s; }
    .detail-thumb:hover { opacity: 0.8; }
    .gh-link { font-size: 13px; color: #6b7280; text-decoration: none; border-bottom: 1px solid #e5e7eb; padding-bottom: 1px; transition: color 0.12s; }
    .gh-link:hover { color: #111; }
    .tech-toggle { background: none; border: none; padding: 0; color: #9ca3af; font-family: inherit; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: color 0.12s; }
    .tech-toggle:hover { color: #6b7280; }

    /* ── Misc ── */
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `}customElements.define("bug-tracker-widget",pe);
