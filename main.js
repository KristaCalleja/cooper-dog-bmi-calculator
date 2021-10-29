// Capture user inputs
const nameInput = document.getElementById('name'); 
const breedInput = document.getElementById('breed');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
// Select HTML nodes
const resultDiv = document.querySelector('.results');
const nameDiv = document.querySelector('.name');
const breedSpan = document.querySelector('.breed');
const weightSpan = document.querySelector('.weight');
const submitBtn = document.querySelector('.primary-btn');
const healthDiv = document.querySelector('.health');
const bmiFunction = document.querySelector('.bmi-function');
const formDiv = document.querySelector('.form');

function fetchResponse(){
    // Read inputs
    const dogName = nameInput.value;
    const breedType = breedInput.value;
    let dogWeight = weightInput.value;
    let dogHeight = heightInput.value;
    // Consume API
    const dataPromise  = fetch("https://api.thedogapi.com/v1/breeds"); 
    console.log(typeof dataPromise);
    dataPromise
    // {
    //     method: 'GET',
    //     headers: {
    //         'x-api-key': '8ae0c179-1bca-4daf-aee8-1cfbecdcaf1f',
    //         'content-type': '',
    //     },
    //     mode: 'cors',
    //     cache: 'default',
    // }
        .then((response) => {
            return response.json();
        })
        .then((data) => {
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
