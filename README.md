# Dutch Daily Coach MVP

This prototype is now shaped around a calmer idea:

- no visible `A1 / A2 / B1` picker
- the app should adapt quietly in the background
- short daily practice instead of study-mode setup
- dialogues and mini stories together
- real-life situations instead of a few broad school-like topics

## Prototype

Open the prototype in a browser:

- `dutch/app/index.html`

## Product concept

This should feel like a personal Dutch coach, not a flashcard deck and not a school tool.

### Home structure

The home screen should focus on four simple actions:

1. `Today's lesson`
2. `Continue`
3. `Review weak words`
4. `Explore situations`

### Learning structure

The app should teach through:

- short dialogues
- mini stories / mini articles
- tappable difficult words
- simple Dutch definitions
- context-first exercises

The main exercise types remain:

- fill in the blank
- match word to meaning
- choose the right word in context

### Progression

The learner should not choose a level manually.

Instead:

- the app starts easy
- it introduces more difficult words and sentence patterns gradually
- it repeats weak words automatically
- it moves from `A1` toward `A2` and `B1` in the background

## Content direction

The app needs many more daily-life situations than the first draft had.

Examples:

- meeting a friend
- at a cafe or bar
- doctor and health
- at work
- phone calls
- shopping and supermarket
- public transport
- gemeente and forms
- neighbors
- weekend plans

The real content model should feel more like:

- `situation -> lesson -> target words -> simple definitions -> exercises`

not:

- `level -> topic -> lesson`

## Suggested production stack

- Frontend: Next.js or React
- Auth: Supabase Auth or Clerk
- Database: Postgres / Supabase

## Suggested data model

- `users`
- `words`
- `word_definitions`
- `situations`
- `lessons`
- `lesson_sentences`
- `lesson_focus_words`
- `exercise_attempts`
- `saved_words`
- `review_schedule`
- `lesson_progress`

## Source strategy

Vocabulary should come from a mix of:

- your own PDF / Quizlet material
- curated A1 and A2 everyday Dutch
- NT2-aligned B1 vocabulary
- manually reviewed simple Dutch explanations

## Next build steps

1. Expand the situation library with many more real-life lessons.
2. Import structured vocabulary from your material and external NT2 sources.
3. Add accounts and saved progress.
4. Build an adaptive review algorithm.
5. Replace this static prototype with a proper React app.
