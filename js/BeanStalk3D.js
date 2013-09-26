/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */


BEANSTALK.BeanStalk3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'BeanStalk3D';

	// 3d vars
	this.container = null;
	this.projector = null;
	this.camera = null;
	this.scene = null;
	this.raycaster = null;
	this.intersected = null;
	this.controls = null;
	this.cube = null;

	this.stageWidth = 0;
	this.stageHeight = 0;
	this.stageOffsetX = 0;
	this.stageOffsetY = 0;

	this.count = 0;
	this.centerCount = 0;

	this.pointLightA = null;

	this.customPlanes = null;
	this.customWirePlanes = null;
	this.water = null;
	this.ground = null;

	this.particles = null;

	this.totalPlanesH = getUrlVars()["totalWidth"] ? getUrlVars()["totalWidth"] : 12;
	this.totalPlanesV = getUrlVars()["totalDepth"] ? getUrlVars()["totalDepth"] : 6;
	this.totalVerticesH = this.totalPlanesH*2 + 1;
	this.totalVerticesV = this.totalPlanesV*2 + 1;
	this.totalVertices = this.totalVerticesH * this.totalVerticesV;

	this.maxHeightCache = null;
	this.maxHeightCacheSize = 20;

	this.colorOffset = .5;

	this.haloLine = null;

	this.halo = null;
	this.haloDot = null;

	this.primaryLine = null;
	this.primaryTangentALine = null;
	this.primaryTangentBLine = null;
	this.primaryTangentCLine = null;
	this.primaryTangentDLine = null;
	this.totalHeightIncrements = 200;

	this.primaryLineNormals = null;
	this.crossLineNormals = null;

	this.tangentLineANormals = null;
	this.tangentLineBNormals = null;
	this.tangentLineCNormals = null;
	this.tangentLineDNormals = null;

	// ---------------------------------------------------------
	// instantiation
	// ---------------------------------------------------------

	this.init = function() {
		this.traceFunction("init");

		// this.perlin = new ClassicalNoise();
		this.perlin = new SimplexNoise();
		return this;
	};

	this.createEnvironment = function() {
		// this.traceFunction("createEnvironment");

		this.projector = new THREE.Projector(); // used for mouse position in 3d space
		this.scene = new THREE.Scene();
		this.base = new THREE.Object3D();
		this.scene.add(this.base);

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3000 );
		this.camera.position.x = 0;
		this.camera.position.y = 300;
		this.camera.position.z = 400;

		this.controls = new THREE.TrackballControls( this.camera, document.getElementById('container3D'));
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		this.controls.keys = [ 65, 83, 68 ];

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		this.renderer.setClearColor(0xEEEEEE, 1);
		this.renderer.setSize(this.stageWidth, this.stageHeight);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.physicallyBasedShading = true;

		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapCullFace = THREE.CullFaceBack;

		this.container = document.getElementById('container3D');
		this.container.appendChild(this.renderer.domElement);

		return this;
	};

	this.createLights = function() {
		
		this.scene.add( new THREE.AmbientLight( 0xCCCCCC ) );

		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 300, 0 );
		this.scene.add( hemiLight );

		this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		// this.dirLight.color.setHSL( 0.1, 1, 0.95 );
		this.dirLight.position.set( -2.5, 2.5, 2.5 );
		this.dirLight.position.multiplyScalar( 100 );
		this.scene.add( this.dirLight );

		this.dirLight.castShadow = true;
		this.dirLight.shadowMapWidth = 3500;
		this.dirLight.shadowMapHeight = 3500;

		var d = 800;

		this.dirLight.shadowCameraLeft = -d;
		this.dirLight.shadowCameraRight = d;
		this.dirLight.shadowCameraTop = d;
		this.dirLight.shadowCameraBottom = -d;

		this.dirLight.shadowCameraFar = 3500;
		this.dirLight.shadowBias = -0.0001;
		this.dirLight.shadowDarkness = 0.35;
		// this.dirLight.shadowCameraVisible = true;

		return this;
	};

	this.createListeners = function() {
		this.container.addEventListener('mousedown', function(event) {
			scope.onDocumentMouseDown(event);
		}, false);
		
		return this;
	};

	this.createElements = function() {
		// trace("createElements")
		this.createPrimaryLine();
		this.createPrimaryTangentLine();

		return this;
	};

	this.createPrimaryLine = function() {
		this.traceFunction("createPrimaryLine");

		var i,
			geometry, 
			material,
			percentage,
			total = this.totalHeightIncrements;

		material = new THREE.LineBasicMaterial({ color: 0xFF00FF});
		geometry = new THREE.Geometry();

		this.primaryLineNormals = [];
		this.crossLineNormals = [];
		this.tangentLineANormals = [];
		this.tangentLineBNormals = [];
		this.tangentLineCNormals = [];
		this.tangentLineDNormals = [];

		for(i = 0; i < total; i++) {
			geometry.vertices.push(new THREE.Vector3(Math.random()*50-25, Math.random()*50-25, Math.random()*50-25 ));
			this.primaryLineNormals.push(new THREE.Vector3());
			this.crossLineNormals.push(new THREE.Vector3());
			this.tangentLineANormals.push(new THREE.Vector3());
			this.tangentLineBNormals.push(new THREE.Vector3());
			this.tangentLineCNormals.push(new THREE.Vector3());
			this.tangentLineDNormals.push(new THREE.Vector3());

		}
		
		this.primaryLine = new THREE.Line( geometry, material );
		this.primaryLine.type = THREE.LineStrip;
		this.base.add(this.primaryLine);

		return this;

	};


	this.createPrimaryTangentLine = function() {
		// this.traceFunction("createPrimaryTangentLine");

		var i,
			geometry, 
			material,
			percentage,
			total = this.totalHeightIncrements*2;

		material = new THREE.LineBasicMaterial({ color: 0x006600, transparent:true, opacity:.25});
		geometry = new THREE.Geometry();

		for(i = 0; i < total; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.primaryTangentLineA = new THREE.Line( geometry, material, THREE.LinePieces	 );
		this.base.add(this.primaryTangentLineA);

		material = new THREE.LineBasicMaterial({ color: 0x000066, transparent:true, opacity:.25});
		geometry = new THREE.Geometry();

		for(i = 0; i < total; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.primaryTangentLineB = new THREE.Line( geometry, material, THREE.LinePieces	 );
		this.base.add(this.primaryTangentLineB);

		material = new THREE.LineBasicMaterial({ color: 0x660000, transparent:true, opacity:.25});
		geometry = new THREE.Geometry();

		for(i = 0; i < total; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.primaryTangentLineC = new THREE.Line( geometry, material, THREE.LinePieces	 );
		this.base.add(this.primaryTangentLineC);

		material = new THREE.LineBasicMaterial({ color: 0x666600, transparent:true, opacity:.25});
		geometry = new THREE.Geometry();
		for(i = 0; i < total; i++) {
			geometry.vertices.push(new THREE.Vector3());
		}
		
		this.primaryTangentLineD = new THREE.Line( geometry, material, THREE.LinePieces	 );
		this.base.add(this.primaryTangentLineD);

		return this;

	};



	this.convertMesh = function(){
		this.traceFunction("convertMesh");

		// var geometry = this.customPlanes[1].geometry;
		// saveSTLFromArray(this.customPlanes,"test_01");

	}

	// ---------------------------------------------------------
	// listeners
	// ---------------------------------------------------------
	this.onDocumentMouseDown = function(event) {
		this.traceFunction("onDocumentMouseDown");
		event.preventDefault();
	};

	// ---------------------------------------------------------
	// public functions
	// ---------------------------------------------------------
	
	this.parse = function() {
		
		this.updatePrimaryLine();
		this.updatePrimaryTangentLine();

		this.count+=BEANSTALK.Params.speed;
		return this;
	};


	this.updatePrimaryLine = function() {
		// this.traceFunction("updatePrimaryLine");

		var i,
			geometry, 
			material,
			percentage,
			vector,
			identityVector = new THREE.Vector3(0,0,1);

			total = this.totalHeightIncrements;


		for(i = 0; i < total; i++) {
			geometry = this.primaryLine.geometry.vertices[i];
			percentage = (i+this.count)/total;
			geometry.x = Math.cos(Math.PI*2*percentage*3.3465)*10;
			geometry.z = Math.sin(Math.PI*2*percentage*2.2323)*10;
			geometry.y = (i/total*2.0-1)*200;
		}

		var radius = 20;
		var theta = TWO_PI*.25;
		var TO_RADIANS = Math.PI / 180;
		var TO_DEGREES = 180 / Math.PI;
		vector = new THREE.Vector3();
		for(i = 0; i < (total-1); i++) {
			vector.copy(this.primaryLineNormals[i]);
			vector.subVectors( this.primaryLine.geometry.vertices[i], this.primaryLine.geometry.vertices[i+1]);
			vector.normalize();
			this.crossLineNormals[i].crossVectors(identityVector,vector);
			
			this.tangentLineANormals[i].copy(this.rotateAroundAxis( this.crossLineNormals[i], vector, TO_RADIANS*(0)));
			this.tangentLineANormals[i].setLength(radius);

			this.tangentLineBNormals[i].copy(this.rotateAroundAxis(this.crossLineNormals[i], vector, TO_RADIANS*(90)));
			this.tangentLineBNormals[i].setLength(radius);

			this.tangentLineCNormals[i].copy(this.rotateAroundAxis(this.crossLineNormals[i], vector, TO_RADIANS*(180)));
			this.tangentLineCNormals[i].setLength(radius);

			this.tangentLineDNormals[i].copy(this.rotateAroundAxis(this.crossLineNormals[i], vector, TO_RADIANS*(270)));
			this.tangentLineDNormals[i].setLength(radius);
		}

		return this;

	};

	this.updatePrimaryTangentLine = function() {
		// this.traceFunction("updatePrimaryTangentLine");

		var i,
			geometry, 
			material,
			percentage,
			total = this.totalHeightIncrements*2;

		var id = 0;
		for(i = 0; i < total; i+=2) {

			geometry = this.primaryTangentLineA.geometry.vertices[i];
			percentage = i/total;
			geometry.x = this.primaryLine.geometry.vertices[id].x;
			geometry.z = this.primaryLine.geometry.vertices[id].z;
			geometry.y = this.primaryLine.geometry.vertices[id].y;

			geometry = this.primaryTangentLineA.geometry.vertices[i+1];
			percentage = i/total;
			geometry.copy(this.primaryLine.geometry.vertices[id]);
			geometry.add(this.tangentLineANormals[id]);
			//
			geometry = this.primaryTangentLineB.geometry.vertices[i];
			percentage = i/total;
			geometry.x = this.primaryLine.geometry.vertices[id].x;
			geometry.z = this.primaryLine.geometry.vertices[id].z;
			geometry.y = this.primaryLine.geometry.vertices[id].y;

			geometry = this.primaryTangentLineB.geometry.vertices[i+1];
			percentage = i/total;
			geometry.copy(this.primaryLine.geometry.vertices[id]);
			geometry.add(this.tangentLineBNormals[id]);
			//
			geometry = this.primaryTangentLineC.geometry.vertices[i];
			percentage = i/total;
			geometry.x = this.primaryLine.geometry.vertices[id].x;
			geometry.z = this.primaryLine.geometry.vertices[id].z;
			geometry.y = this.primaryLine.geometry.vertices[id].y;

			geometry = this.primaryTangentLineC.geometry.vertices[i+1];
			percentage = i/total;
			geometry.copy(this.primaryLine.geometry.vertices[id]);
			geometry.add(this.tangentLineCNormals[id]);
			//
			geometry = this.primaryTangentLineD.geometry.vertices[i];
			percentage = i/total;
			geometry.x = this.primaryLine.geometry.vertices[id].x;
			geometry.z = this.primaryLine.geometry.vertices[id].z;
			geometry.y = this.primaryLine.geometry.vertices[id].y;

			geometry = this.primaryTangentLineD.geometry.vertices[i+1];
			percentage = i/total;
			geometry.copy(this.primaryLine.geometry.vertices[id]);
			geometry.add(this.tangentLineDNormals[id]);

			id++;
			
		}

		return this;

	};


	this.draw = function() {

		// update particles
		this.primaryLine.geometry.verticesNeedUpdate = true;
		
		this.primaryTangentLineA.geometry.verticesNeedUpdate = true;
		this.primaryTangentLineB.geometry.verticesNeedUpdate = true;
		this.primaryTangentLineC.geometry.verticesNeedUpdate = true;
		this.primaryTangentLineD.geometry.verticesNeedUpdate = true;
		
		this.controls.update();
		this.renderer.render( this.scene , this.camera );

		return this;
	};

	this.enableTrackBall = function() {
		this.controls.enabled = true;
	};

	this.disableTrackBall = function() {
		this.controls.enabled = false;
	};

	this.setDimensions = function(w, h) {
		this.stageWidth = w || 600;
		this.stageHeight = h || 600;
	};

	this.resize = function() {

		this.camera.aspect = this.stageWidth / this.stageHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.stageWidth, this.stageHeight );
		this.controls.handleResize();

	};

	this.rotateAroundAxis = function(currentVector, vectorAxis, theta){
		var ax = vectorAxis.x,
			ay = vectorAxis.y,
			az = vectorAxis.z,

			ux = ax * currentVector.x,
			uy = ax * currentVector.y,
			uz = ax * currentVector.z,

			vx = ay * currentVector.x,
			vy = ay * currentVector.y,
			vz = ay * currentVector.z,

			wx = az * currentVector.x,
			wy = az * currentVector.y,
			wz = az * currentVector.z;

			si = Math.sin(theta);
			co = Math.cos(theta);

			var xx = (ax * (ux + vy + wz) + (currentVector.x * (ay * ay + az * az) - ax * (vy + wz)) * co + (-wy + vz) * si);
			var yy = (ay * (ux + vy + wz) + (currentVector.y * (ax * ax + az * az) - ay * (ux + wz)) * co + (wx - uz) * si);
			var zz = (az * (ux + vy + wz) + (currentVector.z * (ax * ax + ay * ay) - az * (ux + vy)) * co + (-vx + uy) * si);

		return (new THREE.Vector3(xx,yy,zz));

	};

};

BEANSTALK.BeanStalk3D.prototype = new UNCTRL.BoilerPlate();
BEANSTALK.BeanStalk3D.prototype.constructor = BEANSTALK.BeanStalk3D;