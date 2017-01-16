/**
 * Created by Weizguy on 11/12/2016.
 */
var timerMax = 90;
var tick = timerMax;
var gameNumber = null;
var gameOver = false;
$(document).ready(function () {
    modal.style.display = "block";
});

// Get the modal
var modal = document.getElementById('myModal');

function submitGameID() {
    gameNumber = 'SPY' + $('#gameID').val();
    gameID = $('#gameID').val();
    modal.style.display = "none";
    $('#submitted').text("Current GameID: " + gameID);
    createSpyBoard();
    $('button').click(submitWord);
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBMt5Zu9r1U4Fjg6jXGAEcnvB_2JJo2SOM",
    authDomain: "codenames-d5f81.firebaseapp.com",
    databaseURL: "https://codenames-d5f81.firebaseio.com",
    storageBucket: "codenames-d5f81.appspot.com",
    messagingSenderId: "507263974886"
};
firebase.initializeApp(config);
var fbRef = firebase.database();
var word;
var list = [];
var arr = [];
var wordList = list;
var spyList = arr;

function submitWord() {
    var status = $('#playerTurn').text();
    if(status.match('WINS')){
        gameOver = true;
        $('#hintWord').prop( "disabled", true );
        $('#hintQty').prop( "disabled", true );
        $('#hintWord').val('');
        $('#hintQty').val('');
        stopTimer();
    }
    var submitWord = $('#hintWord').val();
    var submitQty = $('#hintQty').val();
    var cw = submitWord.toUpperCase();
    var checkWord = gameBoard.indexOf(cw);
    if(checkWord < 0) {
        if (tick === 90 && gameOver === false) {
            fbRef.ref('codenames/Game/' + gameNumber + '/Spymaster/HintWord').set(submitWord);
            fbRef.ref('codenames/Game/' + gameNumber + '/Spymaster/numGuess').set(submitQty);
            x = submitWord + ' submitted!';
            hint = x.toUpperCase();
            $('#hintWord').val('');
            $('#hintQty').val('');
            $('#hintWord').attr("placeholder", hint);
            startTimer();
        }
    }
}

//start timer function
function startTimer() {
    clock = setInterval(function () {
        timer()
    }, 1000);
}
function timer() {
    $('#timer').attr('placeholder', tick--);
    if (tick < 0) {
        stopTimer();
    }
}
function stopTimer() {
    clearInterval(clock);
    clock = null;
    $('#timer').attr('placeholder', 0);
    tick = timerMax;
}
// end timer function



var team;
var clicked;
//get the GameBoard (words) and SpyBoard  (colors)
function createSpyBoard() {
    fbRef.ref().on('value', function (getWords) {
        word = getWords.val();
        G = gameNumber;
        a = word.codenames.Game;
        b = a[G];
        team = b.Team;
        clicked = b.cardClicked;
        gameBoard = b.GameBoard;
        spyBoard = b.spyBoard;

        $('#hintWord').attr("placeholder", "Waiting for hint...");
        $('#playerTurn').text(team);
        if (team.indexOf('RED') >= 0) {
            $('#playerTurn').css('background-color', 'red');
        } else if (team.indexOf('BLUE') >= 0) {
            $('#playerTurn').css('background-color', 'blue');
        }

        for (var i = 0; i < 25; i++) {
            x = gameBoard[i];
            y = spyBoard[i];
            up = x.toUpperCase();
            list[i] = x;
            arr[i] = y;
        }
        for (var k = 0; k < 25; k++) {
            $('#word' + k).html('<p>' + wordList[k] + '</p>');
            $('#word' + k).css('background-color', spyList[k]);
        }
        for (var z = 0; z < 25; z++) {
            if (z == clicked) {
                $('#word' + z).css('opacity', '.3');
            }
        }
    })
}