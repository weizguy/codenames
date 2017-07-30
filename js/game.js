var game = false;
var gameOver = false;
var timerMax = 90;
var tick = timerMax;
var clock;

function changeHint() { 
    var x = $('#hintText').val();
    $('#hint').html(x);
    if(tick == timerMax){
        stopTimer();
        startTimer();
    }
}

function switchHint() { 
    var y = $('#changeHint').val();
    if(game == true) {
    $('#hintText').val(y);
        changeHint()
    }
}
//start timer function
function startTimer() {
    $('.flipContainer').click(cardClicked);
    $('.btn').click(switchTurn);
    clock = setInterval(function() { timer() }, 1000);
}
//actual timer function
function timer() {
    $('#time').html(tick--);
    if(tick < 0){
        if(playerTurn == 'red'){
            turn('blue');
            stopTimer();
        }else if(playerTurn == 'blue'){
            turn('red');
            stopTimer();
        }           
    } 
}
// stop timer function
function stopTimer() {
    clearInterval(clock);
    clock = null;
    $('#time').html(0);
    tick = timerMax;
    $('.btn').off('click');
    $(".flipContainer").off("click");
}
// end timer functions

$(document).ready(function () {
    hintWord();
    randomWords();
    // createSpyBoard();
    setTimeout(function() { createSpyBoard() }, 2000);
    // setTimeout(function() { randomTurn() }, 1000);
    randomTurn();
});
var gameNumber = Math.ceil((Math.random() * 9000) + 1000);

// Initialize Firebase to grab random words START
// +++++++++++++++++++++++++++++++++++++++++++++++++
var config = {
    apiKey: "AIzaSyBMt5Zu9r1U4Fjg6jXGAEcnvB_2JJo2SOM",
    authDomain: "codenames-d5f81.firebaseapp.com",
    databaseURL: "https://codenames-d5f81.firebaseio.com",
    storageBucket: "codenames-d5f81.appspot.com",
    messagingSenderId: "507263974886"
};
firebase.initializeApp(config);
var fbRef = firebase.database();

var hint;
function hintWord() {
    fbRef.ref().on('value', function (getHint) {  
        hint = getHint.val();
        G = 'SPY' + gameNumber;
        a = hint.codenames.Game;
        b = a[G];
        team = b.Team;
        gameBoard = b.GameBoard;
        spyBoard = b.spyBoard;

        try {
            hintWrd = b.Spymaster.HintWord;
            numGuess = b.Spymaster.numGuess;
        }catch(error){
            return;
        }
        up = hintWrd.toUpperCase();

        if(game == true) {

            $('#changeHint').val(up);
            switchHint();
            $('#count').html(numGuess);
        }else if(game == false && gameOver == false) {
            $('#hint').html('WAITING FOR HINT');
            $('#count').html('0');
        }else if(game == false && gameOver == true) {
            $('#hint').html('GAME OVER!');
            $('#count').html('0');
        }

        if (screen.width > 800) {
            // $('#hint').css('font-size', '20px');
            // $('#count').css('font-size', '20px');
            // $('#time').css('font-size', '20px');
            // $('#turn').css('font-size', '20px');
            // $('#blueScore').css('font-size', '20px');
            // $('#redScore').css('font-size', '20px');

        }else if(screen.width < 500){
            $('#hint').css('font-size', '2vh');
            $('#count').css('font-size', '2vh');
            $('#time').css('font-size', '2vh');
            $('#turn').css('font-size', '2vh');
            $('#blueScore').css('font-size', '2vh');
            $('#redScore').css('font-size', '2vh');

        } else if (screen.width <= 800) {
            $('#hint').css('font-size', '18px');
            $('#count').css('font-size', '18px');
            $('#time').css('font-size', '18px');
            $('#turn').css('font-size', '18px');
            $('#blueScore').css('font-size', '18px');
            $('#redScore').css('font-size', '18px');
            }
    })
}

var word;
var list = [];
var wordList = list;
//get all word data from the firebase DB
function randomWords() {
    var arr = [];
    // Create an array with 400 indexes
    var mainArray = [];
    for(var i = 0; i < 400; i++){
        mainArray.push(i);
    }
    shuffle(mainArray);
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        // Create array with 25 unique/random indexes
        arr = array.slice(0,25);
    }

    fbRef.ref().once('value', function (getWords) {
        word = getWords.val();

        for (var j = 0; j < arr.length; j++) {
            x = word.masterWordList[arr[j]].WORD;
            up = x.toUpperCase();
            list.push(up);
        }

        for (var k = 0; k < 25; k++) {
            $('#word' + k).html('<p>' + wordList[k] + '</p>');

        }
        var sendGameBoard = wordList;
        fbRef.ref('codenames/Game/SPY' + gameNumber + '/GameBoard').set(sendGameBoard);
    })
}
// +++++++++++++++++++++++++++++++++++++++++++++++++
// Initialize Firebase to grab random words END

