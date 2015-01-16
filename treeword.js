var GLOBALCOUNTERID = 0;
var recursiveUpdateElements = function(list) {
	list.forEach(function(d) {
		d.size = 1;
		d.myid = GLOBALCOUNTERID++;
		if(d.children)
			recursiveUpdateElements(d.children);
	});
};

var treeword_build = function(options) {
	$.get(options.uri, function(data) {
		if(options.setidsizes) {
			recursiveUpdateElements(data);
		}
		options.tree = data;
		loadTreemap(options);
	});
};
var loadTreemap	= function(options) {
	//console.log(tree);

	var DURIN = 	options.durin;
	var DUROUT =	options.durout;
	var unikid = 	options.id;
	var tree = 		options.tree;
	var fontfamily = options['font-family'] || 'Domine' ;
	var data = {'content':'root','children':tree};
	
	var w = options['w'] || $("#"+unikid).width() || 350 ,
		h = options['h'] || $("#"+unikid).height() || 200 ,
		x = d3.scale.linear().range([0, w]),
		y = d3.scale.linear().range([0, h]),
		color = d3.scale.category20c(),
		root, node;
	node = root = data;	
	console.log("Loading Treeword ("+unikid+"|"+options.uri+") with size ["+w+","+h+"]");
	
	// layout
	var treemap = d3.layout.treemap()
		.padding(0)
		.round(false)
		.size([w, h])
		.sticky(true)
		.value(function(d,i) {
			if(d.content.split('|').length>1) {
					var vv = d.content.split('|')[0];
					//console.log(vv);
					if(vv.length>0) return vv; else return 10;
				}
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
		.style("position","fixed")
		.style("left",0)
		.style("top",0)
		.style("visibility","hidden")
		.style("padding","8px")
		.style("border","1px solid")
		.style("font-family",fontfamily)
	.append("div").style("font-family",fontfamily);
	
/*
	var checkregular = setInterval(function(){
		console.log(". check .");
	},400);
*/
	
/*
	var godeep = function(d,elem) {
		if(d.children) {
			//d3.select(elem).transition().duration(300).style("opacity",0);
			d3.select(elem).style("pointer-events","none");
			d.children.forEach(function(u){
				//d3.select("#box_"+u.id+" .boxtext").transition().duration(200).style("color","#383838");
				//d3.select("#box_"+u.id+" .boxtext").transition().duration(200).style("text-shadow", "none");
				htm.select("#box_"+u.id+" .child").transition().duration(200).style("opacity",1);
			});
		}	
	};
*/
	var adjustFontSize = function(d,elm) {
		// depends on padding set up in css
		var padd = 8;
		var margforinner = 0; // wtf !
		
		// first guess, quite big
		var ss = 7+Math.sqrt(d.dx*d.dy/(d.content.length));
		// test if more that biggest word alone
		var cont = d.content;
		if(d.content.split('|').length>1)
			cont = d.content.split('|').slice(-1)[0];
		cont = cont.replace(/<.+>/," ");
		var words = cont.split(" ");
		var maxword = words.sort(function(a,b){return b.length-a.length;})[0];
		//console.log("===== max word: ["+maxword+"] FROM: "+d.content);
		$("#"+unikid+"_fonttest div").html(maxword);
		$("#"+unikid+"_fonttest").css({"width":d.dx-2*padd+"px","height":d.dx/2+"px","padding":padd+"px"});
		$("#"+unikid+"_fonttest").bigtext();
		var bf = $("#"+unikid+" .bigtext-line0").css('font-size').replace("px","");
		//console.log("===== bigtextsize:"+bf);
		
		// if more then keep like biggest word alone in line
		if(ss>bf) ss=bf;
		d3.select(elm).style("font-size",ss+"px");	
		
		// test if overflow-y ... thinking of padding:8px
		var height = d.dy;
		var innerHeight = elm.scrollHeight-margforinner+padd;
		//console.log("====== checking:"+height+" in:"+innerHeight);
		var cc = 0;
		while(innerHeight > height) {
			var dif = innerHeight - height;
			var size = d3.select(elm).style("font-size").replace("px","");
			var dec = Math.max(2,dif/50);
			size = size - dec;
			//console.log(d.content+" dif:"+dif+" (dec:"+dec+") (fs:"+size+")");
			d3.select(elm).style("font-size", size+"px");
			innerHeight = elm.scrollHeight-margforinner+padd;
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
	////////////////////////////////////////////////////////////////////////////////////////////////
	var currentParentId = -1;
	var reshowTheElem = function(d,elem) {
		//console.log("UNDIG..: depth="+d.depth+" = "+d.content);
		elem.transition().duration(DUROUT).style("opacity",1).each("end",function(){
			//console.log("op=1");
			if( d.depth>0 && currentParentId!=d.parent.id ) { // do not reshow if we are still in the children !
				var pelem = htm.select("#box_"+d.parent.id);
				//console.log("letting appear parent node: "+d.parent.content+" (depth:"+d.parent.depth);
				pelem.style("opacity",0);
				pelem.style("display","");
				pelem.style("pointer-events","");
				reshowTheElem(d.parent,pelem);
			}	
		});
	};
	var digTheElement = function(d,elem) {
		//console.log("DIG..: "+d.content);
		if(d.children && elem.attr("disapearing")!=1) { // if has children & not already disapearing
			elem.attr("sable",0);
			elem.attr("disapearing",1);
			elem.transition().duration(DURIN).style("opacity",0).each("end",function(){
				//console.log("op=0");
				elem.style("display","none");
				elem.style("pointer-events","none");
				elem.attr("disapearing",0);
			});
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////
	var node = htm.selectAll(".node")
		.data(nodes)
		.enter().append("div")
		.attr("class",function(d) {
			var cs = "boxnode";
			cs += d.children ? " dad" : " son";
			cs += d.depth==1 ? "" : " below";
			var sp = d.content.split('|');
			if(sp.length>2)
				cs += " boxnode_"+sp[1];
			return cs;
		})
		.attr('id',function(d,i) { return "box_"+d.id;})
		.attr("sable",0)
		.style("width",function(d) { return mezoom.scale()*d.dx+"px";})
		.style("height",function(d) { return mezoom.scale()*d.dy+"px";})
		.style("left", function(d) { return mezoom.translate()[0]+d.x+"px"; })
		.style("top", function(d) { return mezoom.translate()[1]+d.y+"px"; })
		.style("z-index", function(d) {return d.depth==0 ? 0 : 1000-d.depth;});

	if(options.autodig) {
		node.on('mouseout',function(d){
			currentParentId = -1;
			d3.select(this).attr("sable",0);
			if(d3.select(this).style("opacity")!=0 && d3.select(this).attr("disapearing")!=1) {
				//console.log("OUT of: "+d.content);
				//d3.select(this).classed("mover",false).classed("mout",true);
				reshowTheElem(d,d3.select(this));
			}
		});
		
		node.on('mouseover',function(d){
			currentParentId = d.parent.id;
		});
		
		//node.each(function(d){})
		node.on('mousemove', function(d) {
			if(d3.select(this).attr("disapearing")!=1) {
				// count the mousemoves
				var sab = parseInt(d3.select(this).attr("sable"));
				d3.select(this).attr("sable",sab+1);
				//console.log("sable: "+sab);
				if(d3.select(this).attr("sable")>15) { // if a lot of mousemoves, then we strat to fade-out
					digTheElement(d,d3.select(this));
					//d3.select(this).classed("mover",true).classed("mout",false);
				}
			}
		});
	}
	
	node.on("click", function(d) {
		// hide current and show more depth
		digTheElement(d,d3.select(this));
		//d3.event.stopPropagation();			
	});

	var nodts = node.append("div")
		.attr("class","child boxtext")
		//.style("z-index", function(d) {return d.depth==0 ? 0 : 1001-d.depth;})
		//.style("color", function(d) { return d3.scale.category20b(d.depth);})
		.style("opacity", 1)//function(d) { return d.depth==1 ? 1 : 0.05;})
		.style("text-align",function(d,i) {return i%2==0 ? "right" : "left" ;})
		//.style("font-family",function(d) {return fontfamily;})
		.html(function(d) {
			var t = d.content;
			if(t=="i") return '<img src="sk/sc_0'+parseInt(Math.random()*93)+'.png">';
			if (t.split("|").length>1) t = t.split("|").slice(-1)[0]; 
			return d.depth==0 ? "" : t ;
		});
	nodts.each(function(d){ if(d.depth!=0) adjustFontSize(d,this); });
	nodts.each(function(d){ if(d.depth!=0) adjustImageSize(d,this); });
};