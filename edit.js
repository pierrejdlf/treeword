function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
var baseurl = '/poa/treeword4/';
var editing = false;
var page = getURLParameter('p');
if(page==null) page=0;

var nestable = null;

var initTreeword = function() {
	
	$("#intro").html('<a href="'+baseurl+'show.html?p='+page+'">show content</a> NB: au début d‘un bloc, "10|blabla" modifie la taille du bloc (2=petit > 10=normal > 50=gros)');
	
	// + underscore.js templating engine converts json structure to well formatted html
	// + jquery.nestable.js transforms html to a draggable nested list
	// tree elements are editable by clic
	// on each update:
	//		serialized json is saved to disk through php
	// 		json data is rendered as d3 treemap
	
	var saveToDisk = function(json) {
		var url = baseurl+'edit_save.php';
		$.post(url,{'content':json,'fn':'saved_'+page+'.htm'},function(d) {
			console.log("SAVED: "+d);
		});	
	};

	var gett = $.get('upload/saved_'+page+'.htm', function(data) {
		loadIntoPage($.parseJSON(data));
	});
	gett.error( function() {
		var sampledata = [{"id":1,"content":"vide"},{"id":2,"content":"pas","children":[{"id":3,"content":"rien"},{"id":4,"content":"no"}]}];
		loadIntoPage(sampledata);
	});		
		
	var loadIntoPage = function(loadedjson) {
		console.log(loadedjson);
		if (loadedjson[0]['content']!='ajoutez moi')
			loadedjson.unshift({'id':'new',"myid":'new',"content":"ajoutez moi"});
		
		//console.log(loadedjson);
		// transform json to html list as wanted by jquery.nestable
		$.get('edit_nestedtemplate.html', function(rec) {
			//console.log(data);
			entriesTmpl = _.template( rec );
			$("#mynest").html(entriesTmpl({
				entries: loadedjson,
				tmpl: entriesTmpl,
			}));

			nestable = $('.dd').nestable({maxDepth:20});
			$('.dd').nestable('expandAll');
			
			// cells are editable on click
			$('.dd3-content').on('click',function() {
				if(editing) {
					$("#mynestext").html('');
					editing = false;
				}
				if(!editing) {
					var text = $(this).html();
					var id = $(this).parent().attr("myid");
					$(this).attr("id",id);
					$("#mynestext").append( $('<textarea id="modif_'+id+'" type="text"/>').val(text) );
					editing = true;
					$('#modif_'+id).focusout( function() {
						var updText = $(this).val();
						//console.log(updText+" "+id);
						$("#"+id).html(updText);
						// at each edit, we stringify result and save it to file using php
						var json = window.JSON.stringify( $('#mynest').nestable('serialize') );
						p = json;
						//console.log(json);
						saveToDisk(json);
						editing = false;
						$(this).remove();
					});
				}
			});
			$('.dd').on('change', function() {
				var json = window.JSON.stringify( $('.dd').nestable('serialize') );
				saveToDisk(json);
			});
		});
	};
};