let level = 1; // Initializes the level variable
let salary = 0.1; // Initializes the salary variable
let money = 0; // Initializes the money variable
let warnings = 0; // Initializes the warnings variable
let inflation = 0; // Initializes the inflation counter
let jobCount = 0; // Initialize job count for tracking completed jobs
const housePrice = 1000000; // Sets the price of the unlockable house
const goalsPrice = 800; // Total price of all goals
const jobs = [ // Array of job descriptions
    "Deliver the coffees",
    "Print the papers",
    "Send a bunch of emails",
    "Organizing/Copying files",
    "Sitting in meetings and talking",
    "Small Talk Mini-game",
    "Boss Convo"
];
const moneyEarnedPerJob = [50, 75, 100, 125, 150]; // Array of money earned for each job
const goals = [ // Array of goal objects with name and value properties
    { name: "Rent on apartment", value: 500 },
    { name: "Groceries", value: 100 },
    { name: "Water bill", value: 50 },
    { name: "Internet bill", value: 75 },
    { name: "Electric bill", value: 75 }
];

let inflationInterval; // Declare inflationInterval

let gameInProgress = false; // Initialize flag to track whether a game is in progress
let activegameID = null; //Declare activegameID to track current active game

$(document).ready(function() { // Runs the function when the document is ready
    $('#start-button').click(function() {
        console.log("Start button clicked");
        if (!gameInProgress) { // Check if a game is already in progress
        startNextJob(); // Starts the next job when the start button is clicked
        $('.progress-bar-container').show(); // Show progress bar
        inflationInterval = setInterval(applyInflation, 30000); // Apply inflation every 30 seconds after start
        }
    });

    $('#houseContainer').mousemove(function(event) {
        adjustSpeed(event.clientY); // Adjusts the tutorial scroll speed based on mouse position
    });

    showTutorial(); // Shows the tutorial
});

function showTutorial() { // Function to show the tutorial
    $('#overlay').show(); // Displays the overlay
    $('#tutorial').show(); // Displays the tutorial text
    displayGoals(); // Displays the goals

    setTimeout(() => {
        $('#overlay').hide(); // Hides the overlay after the tutorial ends
        $('#start-button').prop('disabled', false); // Enables the start button
        console.log("Tutorial ended, start button enabled");
        $('#content').removeClass('blur-effect'); // Removes the blur effect
        document.getElementById('background-audio').play(); // Plays the background audio
        console.log("Start button state: " + $('#start-button').prop('disabled'));
    }, 500); // Duration of the scrolling text animation (extended to 20 seconds)
}

function adjustSpeed(mouseY) { // Function to adjust the tutorial scroll speed
    const speedFactor = Math.max(0.1, 1 - (mouseY / window.innerHeight)); // Calculates the speed factor based on mouse position
    document.querySelector('.scrolling-text').style.animationDuration = `${60 * speedFactor}s`; // Adjusts the animation duration
}

function createConfetti() { // Function to create confetti animation
    for (let i = 0; i < 100; i++) { // Creates 100 confetti pieces
        const confetti = document.createElement('div'); // Creates a new div element for confetti
        confetti.classList.add('confetti'); // Adds the confetti class to the element
        confetti.style.left = Math.random() * 100 + 'vw'; // Randomly positions the confetti horizontally
        confetti.style.top = -10 + 'px'; // Positions the confetti above the viewport
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Randomly colors the confetti
        confetti.style.setProperty('--direction', Math.random() > 0.5 ? 1 : -1); // Randomly sets the direction of the confetti
        document.body.appendChild(confetti); // Adds the confetti to the body

        setTimeout(() => {
            confetti.remove(); // Removes the confetti after 3 seconds
        }, 3000);
    }
}


