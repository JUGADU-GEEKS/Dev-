const API_KEY = "41522507e921e5a20c4f238b17dc7b06"; // Replace this

async function getForecast() {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=delhi&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    const tempData = [];
    const humidityData = [];
    const rainData = [];
    const labels = [];

    const dailyData = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));

    dailyData.forEach(entry => {
        const date = new Date(entry.dt_txt).toLocaleDateString();
        labels.push(date);
        tempData.push(entry.main.temp);
        humidityData.push(entry.main.humidity);
        rainData.push(entry.rain ? entry.rain["3h"] || 0 : 0);
    });

    plotChart("tempChart", "Temperature (°C)", labels, tempData, 'rgba(255, 99, 132, 0.6)');
    plotChart("humidityChart", "Humidity (%)", labels, humidityData, 'rgba(54, 162, 235, 0.6)');
    plotChart("rainChart", "Rainfall (mm)", labels, rainData, 'rgba(75, 192, 192, 0.6)');
}

function plotChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color,
                borderColor: color,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
window.addEventListener('DOMContentLoaded', getForecast);