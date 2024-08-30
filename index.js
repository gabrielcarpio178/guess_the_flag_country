const forms = document.querySelector("#submit_form");
const loader = document.querySelector("#loader");
const error_ = document.querySelector("#error");
const scoreDiv = document.querySelector("#score");
const lifeDiv = document.querySelector("#life");
const nextBtn = document.querySelector("#next");
const submitBtn = document.querySelector("#submitBtn");
const result_ = document.querySelector("#result_");
let choice = "";
let answer = 0;
let score = 0;
let life = 5;
scoreDiv.textContent = score;
lifeDiv.textContent = life;

nextBtn.addEventListener("click",()=>{
    fetchData();
    result_.textContent=""
    nextBtn.style.display="none"
    submitBtn.style.display = "block";
});
forms.addEventListener("submit", e=>{
    e.preventDefault();
    try{
        choice = document.querySelector('input[name="choice"]:checked').value;        
        displayResultGuess(choice, answer)   
        addPoints(answer==choice);    
        isGameOver(minusLife(answer!=choice));
        submitBtn.disabled = true;
        disableRadio();
    } catch(error) {
        error_.textContent = "Please select guess"       
    }    
    
})

function randomIntFromInterval(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fetchData(){
     loader.style.zIndex = 1; 
     error_.textContent = "";
     document.querySelector("#next").style.display="none";
                fetch(`https://restcountries.com/v3.1/all?fullText=true`)
    .then(res=>{              
        return res.json();       
    })
    .then(datas=>{          
        let choices = []          
        generateDisplayContent().forEach(i=>{
            choices.push(datas[i])
        })
        displayData(choices)       
     })        
    .catch(error=>{
        fetchData();
        loader.style.zIndex = 1;
    })     
    submitBtn.disabled = false;
}

function generateDisplayContent(){
    let numbers = [];
    while(numbers.length !== 4){
        var ranNumber = randomIntFromInterval(0, 250);
        if (!numbers.includes(ranNumber)) { 
            numbers.push(ranNumber);                
        }    
    }
    return numbers;
}


function displayData(countryObj){    
    answer = randomIntFromInterval(0, 3)
    document.querySelector("#flag_data").src = countryObj[answer].flags.png;
    
    let contentChoose = '';
    for(let i in countryObj){
        contentChoose += `
            <input type="radio" id="${i}" name="choice" value="${i}">
            <label class="choose" for="${i}">${countryObj[i].name.common}</label>
        `;
    }    
    document.querySelector('#dataChoice').innerHTML = contentChoose;
   loader.style.zIndex = -1;        
}

function displayResultGuess(guess, answer){
    if(guess!=""){
        const guessDiv = document.querySelector(`label[for="${guess}"]`);
        const answerDiv = document.querySelector(`label[for="${answer}"]`);
        if(guess==answer){
            result_.textContent="Correct Guess"
        }else{
            result_.textContent="Wrong Guess"
            answerDiv.classList.add("correct");
            guessDiv.classList.add("wrong");
        }
        submitBtn.style.display = "none";
        nextBtn.style.display="block"
    }    
}

function disableRadio(){
    const radios = document.querySelectorAll("input[type='radio']");
    radios.forEach(radio=>{
        radio.disabled = true;
    })
}

function addPoints(isCorrect){
    if(isCorrect){
        score++;
        scoreDiv.textContent = score;
    }    
}

function minusLife(isCorrect){
    if(isCorrect){
        life--;
        lifeDiv.textContent = life;
    }  
    return life;
}

function isGameOver(lifes){
    if (lifes==0) {
        Swal.fire({
          title: `Score: ${score}`,
          text: "Do want try again?",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Yes, Try again!",
          allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();        
            }
        });
    }
}