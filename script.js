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
    
        const percentageLower = (lowerValue / lowerSlider.max) * 100;
        const percentageUpper = (upperValue / upperSlider.max) * 100;
        range.style.left = `${percentageLower}%`;
        range.style.width = `${percentageUpper - percentageLower}%`;
    
        lowerValueDisplay.textContent = lowerSlider.value;
        upperValueDisplay.textContent = upperSlider.value;
    }
    
    lowerSlider.addEventListener('input', updateSlider);
    upperSlider.addEventListener('input', updateSlider);

    updateSlider();
    async function fetchCSVData() {
        const response = await fetch('temperature.csv');

        const data = await response.text();
        // console.log(data);
        const parsedData = parseCSV(data);

        createChart(parsedData);

        return parsedData;
}
function parseCSV(data) {
    const rows = data.trim().split('\n');
    const results = [];

    rows.forEach((row, index) => {
        if (index === 0) return;

        const columns = row.split(',').map(col => col.trim());

        const year = columns[3] ? columns[3].replace(/"/g, '') : null;
        const avgTemp = columns[4] ? parseFloat(columns[4]) : null;

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

    const temperatureChart = new Chart(ctx, {
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



