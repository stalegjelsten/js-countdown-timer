let updater = setInterval(updateTime, 16);
let time = new Date();
let displayCurrentTime = document.querySelector("#currentTime");
let displayCountdown = document.querySelector("#countdown");
let timeSlider = document.querySelector("#timeSliderContainer");
let countdownTime = "";
let randomImage = {
  url: "",
  description: "",
  city: "",
  country: "",
  photographer: "",
  photographerLink: "",
  unsplashLink: "",
};
let percentDone = 0;
let params = {
  clock: true,
  randomImage: false,
  alarmFile: "assets/gong.wav",
  backgroundFile: "assets/bg.jpg",
  alarmImage: "assets/alarm_clock.png",
  whiteForeground: false,
  vits: true,
  message: "",
};

const randomBackground = async () => {
  const response = await fetch(
    "https://api.unsplash.com/photos/random?query=wallpaper-beautiful-landscape-dark&orientation=landscape",
    {
      headers: {
        Authorization: "Client-ID gIfD5KFdWq_6IIQnlmliM0ye3N9NIiWL-yKlLw5Uud0",
      },
    },
  );
  const results = await response.json();
  console.log(results);
  const photographer =
    [results.user.first_name, results.user.last_name]
      .filter((x) => typeof x === "string" && x.length > 0)
      .join(" ").length > 0
      ? [results.user.first_name, results.user.last_name]
          .filter((x) => typeof x === "string" && x.length > 0)
          .join(" ")
      : results.user.username;

  return {
    url: results.urls["full"],
    description:
      results.description == null
        ? results.alt_description
        : results.description,
    city: results.location.city,
    country: results.location.country,
    photographer: photographer,
    photographerLink: results.user.links.self,
    unsplashLink: results.links.html,
  };
};

const setBgColor = () => {
  if (params.whiteForeground) {
    let root = document.querySelector(":root");
    root.style.setProperty("--col", "#fff");
  } else {
    let root = document.querySelector(":root");
    root.style.setProperty("--col", "#000");
  }
};

const updateMessage = () => {
  if (params.message.length > 0) {
    document.getElementById("joke").innerHTML = params.message;
    document.getElementById("answerBtn").style.display = "none";
  }
};

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
      Math.floor((new Date().getTime() + this.seconds * 1000) / 1000) * 1000,
    );
    this.alarmStarted = false;
    //document.querySelector("#imageDescription").style.visibility = "hidden";
  }

  soundAlarm() {
    this.alarmStarted = true;
    countdownTime =
      "<img src='" + params.alarmImage + "' class='alarmImage' />";
    this.alarmSound.play();
    this.stop();
    //document.querySelector("#imageDescription").style.visibility = "visible";
    if (params.randomImage) {
      let descDiv = document.getElementById("imageDescription");
      const locationInformation = [randomImage.city, randomImage.country]
        .filter((x) => typeof x === "string" && x.length > 0)
        .join(", ");
      descDiv.innerHTML += ". " + locationInformation;
    }
  }

  stop() {
    this.started = false;
  }
}

let timer = new Timer(5, 0, (0, 0, 0));
let gui = new dat.GUI();
gui
  .add(timer, "seconds", 0, 3600, 15)
  .name("Sekunder")
  .onChange(initalCountdown);
gui.add(timer, "start").name("Start / pause");
gui.add(params, "clock").name("Vis klokke");
gui
  .add(params, "backgroundFile", [
    "assets/bg.jpg",
    "assets/autumn_leaves_freepik.jpg",
    "assets/christmas.jpg",
    "assets/valg.png",
    "assets/ski.jpg",
    "assets/fireplace.gif",
  ])
  .onChange(function () {
    let root = document.querySelector(":root");
    root.style.setProperty("--bgimage", "url(" + params.backgroundFile + ")");
  });
gui
  .add(params, "randomImage")
  .name("Tilfeldig bilde")
  .onChange(() => {
    // set background image when clicking toggle switch
    if (params.randomImage) {
      randomBackground().then((unsplashObject) => {
        params.backgroundFile = unsplashObject.url;
        randomImage = unsplashObject;
        root.style.setProperty(
          "--bgimage",
          "url(" + params.backgroundFile + ")",
        );
        let descDiv = document.getElementById("imageDescription");
        const photographerInformation =
          "<span title='" +
          randomImage.description +
          "'>" +
          "Bilde</span> " +
          "<a href='" +
          randomImage.photographerLink +
          "'>" +
          randomImage.photographer +
          "</a> / <a href='" +
          randomImage.unsplashLink +
          "'>Unsplash</a>";
        descDiv.innerHTML = photographerInformation;
        console.log(
          unsplashObject.description,
          unsplashObject.city,
          unsplashObject.country,
        );
      });
      let root = document.querySelector(":root");
      root.style.setProperty("--bgimage", "url(" + params.backgroundFile + ")");
      root.style.setProperty("--col", "#fff");
    } else {
    }
  });
gui
  .add(params, "whiteForeground")
  .name("Hvit tekst")
  .onChange(() => {
    if (params.whiteForeground) {
      let root = document.querySelector(":root");
      root.style.setProperty("--col", "#fff");
    } else {
      let root = document.querySelector(":root");
      root.style.setProperty("--col", "#000");
    }
  });
gui
  .add(params, "vits")
  .name("Vis vits/melding")
  .onChange(() => {
    if (params.vits === true) {
      document.getElementById("vits").style.display = "block";
    } else {
      document.getElementById("vits").style.display = "none";
    }
  });
gui.add(params, "message").onChange(() => {
  if (params.message.length > 0) {
    document.getElementById("joke").innerHTML = params.message;
  }
});

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
        window.innerWidth - document.querySelector(".train").clientWidth - 3,
      ) +
      "px, " +
      String(percentDone) +
      "%)";

    countdownTime = new Date(
      Math.floor((timer.alarmTime - time - 3600 * 1000) / 1000) * 1000,
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
          window.innerWidth - document.querySelector(".train").clientWidth - 3,
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

document
  .querySelector(":root")
  .style.setProperty("--bgimage", "url(" + params.backgroundFile + ")");
setBgColor();