function startNextJob() { // Function to start the next job
    gameInProgress = true; // Set game in progress flag to true- should stop games running at the same time
    
    const randomJobIndex = Math.floor(Math.random() * jobs.length); // Randomly selects a job
    const jobName = jobs[randomJobIndex]; // Gets the name of the selected job
    const moneyEarned = moneyEarnedPerJob[randomJobIndex]; // Gets the money earned for the selected job

    jobCount++; // Increment the job count

    if (jobCount > 5) { // Reset progress bar after 5 jobs
        jobCount = 1; // Reset job count
        $('#progressBar').stop().css('width', '100%'); // Reset progress bar width
    }

    if (jobName === "Deliver the coffees") { // If the selected job is "Deliver the coffees"
        startCoffeeGame(moneyEarned); // Starts the coffee game
    } else if (jobName === "Sitting in meetings and talking") { // If the selected job is "Sitting in meetings and talking"
        startMeetingGame(moneyEarned); // Starts the meeting game
    } else if (jobName === "Send a bunch of emails") { // If the selected job is "Send a bunch of emails"
        startEmailGame(moneyEarned); // Starts the email game
    } else if (jobName === "Small Talk Mini-game") { // If the selected job is "Small Talk Mini-game"
        startSmallTalkGame(moneyEarned); // Starts the small talk game
    } else if (jobName === "Boss Convo") { // if selected job is boss convo
        startBossConversationGame(moneyEarned); // starts boss convo game
    } else { // For all other jobs
        $('#game').html(`
        <h2>Job ${level}: ${jobName}</h2>
        <p>Money: $${money}</p>
        <p>Time left: <span id="timeLeft">3</span> seconds</p>
        <button id="complete-task-button">Complete Task</button>
        `); // Displays the job details

        $('#progressBar').css('width', '100%').stop().animate({ width: '0%' }, 3000, function() {
            giveWarning(); // Gives a warning if time runs out
        }); // Animates the progress bar

        setTimeout(() => {
            gameOver(); // Ends the game after 20 seconds
        }, 20000);

        $('#complete-task-button').click(function() {
            completeTask(moneyEarned); // Completes the task when the complete task button is clicked
        });
    }
}

function startCoffeeGame(moneyEarned) {
    hideAllGames(); // Hides other games to prevent overlap
    $('#game').hide(); // Hides the main game
    $('#coffeeGame').show(); // Shows the coffee game
    let score = 0;
  
      // Make coffee draggable
      $('#coffee').draggable({
          revert: true,
          revertDuration: 0
      });
  
      // Make people droppable
      $('.person').droppable({
          accept: '#coffee',
          drop: function(event, ui) {
              score++;
              $('#score').text(`Score: ${score}`);
              alert(`Delivered coffee to ${$(this).attr('id')}!`);

              if(score == 3) {
                score=0;
                startNextJob();
                // Start next game
              }
          }
      });
}

function startMeetingGame(moneyEarned) { // Function to start the meeting game
    hideAllGames(); // should hide other games to prevent overlap
    resetMeetingGame(); // Reset the meeting game state
    $('#game').hide(); // Hides the main game
    $('#meetingGame').show(); // Shows the meeting game
}

function startEmailGame(moneyEarned) {
    hideAllGames(); // should hide other games to prevent overlap
    $('#game').hide(); // Hides the main game
    $('#emailGame').show(); // Shows the email game

    let emailsSent = 0;
    let gameEnded = false;

    const endEmailGame = () => {
        console.log("ending email game");
        if(!gameEnded) {
            gameEnded = true;
            console.log("game ended flag set to true");
            giveWarning();
            startNextGame();
        }
    }; //Function to end game

    const timeoutID = setTimeout(endEmailGame, 10000); //Makes email game end after 20 seconds

    $('#send-button').off('click').on('click', function() {
        const recipient = $('#recipient').val();
        const message = $('#message').val();
        const bossMessage = $('#boss-message');

        if (message.trim() === '') {
            alert('Please type a message before sending.');
            return;
        }

        if (message.length < 100 || !message.includes("I will try my best")) {
            bossMessage.show();
            return;
        } else {
            bossMessage.hide();
        }

        const logList = $('#log-list');
        const logItem = $('<li></li>').text(`Email sent to ${recipient}: "${message}"`);
        logList.append(logItem);

        emailsSent++;

        $('#message').val(''); // Clear the message box

        if(emailsSent >=3) {
            clearTimeout(timeoutID);
            if (!gameEnded) {
                gameEnded = true;
            $('#emailGame').hide(); // Hides the email game
            $('#game').show(); // Shows the main game
            completeTask(moneyEarned); // Completes the task and updates the game state
            startNextGame();
            }
        }  
    });
    if (typeof startNextGame !== "function") {
        console.error("startNextGame not defined");
    }
}

