/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var BEANSTALK = BEANSTALK || {};

BEANSTALK.Params = {};
BEANSTALK.Sliders = {};

BEANSTALK.Params = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Params';
	this.scope3d = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		BEANSTALK.Params = {
			orbitSpeed: 0.0001,
			guiWidth: 300,
			radius: 200,
			radiusRange: .75,
			centerRadius: 10,
			centerSpeed: 0.1,
			centerOffset: 0.001,
			multiplier: 10.0005,
			heightOffset: 10,
			waterHeight: 10,
			maxHeightRange: 1,
			noiseSpeed: .05,
			noiseAmount: .3,
			noiseIntensity:1,
			speed: 0.25,
			colorSpeed:.0001,
			colorRange:.125,
			wrapAmount: 1.0,
			delay: 0.150,
			randomizeAllValues: function(){
				scope.randomizeAllValues();
			},
			randomizeColor: function(){
				scope.randomizeColor();
			},
			toggleView: function(){
				scope.toggleView();
			},
			randomizeTotalNumbers: function(){
				scope.randomizeTotalNumbers();
			}

		};

		this.gui = new dat.GUI({
			width: BEANSTALK.Params.guiWidth,
			// autoPlace: false
		});

		this.guiContainer = this.gui.domElement;

		this.guiContainer.onselectStart = function() {
			return false;
		};

		var f1 = this.gui.addFolder('BEANSTALK');
		var f2 = this.gui.addFolder('GLOBAL');

		BEANSTALK.Sliders.speed = f2.add(BEANSTALK.Params, 'speed', -1.0, 1.0).step(0.0005).name('speed');
		BEANSTALK.Sliders.delay = f2.add(BEANSTALK.Params, 'delay', 0.0, 2.0).step(0.0005).name('delay');

		BEANSTALK.Sliders.noiseSpeed = f1.add(BEANSTALK.Params, 'noiseSpeed', -.35, .35).step(0.0005).name('noiseSpeed');
		BEANSTALK.Sliders.noiseAmount = f1.add(BEANSTALK.Params, 'noiseAmount', 0, 3).step(0.0005).name('noiseAmount');
		BEANSTALK.Sliders.noiseIntensity = f1.add(BEANSTALK.Params, 'noiseIntensity', .25, 2).step(0.0005).name('noiseIntensity');
		
		BEANSTALK.Sliders.radiusRange = f1.add(BEANSTALK.Params, 'radiusRange', 0.5, 1).step(0.0005).name('radiusRange');
		BEANSTALK.Sliders.radius = f1.add(BEANSTALK.Params, 'radius', 100, 400).step(0.0005).name('radius');

		BEANSTALK.Sliders.centerRadius = f1.add(BEANSTALK.Params, 'centerRadius', 0, 25).step(0.0005).name('centerRadius');
		BEANSTALK.Sliders.centerSpeed = f1.add(BEANSTALK.Params, 'centerSpeed', -.1, .1).step(0.0005).name('centerSpeed');
		BEANSTALK.Sliders.centerOffset = f1.add(BEANSTALK.Params, 'centerOffset', -2, 2).step(0.0005).name('centerOffset');

		BEANSTALK.Sliders.multiplier = f1.add(BEANSTALK.Params, 'multiplier', -15, 15).step(0.0005).name('multiplier');
		BEANSTALK.Sliders.maxHeightRange = f1.add(BEANSTALK.Params, 'maxHeightRange', -1, 1).step(0.0005).name('maxHeightRange');
		
		BEANSTALK.Sliders.heightOffset = f1.add(BEANSTALK.Params, 'heightOffset', -50, 50).step(0.0005).name('heightOffset');
		BEANSTALK.Sliders.waterHeight = f1.add(BEANSTALK.Params, 'waterHeight', -100, 50).step(0.0005).name('waterHeight');

		BEANSTALK.Sliders.wrapAmount = f1.add(BEANSTALK.Params, 'wrapAmount', 0, 1).step(0.0005).name('wrapAmount');
		BEANSTALK.Sliders.orbitSpeed = f1.add(BEANSTALK.Params, 'orbitSpeed', -.1, .1).step(0.0005).name('orbitSpeed');

		BEANSTALK.Sliders.colorSpeed = f1.add(BEANSTALK.Params, 'colorSpeed', -.001, .001).step(0.0005).name('colorSpeed');
		BEANSTALK.Sliders.colorRange = f1.add(BEANSTALK.Params, 'colorRange', .0, .35).step(0.0005).name('colorRange');

		this.gui.add(BEANSTALK.Params, 'randomizeAllValues').name('MORPH SHAPE');
		f2.add(BEANSTALK.Params, 'randomizeColor').name('UPDATE COLOR');
		// f2.add(BEANSTALK.Params, 'randomizeTotalNumbers').name('CHANGE RES');
		f2.add(BEANSTALK.Params, 'toggleView').name('CHANGE VIEW');

		f1.open();
		f2.open();

		this.guiContainer = document.getElementById('guiContainer');
		this.guiContainer.appendChild(this.gui.domElement);

		return this;

	};
	this.createListeners = function(arg){

		return this;

	};

	this.createTween = function(arg){
		var slider = arg.slider;
		var param = arg.param;
		var endValue = arg.endValue ? arg.endValue : (slider.__max - slider.__min)*Math.random() + slider.__min;
		var delayValue = arg.delay ? arg.delay : 0;
		var setter = 
		(function( id ){
			return function(element, state) {
				slider.setValue(state.value);
			}
		})(slider);
		return {
			time:delayValue,
			duration:BEANSTALK.Params.speed,
			effect:'quadInOut', 
			start:param,
			stop:endValue,
			onFrame:setter,
			onStop:setter,
		}
	}


	this.toggleView = function() {
		trace("toggleView");
		this.dispatchEvent("TOGGLE_VIEW",[]);
		return this;
	};


	this.randomizeTotalNumbers = function() {
		trace("randomizeTotalNumbers");
		window.location.href=window.location.pathname + "?totalWidth=" +((Math.random()*20)|0 + 2)+ "&totalDepth=" + ((Math.random()*20)|0 + 2);
		return this;
	};
	
	this.randomizeColor = function() {
		// trace("randomizeColor");
		var tweens = [];
		var tween;

		function delayer (total){

			var order = shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*BEANSTALK.Params.delay;
			};
		};

		var getItemDelay = delayer(2);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.colorSpeed,  param:BEANSTALK.Params.colorSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.colorRange, param:BEANSTALK.Params.colorRange}));

		tween = {
			time:0,
			duration:BEANSTALK.Params.speed,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				// scope.waiter();
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();
		return this;

	};	
	this.randomizeAllValues = function() {
		// trace("randomizeAllValues");
		var tweens = [];
		var tween;

		function delayer (total){
			var order = shuffleArray(total);
			var counter = 0;
			return function(e){
				return order[counter++]*BEANSTALK.Params.delay;
			};
		};

		var getItemDelay = delayer(14);

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.noiseSpeed,  param:BEANSTALK.Params.noiseSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.noiseAmount,  param:BEANSTALK.Params.noiseAmount}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.noiseIntensity,  param:BEANSTALK.Params.noiseIntensity}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.radiusRange,  param:BEANSTALK.Params.radiusRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.radius,  param:BEANSTALK.Params.radius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.centerRadius,  param:BEANSTALK.Params.centerRadius}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.centerSpeed,  param:BEANSTALK.Params.centerSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.centerOffset,  param:BEANSTALK.Params.centerOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.multiplier,  param:BEANSTALK.Params.multiplier}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.maxHeightRange,  param:BEANSTALK.Params.maxHeightRange}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.heightOffset,  param:BEANSTALK.Params.heightOffset}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.waterHeight,  param:BEANSTALK.Params.waterHeight}));

		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.colorSpeed,  param:BEANSTALK.Params.colorSpeed}));
		tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.colorRange, param:BEANSTALK.Params.colorRange}));

		// tweens.push(this.createTween({ delay:getItemDelay(),  slider:BEANSTALK.Sliders.wrapAmount,  param:BEANSTALK.Params.wrapAmount}));
		tween = {
			time:0,
			duration:BEANSTALK.Params.speed,
			effect: 'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				// scope.waiter();
			},
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();
		return this;

	};

	this.waiter = function() {
		// trace("waiter");
		var tweens = [];
		var tween;

		tween = {
			time:0,
			duration:BEANSTALK.Params.speed*.5,
			effect:'easeInOut',
			start:0,
			stop:1,
			onStop:function(){
				scope.randomizeAllValues();
			}
		}
		tweens.push(tween);
		$('#proxy').clear();
		$('#proxy').tween(tweens).play();

		return this;
	};

	this.set3DScope = function(arg) {
		this.scope3d = arg;
		return this;
	};

};

BEANSTALK.Params.prototype = new UNCTRL.BoilerPlate();
BEANSTALK.Params.prototype.constructor = BEANSTALK.Params;