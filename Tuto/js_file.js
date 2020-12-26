$(document).ready(function() { //JQuery function

    //WebGL 3D-interactive game by Joakim Nyland
    
    alert("Thanks for checking out my script! I have commented most of the code so hopefully you can learn something, and maybe get started with your own WebGL simulations.\n\nNew in v2.0:\n- Added texture to ground and objects\n- Added shadow\n- Improved code by using functions\n- Fixed POV camera misalignment\n\nI hope you like it!:-)");
    
    
    /*Thanks for checking out my script! 
    I have commented most of the code so hopefully you can learn something, and maybe get started with your own WebGL simulations. 
    
    The simulation should work in browsers and on phones thanks to WebGL and OpenGL ES. Use computer for best readability of the code.
    
    New in v2.0:
    - Added texture to the ground and objects using external links. It would have been easier using ThreeJS built-in functions to make spheres, but with this method you can add any object with its respective texture (cars, etc.)
    
    - Added shadow to the objects which makes it look more realistic.
    
    - Improved code by using functions.
    
    - Fixed POV camera misalignment
    
    - Added transition effect when earth reaches end of stage
    
    - Added button to start the game.
    
    Some information for those interested, these are my preferences when making 3D simulations:
    - Writing the JavaScript code: Sublime Text
    
    - Testing the code: Firefox browser
    
    - Making the models: Blender (and exporting as .obj and .mtl)
    
    - Applying texture: .png or .jpg files. (Usually texture is saved as .tga, but .tga files can easily be converted to .png files)
    
    I hope you can upvote my code if you like it or if you learnt anything:-)
    
    Joakim Nyland
    */
        // ********** Setting parameters **********
        const SCALE = 27;
        const PI = Math.PI;
        var posNeg=0;
        var loopVar=0;
    
        //Camera values
        const FOV = 45;
        const ASPECT = window.innerWidth/window.innerHeight;
        const NEAR = 0.1;
        const FAR = 2000;
    
        //Button variables
        var initAnim = true;
        var startButton = document.getElementById( 'startButtonId' );
        
        // ********** Creating the scene: **********
        var renderer = new THREE.WebGLRenderer({ antialias: true }); //Creates a WebGL renderer using threejs library
        renderer.setPixelRatio( window.devicePixelRatio ); //Prevents blurry output
        renderer.setSize( window.innerWidth,window.innerHeight ); //Sets renderer size to the size of the window
        renderer.setClearColor(0xA9F5F2, 1); //Makes the background color of the scene blue
        renderer.shadowMapEnabled = true; //Enables shadow
        renderer.shadowMapSoft = true;
        document.body.appendChild( renderer.domElement ); //Attaches renderer to DOM (initializes renderer)
    
        var scene = new THREE.Scene(); //Creates an empty scene where we are going to add our objects
    
        var camera = new THREE.PerspectiveCamera( FOV,ASPECT,NEAR,FAR ); //Creates a camera
        camera.position.set( 50/SCALE , -200/SCALE, 100/SCALE ); //Positions the camera
        camera.up.set( 0,0,1 ); //Sets the camera the correct direction
        camera.rotation.x=-PI/2;
        scene.add( camera ); //Adds the camera to the scene
    
        var controls = new THREE.OrbitControls( camera, renderer.domElement ); //OrbitControls allows camera to be controlled and orbit around a target
        controls.minDistance = 600/SCALE; //Sets the minimum distance one can pan into the scene
        controls.maxDistance = 1000/SCALE;  //Sets the maximum distance one can pan away from scene
    
        // ********** Initialize GUI (Graphical user interface) **********
        var gui = new dat.GUI();
        var guiParams = { //Sets the variable names and default values of the GUI
            x : 0,
            cameraPosition : false,
        };
        gui.add(guiParams, 'x', -47, 47).name('<-Left---Right->'); //Adds the x-translate control to the GUI 
        gui.add(guiParams, 'cameraPosition').name('POV'); //Button that sets camera position equal to box position
        gui.closed = true;
    
        // ********** Adding light and Shadow**********
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight); //Adding ambient light
        var light = new THREE.DirectionalLight( 0xffffff, 1.1 );
        light.position.set(0, 0, 1);
        light.castShadow = true; //Enables shadow
    
        var d = 8;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;
        scene.add(light);
        
        // ********** Ground **********
        var width  = 10; //width of ground
        var length = 15; //length of ground
        
        var geometry = new THREE.PlaneGeometry( width, length); //ThreeJS function to create plane geometry
        var texture;
        texture = new THREE.TextureLoader().load( "https://dl.dropbox.com/s/f8exr3zow9nqsol/grass.jpg?dl=0" ); //Sets texture from external link
        var groundmat = new THREE.MeshLambertMaterial({ //Sets color and material attributes for plane
            color: 0x088A08,
            map:texture, //Applies texture
            opacity: 1,
            side: THREE.DoubleSide //Ground visible from both sides
        });
        var ground = new THREE.Mesh( geometry, groundmat ); //Creates a mesh containing the geometry and groundmaterial just defined
        ground.receiveShadow = true; //Enable shadow
        scene.add( ground ); //Adds ground to scene
        
        // ********** Loading the models **********
        var box = new THREE.Object3D(); //Creates a new threejs 3D-object variable named box
        var mtlLoader = new THREE.MTLLoader(); //Creates a mtlLoader (to apply texture to 3d objects)
        mtlLoader.load( 'https://dl.dropbox.com/s/zgwxyzlj098gdsa/box.mtl', function( materials ) //Prepare to set color
        {
            var objLoader = new THREE.OBJLoader(); //Creates an object loader (to load 3d objects)
            objLoader.setMaterials( materials ); //Sets color to the box
            objLoader.load( 'https://dl.dropbox.com/s/8239tdf6pimlnlx/box.obj', function ( object ) //Loads box
            {
                box.add( object ); //Adds the object with material to the box variable
            });
        });
        scene.add( box ); //Adds box to the scene
        //Some positioning
        box.position.z=0.32*2; //Positions box onto ground
        box.position.x=0;
        box.position.y=-72/10;
        box.rotation.x=PI/2
    
        var obstacle = new THREE.Object3D(); //Creates a new threejs 3D-object variable named obstacle
        var mtlLoader = new THREE.MTLLoader(); //Creates an mtlLoader (to apply texture to 3d objects)
        var objLoader = new THREE.OBJLoader();  //Creates an objLoader (to load 3d objects)
        mtlLoader.setTexturePath("https://dl.dropbox.com/s/t4cm3vzsbx21crc/"); //Set texture path to external link ( the original link is https://dl.dropbox.com/s/t4cm3vzsbx21crc/Earth.png)
        mtlLoader.setCrossOrigin(true); //Needed in code to be able to read external links
    
        mtlLoader.load('https://dl.dropbox.com/s/co60o9quyar7r4w/Earth.mtl', function (materials) 
        {
          materials.preload(); //Loads the texture
          objLoader.setMaterials(materials); //Applies texture to object
          objLoader.load('https://dl.dropbox.com/s/od28dsqplhfxa93/Earth.obj', function(object) 
          {
              object.traverse( function ( child )//This function enables shadow on object
              {
                if ( child instanceof THREE.Mesh ) 
                {
                  child.castShadow = true;
                }
            });
              obstacle.add( object ) //Adds object to obstacle
          });
        });
        scene.add(obstacle); //Adds obstacle to scene
    
        //Some positioning and scaling
        obstacle.position.z=0.621;
        obstacle.position.y=72/10;
        obstacle.position.x=-20/10;
        obstacle.scale.x=0.25;
        obstacle.scale.y=0.25;
        obstacle.scale.z=0.25;
    
    //Same method for obstacle2
    var obstacle2 = new THREE.Object3D(); 
    var mtlLoader = new THREE.MTLLoader(); 
    var objLoader = new THREE.OBJLoader(); 
    mtlLoader.setTexturePath("https://dl.dropbox.com/s/t4cm3vzsbx21crc/");
    mtlLoader.setCrossOrigin(true);
    
    mtlLoader.load('https://dl.dropbox.com/s/co60o9quyar7r4w/Earth.mtl', function (materials) 
    {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('https://dl.dropbox.com/s/od28dsqplhfxa93/Earth.obj', function(object) 
          {
              object.traverse( function ( child ) 
              {
                if ( child instanceof THREE.Mesh ) 
                {
                  child.castShadow = true;
                }
            });
              obstacle2.add( object )
          });
        });
        
    //********** Functions to make the game work *************
    
    function obstacleTranslate(newEarth){ // if-function to make obstacles translate
        if (loopVar <=5)
            {
                obstacle.position.y-=1/10;
                obstacle.rotation.x+=1/10;
            }
            else if (loopVar < 10)
            {
                obstacle.position.y-=2/10;
                obstacle.rotation.x+=2/10;
            }
            else if (loopVar<=20)
            {
                obstacle.position.y-=3/10;
                obstacle2.position.y-=3/10;
                obstacle.rotation.x+=3/10;
                obstacle2.rotation.x+=3/10;
            }
            else if (loopVar<=40)
            {
                obstacle.position.y-=4/10;
                obstacle2.position.y-=4/10;
                obstacle.rotation.x+=4/10;
                obstacle2.rotation.x+=4/10;
            }
            else if (loopVar<=100)
            {
                obstacle.position.y-=5/10;
                obstacle2.position.y-=5/10;
                obstacle.rotation.x+=5/10;
                obstacle2.rotation.x+=5/10;
            }
            else if (loopVar<=200)
            {
                obstacle.position.y-=6/10;
                obstacle2.position.y-=6/10;
                obstacle.rotation.x+=6/10;
                obstacle2.rotation.x+=6/10;
            }
        };
    
    function boxTranslate() { //If-function to make box translate
        if ( (guiParams.x/10>box.position.x) && ( (guiParams.x/10)-box.position.x>0.1) )
            {
                box.position.x+=1/10
            }
            else if(guiParams.x/10<box.position.x) 
            {
                box.position.x-=1/10
            }
        };
    
    function obstacleTeleport(){ //Function to make obstacle teleport when it reaches the end.
            if( obstacle.position.y<=-90/10 )
            {
                loopVar += 1;
                obstacle.position.y=72/10;
                obstacle2.position.y=72/10;
                posNeg = Math.random()
                if (posNeg>0.5)
                {
                    q = -1;
                }
                else
                {
                    q=1;
                }
                obstacle.position.x=((q*Math.random()*10)/(100) )*47;
                obstacle2.position.x=((-q*Math.random()*10)/(100) )*47;
                obstacle.scale.x=0.25;
                obstacle.scale.y=0.25;
                obstacle.scale.z=0.25;
            }
        };
    
    function obstacleDisappear(){ //Function to make obstacle disappear before teleporting
        if( obstacle.position.y<=-80/10)
            {
                obstacle.scale.x-=0.03;
                obstacle.scale.y-=0.03;
                obstacle.scale.z-=0.03;
            }
    }
    
    function obstacleCollision(){ //Collision function using x and y location
            if( box.position.x<=(obstacle.position.x+0.9)  && box.position.x>=(obstacle.position.x-0.9) )
            {
                if ( obstacle.position.y<=-70/10 )
                {
                    if (loopVar<40)
                    {
                        alert("Ops, you crashed! You got " + loopVar + " points!");
                    }
                    else if (loopVar>=40)
                    {
                        alert("Ops, you crashed! You got " + loopVar + " points! You're really good!");
                    }
    
                    box.position.x=0;
                    
                    guiParams.x = 0;
                    obstacle.position.y=72/10;
                    obstacle.scale.x=0.25;
                    obstacle.scale.y=0.25;
                    obstacle.scale.z=0.25;
                    scene.remove(obstacle2);
                    loopVar=0;
                }
            }
            if (loopVar >=10)
            {
                if( box.position.x<=(obstacle2.position.x+0.9)  && box.position.x>=(obstacle2.position.x-0.9) )
                {
                    if ( obstacle2.position.y<=-70/10 )
                    {
                        if (loopVar<40)
                        {
                            alert("Ops, you crashed! You got " + loopVar + " points!");
                        }
                        else if (loopVar>=40)
                        {
                            alert("Ops, you crashed! You got " + loopVar + " points! You're really good!");
                        }
    
                        box.position.x=0;
                        guiParams.x = 0;
                        obstacle.position.y=72/10;
                        obstacle.scale.x=0.25;
                        obstacle.scale.y=0.25;
                        obstacle.scale.z=0.25;
                        scene.remove(obstacle2);
                        loopVar=0;
                    }
                }
            }
        };
    
    function obstacleSpawn(){ //Function to spawn new obstacle when user reaches 10 points
            if(loopVar == 10)
            {
                scene.add( obstacle2 );  //Adds new obstacle to the scene
                //Some positioning and scaling
                obstacle2.position.z=0.621;
                obstacle2.scale.x=0.25;
                obstacle2.scale.y=0.25;
                obstacle2.scale.z=0.25;
                obstacle2.position.y=72/10;
                loopVar+=1;
            }
        };
    
    function enablePOV(){ //Enables POV view
            if (guiParams.cameraPosition==true)
            {
                camera.position.set(box.position.x,box.position.y,box.position.z );
                camera.lookAt( box.position.x,72/10,0.621 );
            }
            else
            {
                controls.update();
            }
        };
    
        startButton.onclick = function StartAnimation() //Game doesn't start untill button is pressed
        {
            render();
            document.getElementById( 'startButtonId');
            startButtonId.parentNode.removeChild(startButtonId);
            gui.closed = false;
         };
         
        //********** Render function **********
    var render = function () 
        {
            requestAnimationFrame(render); //render function is called every frame!
    
            //Box translation (and not teleportation) when interacting with GUI.
            boxTranslate();
    
            //Obstacle translation
            obstacleTranslate();
    
            //Obstacle disappearing before teleporting
            obstacleDisappear();
    
            //Obstacle teleportation
            obstacleTeleport();
    
            //Obstacle collision
            obstacleCollision();
    
            //New obstacle spawn
            obstacleSpawn();
    
            //Setting camera position to box position when POV enabled
            enablePOV();
            
            renderer.render(scene, camera); //We need this in the loop to perform the rendering
        };
    renderer.render(scene, camera);
    });
    
    //Made by Joakim Nyland