function startSmallTalkGame(moneyEarned) {
    hideAllGames(); // should hide other games to prevent overlap
    $('#game').hide(); // Hides the main game
    $('#smallTalkGame').show(); // Shows the small talk game

    let options = [
      "Alice has approached your cubicle to talk about her nephew's upcoming clarinet recital. What do you want to do?",
      "Bob has approached you on your lunch break to talk about golf. His breath smells like tuna. What do you want to do?",
      "Charlie has approached you in the lobby to invite you to a 3D printing convention. What do you want to do?",
      "Dana has approached you in the hallway to talk politics. She thinks that Bush is still president. What do you want to do?"
    ];

    let randomIndex = Math.floor(Math.random() * options.length);
    $('#smallTalkText').text(options[randomIndex]);

    $('#talkButton').click(function() {
      giveWarning(); // Give a warning notification from the boss
      $('#smallTalkGame').hide(); // Hide the Small Talk mini-game
      startNextJob(); // Proceed to the next game
    });

    $('#ignoreButton').click(function() {
      $('#smallTalkGame').hide(); // Hide the Small Talk mini-game
      setTimeout(startNextJob); // Proceed to the next game
    });
}

// Function to start the boss conversation mini-game
function startBossConversationGame(moneyEarned) {
    hideAllGames(); // should hide other games to prevent overlap
    $('#game').hide(); // Hides the main game
    $('#bossConversationGame').show(); // Shows the boss conversation game
    fetchRandomFact();

    // Event listener for the nod button
    $('#nodButton').click(function() {
        $('#bossConversationGame').hide(); // Hide the boss conversation mini-game
        startNextJob(); // Proceed to the next game
    });
  
  // Event listener for the ignore button
    $('#bossIgnoreButton').click(function() {
        $('#bossConversationGame').hide(); // Hide the boss conversation mini-game
        giveWarning(); // Give a warning notification from the boss
        setTimeout(startNextJob); // Proceed to the next game after 2 seconds
    });
}
  
// Function to fetch a random fact from the API
function fetchRandomFact() {
    $.ajax({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/facts',
      headers: { 'X-Api-Key': 'Uoe5fU8CQIZQwbfkweGnCw==MnqMVWtlcnehf9x4' }, // Replace 'YOUR_API_KEY' with your actual API key
      contentType: 'application/json',
      success: function(result) {
        console.log(result);
        let bossConversation = "Your boss approached you. They say, '" + result[0].fact + "'. Let that motivate your work throughout the day.";
        $('#bossConversationText').text(bossConversation);
      },
      error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
      }
    });
}


function completeTask(moneyEarned) {
    let success = Math.random() < 0.99; // 99% chance of success
    if (success) { // If the task is successful
        money += moneyEarned; // Increases the money
        level++; // Increases the level
        salary *= 0.1; // Increases the salary

        checkGoalsCompletion(); // Checks and handles goals completion

        if (money >= housePrice) { // If the house is unlocked
            createConfetti(); // Creates confetti
            $('#game').html(`
            <h2>Congratulations!</h2>
            <p>You've unlocked the house!</p>
            <button id="restart-button">Restart</button>
            `); // Displays the congratulations message
            $('#restart-button').click(function() {
                location.reload(); // Reloads the page
            });
        } else {
            startNextJob(); // Starts the next job
        }
    } else {
        const moneyLost = salary * 50; // Calculates the money lost
        money -= moneyLost; // Decreases the money
        $('#game').html(`
        <h2>Failed!</h2>
        <p>Lost: $${moneyLost}</p>
        <p>Money: $${money}</p>
        <button id="quit-button">Quit</button>
        `); // Displays the failure message
        $('#quit-button').click(function() {
            gameOver(); // Ends the game
        });
        gameInProgress = false; // Set game in progress flag to false after completing the task- should stop games running at the same time
    }
}

function hideAllGames() {
    $('#coffeeGame, #meetingGame, #emailGame, #smallTalkGame, #bossConversationGame').hide(); // Hide all game elements
}

function hideTitle() {
    $(".game-container").hide(); // Hide Corporate Climber title
}

function hideHouse() {
    $("#houseContainer").hide(); // Hide house container
}

function giveWarning() { // Function to give a warning when time runs out
    warnings++; // Increases the number of warnings
    alert(`Warning ${warnings}: You are not meeting the deadlines!`); // Displays the warning alert

    if (warnings >= 3) { // If three warnings are given
        showGameOverScreen(); // Show the game over screen
    } else {
        if(activegameID) {
            $('#${activeGameID}').hide(); //Hides the active game
        }
        startNextJob(); // Starts the next job
    }
}

function showGameOverScreen() { // Function to show the Game Over screen
    hideAllGames(); // Hide all games
    hideTitle(); // Hide title
    hideHouse(); // Hide house column
    $('#game').html(`
    <div class="game-over show">
    <img src="img/gameover.jpg" alt="Game Over Image" width="800">
    </div>
    `);

    $('#gameOverContainer').show(); //Show game over container
    setTimeout(function() {
        location.reload(); // Restart the game after 10 seconds
    }, 10000); // 10 seconds delay
}

