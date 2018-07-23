# Example Complexity Explorable

Here's an example of the [Complexity Explorables](http://rocs.hu-berlin.de/explorables/), this one is the essence of [**Keith Haring's Mexican**](http://rocs.hu-berlin.de/explorables/explorables/stripes/) hat that illustrates pattern formation by local excitation and long range inhibition.

All explorables have the same basic structure of code bits.

## index.html

This file is essentially the header that loads fonts externally and some other stuff:

### CSS

1. `<link rel="stylesheet" type="text/css" href="widget.v2.2.css" />`: the styles for the widget
2. `<link rel="stylesheet" type="text/css" href="styles.css" />`: the styles for the page
3. `<link rel="stylesheet" type="text/css" href="stripes.css" />`: the styles for this particular explorable

### header javascript

1.  `<script type="text/javascript" src="d3.v4.min.js"></script>` : the version of D3js used in this explorable
2.  `<script type="text/javascript" src="widget.v2.2.js"></script>` : the js code for the widgets

### Container

The js code for the explorable (see below) inserts the display and the control boxes into the DOM here:

```
<div class="toolbox">
	<div id="stripes-display" class="toolbox display-panel"></div>
	<div id="stripes-controls" class="toolbox control-panel"></div>
</div>
```

### Explorable Code

Finally the explorable code is loaded here:

```
<script type="text/javascript" src="stripes.js"></script>
```

and executed

# Installation

1. make a directory
2. add all the files to it
3. launch a local http server from that directory


