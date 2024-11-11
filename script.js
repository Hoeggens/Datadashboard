const lowerSlider = document.getElementById('lower');
const upperSlider = document.getElementById('upper');
const lowerValueDisplay = document.getElementById('lower-value');
const upperValueDisplay = document.getElementById('upper-value');
const range = document.getElementById('range');
const countrySelect = document.getElementById('land');
const citySelect = document.getElementById('stad');

let originalData = null; // Хранение загруженных данных для фильтрации

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
    const parsedData = parseCSV(data);
    originalData = parsedData; // Сохраняем данные
    populateFilters(parsedData);
    createChart(parsedData);
}

function parseCSV(data) {
    const rows = data.trim().split('\n');
    const results = [];
    const uniqueCountries = new Set();
    const uniqueCities = new Set();

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip the header row

        const columns = row.split(',').map(col => col.trim());
        const year = columns[3];
        const avgTemp = columns[4];
        const city = columns[6];
        const country = columns[8];

        if (year && !isNaN(avgTemp)) {
            results.push({ year, avgTemp, city, country });
            uniqueCountries.add(country);
            uniqueCities.add(city);
        }
    });

    return { data: results, countries: [...uniqueCountries], cities: [...uniqueCities] };
}

function populateFilters(parsedData) {
    countrySelect.innerHTML = '<option value="">All Countries</option>';
    citySelect.innerHTML = '<option value="">All Cities</option>';

    parsedData.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    parsedData.cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.data.map(item => item.year);
    const averages = data.data.map(item => item.avgTemp);

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

countrySelect.addEventListener('change', filterData);
citySelect.addEventListener('change', filterData);

function filterData() {
    const selectedCountry = countrySelect.value;
    const selectedCity = citySelect.value;

    if (originalData) {
        const filteredData = originalData.data.filter(item => {
            return (!selectedCountry || item.country === selectedCountry) &&
                   (!selectedCity || item.city === selectedCity);
        });
        createChart({ data: filteredData });
    }
}

fetchCSVData();
