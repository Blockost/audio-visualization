var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
var renderer = new THREE.WebGLRenderer();
var controls, scale;
var pos_x = 0;
var geometry = new THREE.BoxGeometry(1.5, 5, 1.5);


// Create objects
var rects = [];
for(var i = 0; i < 128; i++){
    rects[i] = new THREE.Mesh(geometry, generateMaterial());
    rects[i].position.copy(new THREE.Vector3(pos_x, 0, 0));
    scene.add(rects[i]);
    pos_x = pos_x <= 0 ? Math.abs(pos_x)+1 : -pos_x-1;
}

// Add lights
var light = new THREE.AmbientLight(0x505050);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

// Set cam position
camera.position.z = 90;

renderer.setClearColor(0x0a111f);
document.body.appendChild(renderer.domElement);


//controls = new THREE.OrbitControls(camera);
//controls.addEventListener('change', render);


// add Listeners
addWindowResizeListener();


var render = function(){
    if(typeof arrayBuffer === 'object'){
        for(var i = 0; i < arrayBuffer.length; i++){
            scale = arrayBuffer[i] / 30;
            if(scale > 0) rects[i].scale.y = scale;
        }
    }


    //controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

renderer.setSize(window.innerWidth, window.innerHeight);

function generateMaterial(){
    return new THREE.MeshPhongMaterial({
        color: randomFairColor(),
        ambient: 0x808080,
        specular: 0xffffff,
        shininess: 20,
        reflectivity: 5.5
    });

}

function randomFairColor(){
    var min = 64;
    var max = 224;
    var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
    var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
    var b = (Math.floor(Math.random() * (max - min + 1)) + min);
    return r + g + b;
}


function addWindowResizeListener(){
    var onWindowResize = function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };
    window.addEventListener( 'resize', onWindowResize, false );
}