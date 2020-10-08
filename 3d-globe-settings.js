// Render settings for the 3D geolocation demo on www.digitalelement.com/solutions
console.log("3D settings loaded...");

// Stuff to be called later...
var canvasElement, renderer, scene, camera, controls, composer, circle, vector, dpr, rotationTimer;

// Main settings
var canvasWidth = document.getElementById("canvas").clientWidth,
    canvasHeight = canvasWidth,
    globeRadius = 11, // size of the globe sphere
    globeDivisions = 64, // higher = more polygons but a "smoother" surface
    cameraRotateSpeed = -0.2,
    cameraDistance = 30, // camera's distance from the center of the globe
    cameraFov = 50,
    cameraVerticalOffset = 20, // degrees from the equator
    cameraHorizontalOffset = -25, // 0 = looking at North America, 180 = looking at Asia
    cameraDampingFactor = 0.1,
    cameraAutoRotateSpeed = -0.1,
    cameraDragSpeed = 0.05,
    cameraMaxAngle = Math.PI * 0.8, // maximum camera angle (in radians)
    cameraMinAngle = Math.PI * 0.2, // minimum camera angle (in radians)
    resumeAutoRotateOnMouseOut = true, // if false, the globe won't start rotating again if you hover over it
    resumeAutoRotationDelay = 8000, // milliseconds of delay until the globe starts auto rotating after the mouse leaves
    globeTexture = "3d-globe-diffuse-texture.jpg",
    globeSpecular = "3d-globe-specular.png",
    globeNormal = "3d-globe-normal.jpg",
    globeNormalScale = 1,
    lightTopIntensity = 0.35,
    lightBottomIntensity = 0.45,
    lightAmbientColor = 0xDDDDDD,
    activeLocationIndex = 0; // Start with info from this index in the array below