var newModal = document.getElementById('newGameModal');
function closeNewGame() {
    newModal.style.display = "none";
}

var winText;
function win(team){
    x = hintWrd;
    lastHint = x.toUpperCase();
    if(team == 'red'){
        winText = "RED WINS! Last hint was " + lastHint;
        fbRef.ref('codenames/Game/SPY' + gameNumber + '/Team').set("RED WINS! Last hint was " + lastHint);
        $('#hint').html('GAME OVER!');
        $('#count').html('0');
        $('#turn').html(winText).css('background-color', 'rgba(255,0,0,1');
        $('.btn').off('click');
        game = false;
        gameOver = true;
        stopTimer();
    }else {
        winText = "BLUE WINS! Last hint was  " + lastHint;
        fbRef.ref('codenames/Game/SPY' + gameNumber + '/Team').set("BLUE WINS! Last hint was " + lastHint);
        $('#hint').html('GAME OVER!');
        $('#count').html('0');
        $('#turn').html(winText).css('background-color', 'rgba(0,0,255,1');
        $('.btn').off('click');
        game = false;
        gameOver = true;
        stopTimer();
    }
}

var card;
var sendInfo;
var sendCardClicked;
function cardClicked() {
    $('.flipContainer:hover .card, .flipContainer.hover .card, .flipContainer.flip .card').css("transform", "rotateY(180deg)");
    card = $(this)[0].children[0].children[1].style.backgroundImage;
    var $this = $(this);
    if($this.hasClass('clicked')){
        return;
    }
    $this.addClass('clicked');
    sendInfo = $(this)[0].children[0].children[1].attributes[1];
    sendCardClicked = sendInfo.value;
    fbRef.ref('codenames/Game/SPY' + gameNumber + '/cardClicked').set(sendCardClicked);

    if (card.indexOf('assassin') > 1) {
        nextTurn('assassin');
    } else if (card.indexOf('blue') > 1) {
        blueCount -= 1;
        $('#blueNeed').html(blueCount);
        if (blueCount == 0) {
            $(this).off("click");
            $('.btn').off('click');
            $(".flipContainer").off("click");
            win('blue');
        } else {
            nextTurn('blue');
        }
    } else if (card.indexOf('red') > 1) {
        redCount -= 1;
        $('#redNeed').html(redCount);
        if (redCount == 0) {
            $(this).off("click");
            $('.btn').off('click');
            $(".flipContainer").off("click");
            win('red');
        } else {
            nextTurn('red');
        }
    } else if (card.indexOf('bystander') > 1) {
        nextTurn('bystander');
    }
}

function switchTurn() {
    stopTimer();
    nextTurn('switch');
}

function nextTurn(card) {
    switch (card) {
        case 'assassin':
            $(this).off('click');
            $('.btn').off('click');
            $(".flipContainer").off("click");
            stopTimer();
            if (playerTurn == 'red') {
                win('blue');
                break;
            } else
                win('red');
            break;
        case 'switch':
            if (playerTurn == 'red') {
                turn('blue');
            } else if (playerTurn == 'blue') {
                turn('red');
            } else
                return;
            break;
        case 'blue':
            if (playerTurn == 'red') {
                turn('blue');
            } else
                return;
            break;
        case 'red':
            if (playerTurn == 'blue') {
                turn('red');
            } else
                return;
            break;
        case 'bystander':
            if (playerTurn == 'red') {
                turn('blue');
                break;
            } else
            turn('red');
            break;
    }
}

var redCount = 0;
var blueCount = 0;
var doubleAgent = null;
function randomTurn() {
    var coinflip = Math.random();
    if (coinflip > .5) {
        turn('red');
        redCount = 9;
        blueCount = 8;
        $('#redNeed').html(redCount);
        $('#blueNeed').html(blueCount);
        doubleAgent = 'red';
    } else if (coinflip <= .5) {
        turn('blue');
        redCount = 8;
        blueCount = 9;
        $('#redNeed').html(redCount);
        $('#blueNeed').html(blueCount);
        doubleAgent = 'blue';
    }
    var cardArray = cards;

    if (doubleAgent == 'red') {
        cardArray.push(doubleAgents[0]);
    } else if (doubleAgent == 'blue') {
        cardArray.push(doubleAgents[1]);
    }

    shuffleCards(cardArray);
}

