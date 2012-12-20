var treeword_build = function(options) {
	$.get(options['file'], function(data) {
		options['tree'] = $.parseJSON(data);
		loadTreemap(options);
	});
};
var loadTreemap	= function(options) {
	//console.log(tree);
	
	var unikid 			= options['id'];
	var tree 			= options['tree'];
	var fontfamily 		= options['font-family'] || 'Arial' ;
	var background_dad 		= options['background-dad'] || "rgba(220,220,220,0.2)";
	var background_dad_over = options['background-dad-over'] || "rgba(250,250,250,0.5)";
	var background_son 		= options['background-son'] || "rgba(200,200,250,0.2)";
	var data = {'content':'root','children':tree};
	
	var w = $("#"+unikid).width() || 640 ,
		h = $("#"+unikid).height() || 480 ,
		x = d3.scale.linear().range([0, w]),
		y = d3.scale.linear().range([0, h]),
		color = d3.scale.category20c(),
		root, node;
	node = root = data;	
	console.log("Loading Treeword ("+unikid+"|"+options['file']+") with size ["+w+","+h+"]");
	
	// layout
	var treemap = d3.layout.treemap()
		.padding(0)
		.round(false)
		.size([w, h])
		.sticky(true)
		.value(function(d,i) {
			if(d.content.split('|').length==2)
				return d.content.split('|')[0];
			else return 10;//d.content.length;
		});
	var nodes = treemap.nodes(root);//.filter(function(d) { return !d.children; });
	var mezoom = d3.behavior.zoom().scaleExtent([1,10]);//.on("zoom", redrawtree);
		
	// htm
	//var taille = function(d) { return d.r*2*0.8; }
	var htm = d3.select("#"+unikid).append("div").attr("class","boxcontainer")
		.style("width",w+"px").style("height",h+"px")
		.call(mezoom);
	
	// hidden div to test font sizes
	// warning: text algorythm needs to know padding, so update it if you change something
	d3.select("#"+unikid).append("div")
		.attr("id",unikid+"_fonttest")
		.style("display","block")
		.style("visibility","hidden")
		.style("padding","8px")
		.style("font-family",fontfamily)
	.append("div");
		
	var godeep = function(d,elem) {
		if(d.children) {
			d3.select(elem).transition().duration(300).style("opacity",0);
			d3.select(elem).style("pointer-events","none");
			d.children.forEach(function(u){
				//d3.select("#box_"+u.id+" .boxtext").transition().duration(200).style("color","#383838");
				//d3.select("#box_"+u.id+" .boxtext").transition().duration(200).style("text-shadow", "none");
				htm.select("#box_"+u.id+" .child").transition().duration(200).style("opacity",1);
			});
		}	
	};
	var adjustFontSize = function(d,elm) {
		// depends on padding set up in css
		var padd = 8;
		var margforinner = -16; // wtf !
		
		// first guess, quite big
		var ss = 7+Math.sqrt(d.dx*d.dy/(d.content.length));
		// test if more that biggest word alone
		var cont = d.content;
		if(d.content.split('|').length>1)
			cont = d.content.split('|')[1];
		cont = cont.replace(/<.+>/," ");
		var words = cont.split(" ");
		var maxword = words.sort(function(a,b){return b.length-a.length;})[0];
		//console.log("===== max word: "+d.content+" ||| "+maxword);
		$("#"+unikid+"_fonttest div").html(maxword);
		$("#"+unikid+"_fonttest").css({"width":d.dx-2*padd,"height":d.dx}).bigtext();
		var bf = $("#"+unikid+" .bigtext-line0").css('font-size').replace("px","");
		//console.log("font:"+bf);
		
		// if more then keep like biggest word alone in line
		if(ss>bf) ss=bf;
		d3.select(elm).style("font-size",ss+"px");
		
		// test if overflow-y ... thinking of padding:8px
		var height = d.dy;
		var innerHeight = elm.scrollHeight-margforinner-(2*padd);
		//console.log("====== checking:"+height+" in:"+innerHeight);
		var cc = 0;
		while(innerHeight > height) {
			var dif = innerHeight - height;
			var size = d3.select(elm).style("font-size").replace("px","");
			var dec = Math.max(2,dif/50);
			size = size - dec;
			//console.log(d.content+" dif:"+dif+" (dec:"+dec+") (fs:"+size+")");
			d3.select(elm).style("font-size", size+"px");
			innerHeight = elm.scrollHeight-margforinner-(2*padd);
			//console.log(height+" "+innerHeight);
			cc+=1;
			if(size<2) break;
		}
		//console.log("====== final:"+height+" in:"+innerHeight);
		//console.log("Fontsize ("+cc+") iterations for: "+cont);
		ss=size;
		d3.select(elm).style("font-size",ss+"px");
	};
	var adjustImageSize = function(d,elm) {
		// if contains image, then fill in con image
		if(d3.select(elm).selectAll("img")[0].length>0) {
			d3.select(elm).selectAll("img").on("load",function() {
				var imdiv = d3.select(elm);
				imdiv.attr("class","child boximg");
				var im = imdiv.select("img");
				var iw = $('#box_'+d.id+' img').width();
				var ih = $('#box_'+d.id+' img').height();
				var bw = htm.select('#box_'+d.id).style('width').replace("px","");
				var bh = htm.select('#box_'+d.id).style('height').replace("px","");
				//console.log(bw+" "+bh);
				//console.log(iw+" "+ih);
				imdiv.style("width",bw+"px");
				imdiv.style("height",bh+"px");
				var mw,mh = null;
				if(iw/ih>bw/bh) {
					mh = bh;
					mw = mh*iw/ih;
				} else {
					mw = bw;
					mh = mw*ih/iw;
				}
				im.style("width",mw+"px")
					.style("height",mh+"px")
					.style("left",-mw/2+bw/2+"px")
					.style("top",-mh/2+bh/2+"px");
			});
		}
	};
	
	var node = htm.selectAll(".node")
		.data(nodes)
		.enter().append("div")
		.attr("class",function(d) {
			var cs = "boxnode";
			cs += d.children ? " dad" : " son";
			cs += d.depth==1 ? "" : " below";
			return cs;
		})
		.attr('id',function(d,i) { return "box_"+d.id;})
		.style("width",function(d) { return mezoom.scale()*d.dx+"px";})
		.style("height",function(d) { return mezoom.scale()*d.dy+"px";})
		.style("left", function(d) { return mezoom.translate()[0]+d.x+"px"; })
		.style("top", function(d) { return mezoom.translate()[1]+d.y+"px"; })
		.style("z-index", function(d) {return d.depth==0 ? 0 : 1000-d.depth;})
		.style('background', function(d) { return d.children ? background_dad : background_son ;})
		.on('mouseover',function(d){ d3.select(this).style('background', function(d) { return d.children ? background_dad_over : background_son ;}); })
		.on('mouseout',function(d){
			d3.select(this).style('background', function(d) { return d.children ? background_dad : background_son ;});
/*
			// reshow last level
			console.log(d);
			if(d.depth>=2) {
				d3.select(this).transition().duration(200).style("opacity",0.05);
				d.parent.children.forEach(function(u){
					d3.select("#box_"+u.id+" .boxtext").transition().duration(200).style("opacity",0.05);
				});
				d3.select("#box_"+d.parent.id+" .boxtext").transition().duration(200).style("opacity",1);
				d3.select(this).style("pointer-events","");
			}
			d3.event.stopPropagation();		
*/
		})
		.each(function(d){
			if(options['border'])
				d3.select(this).style("border",options['border']);
			else {
				d3.select(this).style("border-right","1px dashed rgba(100,100,100,0.2)");
				d3.select(this).style("border-top","1px dashed rgba(100,100,100,0.2)");
			}
		})
		.on('mousemove', function(d) {
			if(d.children) {
				var intv = 0.01;
				var opc = htm.select("#box_"+d.children[0].id+" .child").style("opacity");
				var op = d3.select(this).style("opacity");
				op -= intv;
				opc = parseFloat(opc) + intv;
				//console.log("op:"+opc);
				//d3.select(this).style("opacity",op);
/*
				d.children.forEach(function(u){
					d3.select("#box_"+u.id+" .child").style("opacity",opc);
				});
*/
				if(op<0.1) godeep(d,this);
			}
			d3.event.stopPropagation();	
	
		})
		.on("click", function(d) {
			// hide current and show more depth
			godeep(d,this);
			d3.event.stopPropagation();			
		})
	node.append("div")
		.attr("class","child boxtext")
		//.style("z-index", function(d) {return d.depth==0 ? 0 : 1001-d.depth;})
		.style("color", function(d) { return d3.scale.category20b(d.depth);})
		.style("opacity", function(d) { return d.depth==1 ? 1 : 0.05;})
		.style("text-align",function(d,i){ return i%2==0 ? "right" : "left" ;})
		.style("font-family",fontfamily)
		.html(function(d) {
			var t = d.content;
			if (t.split("|").length>1) t = t.split("|")[1]; 
			return d.depth==0 ? "" : t ;
		})
		.each(function(d){ adjustFontSize(d,this); })
		.each(function(d){ adjustImageSize(d,this); });
};