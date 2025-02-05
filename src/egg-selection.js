document.querySelectorAll(".egg-option").forEach(button => {
    button.addEventListener("click", () => {
      const time = button.getAttribute("data-time");
      console.log(`Selected egg time: ${time} minutes`);
      window.api.startTimer(time);
    });
  });
  