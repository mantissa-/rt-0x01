//DEFINE RENDER REGION
const canvas = document.getElementById("renderCanvas");


// CREATE ENGINE
const engine = new BABYLON.Engine(canvas, true);
    

// MAIN SCENE CREATION
const createScene = function () {


    // SCENE PARAMETERS
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();
    scene.ambientColor = new BABYLON.Color3.Black();

    // CAMERA
    const camera = new BABYLON.ArcRotateCamera("camera", 0.66, 1.21, 0.5, new BABYLON.Vector3(-0.05, 0, 0), scene);
    
    camera.fov = 0.5;
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 0.5;
    camera.upperRadiusLimit = 0.5;
    camera.lowerAlphaLimit = 0.5;
    camera.upperAlphaLimit = 0.8;
    camera.lowerBetaLimit = 1;
    camera.upperBetaLimit = 1.75;
    camera.panningSensibility = 0;
    camera.angularSensibilityX = 2048;
    camera.angularSensibilityY = 2048;
    camera.attachControl(canvas, true);

    // CAMERA MOVEMENT
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERMOVE:
                camera.alpha = 0.5 + ((scene.pointerX / canvas.width) * 0.3);
                camera.beta = 1 + ((scene.pointerY / canvas.height) * 0.75);
            break;
        }
    });

    // var mouseInput = new BABYLON.ArcRotateCameraPointersInput()
    // mouseInput.camera = camera;
    // mouseInput.attachControl();

    
    // FOG
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogStart = 0.42;
    scene.fogEnd = 0.75;
    scene.fogColor = new BABYLON.Color3(0.025, 0.025, 0.025);


    // LIGHTING
    const keyLight = new BABYLON.PointLight("keyLight", new BABYLON.Vector3(-3, 3, 1), scene);
    keyLight.intensity = 15; //200
    keyLight.radius =  3;


    // MATERIALS
    const pbrIrid = new BABYLON.PBRMaterial("pbrIrid", scene);
    pbrIrid.AlbedoColor = new BABYLON.Color3(0, 0, 0);
    pbrIrid.metallic = 0.5;
    pbrIrid.metallicF0Factor = 0;
    pbrIrid.roughness = 0.15;
    pbrIrid.iridescence.isEnabled = true;
    pbrIrid.iridescence.intensity = 5;
    pbrIrid.iridescence.indexOfRefraction = 1.15;
    pbrIrid.iridescence.minimumThickness = 100;
    pbrIrid.iridescence.maximumThickness = 850;

    const pbrMetal = new BABYLON.PBRMaterial("pbrMetal", scene);
    pbrMetal.albedoColor = new BABYLON.Color3.White();
    pbrMetal.metallic = 1;
    pbrMetal.roughness = 0.25;
    pbrMetal.backFaceCulling = false;
    
    const pbrPoint = new BABYLON.PBRMaterial("pbrPoint", scene);
    pbrPoint.metallic = 0;
    pbrPoint.roughness = 0;
    pbrPoint.pointsCloud = true;
    pbrPoint.pointSize = 2;
    pbrPoint.AlbedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    pbrPoint.alpha = 0.015;
    pbrPoint.alphaMode = 1;


    // ASSET LOADING
    function load_mesh(model, material) {
        BABYLON.SceneLoader.ImportMeshAsync("","assets/", model).then((result) => {
            result.meshes.forEach(mesh => {
            mesh.material = material;
            });
    });
    }

    load_mesh("dude-0x01.glb", pbrIrid);
    load_mesh("dude-0x02.glb", pbrPoint);
    load_mesh("dude-0x02.glb", pbrMetal);


    // PARTICLES
    const particles = new BABYLON.ParticleSystem("particles", 1000);
    particles.createBoxEmitter(new BABYLON.Vector3(0, 0.025, 0), new BABYLON.Vector3(0, 0.05, 0), new BABYLON.Vector3(-2, -2, -2), new BABYLON.Vector3(2, -2, 4));
    
    particles.emitRate = 256;
    particles.minEmitPower = 10;
    particles.maxEmitPower = 25;

    particles.minSize = 0.001;
    particles.maxSize = 0.002;
    particles.minLifeTime = 5;
    particles.maxLifeTime = 5;

    particles.gravity = new BABYLON.Vector3(0, ``, 0);
    particles.particleTexture = new BABYLON.Texture("assets/white.png",);

    particles.start();


    //RENDER PIPELINE
    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("DefaultRenderingPipeline", true, scene, scene.cameras);
    if (defaultPipeline.isSupported) {
        // MSAA
        defaultPipeline.samples = 1; // 1 by default

        // imageProcessing
        defaultPipeline.imageProcessingEnabled = true;
        if (defaultPipeline.imageProcessingEnabled) {
            defaultPipeline.imageProcessing.contrast = 1.5; // 1 by default
            defaultPipeline.imageProcessing.exposure = 3.5;
            defaultPipeline.imageProcessing.toneMappingEnabled = true;
            defaultPipeline.imageProcessing.toneMappingType = 1;
        }

        /* FXAA */
        defaultPipeline.fxaaEnabled = true; // false by default
        if (defaultPipeline.fxaaEnabled) {
            defaultPipeline.fxaa.samples = 1; // 1 by default
        }

        /* bloom */
        defaultPipeline.bloomEnabled = true; // false by default
        if (defaultPipeline.bloomEnabled) {
            defaultPipeline.bloomKernel = 128; // 64 by default
            defaultPipeline.bloomScale = 0.5; // 0.5 by default
            defaultPipeline.bloomThreshold = 0.5; // 0.9 by default
            defaultPipeline.bloomWeight = 0.25; // 0.15 by default
        }
        
        // /* DOF */

        defaultPipeline.depthOfFieldEnabled = false; // false by default
        if (defaultPipeline.depthOfFieldEnabled && defaultPipeline.depthOfField.isSupported) {
            defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.High;
            defaultPipeline.depthOfField.fStop = 2; // 1.4 by default
            defaultPipeline.depthOfField.focalLength = 40; // 50 by default, mm
            defaultPipeline.depthOfField.lensSize = 10; // 50 by default
            defaultPipeline.depthOfField.focusDistance = 380;
        }

        defaultPipeline.chromaticAberrationEnabled = true; // false by default
        if (defaultPipeline.chromaticAberrationEnabled) {
            defaultPipeline.chromaticAberration.aberrationAmount = 128; // 30 by default
            defaultPipeline.chromaticAberration.radialIntensity = 5; // 30 by default
        }
        
        /* sharpen */
        defaultPipeline.sharpenEnabled = false;
        if (defaultPipeline.sharpenEnabled) {
            defaultPipeline.sharpen.adaptScaleToCurrentViewport = true; // false by default
            defaultPipeline.sharpen.edgeAmount = 0.1; // 0.3 by default
            defaultPipeline.sharpen.colorAmount = 1 // 1 by default
        }
        // /* glowLayer */
        defaultPipeline.glowLayerEnabled = false;
        if (defaultPipeline.glowLayerEnabled) {
            defaultPipeline.glowLayer.blurKernelSize = 16; // 16 by default
            defaultPipeline.glowLayer.intensity = 1; // 1 by default
        }

        /* grain */
        defaultPipeline.grainEnabled = true;
        if (defaultPipeline.grainEnabled) {
            defaultPipeline.grain.animated = true; // false by default
            defaultPipeline.grain.intensity = 15;
        }
    }

    // Show Inspector
    // scene.debugLayer.show();

    engine.setHardwareScalingLevel(1.15);

    var options = new BABYLON.SceneOptimizerOptions();
    // options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 2));
    // options.addOptimization(new BABYLON.PostProcessesOptimization(1));

    // Optimizer
    var optimizer = new BABYLON.SceneOptimizer(scene, options);
    optimizer.targetFrameRate = 60;
    optimizer.trackerDuration = 2500;
    optimizer.start();

    return scene;
};


const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});

