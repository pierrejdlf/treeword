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

## EDIT

Formerly, `edit.html` displayed a json tree file as a nested editable tree, using the jQuery.nestable plugin
But there is an easier way using an gingkoapp tree json url

## DISPLAY

`show.html` display a json tree file

	treeword_build({ /* config options */ });

### options

* `id` id of the div you want to disturb (mandatory)
* `file` filepath of json file containing tree (mandatory)
* `border` css value of border for each nodebox (default `'none'`)
* `font-family` used for text inside nodeboxes (default `'Domine'`)
	
# dependencies

* jQuery.js: https://github.com/jquery/jquery
* d3.js: https://github.com/mbostock/d3
* Nestable.js: https://github.com/dbushell/Nestable
* Underscore.js: http://underscorejs.org
* FitText.js: https://github.com/davatron5000/FitText.js