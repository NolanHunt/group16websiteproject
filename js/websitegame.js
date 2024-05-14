let level = 1;
let salary = 0.1;
let money = 0;
let housePrice = 1000000;
let timer;

// Define an array of job names
const jobs = [
  "Deliver the coffees",
  "Print the papers",
  "Send a bunch of emails",
  "Organizing/Copying files",
  "Sitting in meetings and talking"
];

// Define an array of money earned for each job
const moneyEarnedPerJob = [50, 75, 100, 125, 150];

// Define an array of goals with their values
const goals = [
  { name: "Rent on apartment", value: 500 },
  { name: "Groceries", value: 100 },
  { name: "Water bill", value: 50 },
  { name: "Internet bill", value: 75 },
  { name: "Electric bill", value: 75 }
];

function startGame() {
  showTutorial();
}

function showTutorial() {
document.getElementById('game').innerHTML = `
<h2>Tutorial</h2>
<p>Welcome to Corporate Climber!</p>
<p>In this game, you will climb the corporate ladder by completing various tasks.</p>
<p>Each task has a time limit. Complete tasks to earn money and advance to higher levels.</p>
<p>If you fail a task, you'll lose money. If you run out of money, you're fired!</p>
<p>Click the button below to start your journey!</p>
<button onclick="startNextJob()">Start</button>
`;
displayGoals();
}

function startNextJob() {
let randomJobIndex = Math.floor(Math.random() * jobs.length);
let jobName = jobs[randomJobIndex];
let moneyEarned = moneyEarnedPerJob[randomJobIndex];

document.getElementById('game').innerHTML = `
<h2>Job ${level}: ${jobName}</h2>
<p>Money: $${money}</p>
<p>Time left: <span id="timeLeft">10</span> seconds</p>
<button onclick="completeTask(${moneyEarned})">Complete Task</button>
`;

// Start timer animation
timer = 10; // Adjust initial timer value here
document.getElementById('progressBar').classList.add('progress-bar-animation');

setTimeout(() => {
gameOver();
}, 10000);
}

function completeTask(moneyEarned) {
  // Simulate completing task
  let success = Math.random() < 0.5; // 50% chance of success
  if (success) {
    money += moneyEarned;
    level++;
    salary *= 0.1;
    startNextJob();
  } else {
    let moneyLost = salary * 50;
    money -= moneyLost;
    document.getElementById('game').innerHTML = `
      <h2>Failed!</h2>
      <p>Lost: $${moneyLost}</p>
      <p>Money: $${money}</p>
      <button onclick="gameOver()">Quit</button>
    `;
  }
}

function displayGoals() {
  const goalsList = document.getElementById('goals-list');
  goals.forEach(goal => {
    const goalItem = document.createElement('li');
    goalItem.textContent = `${goal.name}: $${goal.value}`;
    goalsList.appendChild(goalItem);
  });
}

function gameOver() {
  if (money >= housePrice) {
    document.getElementById('game').innerHTML = `
      <h2>Congratulations!</h2>
      <p>You've unlocked the house!</p>
      <button onclick="location.reload()">Restart</button>
    `;
  } else {
    document.getElementById('game').innerHTML = `
      <h2>You're Fired!</h2>
      <button onclick="location.reload()">Restart</button>
    `;
  }
}