treeword
========

treeword is an experimentation in the field of interactive reading

# how does it work ?

content is represented as a nested tree, containing text or images
at the moment, you'll need a json file
a typical tree looks like :

  [{	"id":0,
		"content":"un texte",
		"size":18,
		"children":[{	"id":1,
						"content":"le texte incroyable
						"size":18
					},
					{	"id":1,
						"content":"le texte incroyable
						"size":18
					}]
	}]

each element will be represented as a clickable div (nodebox)

## edit using edit.html

display a json tree file as a nested editable tree, using the formidable jQuery nestable plugin

## showing using show.html

display a json tree file

### options

* `id` id of the div you want to disturb
* `file` filepath of json file containing tree
* `border` css value of border for each nodebox (default `'none'`)
* `font-family` used for text inside nodeboxes (default `''Domine'`)
* `background-dad` background of a nodebox with children (default `'rgba(30,150,30,0.2)`)
* `background-dad-over` background of a nodebox without children (default `'rgba(40,180,40,0.5)`)
* `background-son` background of a nodebox withou children (default `'rgba(200,80,80,0.2)`)
	
# dependencies

* jQuery.js: https://github.com/jquery/jquery
* d3.js: https://github.com/mbostock/d3
* Nestable.js: https://github.com/dbushell/Nestable
* Underscore.js: http://underscorejs.org
* FitText.js: https://github.com/davatron5000/FitText.js
