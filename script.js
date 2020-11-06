const keyLayoutStart = [
  "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
  "tabs", "voice", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
  "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\", "enter",
  "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
  "done", "space", "leftward", "rightward", "sound", "EN"
];

const symbolsEN = [
  "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
  "tabs", "voice", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}",
  "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", "\"", "|", "enter",
  "shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?",
  "done", "space", "leftward", "rightward", "sound", "EN"
];

const keyLayoutStartRUS = [
  "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
  "tabs", "voice", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
  "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "\\", "enter",
  "shiftRUS", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
  "done", "space", "leftward", "rightward", "sound", "RU"
];

const symbolsRUS = [
  "ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
  "tabs", "voice", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
  "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "'\'", "enter",
  "shiftRUS", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
  "done", "space", "leftward", "rightward", "sound", "RU"
];

const soundEN = [
  "./sound/en/all.wav", "./sound/en/capsLock.wav", "./sound/en/enter.wav", "./sound/en/shift.wav", "./sound/en/space.wav"
];

const soundRUS = [
  "./sound/ru/all.wav", "./sound/ru/capsLock.wav", "./sound/ru/enter.wav", "./sound/ru/shift.wav", "./sound/ru/space.wav"
];

let keyLayout = keyLayoutStart;
let inputText = document.querySelector('.use-keyboard-input');
let lang = 'en';
let soundClick = 'on';
let voiceClick = false;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let voiceMic = new SpeechRecognition();
// voiceMic.interimResults = true; // промежуточные результаты
voiceMic.continuous = true; // непрерывные результаты

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    soundEN.forEach((element) => {
        this.elements.sound = document.createElement("audio");
        this.elements.sound.setAttribute("src", element);
        document.body.appendChild(this.elements.sound);
      }),

      soundRUS.forEach((element) => {
        this.elements.sound = document.createElement("audio");
        this.elements.sound.setAttribute("src", element);
        document.body.appendChild(this.elements.sound);
      }),

      document.querySelectorAll(".use-keyboard-input").forEach(element => {
        element.addEventListener("focus", () => {
          this.open(element.value, currentValue => {
            element.value = currentValue;
          });
        });
        element.addEventListener('click', () => {
          this.properties.start = inputText.selectionStart;
          this.properties.end = inputText.selectionEnd;
        });
      });
  },

  _createIconHTML(icon_name) {
    return `<i class="material-icons">${icon_name}</i>`;
  },

  _sound(typeSound) {
    const audio = document.querySelector(`audio[src="./sound/${lang}/${typeSound}.wav"]`);
    audio.currentTime = 0;
    audio.play();
  },

  _caps() {
    this._toggleCapsLock();
    inputText.focus();
    inputText.setSelectionRange(this.properties.start, this.properties.end);
  },

  _shift(keyElement) {
    this._clickShift(keyElement);
    this._toggleCapsLock();
    inputText.focus();
    inputText.setSelectionRange(this.properties.start, this.properties.end);
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "enter", "/"].indexOf(key) !== -1;

      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.innerHTML = this._createIconHTML("backspace");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("space");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            if (this.properties.start !== this.properties.end) {
              let backspaceAll = inputText.value.substring(0, this.properties.start) +
                inputText.value.substring(this.properties.end);
              inputText.value = backspaceAll;
              this.properties.end = this.properties.start;
            } else {
              let backspace = inputText.value.substring(0, this.properties.start - 1) + inputText.value.substring(this.properties.end);
              inputText.value = backspace;
              this.properties.start--;
              this.properties.end--;
            }
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "voice":
          let textVoice = '';
          keyElement.classList.add("keyboard__key--activatable");
          keyElement.innerHTML = this._createIconHTML("keyboard_voice");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            keyElement.classList.toggle("keyboard__key--active");
            if (lang === "en") voiceMic.lang = "en-US";
            else voiceMic.lang = "ru-RU";
            if (keyElement.classList.contains("keyboard__key--active")) {
              voiceMic.start();
              voiceMic.onresult = function (event) {
                inputText.value += event.results[event.results.length-1][0].transcript;            
              };              
            } 
            else if (!keyElement.classList.contains("keyboard__key--active")) {
              voiceMic.stop();
            }
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });


          break;

        case "sound":
          keyElement.classList.add("keyboard__key--activatable", "keyboard__key--active");
          keyElement.innerHTML = this._createIconHTML("volume_down");
          keyElement.addEventListener("click", () => {
            // this._voice();
            if (soundClick === "on") this._sound("all");
            keyElement.classList.toggle("keyboard__key--active");
            if (keyElement.classList.contains("keyboard__key--active")) soundClick = "on";
            else soundClick = "off";
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "tabs":
          keyElement.innerHTML = this._createIconHTML("keyboard_tab");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--activatable");
          keyElement.innerHTML = this._createIconHTML("keyboard_capslock");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("capsLock");
            this._caps();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--activatable");
          keyElement.innerHTML = this._createIconHTML("keyboard_arrow_up");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("shift");
            this._shift(keyElement);
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.innerHTML = this._createIconHTML("keyboard_return");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("enter");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            inputText.value = inputText.value.substring(0, this.properties.start) + "\n" + inputText.value.substring(this.properties.end);
            this.properties.start++;
            this.properties.end++;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = this._createIconHTML("space_bar");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            let space = inputText.value.substring(0, this.properties.start) + " " + inputText.value.substring(this.properties.end);
            inputText.value = space;
            this.properties.start++;
            this.properties.end++;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--dark");
          keyElement.innerHTML = this._createIconHTML("check_circle");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "EN":
          keyElement.textContent = key;
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this._clickLang(keyElement);
            keyElement.classList.toggle("keyboard__key--active");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "leftward":
          keyElement.innerHTML = this._createIconHTML("keyboard_arrow_left");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            this.properties.start--;
            this.properties.end--;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "rightward":
          keyElement.innerHTML = this._createIconHTML("keyboard_arrow_right");
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            this.properties.start++;
            this.properties.end++;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        default:
          keyElement.textContent = key;
          keyElement.addEventListener("click", () => {
            if (soundClick === "on") this._sound("all");
            this.properties.value += this.properties.capsLock ? keyElement.textContent = keyElement.textContent.toUpperCase() : keyElement.textContent = keyElement.textContent.toLowerCase();
            this.properties.start = inputText.selectionStart; //запоминаем позицию курсора
            this.properties.end = inputText.selectionEnd;
            let text = inputText.value.substring(0, this.properties.start) + keyElement.textContent + inputText.value.substring(this.properties.end);
            inputText.value = text;
            this.properties.start++;
            this.properties.end++;
            inputText.focus(); // возврат фокуса
            inputText.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.elements.keys.forEach((key, i) => {
      if (key.childElementCount === 0 && i !== this.elements.keys.length - 1) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
      if (i === this.elements.keys.length - 1) key.textContent = key.textContent.toUpperCase();
    })
  },

  _clickShift(keyElement) {
    if (!keyElement.classList.contains('keyboard__key--shift')) {
      if (keyLayout === keyLayoutStartRUS) keyLayout = symbolsRUS;
      else if (keyLayout === symbolsRUS) keyLayout = keyLayoutStartRUS;
      else keyLayout = symbolsEN;
      this.elements.keys.forEach((key, i) => {
        key.textContent = keyLayout[i];
        if (i === 13) key.innerHTML = this._createIconHTML("backspace");
        if (i === 14) key.innerHTML = this._createIconHTML("keyboard_tab");
        if (i === 15) key.innerHTML = this._createIconHTML("keyboard_voice");
        if (i === 28) key.innerHTML = this._createIconHTML("keyboard_capslock");
        if (i === 42) key.innerHTML = this._createIconHTML("keyboard_arrow_up");
        if (i === 41) key.innerHTML = this._createIconHTML("keyboard_return");
        if (i === 54) key.innerHTML = this._createIconHTML("space_bar");
        if (i === 53) key.innerHTML = this._createIconHTML("check_circle");
        if (i === 55) key.innerHTML = this._createIconHTML("keyboard_arrow_left");
        if (i === 56) key.innerHTML = this._createIconHTML("keyboard_arrow_right");
        if (i === 57) key.innerHTML = this._createIconHTML("volume_down");
      });
      keyElement.classList.toggle("keyboard__key--shift");
    } else {
      if (keyLayout === symbolsRUS) keyLayout = keyLayoutStartRUS;
      else if (keyLayout === keyLayoutStartRUS) keyLayout = symbolsRUS;
      else keyLayout = keyLayoutStart;
      this.elements.keys.forEach((key, i) => {
        key.textContent = keyLayout[i];
        if (i === 13) key.innerHTML = this._createIconHTML("backspace");
        if (i === 14) key.innerHTML = this._createIconHTML("keyboard_tab");
        if (i === 15) key.innerHTML = this._createIconHTML("keyboard_voice");
        if (i === 28) key.innerHTML = this._createIconHTML("keyboard_capslock");
        if (i === 42) key.innerHTML = this._createIconHTML("keyboard_arrow_up");
        if (i === 41) key.innerHTML = this._createIconHTML("keyboard_return");
        if (i === 54) key.innerHTML = this._createIconHTML("space_bar");
        if (i === 53) key.innerHTML = this._createIconHTML("check_circle");
        if (i === 55) key.innerHTML = this._createIconHTML("keyboard_arrow_left");
        if (i === 56) key.innerHTML = this._createIconHTML("keyboard_arrow_right");
        if (i === 57) key.innerHTML = this._createIconHTML("volume_down");
      });
      keyElement.classList.toggle("keyboard__key--shift");
    }
  },

  _clickLang(keyElement) {
    if (!keyElement.classList.contains('keyboard__key--lang')) {
      lang = "ru";
      keyLayout = keyLayoutStartRUS;
      this.elements.keys.forEach((key, i) => {
        key.textContent = keyLayout[i];
        if (i === 13) key.innerHTML = this._createIconHTML("backspace");
        if (i === 14) key.innerHTML = this._createIconHTML("keyboard_tab");
        if (i === 15) key.innerHTML = this._createIconHTML("keyboard_voice");
        if (i === 28) {
          key.innerHTML = this._createIconHTML("keyboard_capslock");
          key.classList.remove("keyboard__key--active");
        }
        if (i === 42) {
          key.innerHTML = this._createIconHTML("keyboard_arrow_up");
          key.classList.remove("keyboard__key--active");
        }
        if (i === 41) key.innerHTML = this._createIconHTML("keyboard_return");
        if (i === 54) key.innerHTML = this._createIconHTML("space_bar");
        if (i === 53) key.innerHTML = this._createIconHTML("check_circle");
        if (i === 55) key.innerHTML = this._createIconHTML("keyboard_arrow_left");
        if (i === 56) key.innerHTML = this._createIconHTML("keyboard_arrow_right");
        if (i === 57) key.innerHTML = this._createIconHTML("volume_down");
      });
      keyElement.classList.toggle("keyboard__key--lang");
    } else {
      lang = "en";
      this.elements.keys.forEach((key, i) => {
        keyLayout = keyLayoutStart;
        key.textContent = keyLayout[i];
        if (i === 13) key.innerHTML = this._createIconHTML("backspace");
        if (i === 14) key.innerHTML = this._createIconHTML("keyboard_tab");
        if (i === 15) key.innerHTML = this._createIconHTML("keyboard_voice");
        if (i === 28) {
          key.innerHTML = this._createIconHTML("keyboard_capslock");
          key.classList.remove("keyboard__key--active");
        }
        if (i === 42) {
          key.innerHTML = this._createIconHTML("keyboard_arrow_up");
          key.classList.remove("keyboard__key--active");
        }
        if (i === 41) key.innerHTML = this._createIconHTML("keyboard_return");
        if (i === 54) key.innerHTML = this._createIconHTML("space_bar");
        if (i === 53) key.innerHTML = this._createIconHTML("check_circle");
        if (i === 55) key.innerHTML = this._createIconHTML("keyboard_arrow_left");
        if (i === 56) key.innerHTML = this._createIconHTML("keyboard_arrow_right");
        if (i === 57) key.innerHTML = this._createIconHTML("volume_down");
      });
      keyElement.classList.toggle("keyboard__key--lang");
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

const keyCodes = [
  192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
  9, "voice", 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221,
  20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 220, 13,
  16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
  "done", 32, 37, 39
];

document.body.addEventListener('keydown', (event) => {
  let buttons = document.querySelectorAll('.keyboard__key');
  keyCodes.forEach((key, i) => {
    if (event.keyCode === keyCodes[i]) {
      buttons[i].style.background = "rgba(255, 255, 255, 0.12)";
      if (event.keyCode === 20) {
        buttons[i].classList.toggle("keyboard__key--active");
        Keyboard._caps();
      }
      if (event.keyCode === 16) {
        buttons[i].classList.toggle("keyboard__key--active");
        Keyboard._shift(buttons[i]);
      }
    }
  })
});

document.body.addEventListener('keyup', (event) => {
  let buttons = document.querySelectorAll('.keyboard__key');
  keyCodes.forEach((key, i) => {
    if (event.keyCode === keyCodes[i]) buttons[i].style.background = "rgba(255, 255, 255, 0.2)";
  })
});