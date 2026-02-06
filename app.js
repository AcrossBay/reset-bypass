const start = document.getElementById("start");
const process = document.getElementById("process");
const done = document.getElementById("done");

const btnStart = document.getElementById("btnStart");
const btnExit = document.getElementById("btnExit");
const btnClose = document.getElementById("btnClose");

const bar = document.getElementById("bar");
const step = document.getElementById("step");
const timer = document.getElementById("timer");

let interval = null;

function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

function fmt(s){
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return mm + ":" + ss;
}

function goStart(){
  clearInterval(interval); interval = null;
  show(start); hide(process); hide(done);
  bar.style.width = "0%";
  step.textContent = "Preparing…";
  timer.textContent = "00:20";
}

function goProcess(){
  hide(start); show(process); hide(done);

  const total = 20;
  const steps = [
    { t: 7, label: "Clearing session state…" },
    { t: 7, label: "Closing background media…" },
    { t: 6, label: "Cooldown…" },
  ];

  let remaining = total;
  let elapsed = 0;
  let idx = 0;
  let stepRemaining = steps[0].t;

  step.textContent = steps[0].label;
  timer.textContent = fmt(remaining);
  bar.style.width = "0%";

  interval = setInterval(() => {
    remaining -= 1;
    elapsed += 1;
    stepRemaining -= 1;

    bar.style.width = Math.min(100, Math.round((elapsed/total)*100)) + "%";
    timer.textContent = fmt(Math.max(0, remaining));

    if (stepRemaining <= 0 && idx < steps.length - 1) {
      idx += 1;
      stepRemaining = steps[idx].t;
      step.textContent = steps[idx].label;
    }

    if (remaining <= 0) {
      clearInterval(interval); interval = null;
      goDone();
    }
  }, 1000);
}

function goDone(){
  hide(start); hide(process); show(done);
}

btnStart.addEventListener("click", goProcess);
btnExit.addEventListener("click", goStart);
btnClose.addEventListener("click", goStart);

goStart();
// Auto-start after 1200ms to reduce friction
setTimeout(() => {
  if (!interval) {
    goProcess();
  }
}, 1200);
