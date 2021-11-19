// Capture user inputs
const nameInput = document.getElementById('name'); 
const breedInput = document.getElementById('breed');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
// Form error elements
let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);
let breed = id("breed"),
    weight = id("weight"),
    height = id("height"),
    errorMsg = classes("error"),
    failureIcon = classes("failure-icon");
// Select HTML nodes
const matchList = document.getElementById('match-list');
const resultDiv = document.querySelector('.results');
const nameDiv = document.querySelector('.name');
const breedSpan = document.querySelector('.breed');
const weightSpan = document.querySelector('.weight');
const submitBtn = document.querySelector('.primary-btn');
const healthDiv = document.querySelector('.health');
const bmiFunction = document.querySelector('.bmi-function');
const formDiv = document.querySelector('.form');

function apiCall(){
       // get breed input
       breedInput.onkeydown = function() {
       var searchBreed = breedInput.value;
   
       if (searchBreed.length >= 3 ) {
          while (document.getElementsByClassName('autoComplete')[0]) {
            document.getElementsByClassName('autoComplete')[0].remove();
        }
           var request = new XMLHttpRequest();
           request.open('GET', 'https://api.thedogapi.com/v1/breeds', true);
           request.onload = function () {
               // Begin accessing JSON data here
               var data = JSON.parse(this.response);
               var wrapper = document.createElement('div');
               wrapper.className = "autoComplete";
               app.appendChild(wrapper);
               var results = data;
               if (request.status >= 200 && request.status < 400) {
                   console.log(data);
                   Object.keys(data.Search).map(function(key, index) {
                       console.log(data.Search[index].Title);
   
                       const searchResultsContainer = document.createElement('div');
                       searchResultsContainer.setAttribute('class', 'row');
   
                       const h1 = document.createElement('h1');
                       h1.textContent = data.Search[index].Title;
                       wrapper.appendChild(searchResultsContainer);
                       searchResultsContainer.appendChild(h1);
                       console.log(searchResultsContainer);
                    });
               } else {
                   console.log('error');
               }
           };
           request.send();
       }
   }
}
(breedInput, weightInput, heightInput).addEventListener("blur", () =>{
    engine(breed, 0, "Breed field cannot be blank.");
    engine(weight, 1, "Weight cannot be blank.");
    engine(height, 2, "Height cannot be blank");
});

let engine = (id, serial, message) =>{
    if (id.value.trim()===""){
        errorMsg[serial].innerHTML = message;
        id.style.border = "2px solid red";
    } else {
        errorMsg[serial].innerHTML = "";
        id.style.border = "2px solid green";
    }
}

function fetchResponse(){
    // Read inputs
    const dogName = nameInput.value;
    const breedType = breedInput.value;
    let dogWeight = weightInput.value;
    let dogHeight = heightInput.value;
    // Consume API
    fetch("https://api.thedogapi.com/v1/breeds", {
        method: 'GET',
        mode: 'cors',
        headers: {
            'x-api-key': '8ae0c179-1bca-4daf-aee8-1cfbecdcaf1f'
        }
    }).then((response) => response.json())
      .then(data => {
            // Test fields
            console.log(typeof data);
            // Replace name and breed fields
            nameDiv.innerText = `${dogName}`;
            breedSpan.innerText = `${breedType}`;
            // Search API for info about that breed
            // Loop over the array to find the index of the object
            const returnData = data.findIndex(object => {
                if (object.name === `${breedType}`) {
                    return true;
                }   return false;
            })
            // Find range of healthy weight
            var healthyWeight = data[returnData].weight.metric;
            console.log(healthyWeight);
            weightSpan.innerText = healthyWeight;
            // Split the healthy weight values into two values
            function findUnderweight(){
                var underWeight = healthyWeight.split('');
                return underWeight[0];
            }
            function findOverweight(){
                var overWeight = healthyWeight.split('');
                return overWeight[4];
            }
            console.log(findUnderweight());
            console.log(findOverweight());
            // Place image of the dog
            let imageDiv = new Image(300, 200);
            imageDiv.src = data[returnData].image.url;
            imageDiv.classList.add('image');
            resultDiv.insertAdjacentElement('afterbegin', imageDiv);
            // Calculate the BMI
            function bmiCalculation(w, h){
                heightSquared = h * h;
                var value = w / heightSquared;
                return Math.round(value * 10)/10;
            }
            console.log(bmiCalculation(dogWeight, dogHeight));
            bmiFunction.innerText = `${bmiCalculation(dogWeight, dogHeight)}`;
            // Return BMI statement
            function returnResults(){
                if (bmiCalculation < findUnderweight()){
                    return healthDiv.innerText = "underweight";
                } else if (bmiCalculation > findOverweight()){
                    return healthDiv.innerText = "overweight";
                } else {
                    return healthDiv.innerText = "in great shape";
                }
            }
            console.log(returnResults());
            // Close the form div and insert the result div
            formDiv.classList.add('close');
            resultDiv.classList.add('open');
        })
        .catch(handleError);
    }
submitBtn.addEventListener('click', function(event){
    event.preventDefault();
    fetchResponse();
})

// Error handler
function handleError(err) {
    console.log(err);
}