// Locations to show on the globe, and their info to go in the section next to the globe
var locations = [
    {
        city: "Atlanta",
        lat: 33.7579,
        long: -84.3876,
        ip: "76.185.97.100",
        region: "Georgia",
        country: "United States",
        postal: "30303-1026",
        connection: "Wired",
        timezone: "UTC-05:00",
        isp: "AT&T",
        proxy: "Hosting"
    },
    {
        city: "Bangkok",
        lat: 13.7709,
        long: 100.5601,
        ip: "201.116.72.34",
        region: "Krung Thep Maha Nakhon",
        country: "Thailand",
        postal: "10400",
        connection: "Satellite",
        timezone: "UTC-03:00",
        isp: "Intelsat",
        proxy: "None"
    },
    {
        city: "Beijing",
        lat: 39.9125,
        long: 116.3888,
        ip: "212.38.141.137",
        region: "Beijing",
        country: "China",
        postal: "100031",
        connection: "Wifi",
        timezone: "UTC+08:00",
        isp: "China Unicom", proxy: "Transparent"
    },
    {
        city: "Berlin",
        lat: 52.5950,
        long: 13.3458,
        ip: "174.106.0.151",
        region: "Berlin",
        country: "Germany",
        postal: "13439",
        connection: "Wifi",
        timezone: "UTC+01:00",
        isp: "Deutsche Telekom",
        proxy: "None"
    },
    {
        city: "Bogotá",
        lat: 4.6508,
        long: -74.0921,
        ip: "190.189.241.156",
        region: "Distrito Capital",
        country: "Colombia",
        postal: "110221",
        connection: "Satellite",
        timezone: "UTC-05:00",
        isp: "Claro",
        proxy: "None"
    },
    {
        city: "Cape Town",
        lat: -33.9585,
        long: 18.4610,
        ip: "96.255.101.124",
        region: "Western Cape",
        country: "South Africa",
        postal: "S-7700",
        connection: "Wired",
        timezone: "UTC+02:00",
        isp: "eNetworks",
        proxy: "Edu"
    },
    {
        city: "Córdoba",
        lat: -31.4109,
        long: -64.1926,
        ip: "189.190.34.217",
        region: "Córdoba",
        country: "Argentina",
        postal: "X5000KRF",
        connection: "Mobile",
        timezone: "UTC-03:00",
        isp: "Movistar",
        proxy: "Anonymous"
    },
    {
        city: "Istanbul",
        lat: 41.0180,
        long: 28.9627,
        ip: "38.105.68.115",
        region: "Istanbul",
        country: "Turkey",
        postal: "34134",
        connection: "Satellite",
        timezone: "UTC+03:00",
        isp: "GlobalTT",
        proxy: "None"
    },
    {
        city: "Jakarta",
        lat: -6.1724,
        long: 106.8146,
        ip: "74.194.135.98",
        region: "Jakarta Raya",
        country: "Indonesia",
        postal: "10160",
        connection: "Mobile",
        timezone: "UTC+07:00",
        isp: "Indosat",
        proxy: "None"
    },
    {
        city: "Lagos",
        lat: 6.5056,
        long: 3.3768,
        ip: "189.220.80.119",
        region: "Lagos",
        country: "Nigeria",
        postal: "100211",
        connection: "Dialup",
        timezone: "UTC+01:00",
        isp: "CHOGON",
        proxy: "None"
    },
    {
        city: "Los Angeles",
        lat: 34.0641,
        long: -118.2241,
        ip: "181.33.242.91",
        region: "California",
        country: "United States",
        postal: "90031-2514",
        connection: "Mobile",
        timezone: "UTC-08:00",
        isp: "Verizon",
        proxy: "None"
    },
    {
        city: "London",
        lat: 51.5027,
        long: -0.0176,
        ip: "201.161.26.44",
        region: "England",
        country: "Great Britain",
        postal: "E14 5GH",
        connection: "Wired",
        timezone: "UTC+00:00",
        isp: "Gigaclear",
        proxy: "Corporate"
    },
    {
        city: "Madrid",
        lat: 40.4084,
        long: -3.6734,
        ip: "198.185.18.207",
        region: "Madrid",
        country: "Spain",
        postal: "28007",
        connection: "Mobile",
        timezone: "UTC+01:00",
        isp: "Movistar",
        proxy: "Transparent"
    },
    {
        city: "Mexico City",
        lat: 19.4195,
        long: -99.1481,
        ip: "72.84.185.25",
        region: "Distrito Federal",
        country: "Mexico",
        postal: "06720",
        connection: "Wifi",
        timezone: "UTC-06:00",
        isp: "Telmex",
        proxy: "Edu"
    },
    {
        city: "Montreal",
        lat: 45.5078,
        long: -73.5775,
        ip: "64.136.27.229",
        region: "Quebec",
        country: "Canada",
        postal: "H2X 1T7",
        connection: "Wired",
        timezone: "UTC-05:00",
        isp: "TekSavvy",
        proxy: "Public"
    },
    {
        city: "Moscow",
        lat: 55.7471,
        long: 37.6479,
        ip: "207.253.192.161",
        region: "Moskva",
        country: "Russia",
        postal: "109240",
        connection: "Wired",
        timezone: "UTC+03:00",
        isp: "TransTelekom",
        proxy: "Anonymous"
    },
    {
        city: "New Delhi",
        lat: 28.6438,
        long: 77.2165,
        ip: "83.112.1.26",
        region: "Delhi",
        country: "India",
        postal: "110055",
        connection: "Wired",
        timezone: "UTC+05:30",
        isp: "Janak Broadband",
        proxy: "Hosting"
    },
    {
        city: "São Paulo",
        lat: -23.5303,
        long: -46.6459,
        ip: "64.183.78.26",
        region: "São Paulo",
        country: "Brazil",
        postal: "01216-010",
        connection: "Dialup",
        timezone: "UTC-03:00",
        isp: "Universo On Line",
        proxy: "None"
    },
    {
        city: "Seoul",
        lat: 37.4995,
        long: 127.0405,
        ip: "97.95.73.99",
        region: "Gangnam-gu",
        country: "South Korea",
        postal: "135-510",
        connection: "Wired",
        timezone: "UTC+09:00",
        isp: "Onse Telecom",
        proxy: "Corporate"
    },
    {
        city: "Sydney",
        lat: -33.8671,
        long: 151.2071,
        ip: "24.138.64.239",
        region: "New South Wales",
        country: "Australia",
        postal: "2040",
        connection: "Dialup",
        timezone: "UTC+10:00",
        isp: "Virgin Mobile",
        proxy: "None"
    },
    {
        city: "Tokyo",
        lat: 35.7062,
        long: 139.7247,
        ip: "201.171.176.198",
        region: "Tokyo",
        country: "Japan",
        postal: "162-0041",
        connection: "Mobile",
        timezone: "UTC+09:00",
        isp: "NTT East",
        proxy: "None"
    }
];

// Array of DOM elements containing the dots/labels for each location displayed
var locationDivs = [];