function displayGoals() { // Function to display the goals
    const goalsList = $('#goals-list'); // Selects the goals list element
    goalsList.empty(); // Clears the goals list
    goals.forEach(goal => {
        goalsList.append(`<li>${goal.name}: $${goal.value.toFixed(2)}</li>`); // Adds each goal to the list
    });
}

function checkGoalsCompletion() {
    if (money >= goalsPrice) { // If money is greater than or equal to $800
        goals.forEach(goal => {
            if (!goal.completed) { // If the goal is not already completed
                goal.completed = true; // Mark the goal as completed
                createConfetti(); // Create confetti for celebration
            }
        });
        money -= goalsPrice; // Subtract $800 from the money
        alert(`$${goalsPrice} has been deducted for achieving all goals!`);
        displayGoals(); // Update the goals list
    }
}

function gameOver() { // Function to end the game
    $('#game').html(`
    <img src="img/gameover.jpg" alt="Game Over Image" width="1000">
    <button id="restart-button">Restart</button>
    `); // Displays the game over message
    $('#restart-button').click(function() {
        location.reload(); // Reloads the page
    });
}

function startMeeting() {
    document.getElementById('story').innerText = "The meeting has started. Your boss is talking about the company's quarterly performance.";
    document.querySelector('.buttons').innerHTML = `
    <button onclick="takeNotes()">Take Notes</button>
    <button onclick="askQuestion()">Ask a Question</button>
    <button onclick="zoneOut()">Zone Out</button>
    `;
}

function takeNotes() {
    document.getElementById('story').innerText = "You start taking detailed notes. Your boss notices and is impressed with your attentiveness.";
    document.querySelector('.buttons').innerHTML = `<p>Outcome: Your boss appreciates your effort and you receive positive feedback.</p>`;
    endMeetingGame(150); // Reward for completing the meeting
}

function askQuestion() {
    document.getElementById('story').innerText = "You raise your hand and ask a relevant question. Your boss appreciates your engagement and provides a detailed answer.";
    document.querySelector('.buttons').innerHTML = `<p>Outcome: You gain valuable information and your boss respects your curiosity.</p>`;
    endMeetingGame(150); // Reward for completing the meeting
}

function zoneOut() {
    document.getElementById('story').innerText = "You zone out and start daydreaming. Your boss notices and calls you out.";
    document.querySelector('.buttons').innerHTML = `
    <button onclick="apologize()">Apologize and Refocus</button>
    <button onclick="makeExcuse()">Make an Excuse</button>
    `;
    giveWarning(); // Calls warning for wrong choice
}

function apologize() {
    document.getElementById('story').innerText = "You apologize and promise to pay better attention. Your boss accepts your apology and continues with the meeting.";
    document.querySelector('.buttons').innerHTML = `<p>Outcome: You avoid further trouble but feel embarrassed.</p>`;
    endMeetingGame(100); // Less reward for apologizing
}

function makeExcuse() {
    document.getElementById('story').innerText = "You try to make an excuse, but your boss is not convinced.";
    document.querySelector('.buttons').innerHTML = `<p>Outcome: Your boss is disappointed with your lack of professionalism.</p>`;
    endMeetingGame(50); // Least reward for making an excuse

}

function endMeetingGame(reward) {
    setTimeout(() => {
        hideMeetingGame(); // Hide the meeting game
        $('#game').show(); // Show the main game
        completeTask(reward); // Example reward for completing the meeting
        startNextJob(); // Proceed to the next job after the meeting game ends
    }, 3000);
}

function resetMeetingGame() {
    document.getElementById('story').innerText = "You are sitting in a meeting with your boss. Listen carefully and make choices to influence the outcome.";
    document.querySelector('.buttons').innerHTML = `
    <button onclick="startMeeting()">Start Meeting</button>
    `;
}

function hideMeetingGame() {
    $('#meetingGame').hide();
    $('#game').show();
}

function applyInflation() {
    inflation += 0.1; // Increase inflation by 0.1%
    $('#inflation-counter').text(`Inflation: ${inflation.toFixed(1)}%`); // Update the inflation counter display
    goals.forEach(goal => {
        goal.value += goal.value * 0.001; // Increase each goal value by 0.1%
    });
    displayGoals(); // Update the goals list
}