treeword is an experimentation in the field of interactive reading, using nested structure to display text or images

# how does it work ?

the content is represented as a nested tree, containing text or images. you'll need something like:

	[{	"id":0,
		"content":"un paragraphe",
		"size":18,
		"children":[{	"id":1,
						"content":"autre texte incroyable",
						"size":18,
					},
					{	"id":2,
						"content":"<img src="ici.gif">",
						"size":18,
					}]
	}]

each element will be represented as a clickable div (nodebox)

## edit.html

display a json tree file as a nested editable tree, using the formidable jQuery.nestable plugin

## show.html

display a json tree file

	treeword_build({ /* config options */ });

### options

* `id` id of the div you want to disturb (mandatory)
* `file` filepath of json file containing tree (mandatory)
* `border` css value of border for each nodebox (default `'none'`)
* `font-family` used for text inside nodeboxes (default `'Domine'`)
* `background-dad` background of a nodebox with children (default `'rgba(30,150,30,0.2)`)
* `background-dad-over` background of a nodebox without children (default `'rgba(40,180,40,0.5)'`)
* `background-son` background of a nodebox withou children (default `'rgba(200,80,80,0.2)'`)
	
# dependencies

* jQuery.js: https://github.com/jquery/jquery
* d3.js: https://github.com/mbostock/d3
* Nestable.js: https://github.com/dbushell/Nestable
* Underscore.js: http://underscorejs.org
* FitText.js: https://github.com/davatron5000/FitText.js