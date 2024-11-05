    const lowerSlider = document.getElementById('lower');
    const upperSlider = document.getElementById('upper');
    const lowerValueDisplay = document.getElementById('lower-value');
    const upperValueDisplay = document.getElementById('upper-value');
    const range = document.getElementById('range');

    function updateSlider() {
        let lowerValue = parseInt(lowerSlider.value);
        let upperValue = parseInt(upperSlider.value);
    
        if (lowerValue > upperValue) {
            lowerSlider.value = upperValue;
            lowerValue = upperValue;
        }
    
        if (upperValue < lowerValue) {
            upperSlider.value = lowerValue;
            upperValue = lowerValue;
        }

    
        lowerValueDisplay.textContent = lowerSlider.value;
        upperValueDisplay.textContent = upperSlider.value;
    }
    
    lowerSlider.addEventListener('input', updateSlider);
    upperSlider.addEventListener('input', updateSlider);

    updateSlider();
    async function fetchCSVData() {
        const response = await fetch('temperature.csv');

        const data = await response.text();
        console.log(data);
        const parsedData = parseCSV(data);
        console.log(parsedData);
        createChart(parsedData);

        return parsedData;
}
function parseCSV(data) {
    const rows = data.trim().split('\n');
    const results = [];

    rows.forEach((row, index) => {
        if (index === 0) return;

        const columns = row.split(',').map(col => col.trim());

        const year = columns[3];
        const avgTemp = columns[4];
        const city = columns[6];
        const country = columns[8];

        if (year && !isNaN(avgTemp)) {
            results.push({ year, avgTemp });
        }
    });

    return results;
}

function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(item => item.year);
    const averages = data.map(item => item.avgTemp);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Temperature (°F)',
                data: averages,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°F)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

fetchCSVData();



