const peer = new Peer();
let conn;

// 1. Connect to the TV
document.getElementById('connectBtn').addEventListener('click', () => {
    const targetId = prompt("Enter the TV ID you see on the screen:");
    if (targetId) {
        conn = peer.connect(targetId);
        conn.on('open', () => {
            document.getElementById('statusText').innerText = "Connected to TV!";
        });
    }
});

// 2. Enable Motion Tracking
document.getElementById('startBtn').addEventListener('click', () => {
    // Check if the browser supports motion permission requests (like iOS)
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startTracking();
                } else {
                    alert("Permission denied. Please allow motion access in settings.");
                }
            })
            .catch(console.error);
    } else {
        // Fallback for Android/Older browsers
        startTracking();
    }
});

// 3. The Tracking Function
function startTracking() {
    document.getElementById('statusText').innerText = "Tracking Motion...";
    window.addEventListener('devicemotion', (event) => {
        // Multiplier set to 20 for better cursor speed
        let x = event.accelerationIncludingGravity.x * 20;
        let y = event.accelerationIncludingGravity.y * 20;

        // Send data to the TV
        if (conn && conn.open) {
            conn.send({x: x, y: y});
        }
    });
                            }
