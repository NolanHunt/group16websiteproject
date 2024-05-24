let level = 1;
let salary = 0.1;
let money = 0;
const housePrice = 1000000;
const jobs = [
  "Deliver the coffees",
  "Print the papers",
  "Send a bunch of emails",
  "Organizing/Copying files",
  "Sitting in meetings and talking"
];
const moneyEarnedPerJob = [50, 75, 100, 125, 150];
const goals = [
  { name: "Rent on apartment", value: 500 },
  { name: "Groceries", value: 100 },
  { name: "Water bill", value: 50 },
  { name: "Internet bill", value: 75 },
  { name: "Electric bill", value: 75 }
];

$(document).ready(function() {
  $('#start-button').click(function() {
    showTutorial();
  });
});

function showTutorial() {
  $('#game').html(`
    <h2>Tutorial</h2>
    <p>Welcome to Corporate Climber!</p>
    <p>In this game, you will climb the corporate ladder by completing various tasks.</p>
    <p>Each task has a time limit. Complete tasks to earn money and advance to higher levels.</p>
    <p>If you fail a task, you'll lose money. If you run out of money, you're fired!</p>
    <p>Click the button below to start your journey!</p>
    <button id="start-job-button">Start</button>
  `);
  displayGoals();
  $('#start-job-button').click(function() {
    startNextJob();
  });
}

function startNextJob() {
  const randomJobIndex = Math.floor(Math.random() * jobs.length);
  const jobName = jobs[randomJobIndex];
  const moneyEarned = moneyEarnedPerJob[randomJobIndex];

  if (jobName === "Deliver the coffees") {
    startCoffeeGame(moneyEarned);
  } else {
    $('#game').html(`
      <h2>Job ${level}: ${jobName}</h2>
      <p>Money: $${money}</p>
      <p>Time left: <span id="timeLeft">10</span> seconds</p>
      <button id="complete-task-button">Complete Task</button>
    `);

    $('#progressBar').css('width', '100%').stop().animate({ width: '0%' }, 10000);

    setTimeout(() => {
      gameOver();
    }, 30000);

    $('#complete-task-button').click(function() {
      completeTask(moneyEarned);
    });
  }
}

function startCoffeeGame(moneyEarned) {
  $('#game').hide();
  $('#coffeeGame').show();

  let coffeeCup = $('#coffeeCup');
  let position = 0;
  let deliveryInterval = setInterval(moveCoffeeCup, 100);

  function moveCoffeeCup() {
    if (position >= 300) {
      clearInterval(deliveryInterval);
      $('#complete-delivery-button').show();
    } else {
      position += 5;
      coffeeCup.css('left', position + 'px');
    }
  }

  $('#complete-delivery-button').click(function() {
    clearInterval(deliveryInterval);
    $('#coffeeGame').hide();
    $('#game').show();
    completeTask(moneyEarned);
  });
}

function completeTask(moneyEarned) {
  let success = Math.random() < 0.9; // 90% chance of success
  if (success) {
    money += moneyEarned;
    level++;
    salary *= 0.1;
    startNextJob();
  } else {
    const moneyLost = salary * 50;
    money -= moneyLost;
    $('#game').html(`
      <h2>Failed!</h2>
      <p>Lost: $${moneyLost}</p>
      <p>Money: $${money}</p>
      <button id="quit-button">Quit</button>
    `);
    $('#quit-button').click(function() {
      gameOver();
    });
  }
}

function displayGoals() {
  const goalsList = $('#goals-list');
  goalsList.empty();
  goals.forEach(goal => {
    goalsList.append(`<li>${goal.name}: $${goal.value}</li>`);
  });
}

function gameOver() {
  if (money >= housePrice) {
    $('#game').html(`
      <h2>Congratulations!</h2>
      <p>You've unlocked the house!</p>
      <button id="restart-button">Restart</button>
    `);
  } else {
    $('#game').html(`
      <h2>You're Fired!</h2>
      <button id="restart-button">Restart</button>
    `);
  }
  $('#restart-button').click(function() {
    location.reload();
  });
}
