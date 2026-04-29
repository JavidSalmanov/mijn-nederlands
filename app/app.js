(function () {
  const data = window.APP_DATA;

  const state = {
    uiLanguage: window.localStorage.getItem("dutchDailyCoach.uiLanguage") || "nl",
    theme: window.localStorage.getItem("dutchDailyCoach.theme") || "light",
    currentPage: "main",
    lessonModeFilter: window.localStorage.getItem("dutchDailyCoach.lessonModeFilter") || "all",
    lessonIndex: Number(window.localStorage.getItem("dutchDailyCoach.lessonIndex") || 0),
    selectedLesson: null,
    selectedWord: null,
    wordHelpTab: "definition",
    exerciseTab: "fillBlank",
    savedWords: JSON.parse(window.localStorage.getItem("dutchDailyCoach.savedWords") || "[]"),
    masteredWords: JSON.parse(window.localStorage.getItem("dutchDailyCoach.masteredWords") || "[]"),
    masteredOpen: false
  };

  const els = {
    languageToggleBtn: document.getElementById("languageToggleBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeToggleThumb: document.getElementById("themeToggleThumb"),
    mainPageBtn: document.getElementById("mainPageBtn"),
    exercisePageBtn: document.getElementById("exercisePageBtn"),
    gamePageBtn: document.getElementById("gamePageBtn"),
    mainPage: document.getElementById("mainPage"),
    exercisePage: document.getElementById("exercisePage"),
    gamePage: document.getElementById("gamePage"),
    openLessonBtn: document.getElementById("openLessonBtn"),
    dialogueModeBtn: document.getElementById("dialogueModeBtn"),
    storyModeBtn: document.getElementById("storyModeBtn"),
    lessonOfDayLabel: document.getElementById("lessonOfDayLabel"),
    lessonContentTitle: document.getElementById("lessonContentTitle"),
    lessonContentMode: document.getElementById("lessonContentMode"),
    lessonContentTheme: document.getElementById("lessonContentTheme"),
    lessonContentIntro: document.getElementById("lessonContentIntro"),
    sentenceList: document.getElementById("sentenceList"),
    wordDayLabel: document.getElementById("wordDayLabel"),
    wordDayWord: document.getElementById("wordDayWord"),
    wordDayMeaning: document.getElementById("wordDayMeaning"),
    wordDaySentence: document.getElementById("wordDaySentence"),
    wordPanelLabel: document.getElementById("wordPanelLabel"),
    selectedWordTitle: document.getElementById("selectedWordTitle"),
    wordPanelIntro: document.getElementById("wordPanelIntro"),
    wordDetails: document.getElementById("wordDetails"),
    definitionTabBtn: document.getElementById("definitionTabBtn"),
    translationTabBtn: document.getElementById("translationTabBtn"),
    wordTerm: document.getElementById("wordTerm"),
    wordDefinition: document.getElementById("wordDefinition"),
    wordTranslation: document.getElementById("wordTranslation"),
    wordExample: document.getElementById("wordExample"),
    saveWordBtn: document.getElementById("saveWordBtn"),
    masterWordBtn: document.getElementById("masterWordBtn"),
    practiceLabel: document.getElementById("practiceLabel"),
    practiceTitle: document.getElementById("practiceTitle"),
    fillBlankTabBtn: document.getElementById("fillBlankTabBtn"),
    matchTabBtn: document.getElementById("matchTabBtn"),
    contextTabBtn: document.getElementById("contextTabBtn"),
    fillBlankPanel: document.getElementById("fillBlankPanel"),
    matchPanel: document.getElementById("matchPanel"),
    contextPanel: document.getElementById("contextPanel"),
    fillBlankTitle: document.getElementById("fillBlankTitle"),
    fillBlankPrompt: document.getElementById("fillBlankPrompt"),
    fillBlankChoices: document.getElementById("fillBlankChoices"),
    fillBlankFeedback: document.getElementById("fillBlankFeedback"),
    matchTitle: document.getElementById("matchTitle"),
    matchPrompt: document.getElementById("matchPrompt"),
    matchChoices: document.getElementById("matchChoices"),
    matchFeedback: document.getElementById("matchFeedback"),
    contextTitle: document.getElementById("contextTitle"),
    contextPrompt: document.getElementById("contextPrompt"),
    contextChoices: document.getElementById("contextChoices"),
    contextFeedback: document.getElementById("contextFeedback"),
    reviewLabelBottom: document.getElementById("reviewLabelBottom"),
    reviewTitle: document.getElementById("reviewTitle"),
    reviewIntro: document.getElementById("reviewIntro"),
    savedWords: document.getElementById("savedWords"),
    toggleMasteredBtn: document.getElementById("toggleMasteredBtn"),
    masteredPanel: document.getElementById("masteredPanel"),
    masteredTitle: document.getElementById("masteredTitle"),
    masteredWords: document.getElementById("masteredWords"),
    gameLabel: document.getElementById("gameLabel"),
    gameTitle: document.getElementById("gameTitle"),
    gameIntro: document.getElementById("gameIntro"),
    gameWordsTitle: document.getElementById("gameWordsTitle"),
    gameMeaningsTitle: document.getElementById("gameMeaningsTitle"),
    gameScorePill: document.getElementById("gameScorePill"),
    gameWordList: document.getElementById("gameWordList"),
    gameMeaningList: document.getElementById("gameMeaningList"),
    gameFeedback: document.getElementById("gameFeedback"),
    newGameBtn: document.getElementById("newGameBtn")
  };

  function getCopy() {
    return data.uiCopy[state.uiLanguage];
  }

  function getLesson() {
    const filtered =
      state.lessonModeFilter === "all"
        ? data.lessons
        : data.lessons.filter((lesson) => lesson.mode === state.lessonModeFilter);

    return filtered[state.lessonIndex % filtered.length];
  }

  function modeLabel(mode) {
    const copy = getCopy();
    return mode === "dialogue" ? copy.lessonModeDialogue : copy.lessonModeStory;
  }

  function themeLabel(theme) {
    const labels = {
      social: { en: "Meeting friends", nl: "Vrienden ontmoeten" },
      health: { en: "Doctor and health", nl: "Dokter en gezondheid" },
      work: { en: "Work meeting", nl: "Werkoverleg" }
    };

    return labels[theme][state.uiLanguage];
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeWord(value) {
    return value
      .toLowerCase()
      .replace(/^[^a-zA-ZÀ-ÿ']+|[^a-zA-ZÀ-ÿ']+$/g, "");
  }

  function getWordData(wordKey) {
    return state.selectedLesson.focusWords[wordKey] || data.lexicon[wordKey] || null;
  }

  function buildSentence(sentence) {
    return sentence.replace(/[A-Za-zÀ-ÿ']+/g, (match) => {
      const normalized = normalizeWord(match);
      return `<button type="button" class="tap-word" data-word="${normalized}">${match}</button>`;
    });
  }

  function renderCopy() {
    const copy = getCopy();

    [
      "lessonOfDayLabel",
      "wordDayLabel",
      "wordPanelLabel",
      "practiceLabel",
      "practiceTitle",
      "gameLabel",
      "gameTitle",
      "gameWordsTitle",
      "gameMeaningsTitle",
      "fillBlankTitle",
      "matchTitle",
      "contextTitle",
      "reviewLabelBottom"
    ].forEach((key) => {
      els[key].textContent = copy[key];
    });

    els.mainPageBtn.textContent = copy.mainPage;
    els.exercisePageBtn.textContent = copy.exercisesPage;
    els.gamePageBtn.textContent = copy.gamePage;
    els.dialogueModeBtn.textContent = copy.dialogueMode;
    els.storyModeBtn.textContent = copy.storyMode;
    els.languageToggleBtn.textContent = state.uiLanguage === "nl" ? "NL" : "EN";
    els.definitionTabBtn.textContent = copy.definitionTab;
    els.translationTabBtn.textContent = copy.translationTab;
    els.fillBlankTabBtn.textContent = copy.fillBlankTab;
    els.matchTabBtn.textContent = copy.matchTab;
    els.contextTabBtn.textContent = copy.contextTab;
    els.themeToggleBtn.setAttribute(
      "aria-label",
      state.theme === "dark" ? copy.lightMode : copy.darkMode
    );
    els.themeToggleBtn.setAttribute(
      "title",
      state.theme === "dark" ? copy.lightMode : copy.darkMode
    );
    els.themeToggleThumb.textContent = state.theme === "dark" ? "☾" : "☀︎";
    els.themeToggleBtn.classList.toggle("dark", state.theme === "dark");
    els.openLessonBtn.textContent = copy.openLesson;
    els.gameIntro.textContent = copy.gameIntro;
    els.newGameBtn.textContent = copy.newGame;
    els.reviewIntro.textContent = copy.reviewIntro;
    els.toggleMasteredBtn.textContent = copy.masteredButton;
    els.masteredTitle.textContent = copy.masteredTitle;
    renderPageTabs();
    renderLessonModeTabs();
    renderGame();
  }

  function renderLesson() {
    state.selectedLesson = getLesson();
    const lesson = state.selectedLesson;

    els.lessonContentTitle.textContent = lesson.title[state.uiLanguage];
    els.lessonContentIntro.textContent = lesson.intro[state.uiLanguage];
    els.lessonContentMode.textContent = modeLabel(lesson.mode);
    els.lessonContentTheme.textContent = themeLabel(lesson.theme);

    els.sentenceList.innerHTML = lesson.sentences
      .map((sentence) => {
        const rendered = buildSentence(sentence);
        if (lesson.mode === "dialogue" && sentence.includes(":")) {
          const parts = rendered.split(":");
          const speaker = parts.shift();
          const text = parts.join(":").trim();
          return `<div class="sentence-item dialogue-line"><span class="speaker">${speaker}:</span><span>${text}</span></div>`;
        }

        return rendered;
      })
      .join(lesson.mode === "story" ? " " : "");

    if (lesson.mode === "story") {
      els.sentenceList.innerHTML = `<p class="story-paragraph">${els.sentenceList.innerHTML}</p>`;
    }

    resetWordPanel();
    renderWordOfDay();
    renderExercises();
  }

  function renderLessonModeTabs() {
    const isDialogue = state.lessonModeFilter !== "story";
    const isStory = state.lessonModeFilter === "story";
    els.dialogueModeBtn.classList.toggle("active", isDialogue);
    els.storyModeBtn.classList.toggle("active", isStory);
  }

  function renderWordOfDay() {
    const entries = Object.entries(state.selectedLesson.focusWords);
    const [word, wordData] = entries[state.lessonIndex % entries.length];
    els.wordDayWord.textContent = word;
    els.wordDayMeaning.textContent = wordData.definition;
    els.wordDaySentence.textContent = wordData.funSentence || wordData.example;
  }

  function resetWordPanel() {
    const copy = getCopy();
    els.selectedWordTitle.textContent = copy.emptyWordTitle;
    els.wordPanelIntro.textContent = copy.emptyWordIntro;
    els.wordDetails.classList.add("hidden");
  }

  function renderSelectedWord(wordKey) {
    const copy = getCopy();
    const wordData = getWordData(wordKey);
    if (!wordData) {
      els.selectedWordTitle.textContent = wordKey;
      els.wordPanelIntro.textContent = "";
      els.wordTerm.textContent = wordKey;
      els.wordDefinition.textContent = state.uiLanguage === "nl"
        ? "Nog geen uitleg toegevoegd."
        : "No explanation added yet.";
      els.wordTranslation.textContent = state.uiLanguage === "nl"
        ? "Nog geen vertaling toegevoegd."
        : "No translation added yet.";
      els.wordExample.textContent = "";
      els.saveWordBtn.textContent = copy.saveWord;
      els.masterWordBtn.textContent = copy.masterWord;
      els.wordDetails.classList.remove("hidden");
      renderWordHelpTab();
      return;
    }

    state.selectedWord = wordKey;
    els.selectedWordTitle.textContent = wordKey;
    els.wordPanelIntro.textContent = "";
    els.wordTerm.textContent = wordKey;
    els.wordDefinition.textContent = wordData.definition;
    els.wordTranslation.textContent = wordData.translation || "";
    els.wordExample.textContent = wordData.example;
    els.saveWordBtn.textContent = state.savedWords.includes(wordKey)
      ? copy.savedWord
      : copy.saveWord;
    els.masterWordBtn.textContent = state.masteredWords.includes(wordKey)
      ? copy.masteredWord
      : copy.masterWord;
    els.wordDetails.classList.remove("hidden");
    renderWordHelpTab();
  }

  function renderWordHelpTab() {
    const showDefinition = state.wordHelpTab === "definition";
    els.wordDefinition.classList.toggle("hidden", !showDefinition);
    els.wordTranslation.classList.toggle("hidden", showDefinition);
    els.definitionTabBtn.classList.toggle("active", showDefinition);
    els.translationTabBtn.classList.toggle("active", !showDefinition);
  }

  function renderExerciseTab() {
    const isFillBlank = state.exerciseTab === "fillBlank";
    const isMatch = state.exerciseTab === "match";
    const isContext = state.exerciseTab === "context";

    els.fillBlankPanel.classList.toggle("hidden", !isFillBlank);
    els.matchPanel.classList.toggle("hidden", !isMatch);
    els.contextPanel.classList.toggle("hidden", !isContext);

    els.fillBlankTabBtn.classList.toggle("active", isFillBlank);
    els.matchTabBtn.classList.toggle("active", isMatch);
    els.contextTabBtn.classList.toggle("active", isContext);
  }

  function renderExercise(container, promptEl, feedbackEl, exercise) {
    const copy = getCopy();
    promptEl.textContent = exercise.prompt;
    feedbackEl.textContent = "";
    container.innerHTML = "";

    exercise.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => {
        const isCorrect = choice === exercise.answer;
        container.querySelectorAll(".choice-button").forEach((item) => {
          item.disabled = true;
          if (item.textContent === exercise.answer) {
            item.classList.add("correct");
          }
        });

        if (!isCorrect) {
          button.classList.add("wrong");
        }

        feedbackEl.textContent = isCorrect
          ? copy.correct
          : `${copy.wrongPrefix} ${exercise.answer}`;
      });

      container.appendChild(button);
    });
  }

  function renderExercises() {
    const exercises = state.selectedLesson.exercises;
    renderExercise(els.fillBlankChoices, els.fillBlankPrompt, els.fillBlankFeedback, exercises.fillBlank);
    renderExercise(els.matchChoices, els.matchPrompt, els.matchFeedback, exercises.match);
    renderExercise(els.contextChoices, els.contextPrompt, els.contextFeedback, exercises.context);
    renderExerciseTab();
  }

  function renderPageTabs() {
    const isMain = state.currentPage === "main";
    const isExercises = state.currentPage === "exercises";
    const isGame = state.currentPage === "game";
    els.mainPage.classList.toggle("hidden", !isMain);
    els.exercisePage.classList.toggle("hidden", !isExercises);
    els.gamePage.classList.toggle("hidden", !isGame);
    els.mainPageBtn.classList.toggle("active", isMain);
    els.exercisePageBtn.classList.toggle("active", isExercises);
    els.gamePageBtn.classList.toggle("active", isGame);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getGamePairs() {
    const lessonWords = Object.entries(state.selectedLesson?.focusWords || {});
    return lessonWords
      .filter(([, value]) => value.translation)
      .map(([word, value]) => ({ word, translation: value.translation }));
  }

  function renderGame() {
    const copy = getCopy();
    const pairs = getGamePairs();
    const selectedWord = state.gameSelectedWord || null;
    const score = Number(window.localStorage.getItem("dutchDailyCoach.gameScore") || 0);
    els.gameScorePill.textContent = `${copy.gameScore}: ${score}`;

    if (!pairs.length) {
      els.gameWordList.innerHTML = "";
      els.gameMeaningList.innerHTML = "";
      els.gameFeedback.textContent = "";
      return;
    }

    const shuffledMeanings = shuffle(pairs);

    els.gameWordList.innerHTML = pairs
      .map(
        (pair) =>
          `<button type="button" class="choice-button game-option${selectedWord === pair.word ? " active" : ""}" data-game-word="${pair.word}">${pair.word}</button>`
      )
      .join("");

    els.gameMeaningList.innerHTML = shuffledMeanings
      .map(
        (pair) =>
          `<button type="button" class="choice-button game-option" data-game-translation="${pair.translation}" data-game-word="${pair.word}">${pair.translation}</button>`
      )
      .join("");
  }

  function resetGame() {
    state.gameSelectedWord = null;
    state.gameFeedback = "";
    renderGame();
    els.gameFeedback.textContent = "";
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
  }

  function renderSavedWords() {
    const copy = getCopy();
    if (!state.savedWords.length) {
      els.savedWords.innerHTML = `<span class="saved-word">${copy.savedWordsEmpty}</span>`;
    } else {
      els.savedWords.innerHTML = state.savedWords
        .map((word) => `<span class="saved-word">${word}</span>`)
        .join("");
    }
  }

  function renderMasteredWords() {
    const copy = getCopy();
    els.masteredPanel.classList.toggle("hidden", !state.masteredOpen);

    if (!state.masteredWords.length) {
      els.masteredWords.innerHTML = `<span class="saved-word">${copy.masteredWordsEmpty}</span>`;
      return;
    }

    els.masteredWords.innerHTML = state.masteredWords
      .map((word) => `<span class="saved-word mastered-word">${word}</span>`)
      .join("");
  }

  function saveWord() {
    if (!state.selectedWord) {
      return;
    }

    if (!state.savedWords.includes(state.selectedWord)) {
      state.savedWords.push(state.selectedWord);
      window.localStorage.setItem("dutchDailyCoach.savedWords", JSON.stringify(state.savedWords));
    }

    renderSelectedWord(state.selectedWord);
    renderSavedWords();
  }

  function masterWord() {
    if (!state.selectedWord) {
      return;
    }

    if (!state.masteredWords.includes(state.selectedWord)) {
      state.masteredWords.push(state.selectedWord);
      window.localStorage.setItem(
        "dutchDailyCoach.masteredWords",
        JSON.stringify(state.masteredWords)
      );
    }

    state.savedWords = state.savedWords.filter((word) => word !== state.selectedWord);
    window.localStorage.setItem("dutchDailyCoach.savedWords", JSON.stringify(state.savedWords));

    renderSelectedWord(state.selectedWord);
    renderSavedWords();
    renderMasteredWords();
  }

  function openNextLesson() {
    state.lessonIndex = (state.lessonIndex + 1) % data.lessons.length;
    window.localStorage.setItem("dutchDailyCoach.lessonIndex", String(state.lessonIndex));
    renderLesson();
  }

  function bindEvents() {
    els.sentenceList.addEventListener("click", (event) => {
      const button = event.target.closest(".tap-word");
      if (!button) {
        return;
      }

      renderSelectedWord(button.dataset.word);
    });

    els.saveWordBtn.addEventListener("click", saveWord);
    els.masterWordBtn.addEventListener("click", masterWord);
    els.definitionTabBtn.addEventListener("click", () => {
      state.wordHelpTab = "definition";
      renderWordHelpTab();
    });
    els.translationTabBtn.addEventListener("click", () => {
      state.wordHelpTab = "translation";
      renderWordHelpTab();
    });
    els.fillBlankTabBtn.addEventListener("click", () => {
      state.exerciseTab = "fillBlank";
      renderExerciseTab();
    });
    els.matchTabBtn.addEventListener("click", () => {
      state.exerciseTab = "match";
      renderExerciseTab();
    });
    els.contextTabBtn.addEventListener("click", () => {
      state.exerciseTab = "context";
      renderExerciseTab();
    });
    els.openLessonBtn.addEventListener("click", openNextLesson);
    els.dialogueModeBtn.addEventListener("click", () => {
      state.lessonModeFilter = "dialogue";
      state.lessonIndex = 0;
      window.localStorage.setItem("dutchDailyCoach.lessonModeFilter", state.lessonModeFilter);
      renderCopy();
      renderLesson();
    });
    els.storyModeBtn.addEventListener("click", () => {
      state.lessonModeFilter = "story";
      state.lessonIndex = 0;
      window.localStorage.setItem("dutchDailyCoach.lessonModeFilter", state.lessonModeFilter);
      renderCopy();
      renderLesson();
    });
    els.mainPageBtn.addEventListener("click", () => {
      state.currentPage = "main";
      renderPageTabs();
    });
    els.exercisePageBtn.addEventListener("click", () => {
      state.currentPage = "exercises";
      renderPageTabs();
    });
    els.gamePageBtn.addEventListener("click", () => {
      state.currentPage = "game";
      renderPageTabs();
      renderGame();
    });
    els.languageToggleBtn.addEventListener("click", () => {
      state.uiLanguage = state.uiLanguage === "nl" ? "en" : "nl";
      window.localStorage.setItem("dutchDailyCoach.uiLanguage", state.uiLanguage);
      renderCopy();
      renderLesson();
      renderSavedWords();
      renderMasteredWords();
    });
    els.gameWordList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-game-word]");
      if (!button || button.dataset.gameTranslation) {
        return;
      }
      state.gameSelectedWord = button.dataset.gameWord;
      renderGame();
    });
    els.gameMeaningList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-game-translation]");
      if (!button || !state.gameSelectedWord) {
        return;
      }
      const copy = getCopy();
      const isCorrect = button.dataset.gameWord === state.gameSelectedWord;
      if (isCorrect) {
        const currentScore = Number(window.localStorage.getItem("dutchDailyCoach.gameScore") || 0) + 1;
        window.localStorage.setItem("dutchDailyCoach.gameScore", String(currentScore));
        els.gameFeedback.textContent = copy.gameCorrect;
      } else {
        els.gameFeedback.textContent = copy.gameWrong;
      }
      state.gameSelectedWord = null;
      renderGame();
    });
    els.newGameBtn.addEventListener("click", resetGame);
    els.themeToggleBtn.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      window.localStorage.setItem("dutchDailyCoach.theme", state.theme);
      applyTheme();
      renderCopy();
    });
    els.toggleMasteredBtn.addEventListener("click", () => {
      state.masteredOpen = !state.masteredOpen;
      renderMasteredWords();
    });
  }

  function init() {
    state.lessonIndex = ((state.lessonIndex % data.lessons.length) + data.lessons.length) % data.lessons.length;
    applyTheme();
    renderCopy();
    renderLesson();
    renderSavedWords();
    renderMasteredWords();
    bindEvents();
  }

  init();
})();
