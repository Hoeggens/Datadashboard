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

            if (year && !isNaN(avgTemp) && country != "NA" && city != "") {
                results.push({ year, avgTemp, city, country});
            }
        });

        return results;
    }

        function createChart(data) {
            const ctx = document.getElementById('myChart').getContext('2d');
        
            const labels = Array.from(new Set(data.map(item => item.year))).sort();

            const groupedData = {};
            
            data.forEach(item => {
                const { country, city, year, avgTemp } = item;
            
                if (!groupedData[country]) {
                    groupedData[country] = {};
                }
            
                if (!groupedData[country][city]) {
                    groupedData[country][city] = {};
                }
            
                groupedData[country][city][year] = avgTemp;
            });
            
            const datasets = [];
            
            Object.keys(groupedData).forEach(country => {
                Object.keys(groupedData[country]).forEach(city => {
                    const cityData = labels.map(year => groupedData[country][city][year] || null);
            
                    datasets.push({
                        label: `${city}, ${country}`,
                        data: cityData,
                        borderWidth: 2,
                        fill: false,
                        borderColor: getRandomColor(),
                    });
                });
            });
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
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
            
        function getRandomColor() {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgba(${r}, ${g}, ${b}, 0.7)`;
        }

    fetchCSVData();



