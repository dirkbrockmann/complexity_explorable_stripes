(function(){
var width = 400,
	height = 400,
	control_box_width = 400,
	control_box_height = 400,
	sl_width = 200,
	sl_height = 120,
	sl_margin = {top:30,bottom:0,left:10,right:10},
	butt_width = 400,
	butt_margin = {top:150+40+25,bottom:0,left:30,right:30},
	cartoon_x = 330,
	cartoon_y = 70;

var sbl = new widget.block([3],sl_height,0,"[]"),
	bbl = new widget.block([2,1],butt_width-butt_margin.left-butt_margin.right,200,"[]");

var N = 150,
	epsilon = 0.01,
	dt=.1,
	cartoon_scale=5;

var	def_R1 = 5,
	def_R2 = 6.5,
	def_beta = 15;	
	
	
var pixel_width = width / N;
var pixel_height = height / N;
var X = d3.scaleLinear().domain([0,N]).range([0,width]);
var Y = d3.scaleLinear().domain([0,N]).range([0,height]);
var C = d3.scaleLinear().domain([-1,1]).range(["black","white"])

var R1 = {id:"r1", name:"Activation Radius R1", range:[1,5], value:def_R1},
	R2 = {id:"r2", name:"Inhibition Radius R2", range:[5,10], value:def_R2},
	beta = {id:"beta", name:"Interaction Steepness", range:[5,20], value:def_beta};

var playpause = { id:"b1", name:"", actions: ["play","pause"], value: 0};
var back = { id:"b2", name:"", actions: ["back"], value: 0};
var reload = { id:"b3", name:"", actions: ["reload"], value: 0};


var sliders = [
	new widget.slider(R1).width(sl_width-sl_margin.left-sl_margin.right).update(setr1),
	new widget.slider(R2).width(sl_width-sl_margin.left-sl_margin.right).update(setr2),
	new widget.slider(beta).width(sl_width-sl_margin.left-sl_margin.right)
]

var buttons = [
	new widget.button(playpause).update(runpause),
	new widget.button(back).update(reset),
	new widget.button(reload).update(rl)
]


var canvas  = d3.selectAll("#stripes-display").append("canvas")
	.attr("id", "canvas")
	.attr("width", width)
	.attr("height", height)

var controls = d3.selectAll("#stripes-controls").append("svg")
	.attr("width",control_box_width)
	.attr("height",control_box_height)


controls.selectAll(".slider").data(sliders).enter().append(widget.sliderElement)
	.attr("transform",function(d,i){return "translate("+sl_margin.left+","+(sl_margin.top+sbl.x(i))+")"});

controls.selectAll(".button").data(buttons).enter().append(widget.buttonElement)
	.attr("transform",function(d,i){return "translate("+(butt_margin.left+bbl.x(i))+","+butt_margin.top+")"});	

controls.append("circle").attr("r",cartoon_scale*R2.value).attr("id","circle_2")
	.attr("transform","translate("+cartoon_x+","+cartoon_y+")")
controls.append("circle").attr("r",cartoon_scale*R1.value).attr("id","circle_1")
	.attr("transform","translate("+cartoon_x+","+cartoon_y+")")
	
var context = canvas.node().getContext("2d");
var points = d3.range(N*N).map(function(i){	
	return { x: (i % N) , y: Math.floor(i / N), state: 2 * epsilon * (Math.random()-0.5)}
})

points.forEach(function(d,i){
	context.fillStyle = C(d.state);
	context.fillRect(X(d.x), Y(d.y), pixel_width, pixel_height);
	d.nn_r1=nn(i,N,R1.value).map(function(x){return points[x]});
	d.nn_r2=nn(i,N,R2.value).map(function(x){return points[x]});
})

runsim();


function setr1(){
	points.forEach(function(d,i){
		d.nn_r1=nn(i,N,R1.value).map(function(x){return points[x]});
	})
	d3.select("#circle_1").attr("r",cartoon_scale*R1.value);
	d3.select("#circle_2").attr("r",cartoon_scale*R2.value);
}

function setr2(){
	points.forEach(function(d,i){
		d.nn_r2=nn(i,N,R2.value).map(function(x){return points[x]});
	})
	d3.select("#circle_1").attr("r",cartoon_scale*R1.value);
	d3.select("#circle_2").attr("r",cartoon_scale*R2.value);
}


function reset(){
	 points = d3.range(N*N).map(function(i){
		return { x: (i % N) , y: Math.floor(i / N), state: 2 * epsilon * (Math.random()-0.5)}
	 })
	 setr1();
	 setr2();
		
	 points.forEach(function(d,i){
		context.fillStyle=C(d.state);
			context.fillRect(X(d.x), Y(d.y), pixel_width, pixel_height);
		
	})
	runsim();
	runsim();
}

function rl(){ 
	sliders[0].click(def_R1);
	sliders[1].click(def_R2);
	sliders[2].click(def_beta);
}

var t;

function runpause(d){ d.value() == 1 ? t = d3.timer(runsim,0) : t.stop(); }

function runsim(){	

	points.forEach(function(d){
		var h = 2*d3.sum(d.nn_r1,function(x){return x.state})-d3.sum(d.nn_r2,function(x){return x.state});
		h=h / d.nn_r2.length;
		d.s = sigmoid(h);		
	});	

	points.forEach(function(d,i){
		d.state+=dt*(d.s-d.state);
		
		context.fillStyle=C(d.state);
		context.fillRect(X(d.x), Y(d.y), pixel_width, pixel_height);
	})	
}

function sigmoid(x){
	var z = Math.exp(-beta.value*x);
	return (1-z)/(1+z);
}

function d2l(x,y,n){ return y*n+x; }
function l2d(i,n){ return [i % n, Math.floor(i/n)];}
function nn(k,n,R){
	var wadda=[];
	var L = Math.ceil(R); 
	for(i=-L;i<=L;i++){
		for(j=-L;j<=L;j++){
			p = l2d(k,n);
			x = p[0];y = p[1];
			a = x + i; b = y+j;
			if (!(j == 0 && i==0) && (i*i + j*j) <= R*R) {
				wadda.push(n*((b+n)%n)+(a+n)%n);
			}
		}
	}
	return wadda;
}
})()