var imgChoice = [];
// Create random images based on the available number of cards
function shuffleCards(array) {
    imgChoice = array;
    var counter = 25, temp, index;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    $('.reveal').each(function (val) {
        $(this).css('background', 'url(' + imgChoice[val].img + ') no-repeat center');
    });
    $('.reveal').each(function (index) {
        $(this).attr('alt', index);
    });
}

$('#gameID').html(gameNumber);

$(document).ready(function(){
    modal.style.display = "block";
});

// Get the modal
var modal = document.getElementById('gameModal');

function submitGameID(){
    modal.style.display = "none";
}


var fbArray = [];
function createSpyBoard() {
    for (var i = 0; i < imgChoice.length; i++) {
        var str = imgChoice[i].img;
        if (str.match('green')) {
            fbArray.push('green');
        } else if (str.match('red')) {
            fbArray.push('red');
        } else if (str.match('blue')) {
            fbArray.push('blue');
        } else if (str.match('bystander')) {
            fbArray.push('burlywood');
        } else if (str.match('assassin')) {
            fbArray.push('black');
        }
    }
    var sendSpyBoard = fbArray;
    fbRef.ref('codenames/Game/SPY' + gameNumber + '/spyBoard').set(sendSpyBoard);
    $('#gameNum').html('Current GameID: ' + gameNumber);
    game = true;
}

// function to notify which players turn it is for both the game board and spymaster board START
// ***********************************************************************************
var playerTurn = null;
function turn(team) {
    if (team === 'red') {
        playerTurn = 'red';
        fbRef.ref('codenames/Game/SPY' + gameNumber + '/Team').set('RED TEAMS TURN');
        $('#turn').html("RED TEAM'S TURN");
        $('#turn').css('background-color', 'rgba(255,0,0,1');
        $('#hint').html('WAITING FOR HINT');
        stopTimer();
    } else if (team === 'blue') {
        playerTurn = 'blue';
        fbRef.ref('codenames/Game/SPY' + gameNumber + '/Team').set('BLUE TEAMS TURN');
        $('#turn').html("BLUE TEAM'S TURN");
        $('#turn').css('background-color', 'rgba(0,0,255,1');
        $('#hint').html('WAITING FOR HINT');
        stopTimer();
    }
}
// ***********************************************************************************
// function to notify which players turn it is for both the game board and spymaster board START

// create the card faces (8 blue, 8 red, 7 bystanders, 1 assassin, 2 double agents) START
// ***********************************************************************************
var cards = [
    {   name: "bystander", img: "images/bystanderFemale.png", id: 1  },
    {   name: "bystander", img: "images/bystanderFemale.png", id: 2 },
    {   name: "bystander", img: "images/bystanderFemale.png", id: 3 },
    {   name: "bystander", img: "images/bystanderMale.png", id: 4 },
    {   name: "bystander", img: "images/bystanderMale.png", id: 5 },
    {   name: "bystander", img: "images/bystanderMale.png", id: 6 },
    {   name: "bystander", img: "images/bystanderMale.png", id: 7 },

    {   name: "assassin", img: "images/assassin.png", id: 8 },

    {   name: "redAgent", img: "images/redMale.png", id: 9 },
    {   name: "redAgent", img: "images/redMale.png", id: 10 },
    {   name: "redAgent", img: "images/redMale.png", id: 11 },
    {   name: "redAgent", img: "images/redMale.png", id: 12 },
    {   name: "redAgent", img: "images/redFemale.png", id: 13 },
    {   name: "redAgent", img: "images/redFemale.png", id: 14 },
    {   name: "redAgent", img: "images/redFemale.png", id: 15 },
    {   name: "redAgent", img: "images/redFemale.png", id: 16 },

    {   name: "blueAgent", img: "images/blueFemale.png", id: 17 },
    {   name: "blueAgent", img: "images/blueFemale.png", id: 18 },
    {   name: "blueAgent", img: "images/blueFemale.png", id: 19 },
    {   name: "blueAgent", img: "images/blueFemale.png", id: 20 },
    {   name: "blueAgent", img: "images/blueMale.png", id: 21 },
    {   name: "blueAgent", img: "images/blueMale.png", id: 22 },
    {   name: "blueAgent", img: "images/blueMale.png", id: 23 },
    {   name: "blueAgent", img: "images/blueMale.png", id: 24 }
];

var doubleAgents = [
    {   name: "doubleAgent", img: "images/doubleAgentred.png", id: 25 },
    {   name: "doubleAgent", img: "images/doubleAgentblue.png", id: 25 }
];
// ***********************************************************************************
// create the card faces (8 blue, 8 red, 7 bystanders, 1 assassin, 2 double agents) END


