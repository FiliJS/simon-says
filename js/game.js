const levelModal = document.getElementById("level-modal"),
  currentLevel = document.getElementById("current-level"),
  currentScore = document.getElementById("current-score"),
  btnStart = document.getElementById("btnStart"),
  lightBlue = document.getElementById("light-blue"),
  violet = document.getElementById("violet"),
  orange = document.getElementById("orange"),
  green = document.getElementById("green"),
  LAST_LEVEL = 10;

class Game {
  constructor() {
    this.start = this.start.bind(this);
    this.start();
    this.generateSequence();
    setTimeout(this.nextLevel, 500);
  }

  start() {
    this.nextLevel = this.nextLevel.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.updateLevel = this.updateLevel.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.toggleBtnStart();
    this.level = 1;
    this.score = 0;
    this.updateLevel();
    this.updateScore();
    this.colors = {
      lightBlue,
      violet,
      orange,
      green
    };
  }

  toggleBtnStart() {
    if (levelModal.classList.contains("hide")) {
      levelModal.classList.remove("hide");
    } else {
      levelModal.classList.add("hide");
    }
  }

  generateSequence() {
    this.sequence = new Array(LAST_LEVEL)
      .fill(0)
      .map(n => Math.floor(Math.random() * 4));
  }

  nextLevel() {
    this.subLevel = 0;
    this.illuminateSequence();
    this.addclickEvents();
  }

  transformNumberToColor(number) {
    switch (number) {
      case 0:
        return "lightBlue";
      case 1:
        return "violet";
      case 2:
        return "orange";
      case 3:
        return "green";
    }
  }

  transformColorToNumber(color) {
    switch (color) {
      case "lightBlue":
        return 0;
      case "violet":
        return 1;
      case "orange":
        return 2;
      case "green":
        return 3;
    }
  }

  transformNumberToSound(number) {
    switch (number) {
      case 0:
        return "one";
      case 1:
        return "two";
      case 2:
        return "three";
      case 3:
        return "four";
    }
  }

  illuminateSequence() {
    for (let i = 0; i < this.level; i++) {
      let currentSequence = this.sequence[i];
      let color = this.transformNumberToColor(currentSequence);
      let sound = this.transformNumberToSound(currentSequence);

      setTimeout(() => this.iluminateColor(color), 1000 * i);
      setTimeout(() => this.playSound(sound), 1000 * i);
    }
  }

  iluminateColor(color) {
    this.colors[color].classList.add("light");
    this.colors[color].classList.add("increase-scale");
    setTimeout(() => this.offColor(color), 350);
  }

  playSound(soundName) {
    const sound = new Audio();
    sound.src = `sounds/${soundName}.mp3`;
    sound.play();
  }

  offColor(color) {
    this.colors[color].classList.remove("light");
    this.colors[color].classList.remove("increase-scale");
  }

  addclickEvents() {
    this.colors.lightBlue.addEventListener("click", this.selectColor);
    this.colors.violet.addEventListener("click", this.selectColor);
    this.colors.orange.addEventListener("click", this.selectColor);
    this.colors.green.addEventListener("click", this.selectColor);
  }

  deleteClickEvents() {
    this.colors.lightBlue.removeEventListener("click", this.selectColor);
    this.colors.violet.removeEventListener("click", this.selectColor);
    this.colors.orange.removeEventListener("click", this.selectColor);
    this.colors.green.removeEventListener("click", this.selectColor);
  }

  updateLevel() {
    currentLevel.textContent = this.level;
  }

  updateScore() {
    currentScore.textContent = this.score;
  }

  selectColor(ev) {
    const colorName = ev.target.dataset.color;
    const soundName = ev.target.dataset.sound;
    const numberColor = this.transformColorToNumber(colorName);
    this.iluminateColor(colorName);
    this.playSound(soundName);

    if (numberColor === this.sequence[this.subLevel]) {
      this.subLevel++;

      if (this.subLevel === this.level) {
        this.score = this.level * 150;
        this.level++;
        setTimeout(this.updateScore, 300);
        setTimeout(this.updateLevel, 1000);
        this.deleteClickEvents();

        if (this.level === LAST_LEVEL + 1) {
          this.wonTheGame();
        } else {
          setTimeout(this.nextLevel, 1500);
        }
      }
    } else {
      this.lostTheGame();
    }
  }

  wonTheGame() {
    Swal.fire({
      type: "success",
      title: "WOW",
      text: "Congratulations, you won the game!",
      footer: `${this.score}`
    }).then(this.start);
    
  }

  lostTheGame() {
    Swal.fire({
      type: "error",
      title: "Ops!",
      text: "We are sorry, you lost",
      footer: `${this.score}`
    }).then(() => {
      this.deleteClickEvents();
      this.start();
    });
  }
}

class NormalGame extends Game {
  constructor() {
    super();
  }

  iluminateColor(color) {
    this.colors[color].classList.add("light");
    setTimeout(() => this.offColor(color), 350);
  }

  offColor(color) {
    this.colors[color].classList.remove("light");
  }

  selectColor(ev) {
    const colorName = ev.target.dataset.color;
    const soundName = ev.target.dataset.sound;
    const numberColor = this.transformColorToNumber(colorName);
    this.iluminateColor(colorName);
    this.playSound(soundName);

    if (numberColor === this.sequence[this.subLevel]) {
      this.subLevel++;

      if (this.subLevel === this.level) {
        this.score = this.level * 200;
        this.level++;
        setTimeout(this.updateScore, 300);
        setTimeout(this.updateLevel, 1000);
        this.deleteClickEvents();

        if (this.level === LAST_LEVEL + 1) {
          this.wonTheGame();
        } else {
          setTimeout(this.nextLevel, 1500);
        }
      }
    } else {
      this.lostTheGame();
    }
  }
}

class HardGame extends NormalGame {
  constructor() {
    super();
  }

  illuminateSequence() {
    for (let i = 0; i < this.level; i++) {
      let currentSequence = this.sequence[i];
      let color = this.transformNumberToColor(currentSequence);

      setTimeout(() => this.iluminateColor(color), 500 * i);
    }
  }

  selectColor(ev) {
    const colorName = ev.target.dataset.color;
    const numberColor = this.transformColorToNumber(colorName);
    this.iluminateColor(colorName);

    if (numberColor === this.sequence[this.subLevel]) {
      this.subLevel++;

      if (this.subLevel === this.level) {
        this.score = this.level * 350;
        this.level++;
        setTimeout(this.updateScore, 300);
        setTimeout(this.updateLevel, 1000);
        this.deleteClickEvents();

        if (this.level === LAST_LEVEL + 1) {
          this.wonTheGame();
        } else {
          setTimeout(this.nextLevel, 1500);
        }
      }
    } else {
      this.lostTheGame();
    }
  }
}

function startGame() {
  window.game = new Game();
}

function startNormalGame() {
  window.game = new NormalGame();
}
function startHardGame() {
  window.game = new HardGame();
}
