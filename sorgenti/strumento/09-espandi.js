/* ESPANDI · 31/10/2026 (thread «Rifare Azione per il nucleo e lo staff»). Gab 30/10 21:18: «e se fosse espandi […] Espandi. Come potrebbe essere integrato?»;
   21:20 «Manda» (bozza espandi/espandi-bozza.html); 31/10 09:28: «azione non ci sarà piu una volta che metti espandi».
   La voce del menu si chiama Espandi (la vista resta "azione"). Cinque elementi come in Coscienza, ognuno con la riga del glossario
   e i gesti che fa davvero; i gesti di ruolo (tratteggiati) li vede solo chi ha il ruolo. */
var ESP_EL=[
  {k:"terra",s:"cubo",c:"#C9A15A",st:"Vicinati",el:"TERRA",d:"i luoghi e le persone vicine a te, e quello di cui c'è bisogno"},
  {k:"acqua",s:"icosaedro",c:"#6FA8D6",st:"Emporio",el:"ACQUA",d:"quello che si compra, si scambia e si dona, e chi lo porta"},
  {k:"fuoco",s:"tetraedro",c:"#E07A55",st:"Assistenza",el:"FUOCO",d:"chi risponde a un bisogno: spiritualità, trattamenti, consulenze, mutuo aiuto"},
  {k:"aria",s:"ottaedro",c:"#8DBF5E",st:"Edizione",el:"ARIA",d:"le opere, la radio, e quello che si stampa e si distribuisce"},
  {k:"etere",s:"dodecaedro",c:"#B08AE0",st:"Scuola",el:"ETERE",d:"le lezioni, le formazioni, e la ricerca. Qui vive il wiki"}
];
var ESP_PHI=(1+Math.sqrt(5))/2,espGiro=null;
function espSolido(n){var v=[],b=1/ESP_PHI,p=ESP_PHI;
  function d3(a,c){return Math.hypot(a[0]-c[0],a[1]-c[1],a[2]-c[2]);}
  function cubo(){[-1,1].forEach(function(x){[-1,1].forEach(function(y){[-1,1].forEach(function(z){v.push([x,y,z]);});});});}
  if(n==="cubo")cubo();
  else if(n==="tetraedro")v=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
  else if(n==="ottaedro")v=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  else if(n==="icosaedro"){[-1,1].forEach(function(a){[-1,1].forEach(function(t){v.push([0,a,t*p]);v.push([a,t*p,0]);v.push([t*p,0,a]);});});}
  else {cubo();[-1,1].forEach(function(a){[-1,1].forEach(function(t){v.push([0,a*b,t*p]);v.push([a*b,t*p,0]);v.push([t*p,0,a*b]);});});}
  var m=1e9,i,j;for(i=0;i<v.length;i++)for(j=i+1;j<v.length;j++)m=Math.min(m,d3(v[i],v[j]));
  var e=[];for(i=0;i<v.length;i++)for(j=i+1;j<v.length;j++)if(Math.abs(d3(v[i],v[j])-m)<1e-6)e.push([i,j]);
  var r=0;v.forEach(function(q){r=Math.max(r,Math.hypot(q[0],q[1],q[2]));});
  return {v:v.map(function(q){return q.map(function(c){return c/r;});}),e:e};}
function espSolidi(c){
  if(espGiro)cancelAnimationFrame(espGiro);
  var tele=[].slice.call(c.querySelectorAll("canvas[data-s]")).map(function(cv,i){var r=window.devicePixelRatio||1,w=cv.clientWidth||64;cv.width=w*r;cv.height=w*r;
    return {cv:cv,x:cv.getContext("2d"),s:espSolido(cv.getAttribute("data-s")),col:cv.getAttribute("data-c"),w:w*r,f:i*0.7};});
  var fermo=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function giro(t){
    if(vista!=="azione"||!tele.length||!tele[0].cv.isConnected){espGiro=null;return;}
    tele.forEach(function(o){var x=o.x,w=o.w,A=t*0.00035+o.f,B=t*0.00022+o.f*0.5,ca=Math.cos(A),sa=Math.sin(A),cb=Math.cos(B),sb=Math.sin(B);
      x.clearRect(0,0,w,w);
      var P=o.s.v.map(function(q){var X=q[0]*ca-q[2]*sa,Z=q[0]*sa+q[2]*ca,Y=q[1]*cb-Z*sb;Z=q[1]*sb+Z*cb;var k=w*0.36*(1+Z*0.12);return [w/2+X*k,w/2+Y*k,Z];});
      x.lineWidth=Math.max(1,w/90);x.strokeStyle=o.col;x.shadowColor=o.col;x.shadowBlur=w/14;
      o.s.e.forEach(function(e){var a=P[e[0]],b=P[e[1]];x.globalAlpha=0.45+0.55*((a[2]+b[2])/2+1)/2;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();});
      x.globalAlpha=1;});
    if(!fermo)espGiro=requestAnimationFrame(giro);}
  espGiro=requestAnimationFrame(giro);
}
