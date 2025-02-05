document.getElementById("close-btn").addEventListener("click", () => {
  window.api.closeApp();
});

document.getElementById("start-btn").addEventListener("click", () => {
  console.log("Start button clicked!");
  showEggSelection();
});

function showEggSelection() {
  console.log("Opening egg selection...");
  document.querySelector(".content").innerHTML = `
      <h2>Select the type of egg:</h2>
      <div class="egg-selection">
          <div class="egg-row">
              <div class="egg" data-time="30">
                  <img src="assets/egg_runny.svg" alt="Runny Yolk">
                  <p>Runny yolk<br><small>6 min</small></p>
              </div>
              <div class="egg" data-time="480">
                  <img src="assets/egg_soft.svg" alt="Soft Boiled">
                  <p>Soft boiled<br><small>8 min</small></p>
              </div>
          </div>
          <div class="egg-row">
              <div class="egg" data-time="600">
                  <img src="assets/egg_hard.svg" alt="Hard Boiled">
                  <p>Hard boiled<br><small>10 min</small></p>
              </div>
              <div class="egg" data-time="840">
                  <img src="assets/egg_over.svg" alt="Over Cooked">
                  <p>Over cooked<br><small>14 min</small></p>
              </div>
          </div>
      </div>
  `;

  document.querySelectorAll(".egg").forEach((button) => {
    button.addEventListener("click", (event) => {
      let time = event.currentTarget.dataset.time;
      
      // Сохраняем выбранное яйцо
      let selectedEggImg = event.currentTarget.querySelector("img").src;
      localStorage.setItem("selectedEggImg", selectedEggImg);
      
      startTimer(parseInt(time));
    });
  });
}

function startTimer(time) {
  console.log(`Timer started for ${time} seconds`);

  const content = document.querySelector(".content");
  content.innerHTML = ""; // Очищаем содержимое перед таймером

  // Заголовок
  const title = document.createElement("h3");
  title.textContent = "Cooking in progress...";
  content.appendChild(title);

  // Таймер
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.textContent = `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`;
  content.appendChild(timerElement);

  // Получаем выбранное яйцо
  const selectedEggImage = localStorage.getItem("selectedEggImg");

  // Изображение яйца (изначально с цыпленком)
  const eggImage = document.createElement("img");
  eggImage.src = "assets/egg_chicken.svg";
  eggImage.classList.add("egg-image-small");
  eggImage.id = "egg";
  content.appendChild(eggImage);

  // Кнопка "Стоп"
  const stopButton = document.createElement("button");
  stopButton.id = "stop-btn";
  stopButton.textContent = "Stop";
  stopButton.style.display = "none";
  content.appendChild(stopButton);

  // Кнопка "Restart" (значок)
  const restartButton = document.createElement("img");
  restartButton.id = "restart-btn";
  restartButton.src = "assets/restart.svg"; 
  restartButton.alt = "Restart";
  restartButton.title = "Restart";
  restartButton.classList.add("restart-icon");
  restartButton.style.display = "none"; 
  content.appendChild(restartButton);

  let timeLeft = time;
  let boilingSound = new Audio("assets/budilnik.mp3");
  let alarmSound = new Audio("assets/ding.mp3");
  let animationFrame;

  boilingSound.loop = true;
  boilingSound.volume = 1.0;
  boilingSound.play();

  function animateEgg() {
    let totalTime = timeLeft; 

    function shake() {
      if (timeLeft > 0) {
        let progress = 1 - timeLeft / totalTime;
        let maxIntensity = 10; 
        let intensity = maxIntensity * progress; 

        let xOffset = Math.sin(Date.now() / 120) * intensity; 
        let yOffset = Math.cos(Date.now() / 180) * (intensity / 3);

        eggImage.style.transform = `translate(${xOffset}px, ${-yOffset}px)`;

        animationFrame = requestAnimationFrame(shake);
      } else {
        cancelAnimationFrame(animationFrame);
        eggImage.style.transform = "translate(0, 0)";
      }
    }

    shake();
  }

  function updateTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timerElement.textContent = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`;
      setTimeout(updateTimer, 1000);
    } else {
      cancelAnimationFrame(animationFrame);
      boilingSound.pause();
      boilingSound.currentTime = 0;

      // Устанавливаем изображение выбранного яйца в конце
      eggImage.src = selectedEggImage || "assets/egg.svg";
      eggImage.classList.add("egg-image-new");

      // Плавное завершение анимации
      eggImage.style.transition = "transform 0.3s ease-in-out";
      eggImage.style.transform = "scale(1)";

      // Надпись "Your egg is ready!"
      const readyText = document.createElement("div");
      title.style.display = "none";
      readyText.classList.add("ready-text");
      readyText.textContent = "Your egg is ready!";
      eggImage.after(readyText);

      // Показываем кнопку Stop
      stopButton.style.display = "block";
      alarmSound.loop = true;
      alarmSound.play();
    }
  }

  stopButton.addEventListener("click", () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    timerElement.style.display = "none";
    stopButton.style.display = "none";

    // Показываем кнопку Restart
    restartButton.style.display = "block";
  });

  restartButton.addEventListener("click", () => {
    location.reload(); // Перезагружаем страницу
  });

  requestAnimationFrame(animateEgg);
  updateTimer();
}
