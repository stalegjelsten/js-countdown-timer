let updater = setInterval(updateTime, 16);
let time = new Date();
let displayCurrentTime = document.querySelector("#currentTime");
let displayCountdown = document.querySelector("#countdown");
let timeSlider = document.querySelector("#timeSliderContainer");
let countdownTime = "";
let percentDone = 0;
let params = {
  clock: true,
  alarmFile: "assets/gong.waw",
  backgroundFile: "assets/fireplace.gif",
  alarmImage: "assets/alarm_clock.png",
};

const randomBackground = async () => {
  const response = await fetch(
    "https://api.unsplash.com/photos/random?query=wallpaper-beautiful-landscape-dark&orientation=landscape",
    {
      headers: {
        Authorization: "Client-ID gIfD5KFdWq_6IIQnlmliM0ye3N9NIiWL-yKlLw5Uud0",
      },
    }
  );
  const results = await response.json();
  console.log(results);
  return results.urls["full"];
};
// set background image
randomBackground().then((url) => {
  params.backgroundFile = url;
  root.style.setProperty("--bgimage", "url(" + params.backgroundFile + ")");
});
let root = document.querySelector(":root");
root.style.setProperty("--bgimage", "url(" + params.backgroundFile + ")");

class Timer {
  constructor(minutes, seconds, color) {
    this.seconds = seconds + minutes * 60;
    this.color = color;
    this.secondsRun = 0;
    this.started = false;
    this.alarmStarted = false;
    this.alarmImageRot = false;
    this.alarmSound = new Audio(params.alarmFile);
  }

  start() {
    this.started = !this.started;
    this.initialTime = this.seconds;
    this.startTime = new Date();
    this.alarmTime = new Date(
      Math.floor((new Date().getTime() + this.seconds * 1000) / 1000) * 1000
    );
    this.alarmStarted = false;
  }

  soundAlarm() {
    this.alarmStarted = true;
    countdownTime =
      "<img src='" + params.alarmImage + "' class='alarmImage' />";
    this.alarmSound.play();
    this.stop();
  }

  stop() {
    this.started = false;
  }
}

let timer = new Timer(5, 0, (0, 0, 0));

let gui = new dat.GUI();
gui.add(timer, "seconds", 0, 3600, 5).onChange(initalCountdown);
gui.add(timer, "start").name("Start / pause");
gui.add(params, "clock").name("Vis klokke");

function initalCountdown() {
  const currentSeconds = Math.floor(timer.seconds % 60);
  const currentMinutes = Math.floor(timer.seconds / 60);
  if (currentMinutes < 10) {
    countdownTime = "0" + currentMinutes;
  } else {
    countdownTime = currentMinutes;
  }

  countdownTime += ":";

  if (currentSeconds < 10) {
    countdownTime += "0" + currentSeconds;
  } else {
    countdownTime += currentSeconds;
  }
  displayCountdown.innerHTML = countdownTime;
}

function updateTime() {
  time = new Date();
  if (timer.started) {
    timer.seconds = (timer.alarmTime.getTime() - time.getTime()) / 1000;
    const currentSeconds = Math.floor(timer.seconds % 60);
    const currentMinutes = Math.floor(timer.seconds / 60);
    percentDone = (
      ((timer.initialTime - timer.seconds) / timer.initialTime) *
      100
    ).toFixed(2);
    // timeSlider.innerHTML =
    //   "<div style='height:5%; background: linear-gradient(90deg, rgba(190,41,159,0.4) 0%, rgba(190,41,159,0.4) " +
    //   String(percentDone) +
    //   "%, rgba(0,212,255,0) " +
    //   String(Math.min(percentDone * 1.2, 100)) +
    //   "%);'></div>";
    //   "<div id='animatedFigure'><img src='assets/train.png' class='train' /></div> ";
    document.querySelector(".train").style.left =
      "min(" +
      String(
        window.innerWidth - document.querySelector(".train").clientWidth - 3
      ) +
      "px, " +
      String(percentDone) +
      "%)";

    countdownTime = new Date(
      Math.floor((timer.alarmTime - time - 3600 * 1000) / 1000) * 1000
    ).toLocaleTimeString([], {
      minute: "2-digit",
      second: "2-digit",
    });
    if (Math.floor(timer.seconds) == 0 || Math.round(timer.seconds) == 0) {
      timer.soundAlarm();
      clearInterval(updater);
      updater = setInterval(updateTime, 500);
      document.querySelector(".train").style.left =
        String(
          window.innerWidth - document.querySelector(".train").clientWidth - 3
        ) + "px";
    }
    // } else {
    //   if (currentMinutes < 10) {
    //     countdownTime = "0" + currentMinutes;
    //   } else {
    //     countdownTime = currentMinutes;
    //   }

    //   countdownTime += ":";

    //   if (currentSeconds < 10) {
    //     countdownTime += "0" + currentSeconds;
    //   } else {
    //     countdownTime += currentSeconds;
    //   }
    // }
  }
  if (params.clock) {
    const result = time.toLocaleTimeString("nb-NO");
    displayCountdown.innerHTML = countdownTime;
    displayCurrentTime.innerHTML = result;
  } else {
    displayCountdown.innerHTML = countdownTime;
    displayCurrentTime.innerHTML = "";
  }
  // displayTime.innerHTML = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}
