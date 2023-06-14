// Initialize important values for frontend
const input = $('input');
const formUrl = 'http://127.0.0.1:5000/game/handle';
let score = 0;
let gameOver = false;
const reusedWords = [];

// On document load, executes the following functions
$('document').ready(function (){
    checkHiScore();
    checkVisits();
    countDown();
})
// Use jQuery to handle click on button in the form

$('button.subgame').on('click', async function(e){
    e.preventDefault();
    if (gameOver === false){
        // Places the request and generates the response from the server
        const response = await handleClick();
        // Handles the response from the server
        handleResponse(response);
        // Resets the form to be blank
        $('input').val('');
    }
    else {
        $('h3').remove();
        $('div.response-box').append("<h3>If you would like to play again, please reload the page.</h3>");
        $('input').val('');
    }
});

// Include functions below to expand on what clicking the button should do (don't forget to include axios)

async function handleClick(){
    // extracts value from input
    let subWord = $('input').val();
    // sends POST request to formUrl in json
    const res = await axios.post(formUrl, { word: subWord });
    // extracts data sent from server
    const answer = res.data;
    // returns the answer (extracted data)
    return answer;
}

// Provides several ways for the front end to handle each response generated from handleClick()

function handleResponse(info){
    $('h3').remove();
    if(info === 'ok'){
        if(reusedWords.includes($('input').val())){
            $('div.response-box').append("<h3>Sorry, that word was already used.</h3>");
        }
        else {
            reusedWords.push($('input').val());
            $('div.response-box').append("<h3>Good answer!</h3>");
            let len = $('input').val().length;
            handleScore(len);
        }
    }
    else if(info === 'not-on-board'){
        $('div.response-box').append("<h3>Sorry, that word isn't on the board.</h3>");
    }
    else if(info === 'not-word'){
        $('div.response-box').append("<h3>Sorry, that isn't a word.</h3>");
    }
}

// Adds points to the score if the user submitted a word that is valid, on the board and hasn't been used

function handleScore(l){
    score += l;
    document.querySelector('p.score').innerText = `${score} points`;
}

// Every second the ticker will drop down by 1. Each second it's active, it will update the UI to show the remaining
// seconds. If it reaches 0, it will display 0 seconds and change gameOver to true. 

function countDown(){
    let ticker = 60;
    let clock = setInterval(function(){
        if(ticker > 0){
            ticker-- ;
            document.querySelector('p.timer').innerText = `${ticker} seconds`
        }
        else{
            clearInterval(clock);
            reviewHiScore();
            gameOver = true;
        }
    }, 1000);
}

// Checks for high score in the localStorage. If true, appends to div.stat-box. 

function checkHiScore(){
    if (localStorage.getItem('high-score')){
        let hScore = localStorage.getItem('high-score');
        $('div.stat-box').append(`<p class="high-score">High Score: ${hScore}</p>`);
    }
    return
}

// Checks how many times the user has visited the page. If true, adds 1 to visit and appends to div.stat-box. If false, sets num-visits to 1
// and appends to div.stat-box.

function checkVisits(){
    if (localStorage.getItem('num-visits')){
        let nVisit = localStorage.getItem('num-visits');
        let number = Number(nVisit);
        number++;
        localStorage.setItem('num-visits', number.toString());
        $('div.stat-box').append(`<p class="visits">Number of page visits: ${nVisit}</p>`)
    }
    else {
        localStorage.setItem('num-visits', '1');
        let nVisit = localStorage.getItem('num-visits');
        $('div.stat-box').append(`<p class="visits">Number of page visits: ${nVisit}</p>`)
    }
}

// Executes at the end and checks if the current score is higher than the high score. If true, localStorage item 'high-score' is updated and proper
// high-score is appended to div.stat-box. If false, localStorage item 'high-score' remains unchanged. 

function reviewHiScore(){
    if(localStorage.getItem('high-score')){
        let hiScore = localStorage.getItem('high-score');
        let highScore = Number(hiScore);
        if(highScore < score){
            localStorage.setItem('high-score', score.toString());
            let newScore = localStorage.getItem('high-score');
            document.querySelector('p.high-score').innerText = `High Score: ${newScore}`;
        }
        else{
            return
        }
    }
    else{
        localStorage.setItem('high-score', score.toString())
        let newScore = localStorage.getItem('high-score');
        $('div.stat-box').append(`<p class="high-score">High Score: ${newScore}</p>`);
    }
}