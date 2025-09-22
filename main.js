// Elements
const earthImage = document.getElementById('image');
const earthCaption = document.getElementById('caption');
const marsImage = document.getElementById('image2');
const marsCaption = document.getElementById('caption2');
const controls = document.getElementById('controls');

const apiKey = "GIL57PDXFMLjlGFlxrS7EPY3BGQMjr1juekJApTm";

let marsImageArray = [];
let marsIndex = 0;

let earthDatesArray = []; // for slideshow (optional)
let earthIndex = 0;
let earthSlideInterval = null;

// ------------------------ FETCH EARTH IMAGE ------------------------
function fetchEarthImageByDate() {
    const dateInput = document.getElementById('dateInput').value;
    if (!dateInput) {
        alert('Please select a date');
        return;
    }

    const layer = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';
    const projection = 'epsg4326';
    const format = 'image/png';
    const bbox = '-180,-90,180,90'; // full world
    const width = 800;
    const height = 400;
    const styles = '';

    const imageUrl = `https://gibs.earthdata.nasa.gov/wms/${projection}/best/wms.cgi?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=${layer}&STYLES=${styles}&BBOX=${bbox}&WIDTH=${width}&HEIGHT=${height}&SRS=EPSG:4326&FORMAT=${format}&TIME=${dateInput}`;

    // Display image directly (avoiding CORB/CORS)
    earthImage.src = imageUrl;
    earthCaption.textContent = `Date: ${dateInput}`;
    controls.style.display = 'flex';

    // Optional: for slideshow support
    earthDatesArray = [dateInput]; // add more dates if desired
    earthIndex = 0;
}


// ------------------------ MARS IMAGE ------------------------
async function fetchMarsImage() {
    try {
        const solInput = document.getElementById('solInput2').value;
        if (!solInput) {
            alert('Please select a sol');
            return;
        }

        const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solInput}&camera=mast&api_key=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.photos.length === 0) {
            marsImage.src = '';
            marsCaption.textContent = 'No images found for this sol.';
            return;
        }

        // Populate marsImageArray
        marsImageArray = data.photos.map(photo => ({
            url: photo.img_src,
            date: photo.earth_date
        }));

        marsIndex = 0;
        displayMarsImage(marsIndex);

    } catch (error) {
        console.error(error);
        alert(`Error fetching Mars image: ${error.message}`);
    }
}

function displayMarsImage(index) {
    marsImage.src = marsImageArray[index].url;
    marsCaption.textContent = `Date: ${marsImageArray[index].date}`;
}

// Mars navigation
function prevMarsImage() {
    if (marsImageArray.length === 0) return;
    marsIndex = (marsIndex - 1 + marsImageArray.length) % marsImageArray.length;
    displayMarsImage(marsIndex);
}

function nextMarsImage() {
    if (marsImageArray.length === 0) return;
    marsIndex = (marsIndex + 1) % marsImageArray.length;
    displayMarsImage(marsIndex);
}

// ------------------------ OPTIONAL: Mars Slideshow ------------------------
let marsSlideInterval = null;
function startMarsSlideShow(interval = 1500) {
    if (marsImageArray.length === 0) return;
    clearInterval(marsSlideInterval);
    marsSlideInterval = setInterval(nextMarsImage, interval);
}

function stopMarsSlideShow() {
    clearInterval(marsSlideInterval);
}