// Threshold for when to show/hide location dots & labels
var visibilityLimit = Math.sqrt(Math.pow(cameraDistance, 2) - Math.pow(globeRadius, 2));

// Turn a location's lat/long coordinates into a position in 3D space on the globe
function calcPosFromLatLonRad(lat, lon, radius) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);
    x = -((radius) * Math.sin(phi) * Math.cos(theta) * (globeRadius / 2));
    z = ((radius) * Math.sin(phi) * Math.sin(theta) * (globeRadius / 2));
    y = ((radius) * Math.cos(phi) * (globeRadius / 2));
    return [x, y, z];
};

// Ease the globe's rotation to a stop, on mouseover
function stopRotation() {
	clearTimeout(rotationTimer);
    if (controls.autoRotate == true) {
        controls.autoRotate = false;
    }
};

// Ease the globe into rotation, on mouseout
function startRotation() {
    if (controls.autoRotate == false) {
        rotationTimer = setTimeout(function () {
            controls.autoRotate = true;
        }, resumeAutoRotationDelay);
    }
};

function addLocationInfoToDOM(location) {
	document.getElementById("activeLocationTitle").innerHTML = location.city;
    document.getElementById("locationInfoIP").innerHTML = location.ip;
    document.getElementById("locationInfoCity").innerHTML = location.city;
    document.getElementById("locationInfoRegion").innerHTML = location.region;
    document.getElementById("locationInfoCountry").innerHTML = location.country;
    document.getElementById("locationInfoPostal").innerHTML = location.postal;
    document.getElementById("locationInfoLat").innerHTML = location.lat;
    document.getElementById("locationInfoLong").innerHTML = location.long;
    document.getElementById("locationInfoConnection").innerHTML = location.connection;
    document.getElementById("locationInfoTime").innerHTML = location.timezone;
    document.getElementById("locationInfoISP").innerHTML = location.isp;
    document.getElementById("locationInfoProxy").innerHTML = location.proxy;
};

// When a dot/label is clicked, populate the demo's displayed output with that location's information
function locationDivClicked(location, index) {

    // Update DOM
    addLocationInfoToDOM(location);

    // Remove 'active' class from last label, add it to the new one
    locationDivs[activeLocationIndex].classList.remove("active");
    
    // Add 'active' class to the clicked div
    locationDivs[index].classList.add("active");
    
    // Update the current active div to reference for the next click
    activeLocationIndex = index;
};

// Initialize the 3D scene
function init() {

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    dpr = renderer.getPixelRatio();

    // Canvas
    document.getElementById('canvas').appendChild(renderer.domElement);
    canvasElement = document.querySelector("#canvas canvas");
    canvasElement.setAttribute("class", "canvas-hidden");

    // Auto-rotation toggle on mouse-in/mouse-out
    document.getElementById('canvas').addEventListener("mouseover", stopRotation);
    if (resumeAutoRotateOnMouseOut == true) {
        document.getElementById('canvas').addEventListener("mouseout", startRotation);
    }

    // Set the stage to add camera, globe, lights, etc. to
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(cameraFov, canvasWidth / canvasHeight, 1, 1000);
    var spherical = new THREE.Spherical(cameraDistance, THREE.Math.degToRad(90 - cameraVerticalOffset), THREE.Math.degToRad(cameraHorizontalOffset));
    camera.position.setFromSpherical(spherical);
    scene.add(camera);

    // Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = cameraAutoRotateSpeed;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = cameraDampingFactor;
    controls.rotateSpeed = cameraDragSpeed;
    controls.maxPolarAngle = cameraMaxAngle;
    controls.minPolarAngle = cameraMinAngle;

    // Globe construction
    circle = new THREE.Object3D(); // The parent "holder" for entire globe + location points
    scene.add(circle);
	
    var geom = new THREE.SphereGeometry(globeRadius, globeDivisions, globeDivisions); // Geometry for the globe
    var material = new THREE.MeshPhongMaterial({
        // color: 0xCCCCCC,
        map: new THREE.TextureLoader().load(globeTexture),
        normalMap: new THREE.TextureLoader().load(globeNormal),
        normalScale: new THREE.Vector2(globeNormalScale, globeNormalScale),
        specularMap: new THREE.TextureLoader().load(globeSpecular)
    });
    var planet = new THREE.Mesh(geom, material); // Create globe from geometry & textures
	
    circle.add(planet); // Add the globe to the parent "holder"

    // Light settings
    var ambientLight = new THREE.AmbientLight( lightAmbientColor );
    scene.add(ambientLight);
	
    pointLight1 = new THREE.PointLight(0xFFFFFF, lightTopIntensity );
    pointLight1.position.set(20, 30, 2);
    camera.add(pointLight1);
	
    pointLight2 = new THREE.DirectionalLight(0xFFFFFF, lightBottomIntensity );
    pointLight2.position.set(0, -100, -70);
    camera.add(pointLight2);

    // Generate location points, place them on the globe, and add elements for labels & dots to the DOM
    for (let j = 0; j < locations.length; j++) {
        let currentLocation = locations[j];

        // Add location point to 3D globe
        var point = new THREE.Object3D();
        var pointPosition = calcPosFromLatLonRad(Math.round(currentLocation.lat * 10) / 10,Math.round(currentLocation.long * 10) / 10,2);
        point.position.set(pointPosition[0], pointPosition[1], pointPosition[2]);
        circle.add(point);

        // Create DOM elements (label & dot) for that location
        var locationDiv = document.createElement("div");
        locationDiv.setAttribute("class", "location-div");
        if (j == activeLocationIndex) {
            locationDiv.classList.add("active");
        }
        locationDiv.setAttribute("id", currentLocation.city.toLowerCase().replace(/ /g,''));
        document.getElementById('canvas').appendChild(locationDiv);
		
        var locationDot = document.createElement("span");
        locationDot.setAttribute("class", "location-dot");
        locationDiv.appendChild(locationDot);
		
        var locationLabel = document.createElement("span");
        locationLabel.setAttribute("class", "location-label");
        locationDot.appendChild(locationLabel);
		
        var labelContents = document.createTextNode(currentLocation.city);
        locationLabel.appendChild(labelContents);
		
        locationDiv.addEventListener("click", function() {
            locationDivClicked(currentLocation, j);
        }, false);
		
        locationDivs.push(locationDiv);
    }
	
    window.addEventListener('resize', onWindowResize, false);
};

