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
    gameSelectedWord: null,
    gamePairs: [],
    gameMeaningOrder: [],
    gameLastRoundSignature: "",
    savedWords: JSON.parse(window.localStorage.getItem("dutchDailyCoach.savedWords") || "[]"),
    masteredWords: JSON.parse(window.localStorage.getItem("dutchDailyCoach.masteredWords") || "[]"),
    masteredOpen: false,
    progress: JSON.parse(window.localStorage.getItem("dutchDailyCoach.progress") || "{}"),
    lessonStats: JSON.parse(window.localStorage.getItem("dutchDailyCoach.lessonStats") || "{}"),
    fillBlankAnswered: false,
    lastTrackedLessonId: null
  };

  const BASIC_GAME_WORDS = new Set([
    "de", "het", "een", "ik", "je", "jij", "hij", "zij", "we", "wij", "u",
    "ze", "me", "mij", "hem", "haar", "hun", "ons", "dit", "dat", "die", "deze",
    "is", "ben", "bent", "zijn", "was", "waren", "heb", "hebt", "heeft", "hebben",
    "wil", "wilt", "kan", "kun", "kunnen", "moet", "moeten", "zal", "zullen",
    "te", "in", "op", "aan", "bij", "met", "van", "voor", "na", "naar", "om",
    "uit", "tot", "nog", "wel", "niet", "ja", "nee", "dan", "dus", "ook", "al",
    "hier", "daar", "zo", "wat", "wie", "waar", "hoe", "wanneer", "waarom",
    "als", "of", "en", "maar"
  ]);

  const els = {
    languageToggleBtn: document.getElementById("languageToggleBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeToggleThumb: document.getElementById("themeToggleThumb"),
    mainPageBtn: document.getElementById("mainPageBtn"),
    exercisePageBtn: document.getElementById("exercisePageBtn"),
    gamePageBtn: document.getElementById("gamePageBtn"),
    progressPageBtn: document.getElementById("progressPageBtn"),
    mainPage: document.getElementById("mainPage"),
    exercisePage: document.getElementById("exercisePage"),
    gamePage: document.getElementById("gamePage"),
    progressPage: document.getElementById("progressPage"),
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
    fillBlankInput: document.getElementById("fillBlankInput"),
    fillBlankCheckBtn: document.getElementById("fillBlankCheckBtn"),
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
    weakWordsTitle: document.getElementById("weakWordsTitle"),
    weakWords: document.getElementById("weakWords"),
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
    newGameBtn: document.getElementById("newGameBtn"),
    progressLabel: document.getElementById("progressLabel"),
    progressTitle: document.getElementById("progressTitle"),
    progressMetrics: document.getElementById("progressMetrics"),
    recommendedThemeTitle: document.getElementById("recommendedThemeTitle"),
    recommendedLessonText: document.getElementById("recommendedLessonText"),
    themeStrengthTitle: document.getElementById("themeStrengthTitle"),
    themeBreakdown: document.getElementById("themeBreakdown")
  };

  function getCopy() {
    return data.uiCopy[state.uiLanguage];
  }

  function persistProgress() {
    window.localStorage.setItem("dutchDailyCoach.progress", JSON.stringify(state.progress));
  }

  function persistLessonStats() {
    window.localStorage.setItem("dutchDailyCoach.lessonStats", JSON.stringify(state.lessonStats));
  }

  function getWordProgress(word) {
    if (!state.progress[word]) {
      state.progress[word] = {
        seen: 0,
        correct: 0,
        wrong: 0,
        lastSeen: 0
      };
    }

    return state.progress[word];
  }

  function getWordStatus(word) {
    if (state.masteredWords.includes(word)) {
      return "mastered";
    }

    const progress = getWordProgress(word);
    const attempts = progress.correct + progress.wrong;

    if (attempts >= 4 && progress.correct >= Math.max(3, progress.wrong + 2)) {
      return "mastered";
    }

    if (progress.wrong > progress.correct || state.savedWords.includes(word)) {
      return "weak";
    }

    if (attempts >= 2 || progress.seen > 0) {
      return "learning";
    }

    return "new";
  }

  function recordWordSeen(word) {
    if (!word) {
      return;
    }

    const progress = getWordProgress(word);
    progress.seen += 1;
    progress.lastSeen = Date.now();
    persistProgress();
  }

  function recordWordResult(words, isCorrect) {
    words.forEach((word) => {
      if (!word) {
        return;
      }

      const progress = getWordProgress(word);
      progress.seen += 1;
      progress.lastSeen = Date.now();
      progress[isCorrect ? "correct" : "wrong"] += 1;
    });

    if (state.selectedLesson) {
      const lessonStats = state.lessonStats[state.selectedLesson.id] || {
        views: 0,
        correct: 0,
        wrong: 0,
        theme: state.selectedLesson.theme,
        mode: state.selectedLesson.mode,
        lastSeen: 0
      };
      lessonStats[isCorrect ? "correct" : "wrong"] += 1;
      lessonStats.theme = state.selectedLesson.theme;
      lessonStats.mode = state.selectedLesson.mode;
      lessonStats.lastSeen = Date.now();
      state.lessonStats[state.selectedLesson.id] = lessonStats;
      persistLessonStats();
    }

    persistProgress();
  }

  function noteLessonView(lesson) {
    const stats = state.lessonStats[lesson.id] || {
      views: 0,
      correct: 0,
      wrong: 0,
      theme: lesson.theme,
      mode: lesson.mode,
      lastSeen: 0
    };

    stats.views += 1;
    stats.theme = lesson.theme;
    stats.mode = lesson.mode;
    stats.lastSeen = Date.now();
    state.lessonStats[lesson.id] = stats;
    persistLessonStats();

    Object.keys(lesson.focusWords || {}).forEach((word) => recordWordSeen(word));
  }

  function getFilteredLessons() {
    return state.lessonModeFilter === "all"
      ? data.lessons
      : data.lessons.filter((lesson) => lesson.mode === state.lessonModeFilter);
  }

  function getLesson() {
    const filtered = getFilteredLessons();
    return filtered[state.lessonIndex % filtered.length];
  }

  function scoreLesson(lesson) {
    const lessonStat = state.lessonStats[lesson.id];
    const words = Object.keys(lesson.focusWords || {});
    let score = lessonStat?.views ? 0 : 12;

    words.forEach((word) => {
      const status = getWordStatus(word);
      if (status === "weak") {
        score += 6;
      } else if (status === "learning") {
        score += 3;
      } else if (status === "new") {
        score += 2;
      } else {
        score -= 1;
      }
    });

    if (lessonStat?.wrong > lessonStat?.correct) {
      score += 4;
    }

    if (state.selectedLesson?.id === lesson.id) {
      score -= 6;
    }

    return score;
  }

  function getRecommendedLessonIndex(excludeLessonId = "") {
    const filtered = getFilteredLessons();
    if (!filtered.length) {
      return 0;
    }

    let bestIndex = 0;
    let bestScore = -Infinity;

    filtered.forEach((lesson, index) => {
      if (excludeLessonId && filtered.length > 1 && lesson.id === excludeLessonId) {
        return;
      }

      const score = scoreLesson(lesson);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function modeLabel(mode) {
    const copy = getCopy();
    return mode === "dialogue" ? copy.lessonModeDialogue : copy.lessonModeStory;
  }

  function themeLabel(theme) {
    const labels = {
      social: { en: "Meeting friends", nl: "Vrienden ontmoeten" },
      health: { en: "Doctor and health", nl: "Dokter en gezondheid" },
      work: { en: "Work meeting", nl: "Werkoverleg" },
      shopping: { en: "Shopping and supermarket", nl: "Winkelen en supermarkt" },
      travel: { en: "Travel and transport", nl: "Reizen en vervoer" },
      housing: { en: "Housing and home", nl: "Wonen en thuis" },
      official: { en: "Official matters", nl: "Officiele zaken" },
      study: { en: "Study and class", nl: "Studie en les" },
      food: { en: "Food and going out", nl: "Eten en uitgaan" }
    };

    return labels[theme]?.[state.uiLanguage] || theme;
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
      "reviewLabelBottom",
      "weakWordsTitle",
      "progressLabel",
      "progressTitle",
      "recommendedThemeTitle",
      "themeStrengthTitle"
    ].forEach((key) => {
      els[key].textContent = copy[key];
    });

    els.mainPageBtn.textContent = copy.mainPage;
    els.exercisePageBtn.textContent = copy.exercisesPage;
    els.gamePageBtn.textContent = copy.gamePage;
    els.progressPageBtn.textContent = copy.progressPage;
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
    els.fillBlankCheckBtn.textContent = copy.checkAnswer;
    els.fillBlankInput.placeholder = copy.fillBlankTitle;
    els.reviewIntro.textContent = copy.reviewIntro;
    els.toggleMasteredBtn.textContent = copy.masteredButton;
    els.masteredTitle.textContent = copy.masteredTitle;
    renderPageTabs();
    renderLessonModeTabs();
    renderGame();
    renderProgress();
  }

  function renderLesson() {
    state.selectedLesson = getLesson();
    const lesson = state.selectedLesson;
    if (state.lastTrackedLessonId !== lesson.id) {
      noteLessonView(lesson);
      state.lastTrackedLessonId = lesson.id;
    }
    state.fillBlankAnswered = false;
    els.fillBlankInput.value = "";

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
    initializeGame();
    els.gameFeedback.textContent = "";
    renderGame();
    renderSavedWords();
    renderMasteredWords();
    renderProgress();
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
    state.selectedWord = wordKey;
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

  function getExerciseWords(exercise) {
    return [exercise.answer]
      .concat(
        exercise.answer.includes(" ")
          ? exercise.answer
              .split(" ")
              .map((part) => normalizeWord(part))
              .filter(Boolean)
          : [normalizeWord(exercise.answer)]
      )
      .filter(Boolean);
  }

  function renderExercise(container, promptEl, feedbackEl, exercise, type) {
    const copy = getCopy();
    promptEl.textContent = exercise.prompt;
    feedbackEl.textContent = "";
    container.innerHTML = "";

    if (type === "fillBlank") {
      els.fillBlankInput.value = "";
      els.fillBlankInput.disabled = false;
      els.fillBlankCheckBtn.disabled = false;
      els.fillBlankInput.classList.remove("correct", "wrong");
      state.fillBlankAnswered = false;

      exercise.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.className = "choice-button hint-chip";
        button.type = "button";
        button.textContent = choice;
        button.addEventListener("click", () => {
          if (state.fillBlankAnswered) {
            return;
          }
          els.fillBlankInput.value = choice;
          els.fillBlankInput.focus();
        });
        container.appendChild(button);
      });

      return;
    }

    exercise.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => {
        const isCorrect = choice === exercise.answer;
        recordWordResult(getExerciseWords(exercise), isCorrect);
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
        renderWeakWords();
        renderProgress();
      });

      container.appendChild(button);
    });
  }

  function renderExercises() {
    const exercises = state.selectedLesson.exercises;
    renderExercise(
      els.fillBlankChoices,
      els.fillBlankPrompt,
      els.fillBlankFeedback,
      exercises.fillBlank,
      "fillBlank"
    );
    renderExercise(els.matchChoices, els.matchPrompt, els.matchFeedback, exercises.match, "match");
    renderExercise(
      els.contextChoices,
      els.contextPrompt,
      els.contextFeedback,
      exercises.context,
      "context"
    );
    renderExerciseTab();
  }

  function renderPageTabs() {
    const isMain = state.currentPage === "main";
    const isExercises = state.currentPage === "exercises";
    const isGame = state.currentPage === "game";
    const isProgress = state.currentPage === "progress";
    els.mainPage.classList.toggle("hidden", !isMain);
    els.exercisePage.classList.toggle("hidden", !isExercises);
    els.gamePage.classList.toggle("hidden", !isGame);
    els.progressPage.classList.toggle("hidden", !isProgress);
    els.mainPageBtn.classList.toggle("active", isMain);
    els.exercisePageBtn.classList.toggle("active", isExercises);
    els.gamePageBtn.classList.toggle("active", isGame);
    els.progressPageBtn.classList.toggle("active", isProgress);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function isUsefulGameWord(word) {
    const normalized = normalizeWord(word);
    if (!normalized || normalized.length < 4) {
      return false;
    }

    if (BASIC_GAME_WORDS.has(normalized)) {
      return false;
    }

    return /[a-zà-ÿ]/i.test(normalized);
  }

  function getGamePairs() {
    const uniquePairs = new Map();

    Object.entries(data.lexicon || {}).forEach(([word, value]) => {
      if (value.translation && isUsefulGameWord(word) && !uniquePairs.has(word)) {
        uniquePairs.set(word, { word, translation: value.translation });
      }
    });

    data.lessons.forEach((lesson) => {
      Object.entries(lesson.focusWords || {}).forEach(([word, value]) => {
        if (value.translation && isUsefulGameWord(word) && !uniquePairs.has(word)) {
          uniquePairs.set(word, { word, translation: value.translation });
        }
      });

      lesson.sentences.forEach((sentence) => {
        sentence.match(/[A-Za-zÀ-ÿ']+/g)?.forEach((token) => {
          const normalized = normalizeWord(token);
          const lexiconEntry = data.lexicon[normalized];
          if (
            lexiconEntry?.translation &&
            isUsefulGameWord(normalized) &&
            !uniquePairs.has(normalized)
          ) {
            uniquePairs.set(normalized, {
              word: normalized,
              translation: lexiconEntry.translation
            });
          }
        });
      });
    });

    return [...uniquePairs.values()];
  }

  function initializeGame() {
    state.gameSelectedWord = null;
    const allPairs = getGamePairs();
    const desiredSize = Math.min(6, allPairs.length);
    let selectedPairs = shuffle(allPairs).slice(0, desiredSize);
    let signature = selectedPairs.map((pair) => pair.word).sort().join("|");
    let attempts = 0;

    while (
      allPairs.length > desiredSize &&
      signature === state.gameLastRoundSignature &&
      attempts < 6
    ) {
      selectedPairs = shuffle(allPairs).slice(0, desiredSize);
      signature = selectedPairs.map((pair) => pair.word).sort().join("|");
      attempts += 1;
    }

    state.gamePairs = selectedPairs;
    state.gameMeaningOrder = shuffle(state.gamePairs.map((pair) => pair.word));
    state.gameLastRoundSignature = signature;
  }

  function renderGame() {
    const copy = getCopy();
    const pairs = state.gamePairs;
    const selectedWord = state.gameSelectedWord;
    const score = Number(window.localStorage.getItem("dutchDailyCoach.gameScore") || 0);
    els.gameScorePill.textContent = `${copy.gameScore}: ${score}`;

    if (!pairs.length) {
      els.gameWordList.innerHTML = "";
      els.gameMeaningList.innerHTML = "";
      els.gameFeedback.textContent = copy.gameRoundDone;
      return;
    }

    els.gameWordList.innerHTML = pairs
      .map(
        (pair) =>
          `<button type="button" class="choice-button game-option${selectedWord === pair.word ? " active" : ""}" data-game-word="${pair.word}">${pair.word}</button>`
      )
      .join("");

    els.gameMeaningList.innerHTML = state.gameMeaningOrder
      .map((word) => pairs.find((pair) => pair.word === word))
      .filter(Boolean)
      .map(
        (pair) =>
          `<button type="button" class="choice-button game-option" data-game-translation="${pair.translation}" data-game-word="${pair.word}">${pair.translation}</button>`
      )
      .join("");
  }

  function resetGame() {
    initializeGame();
    els.gameFeedback.textContent = "";
    renderGame();
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
  }

  function getWeakWordsList() {
    return Object.keys(state.progress)
      .filter((word) => getWordStatus(word) === "weak" && !state.masteredWords.includes(word))
      .sort((left, right) => {
        const leftProgress = getWordProgress(left);
        const rightProgress = getWordProgress(right);
        return (rightProgress.wrong - rightProgress.correct) - (leftProgress.wrong - leftProgress.correct);
      })
      .slice(0, 16);
  }

  function renderWeakWords() {
    const copy = getCopy();
    const weakWords = getWeakWordsList();
    if (!weakWords.length) {
      els.weakWords.innerHTML = `<span class="saved-word">${copy.weakWordsEmpty}</span>`;
      return;
    }

    els.weakWords.innerHTML = weakWords
      .map((word) => `<button type="button" class="saved-word status-chip weak-chip" data-review-word="${word}">${word}</button>`)
      .join("");
  }

  function renderSavedWords() {
    const copy = getCopy();
    if (!state.savedWords.length) {
      els.savedWords.innerHTML = `<span class="saved-word">${copy.savedWordsEmpty}</span>`;
    } else {
      els.savedWords.innerHTML = state.savedWords
        .map((word) => `<button type="button" class="saved-word status-chip" data-review-word="${word}">${word}</button>`)
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
      .map((word) => `<button type="button" class="saved-word mastered-word status-chip" data-review-word="${word}">${word}</button>`)
      .join("");
  }

  function buildThemeSummary() {
    const summary = {};

    Object.entries(state.lessonStats).forEach(([, lessonStats]) => {
      const theme = lessonStats.theme;
      if (!theme) {
        return;
      }

      if (!summary[theme]) {
        summary[theme] = { correct: 0, wrong: 0, views: 0 };
      }

      summary[theme].correct += lessonStats.correct || 0;
      summary[theme].wrong += lessonStats.wrong || 0;
      summary[theme].views += lessonStats.views || 0;
    });

    return summary;
  }

  function renderProgress() {
    const copy = getCopy();
    const trackedWords = Object.keys(state.progress);
    const masteredCount = trackedWords.filter((word) => getWordStatus(word) === "mastered").length;
    const learningCount = trackedWords.filter((word) => getWordStatus(word) === "learning").length;
    const weakCount = trackedWords.filter((word) => getWordStatus(word) === "weak").length;
    const metrics = [
      { label: copy.wordsTracked, value: trackedWords.length },
      { label: copy.wordsMastered, value: masteredCount },
      { label: copy.wordsLearning, value: learningCount },
      { label: copy.wordsWeak, value: weakCount }
    ];

    els.progressMetrics.innerHTML = metrics
      .map(
        (item) =>
          `<div class="metric-card"><span class="metric-value">${item.value}</span><span class="metric-label">${item.label}</span></div>`
      )
      .join("");

    const lessons = getFilteredLessons();
    const recommendationIndex = getRecommendedLessonIndex();
    const recommendation = lessons[recommendationIndex];
    if (recommendation) {
      const reason = Object.keys(recommendation.focusWords || {}).some(
        (word) => getWordStatus(word) === "weak"
      )
        ? copy.recommendationReview
        : copy.recommendationNew;
      els.recommendedLessonText.textContent = `${recommendation.title[state.uiLanguage]} · ${reason}`;
    } else {
      els.recommendedLessonText.textContent = copy.noRecommendation;
    }

    const themeSummary = buildThemeSummary();
    const themeEntries = Object.entries(themeSummary)
      .sort(([, left], [, right]) => (right.correct - right.wrong) - (left.correct - left.wrong))
      .slice(0, 6);

    els.themeBreakdown.innerHTML = themeEntries.length
      ? themeEntries
          .map(([theme, stats]) => {
            const score = stats.correct - stats.wrong;
            const status = score >= 0 ? copy.themeStrong : copy.themeNeedsWork;
            return `<div class="theme-item"><span>${themeLabel(theme)}</span><span class="theme-score">${status}</span></div>`;
          })
          .join("")
      : `<p class="lesson-intro">${copy.noRecommendation}</p>`;
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
    renderWeakWords();
    renderProgress();
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
    renderWeakWords();
    renderMasteredWords();
    renderProgress();
  }

  function openNextLesson() {
    state.lessonIndex = getRecommendedLessonIndex(state.selectedLesson?.id);
    state.lastTrackedLessonId = null;
    window.localStorage.setItem("dutchDailyCoach.lessonIndex", String(state.lessonIndex));
    renderLesson();
  }

  function bindEvents() {
    function checkFillBlankAnswer() {
      if (state.fillBlankAnswered) {
        return;
      }

      const copy = getCopy();
      const exercise = state.selectedLesson.exercises.fillBlank;
      const value = normalizeWord(els.fillBlankInput.value);
      const expected = normalizeWord(exercise.answer);
      const isCorrect = value === expected;

      state.fillBlankAnswered = true;
      els.fillBlankInput.disabled = true;
      els.fillBlankCheckBtn.disabled = true;
      recordWordResult(getExerciseWords(exercise), isCorrect);

      els.fillBlankChoices.querySelectorAll(".choice-button").forEach((item) => {
        item.disabled = true;
        if (normalizeWord(item.textContent) === expected) {
          item.classList.add("correct");
        }
      });

      if (!isCorrect) {
        els.fillBlankInput.classList.add("wrong");
      } else {
        els.fillBlankInput.classList.add("correct");
      }

      els.fillBlankFeedback.textContent = isCorrect
        ? copy.correct
        : `${copy.wrongPrefix} ${exercise.answer}`;

      renderWeakWords();
      renderProgress();
    }

    els.sentenceList.addEventListener("click", (event) => {
      const button = event.target.closest(".tap-word");
      if (!button) {
        return;
      }

      recordWordSeen(button.dataset.word);
      renderSelectedWord(button.dataset.word);
      renderProgress();
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
    els.fillBlankCheckBtn.addEventListener("click", checkFillBlankAnswer);
    els.fillBlankInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        checkFillBlankAnswer();
      }
    });
    els.openLessonBtn.addEventListener("click", openNextLesson);
    els.dialogueModeBtn.addEventListener("click", () => {
      state.lessonModeFilter = "dialogue";
      state.lessonIndex = getRecommendedLessonIndex();
      state.lastTrackedLessonId = null;
      window.localStorage.setItem("dutchDailyCoach.lessonModeFilter", state.lessonModeFilter);
      renderCopy();
      renderLesson();
    });
    els.storyModeBtn.addEventListener("click", () => {
      state.lessonModeFilter = "story";
      state.lessonIndex = getRecommendedLessonIndex();
      state.lastTrackedLessonId = null;
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
    els.progressPageBtn.addEventListener("click", () => {
      state.currentPage = "progress";
      renderPageTabs();
      renderProgress();
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
        recordWordResult([state.gameSelectedWord], true);
        state.gamePairs = state.gamePairs.filter((pair) => pair.word !== state.gameSelectedWord);
        state.gameMeaningOrder = state.gameMeaningOrder.filter((word) => word !== state.gameSelectedWord);
      } else {
        els.gameFeedback.textContent = copy.gameWrong;
        recordWordResult([state.gameSelectedWord], false);
      }
      state.gameSelectedWord = null;
      renderGame();
      renderWeakWords();
      renderProgress();
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
    [els.savedWords, els.masteredWords, els.weakWords].forEach((container) => {
      container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-review-word]");
        if (!button) {
          return;
        }

        state.currentPage = "main";
        renderPageTabs();
        renderSelectedWord(button.dataset.reviewWord);
      });
    });
  }

  function init() {
    state.lessonIndex = getRecommendedLessonIndex();
    applyTheme();
    renderCopy();
    renderLesson();
    renderSavedWords();
    renderWeakWords();
    renderMasteredWords();
    renderProgress();
    bindEvents();
  }

  init();
})();
