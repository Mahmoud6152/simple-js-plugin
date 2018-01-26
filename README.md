# Simple js slider - javaScript slider plugin #

>A simple, responsive, and touch-enabled javaScript slider plugin.

Main features: 

* responsive
* touch-swipe
* infinite scrolling
* fade effect
* custome autoplay
* custom arrows and pagination
* no dependincies
* can be used multible times in a page

## Getting started ##

### 1. Get a copy of the plugin ###

You can fork or download the plugin from GitHub.

### 2. Load the required files ###

Inside the page's head tag include the slider's CSS file.

```html
<link rel="stylesheet" href="simplejs.min.css"/>
```

In the page's footer, just before <code>&lt;/body&gt;</code>, include the JavaScript file.

```html
<script src="simplejs.min.js"></script>
```

### 3. Create the HTML markup ###

```html
<div id="my-slider">
  <img class="sp-image" src="path/to/image1.jpg"/>
  <div> 
    <h3> my content </h3>
  </div>
  <img class="sp-image" src="path/to/image2.jpg"/>
  <img class="sp-image" src="path/to/image3.jpg"/>
</div>
```
the requierd structure is to only put your slides in a single div and give it an id to use later when startig the slider.

### 4. Instantiate the slider ###
in the main.js file start the slider. make sure it's in the global scope.
```javascript
simpleJs.start({
  containerId: "#my-slider", //the id of the container, this is the only requierd input.
  infinite: true, //endless sliding, defualt is true
  fade: false, //fading the slides, defualt is false
  pagination: true, //use to disable/enable pagination, defualt is true
  paginationColors: {main: 'transparent', border: 'gray', active: 'gray'},
  autoplayInterval: 0, //use to activate autoplay, 0 means disabled, set timer in milliseconds, defualt is 0.
  animationDuration: '1s', //sets the value of the transition property for all slides, must be in quotation marks. defualt is '1s'.
  btnIcons: {left: '<i></i>', right:'<i></i>'} //the icons to use as buttons, put what you would normally use in your html inside quotation marks, the defulat is an empty <i> tag
});
```
