(window.webpackJsonpcosmochart=window.webpackJsonpcosmochart||[]).push([[0],[,,,,,function(e,t,n){e.exports=n(12)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var i=n(0),a=n.n(i),r=n(4),c=n.n(r),o=(n(10),n(2)),l=n(1);function h(e){var t=[],n=[],i=e.length-1,a=[],r=[],c=[],o=[];a[0]=0,r[0]=2,c[0]=1,o[0]=e[0]+2*e[1];for(var l=1;l<i-1;l++)a[l]=1,r[l]=4,c[l]=1,o[l]=4*e[l]+2*e[l+1];a[i-1]=2,r[i-1]=7,c[i-1]=0,o[i-1]=8*e[i-1]+e[i];for(var h=1;h<i;h++){var u=a[h]/r[h-1];r[h]=r[h]-u*c[h-1],o[h]=o[h]-u*o[h-1]}t[i-1]=o[i-1]/r[i-1];for(var s=i-2;s>=0;--s)t[s]=(o[s]-c[s]*t[s+1])/r[s];for(var x=0;x<i-1;x++)n[x]=2*e[x+1]-t[x+1];return n[i-1]=.5*(e[i]+t[i-1]),{cp1:t,cp2:n}}var u=8;function s(e,t,n,i){if(!(t.length<2)){var a,r=t[0];e.beginPath(),i&&(e.strokeStyle="gray",e.lineWidth=.5),e.moveTo(r.x,r.y);for(var c=1;c<t.length;c++)a=t[c],e.lineTo(a.x,a.y);n&&e.lineTo(r.x,r.y),e.stroke(),i&&(e.strokeStyle="black",e.lineWidth=1)}}function x(e,t,n,i,a){e.beginPath(),e.moveTo(t.x,t.y),e.bezierCurveTo(n.x,n.y,i.x,i.y,a.x,a.y),e.stroke()}function d(e,t,n,i){e.beginPath(),e.moveTo(t.x,t.y),e.quadraticCurveTo(n.x,n.y,i.x,i.y),e.stroke()}function m(e,t,n){for(var i=0;i<t.length;){var a=t.length-i,r=t[i];if(a>=4){var c=t[i+1],o=t[i+2],l=t[i+3];n&&s(e,[r,c,o,l],!1,!0),x(e,r,c,o,l),i+=3}else if(3===a){var h=t[i+1],u=t[i+2];n&&s(e,[r,h,u],!1,!0),d(e,r,h,u),i+=2}else{if(2!==a)break;s(e,[r,t[i+1]],!1,!1),i++}}}function f(e,t,n,i){switch(i&&(t=t.slice()).push(t[0]),n){case"spline":m(e,function(e){if(e.length<3)return e;for(var t=h(e.map(function(e){return e.x})),n=h(e.map(function(e){return e.y})),i=[e[0]],a=0;a<e.length-1;a++)i.push({x:t.cp1[a],y:n.cp1[a]}),i.push({x:t.cp2[a],y:n.cp2[a]}),i.push(e[a+1]);return i}(t),!1);break;case"bezier":m(e,t,!0);break;case"line":s(e,t,!1,!1)}}function y(){var e=Object(i.useState)(null),t=Object(l.a)(e,2),n=t[0],a=t[1];return[n,Object(i.useCallback)(function(e){null!==e&&a(e.getContext("2d"))},[])]}function v(e,t,n){var i=function(e,t){var n=Math.log10(t/e),i=Math.pow(10,Math.floor(n)),a=t/(i*e);return a>5?5*i:a>2?2*i:i}(14,Math.max(e.x.extent,e.y.extent)),a={dx:i,dy:i},r={dx:t/(e.x.extent/a.dx),dy:n/(e.y.extent/a.dy)},c=Math.abs(e.x.min)%i,o=Math.abs(e.y.min)%i;return c=e.x.min>0?-c:c,o=e.y.min>0?-o:o,{worldStarts:{x:c+e.x.min,y:o+e.y.min},deviceStarts:{x:c/e.x.extent*t,y:o/e.y.extent*n},worldIncrements:a,deviceIncrements:r}}function g(e){return(Math.round(1e3*e)/1e3).toString()}function w(e,t,n,i,a){var r=e.measureText(t);a&&(n+=r.width/2),e.fillStyle="white",e.fillRect(n-r.width/2,i-8,r.width,16),e.fillStyle="black",e.fillText(t,n,i)}var b=function(e){var t=y(),n=Object(l.a)(t,2),r=n[0],c=n[1],o=v(e.viewport,e.width,e.height);return Object(i.useEffect)(function(){null!==r&&function(e,t,n,i){if(null!==e){e.clearRect(0,0,t,n),e.strokeStyle="gray",e.textBaseline="middle",e.textAlign="center",e.font="16px monospace";for(var a=i.worldStarts.y,r=i.worldIncrements.dy/2,c=n-i.deviceStarts.y;c>=0;c-=i.deviceIncrements.dy)a+r>0&&a-r<0?(e.strokeStyle="black",e.strokeRect(0,c,t,.8),e.strokeStyle="gray"):e.strokeRect(0,c,t,.1),w(e,g(a),0,c,!0),a+=i.worldIncrements.dy;var o=i.worldStarts.x;r=i.worldIncrements.dx/2;for(var l=i.deviceStarts.x;l<t;l+=i.deviceIncrements.dx)o+r>0&&o-r<0?(e.strokeStyle="black",e.strokeRect(l,0,.8,n),e.strokeStyle="gray"):e.strokeRect(l,0,.1,n),w(e,g(o),l,10,!1),o+=i.worldIncrements.dx}}(r,e.width,e.height,o)},[r,e,o]),a.a.createElement("canvas",{ref:c,width:e.width,height:e.height,className:"fixed layer-bottom"})},p=function(e){var t=y(),n=Object(l.a)(t,2),r=n[0],c=n[1];return Object(i.useEffect)(function(){null!==r&&0!==e.points.length&&(r.clearRect(0,0,e.width,e.height),f(r,e.points,e.lineType,e.isCycle),e.points.forEach(function(t,n){var i;i=n===e.activePoint?"red":"blue",function(e,t,n){e.fillStyle=n,e.beginPath(),e.arc(t.x,t.y,u,0,2*Math.PI),e.fill()}(r,t,i)}))},[r,e]),a.a.createElement("canvas",{ref:c,width:e.width,height:e.height,className:"fixed layer-middle"})};function k(e,t){var n=e.x.extent*t,i=e.y.extent*t,a=(e.x.extent-n)/2+e.x.min,r=(e.y.extent-i)/2+e.y.min;return{x:{min:a,max:a+n,extent:n},y:{min:r,max:r+i,extent:i}}}var S=function(e){var t,n,r=Object(i.useState)(void 0),c=Object(l.a)(r,2),h=c[0],s=c[1],x=Object(i.useState)(!1),d=Object(l.a)(x,2),m=d[0],f=d[1],y=Object(i.useState)([]),v=Object(l.a)(y,2),g=v[0],w=v[1],S=Object(i.useState)([]),j=Object(l.a)(S,2),E=j[0],O=j[1],M=Object(i.useState)((t=e.width,n=e.height,function(e,t,n,i){var a=1,r=1;n>i?r=i/n:a=n/i;var c=e*a,o=t*a,l=e*r,h=t*r;return{x:{min:c,max:o,extent:o-c},y:{min:l,max:h,extent:h-l}}}(-10.5,10.5,t,n))),C=Object(l.a)(M,2),I=C[0],P=C[1],T=Object(i.useState)("spline"),R=Object(l.a)(T,2),Y=R[0],z=R[1],D=Object(i.useState)(!1),N=Object(l.a)(D,2),W=N[0],X=N[1];function B(t){return{x:t.x/e.width*I.x.extent+I.x.min,y:(e.height-t.y)/e.height*I.y.extent+I.y.min}}var F=Object(i.useCallback)(function(t){return{x:Math.round((t.x-I.x.min)/I.x.extent*e.width),y:Math.round(e.height-(t.y-I.y.min)/I.y.extent*e.height)}},[e.width,e.height,I]);return Object(i.useEffect)(function(){O(g.map(F))},[F,g]),a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{width:e.width,height:e.height},tabIndex:0,onPointerDown:function(e){var t=u,n={x:e.clientX,y:e.clientY},i=void 0;E.forEach(function(e,a){var r=function(e,t){var n=t.x-e.x,i=t.y-e.y;return Math.sqrt(n*n+i*i)}(n,e);r<t&&(i=a,t=r)}),h!==i&&s(i),f(!0)},onPointerMove:function(t){if(m)if(t.preventDefault(),void 0===h){var n=t.movementX/e.width,i=(I.x.max-I.x.min)*n,a=I.x.min-i,r=I.x.max-i,c=t.movementY/e.height,o=(I.y.max-I.y.min)*c,l=I.y.min+o,u=I.y.max+o;P({x:{min:a,max:r,extent:r-a},y:{min:l,max:u,extent:u-l}})}else{var s={x:t.clientX,y:t.clientY},x=g.slice();x[h]=B(s),w(x)}},onPointerUp:function(e){f(!1)},onDoubleClick:function(e){var t={x:e.clientX,y:e.clientY};s(g.length),O([].concat(Object(o.a)(E),[t])),w([].concat(Object(o.a)(g),[B(t)]))},onWheel:function(e){0!==e.deltaY&&(e.deltaY>0?P(k(I,1.2)):P(k(I,.8)))},onKeyDown:function(e){switch(e.key){case"d":void 0!==h&&(E.splice(h,1),g.splice(h,1),O(E),w(g),s(void 0))}},className:"fixed layer-top"}),a.a.createElement(b,{width:e.width,height:e.height,viewport:I}),a.a.createElement(p,{width:e.width,height:e.height,points:E,activePoint:h,lineType:Y,isCycle:W}),a.a.createElement("div",{id:"controls",className:"layer-control"},a.a.createElement("select",{id:"line-style",onChange:function(e){z(e.target.value)}},a.a.createElement("option",{value:"spline"},"Spline"),a.a.createElement("option",{value:"bezier"},"Bezier"),a.a.createElement("option",{value:"line"},"Line"),a.a.createElement("option",{value:"plot"},"Plot")),a.a.createElement("div",null,a.a.createElement("input",{type:"checkbox",onChange:function(e){X(e.target.checked)}}),a.a.createElement("label",{htmlFor:"cycle"},"Cycle"))))},j=(n(11),function(e){return a.a.createElement(a.a.Fragment,null,a.a.createElement(S,{width:e.width,height:e.height}))});function E(){c.a.render(a.a.createElement(j,{width:window.innerWidth,height:window.innerHeight}),document.getElementById("root"))}window.addEventListener("resize",E),E()}],[[5,1,2]]]);
//# sourceMappingURL=main.6e7fcb94.chunk.js.map