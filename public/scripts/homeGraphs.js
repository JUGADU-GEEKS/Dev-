// Sample data - replace with your actual data
const dates = ['4/11/2025', '4/12/2025', '4/13/2025', '4/14/2025', '4/15/2025'];
    
// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 40,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

// Temperature chart
const tempCtx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(tempCtx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Temperature (°C)',
      data: [24, 22, 26, 25, 23],
      borderColor: '#9A9575',
      backgroundColor: 'rgba(154, 149, 117, 0.2)',
      tension: 0.3,
      pointBackgroundColor: '#9A9575',
      fill: true
    }]
  },
  options: {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: false,
        min: 15,
        max: 30,
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      },
      x: {
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      }
    }
  }
});

// Humidity chart
const humidityCtx = document.getElementById('humidityChart').getContext('2d');
const humidityChart = new Chart(humidityCtx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Humidity (%)',
      data: [65, 70, 55, 60, 75],
      borderColor: '#6A762A',
      backgroundColor: 'rgba(106, 118, 42, 0.2)',
      tension: 0.3,
      pointBackgroundColor: '#6A762A',
      fill: true
    }]
  },
  options: {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: false,
        min: 40,
        max: 80,
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      },
      x: {
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      }
    }
  }
});

// Rainfall chart
const rainCtx = document.getElementById('rainChart').getContext('2d');
const rainChart = new Chart(rainCtx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Rainfall (mm)',
      data: [5, 12, 0, 2, 8],
      borderColor: '#4682B4',
      backgroundColor: 'rgba(70, 130, 180, 0.2)',
      tension: 0.3,
      pointBackgroundColor: '#4682B4',
      fill: true
    }]
  },
  options: {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      },
      x: {
        grid: {
          color: 'rgba(178, 172, 136, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      }
    }
  }
});
