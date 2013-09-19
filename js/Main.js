/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var BEANSTALK = BEANSTALK || {};


BEANSTALK.Main = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Main';
	this.isPaused = false;

	// stage
	this.stageWidth = window.innerWidth - this.guiWidth;
	this.stageHeight = window.innerHeight;
	this.stageOffsetX = ((window.innerWidth - this.stageWidth) * 0.5) | 0;
	this.stageOffsetY = ((window.innerHeight - this.stageHeight) * 0.5) | 0;

	// dat.gui
	this.gui = null;

	// stats
	// this.stats = new Stats();
	// this.stats.domElement.style.position = 'absolute';

	// 3d
	this.beanStalk3D = null;

	this.init = function() {
		this.traceFunction("init");
		this.createListeners();


		this.gui = new BEANSTALK.Params("Params");
		this.gui.addEventListener("TOGGLE_VIEW", function() {
			scope.beanStalk3D.toggleWireFrame();
		});
		this.gui.createGui();

		this.beanStalk3D = new BEANSTALK.BeanStalk3D("BeanStalk3D");
		this.beanStalk3D.addEventListener("MORPH_SHAPE", function() {
			// scope.gui.randomizeAllValues();
		});
		this.beanStalk3D.init();
		this.beanStalk3D.setDimensions(this.stageWidth,this.stageHeight);
		this.beanStalk3D.createEnvironment();
		this.beanStalk3D.createLights();
		this.beanStalk3D.createSecondaryElements();
		this.beanStalk3D.createPrimaryElements();
		// this.beanStalk3D.createListeners();
		

		this.gui.set3DScope(this.beanStalk3D);
		this.gui.createListeners();

		this.loader = document.getElementById('loader');
		// document.body.appendChild(this.stats.domElement);

		// stop the user getting a text cursor
		document.onselectStart = function() {
			return false;
		};

		this.resize();
		this.play();
		return this;
	};


	this.update = function() {

		this.beanStalk3D.parse();
		this.beanStalk3D.draw();
		return this;
	};

	this.loop = function() {
		// this.stats.update();
		this.update();
		if (this.isPaused) {
			return this;
		}
		requestAnimationFrame(function() {
			scope.loop();
		});
		return this;
	};

	this.pausePlayToggle = function() {
		if (scope.isPaused) {
			this.play();
		} else {
			this.pause();
		}
	};

	this.play = function() {
		this.isPaused = false;
		this.beanStalk3D.enableTrackBall();
		this.loop();
		return this;
	};

	this.pause = function() {
		this.isPaused = true;
		this.beanStalk3D.disableTrackBall();
	};

	this.createListeners = function() {
		window.addEventListener('keydown', function() {
			scope.keyDown(event);
		}, false);

		window.addEventListener('resize', function() {
			scope.resize(event);
		}, false);

	};

	this.keyDown = function(event) {
		if (event.keyCode === 32) {
			this.pausePlayToggle();
		}

		// save stl
		if (event.keyCode === 83) {
			this.beanStalk3D.convertMesh();
		}
	};

	this.resize = function() {
		this.stageWidth = window.innerWidth - BEANSTALK.Params.guiWidth;
		this.stageHeight = window.innerHeight;

		this.beanStalk3D.setDimensions(this.stageWidth,this.stageHeight);
		this.beanStalk3D.resize();

		// this.stats.domElement.style.top = (10) + 'px';
		// this.stats.domElement.style.right = (BEANSTALK.Params.guiWidth + 10) + 'px';

	};

};

BEANSTALK.Main.prototype = new UNCTRL.BoilerPlate();
BEANSTALK.Main.prototype.constructor = BEANSTALK.Main;