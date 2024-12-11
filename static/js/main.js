let map;
let markers = [];
let markerCluster;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 44.3894, lng: -79.6903 },  // Default center (Barrie, Ontario)
        zoom: 12,
    });

    fetch("/api/transit")
        .then(response => response.json())
        .then(data => {
            // Map Markers
            markers = data.map(location => {
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(location.stop_lat), lng: parseFloat(location.stop_lon) },
                    title: location.stop_name,
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="info-window"><strong>${location.stop_name}</strong><br>Stop ID: ${location.stop_id}</div>`
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });

                return marker;
            });

            try {
                markerCluster = new MarkerClusterer({
                    map,
                    markers,
                });
            } catch (error) {
                console.error("Error initializing MarkerClusterer:", error);
            }

            const stopFrequency = {};
            data.forEach(location => {
                const stopName = location.stop_name;
                stopFrequency[stopName] = (stopFrequency[stopName] || 0) + 1;
            });

            const labels1 = Object.keys(stopFrequency); // Stop names
            const values1 = Object.values(stopFrequency); // Frequencies
            drawBarChart(labels1, values1, "chartCanvas", "Stop Frequencies");

            const routeFrequency = {};
            data.forEach(location => {
                const routeName = location.route_long_name;
                routeFrequency[routeName] = (routeFrequency[routeName] || 0) + 1;
            });

            const labels2 = Object.keys(routeFrequency); // Route names
            const values2 = Object.values(routeFrequency); // Frequencies
            drawPieChart(labels2, values2, "chartCanvas2", "Route Frequencies");
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Function to draw a bar chart
function drawBarChart(labels, values, canvasId, chartLabel) {
    console.log(`Drawing bar chart on ${canvasId} with labels:`, labels, "and values:", values);

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with ID ${canvasId} not found!`);
        return;
    }

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Stop Name'
                    }
                }
            }
        }
    });
}

// Function to draw a pie chart
function drawPieChart(labels, values, canvasId, chartLabel) {
    console.log(`Drawing pie chart on ${canvasId} with labels:`, labels, "and values:", values);

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with ID ${canvasId} not found!`);
        return;
    }

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: values,
                backgroundColor: labels.map(() => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`),
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Function to search stops by name
function searchStops() {
    const query = document.getElementById("search-box").value.toLowerCase();

    markers.forEach(marker => marker.setMap(null));

    const filteredMarkers = markers.filter(marker =>
        marker.getTitle().toLowerCase().includes(query)
    );

    filteredMarkers.forEach(marker => marker.setMap(map));

    if (markerCluster) {
        markerCluster.clearMarkers();
        markerCluster.addMarkers(filteredMarkers);
    }
}

window.onload = initMap;
