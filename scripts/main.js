const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);
        
        const createScene = function () {
            // SCENE PARAMETERS
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3.Black();
            scene.ambientColor = new BABYLON.Color3.Black();

            //CAMERA
            // const camera = new BABYLON.ArcRotateCamera("camera", -2.1, 2, 45, new BABYLON.Vector3(0,0,0), scene);
            const camera = new BABYLON.TargetCamera("camera", new BABYLON.Vector3(0, 0, -50), scene);
            
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.fov = 0.5;
            // camera.minZ = 0.1;
            // camera.lowerRadiusLimit = 45;
            // camera.upperRadiusLimit = 45;
            camera.panningSensibility = 0;
            camera.angularSensibilityX = 2048;
            camera.angularSensibilityY = 2048;

            camera.attachControl(canvas, true);

            console.log(camera);

            // camNoise = BABYLON.MeshBuilder.CreateBox("camNoise", {});
            // camNoise.alpha = 0;
            // camera.parent = camNoise;
            // camNoise.position = new BABYLON.Vector3(0,0,-25);




            // const frameRate = 1;

            // const camAnim = new BABYLON.Animation("camAnim", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

            // const keyFrames = [];

            // keyFrames.push ({frame: 0, value: -40,});
            // keyFrames.push ({frame: 1, value: -50,});
            // keyFrames.push ({frame: 2, value: -40,});
            
            // camAnim.setKeys(keyFrames);

            // // const easingFunction = new BABYLON.QuinticEase();
            // // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            // // camTween.setEasingFunction(easingFunction);

            // camera.animations.push(camAnim);
            // scene.beginAnimation(camera, 0, 2, true);
            

            

            scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
            scene.fogStart = 45;
            scene.fogEnd = 60;
            scene.fogColor = new BABYLON.Color3.Black();

            const keyLight = new BABYLON.PointLight("keyLight", new BABYLON.Vector3(4, 15, -6), scene);
            keyLight.intensity = 125;
            keyLight.radius =  5;

            const rimLight = new BABYLON.PointLight("rimLight", new BABYLON.Vector3(-10, 0, 25), scene);
            rimLight.intensity = 125;
            rimLight.radius =  5;


            // MATERIALS
            const pbrGrid = new BABYLON.GridMaterial("pbrGrid", scene);
            pbrGrid.majorUnitFrequency = 8;
            pbrGrid.minorUnitVisibility = 0.45;
            pbrGrid.gridRatio = 0.001;
            pbrGrid.opacity = 0.5;
            pbrGrid.mainColor = new BABYLON.Color3(0, 0, 0);
            pbrGrid.lineColor = new BABYLON.Color3(0.0, 1.0, 0.0);

            const pbrIrid = new BABYLON.PBRMaterial("pbrIrid", scene);
            pbrIrid.AlbedoColor = new BABYLON.Color3(0, 0, 0);
            pbrIrid.metallic = 0.5;
            pbrIrid.metallicF0Factor = 0;
            pbrIrid.roughness = 0.15;
            pbrIrid.iridescence.isEnabled = true;
            pbrIrid.iridescence.intensity = 1;
            pbrIrid.iridescence.indexOfRefraction = 1.5;
            pbrIrid.iridescence.minimumThickness = 100;
            pbrIrid.iridescence.maximumThickness = 500;
            pbrIrid.alpha = 1;

            const pbrMetal = new BABYLON.PBRMaterial("pbrMetal", scene);
            pbrMetal.albedoColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            pbrMetal.metallic = 1;
            pbrMetal.roughness = 0;
            pbrMetal.wireframe = true;
            pbrMetal.backFaceCulling = false;
            
            const pbrPoint = new BABYLON.PBRMaterial("pbrPoint", scene);
            pbrPoint.metallic = 0;
            pbrPoint.pointsCloud = true;
            pbrPoint.pointSize = 3;
            pbrPoint.AlbedoColor = new BABYLON.Color3.White();


            const pbrHolo = new BABYLON.PBRMaterial("pbrHolo", scene);
            pbrHolo.emissiveColor = new BABYLON.Color3.White();
            pbrHolo.emissiveIntensity = 2;
            pbrHolo.alpha = 0.075;
            pbrHolo.wireframe = true;
            pbrHolo.backFaceCulling = false;
            pbrHolo.albedoColor = new BABYLON.Color3.Black();
            pbrHolo.reflectivity = new BABYLON.Color3.Black();
            pbrHolo.microSurface = 0;


            // ASSET LOADING
            function load_mesh(model, material) {
                BABYLON.SceneLoader.ImportMeshAsync("","assets/", model).then((result) => {
                    result.meshes.forEach(mesh => {
                    mesh.material = material;
                    mesh.scaling = new BABYLON.Vector3(10,10,10);
                 });
            });
            }

            load_mesh("rt-0x01a.glb", pbrIrid);
            load_mesh("rt-0x01b.glb", pbrMetal);
            load_mesh("rt-0x01c.glb", pbrPoint);
            load_mesh("rt-0x01c.glb", pbrHolo);


            // PARTICLES
            const particles = new BABYLON.ParticleSystem("particles", 1000);
            particles.createBoxEmitter(new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 2, 0), new BABYLON.Vector3(-50, -25, -8), new BABYLON.Vector3(50, -25, 32));
            
            particles.emitRate = 128;
            particles.minEmitPower = 10;
            particles.maxEmitPower = 25;

            particles.minSize = 0.025;
            particles.maxSize = 0.05;
            particles.minLifeTime = 2.5;

            particles.gravity = new BABYLON.Vector3(0, 1, 0);
            particles.particleTexture = new BABYLON.Texture("assets/white.png",);

            particles.start();


            //RENDER PIPELINE
            var defaultPipeline = new BABYLON.DefaultRenderingPipeline("DefaultRenderingPipeline", true, scene, scene.cameras);
            if (defaultPipeline.isSupported) {
                // MSAA
                defaultPipeline.samples = 2; // 1 by default

                // imageProcessing
                defaultPipeline.imageProcessingEnabled = false;

                /* FXAA */
                defaultPipeline.fxaaEnabled = false; // false by default
                if (defaultPipeline.fxaaEnabled) {
                    defaultPipeline.fxaa.samples = 1; // 1 by default
                }

                /* bloom */
                defaultPipeline.bloomEnabled = true; // false by default
                if (defaultPipeline.bloomEnabled) {
                    defaultPipeline.bloomKernel = 128; // 64 by default
                    defaultPipeline.bloomScale = 1; // 0.5 by default
                    defaultPipeline.bloomThreshold = 0; // 0.9 by default
                    defaultPipeline.bloomWeight = 0.25; // 0.15 by default
                }
                
                // /* DOF */

                defaultPipeline.depthOfFieldEnabled = false; // false by default
                if (defaultPipeline.depthOfFieldEnabled && defaultPipeline.depthOfField.isSupported) {
                    defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
                    defaultPipeline.depthOfField.fStop = 4; // 1.4 by default
                    defaultPipeline.depthOfField.focalLength = 50; // 50 by default, mm
                    defaultPipeline.depthOfField.lensSize = 50; // 50 by default
                    defaultPipeline.depthOfField.focusDistance = 450;
                }

                defaultPipeline.chromaticAberrationEnabled = true; // false by default
                if (defaultPipeline.chromaticAberrationEnabled) {
                    defaultPipeline.chromaticAberration.aberrationAmount = 100; // 30 by default
                    defaultPipeline.chromaticAberration.radialIntensity = 5; // 30 by default
                    defaultPipeline.chromaticAberration.adaptScaleToCurrentViewport = false; // false by default
                    defaultPipeline.chromaticAberration.alphaMode = 0; // 0 by default
                    defaultPipeline.chromaticAberration.alwaysForcePOT = false; // false by default
                    defaultPipeline.chromaticAberration.enablePixelPerfectMode = false; // false by default
                    defaultPipeline.chromaticAberration.forceFullscreenViewport = true; // true by default
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

                // Volume
                // const vls = new BABYLON.VolumetricLightScatteringPostProcess("vls", 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
                // vls.exposure = 0.0001;
            }

            // Show Inspector
            scene.debugLayer.show();

            engine.setHardwareScalingLevel(1);

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