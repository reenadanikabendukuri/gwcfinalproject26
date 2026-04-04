const STATE = 
{
  running:   false,
  timeLeft:  1500,
  totalTime: 1500,
  mode:      'pomodoro',
  sessions:  0,
  interval:  null,
};
 
const MODES = 
{
  pomodoro: { duration: 1500 },
  short:    { duration: 300  },
  long:     { duration: 900  },
};
 
const timeDisplay  = document.getElementById('time-display');
const sessionCount = document.getElementById('session-count');
const startBtn     = document.getElementById('start-btn');
const pauseBtn     = document.getElementById('pause-btn');
const resetBtn     = document.getElementById('reset-btn');
const tabs         = document.querySelectorAll('.tab');
 
function startTimer() 
{
  if (STATE.running) return;
  STATE.running = true;
  STATE.interval = setInterval(() => 
  {
    STATE.timeLeft--;
    renderTime();
    if (STATE.timeLeft <= 0) 
    {
      clearInterval(STATE.interval);
      STATE.running = false;
      onComplete();
    }
  }, 1000);
}
 
function pauseTimer() 
{
  if (!STATE.running) return;
  clearInterval(STATE.interval);
  STATE.running = false;
}
 
function resetTimer() 
{
  clearInterval(STATE.interval);
  STATE.running = false;
  STATE.timeLeft = STATE.totalTime;
  renderTime();
}
 
function onComplete() 
{
  if (STATE.mode === 'pomodoro') 
  {
    STATE.sessions++;
    sessionCount.textContent = STATE.sessions;
    setMode(STATE.sessions % 4 === 0 ? 'long' : 'short');
  } 
  else 
  {
    setMode('pomodoro');
  }
}
 
function setMode(mode) 
{
  STATE.mode      = mode;
  STATE.totalTime = MODES[mode].duration;
  STATE.timeLeft  = STATE.totalTime;
  STATE.running   = false;
  clearInterval(STATE.interval);
  tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  renderTime();
}
 
function renderTime() 
{
  const m = Math.floor(STATE.timeLeft / 60).toString().padStart(2, '0');
  const s = (STATE.timeLeft % 60).toString().padStart(2, '0');
  timeDisplay.textContent = `${m}:${s}`;
  document.title = `${m}:${s} — Pomodoro`;
}
 
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    pauseTimer();
    setMode(tab.dataset.mode);
  });
});
 
renderTime();

let tasks = [];
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const taskCount = document.getElementById('task-count');

function renderTasks() 
{
  taskList.innerHTML = '';
  tasks.forEach((task, i) => 
  {
    const item = document.createElement('div');
    item.className = 'task-item' + (task.done ? ' done' : '');
    item.innerHTML = `
      <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-i="${i}" />
      <span class="task-text">${task.text}</span>
      <button class="task-del" data-i="${i}">&#x2715;</button>`;
    taskList.appendChild(item);
  });
  taskCount.textContent = tasks.filter(t => !t.done).length;
}

function addTask() 
{
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  renderTasks();
}

document.getElementById('add-task-btn').addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

taskList.addEventListener('click', e => 
{
  const i = e.target.dataset.i;
  if (e.target.classList.contains('task-check')) { tasks[i].done = e.target.checked; renderTasks(); }
  if (e.target.classList.contains('task-del')) { tasks.splice(i, 1); renderTasks(); }
});