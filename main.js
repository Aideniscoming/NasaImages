


const imageContainer = document.getElementById('imageContainer');
const image = document.getElementById('image');
const image2 = document.getElementById('image2');
const caption2 = document.getElementById('caption2');
const caption = document.getElementById('caption');
const imageContainer2 = document.getElementById('imageContainer2');

const apiKey = "GIL57PDXFMLjlGFlxrS7EPY3BGQMjr1juekJApTm";

let ImageArray = [];
let marsImageArray = [];
let ImaIndex = 0;

async function fetchImageByDate() {
  try {
    const dateInput = document.getElementById('dateInput').value;
    if (!dateInput) {
      alert('Please select a date');
      return;
    }
    const apiUrl = `https://api.nasa.gov/EPIC/api/natural/date/${dateInput}?api_key=${apiKey}`
   
    const EarthResponse = await fetch(apiUrl);
    
    if (!EarthResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await EarthResponse.json();

    if (data.length === 0) {
        imageContainer.innerHTML = '<p>No images found for this date.</p>';
        return;
    }
    data.forEach(object => {
      const [year, month, day] = object.date.split(' ')[0].split('-');
      const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${object.image}.png`;
      const time = object.date.split(' ')[1];
      ImageArray.push({ imageUrl, time });
    });
    
    if (ImageArray.length > 0) {
        ImaIndex = 0;
        displayImage(ImaIndex);
    } else {
        imageContainer.innerHTML = '<p>No images available for this date.</p>';
    }
    
}
  catch (error) {
    console.error(error);
    window.alert(`Error: ${error.message}`);
  }
}
async function fetchMarsImage() {
    try {
        const dataInput2 = document.getElementById('solInput2').value;
        if (!dataInput2) {
        alert('Please select a sol');
        return; 
        }
        const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${dataInput2}&camera=mast&api_key=${apiKey}`
        const MarsResponse = await fetch(apiUrl);
        if (!MarsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const MarsData = await MarsResponse.json();
        if (MarsData.photos.length === 0) {
            imageContainer.innerHTML = '<p>No images found for this sol.</p>';
            return;
        }
        MarsData.photos.forEach(object => {
            const imageUrl = object.img_src;
            const time = object.earth_date;
            marsImageArray.push({ imageUrl, time });
        })
        if (marsImageArray.length > 0) {
        ImaIndex = 0;
        displayMarsImage(ImaIndex);
        } else {
            imageContainer2.innerHTML = '<p>No images available for this date.</p>';
        }
   }
    catch (error) {
        console.error(error);
        window.alert(`Error: ${error.message}`);
    }
}
function displayMarsImage(ImaIndex) {
    image2.src = marsImageArray[ImaIndex].imageUrl;
    caption2.textContent = `Date: ${marsImageArray[ImaIndex].time}`;
    document.getElementById('controls').style.display = 'flex';
    ImaIndex = ImaIndex; 
}
function prevImage2() {
    if (ImaIndex > 0) {
        ImaIndex--;
        displayMarsImage(ImaIndex);
    } else {
        ImaIndex = 20
        displayMarsImage(ImaIndex);; 
    }
}
function nextImage2() {
    if (ImaIndex <= 20) {
        ImaIndex++;
        displayMarsImage(ImaIndex);
    }
    else {
        ImaIndex = 0
        displayMarssImage(ImaIndex);; 
    }
}


function displayImage(ImaIndex) {
    image.src = ImageArray[ImaIndex].imageUrl;
    caption.textContent = `Time: ${ImageArray[ImaIndex].time}`;
    document.getElementById('controls').style.display = 'flex';
    ImaIndex = ImaIndex; 
}
function prevImage() {
    if (ImaIndex > 0) {
        ImaIndex--;
        displayImage(ImaIndex);
    } else {
        ImaIndex = ImageArray.length - 1
        displayImage(ImaIndex);; 
    }
}
function nextImage() {
    if (ImaIndex < (ImageArray.length - 1)) {
        ImaIndex++;
        displayImage(ImaIndex);
    }
    else {
        ImaIndex = 0
        displayImage(ImaIndex);; 
    }
}
let SlideInterval = null;
function SlideImage() {
    ImaIndex = 0;
    SlideInterval = setInterval(() => {
        

        if (ImaIndex === ImageArray.length - 1) {
        clearInterval(SlideInterval);
        displayImage(ImaIndex) }
        else {
            nextImage();
        }// Reset index if it exceeds the length of the array
    }, 1500);
}