// Recalculate render on screen resizing
function onWindowResize() {
    newWidth = document.getElementById("canvas").clientWidth;;
    newHeight = newWidth;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}

// Lights, camera, action!
function animate() {
    requestAnimationFrame(animate);
    renderer.clear();
    controls.update();
    vector = new THREE.Vector3();
    var k;
    for (k = 0; k < locations.length; k++) {
        var vectorPos = calcPosFromLatLonRad(locations[k].lat, locations[k].long, 2); // Get the currents location's position in 3D space
        vector.set(vectorPos[0], vectorPos[1], vectorPos[2]); // Set vector to that postion
        vector.project(camera); // Project that position to the camera, to convert to 2D screen coordinates below
        vector.x = Math.round(((vector.x + 1) * renderer.domElement.width / 2 / dpr) * 10) / 10;
        vector.y = Math.round(((- vector.y + 1) * renderer.domElement.height / 2 / dpr) * 10) / 10;
        vector.z = 0;
        locationDivs[k].style.transform = "translate(" + vector.x + "px, " + vector.y + "px)"; // Move the DOM element of the dot & label to those 2D coordinates
        var cameraToPin = circle.children[k + 1].position.clone().sub(camera.position);
        if (cameraToPin.length() > visibilityLimit) { // Hide the dot & label if it's outside the visibility limit (behind the globe)
            if (!locationDivs[k].classList.contains("hidden")) {
                locationDivs[k].classList.add("hidden");
            }
            if (locationDivs[k].style.zIndex > 0) {
                locationDivs[k].style.zIndex = 0;
            }
        }
        else if (cameraToPin.length() <= visibilityLimit) { // Show dot & label if not covered by the globe
            if (locationDivs[k].classList.contains("hidden")) {
                locationDivs[k].classList.remove("hidden");
            }
            locationDivs[k].style.zIndex = 2800 - Math.round(cameraToPin.length() * 100);
        }
    }
    renderer.render(scene, camera);
};

// Set this whole thang in motion once all content is loaded and ready
window.onload = function () {
	
	// Initialize 3D scene, create the locations from our big 'locations' array
    init();
	
	// Start the animation loop
    animate();
	
	// Populate the location info box with the current active location's info
	addLocationInfoToDOM(locations[activeLocationIndex]);
	
	// Get rid of the canvas' loading state
    canvasElement.removeAttribute("class");
    canvasElement.parentElement.classList.remove("loading");
};
