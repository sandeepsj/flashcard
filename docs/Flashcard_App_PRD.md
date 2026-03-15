**Flashcard App**

Product Requirements Document

Version 1.0   |   March 2026

*Stack: React JS  \+  Firebase*

# **1\. Product Overview**

The Flashcard App is a Progressive Web Application (PWA) that allows users to build, organise, and study Data Structures & Algorithms flashcards. Cards can be generated from multiple input sources — LeetCode / problem links, pasted Q\&A text, or free-form theory paragraphs — and are stored persistently in Firebase. A spaced-repetition engine schedules cards for review. Daily practice results are visualised on a heatmap and score chart. The app must feel fast, minimal, and fully usable on both desktop and mobile browsers.

# **2\. Goals and Non-Goals**

## **2.1 Goals**

* Enable fast, frictionless flashcard creation from multiple input types.

* Organise cards by user-defined topics (subjects).

* Drive consistent daily practice via spaced repetition scheduling.

* Surface study progress through a dashboard with heatmap and daily scores.

* Provide audio readout of every question for hands-free studying.

* Work offline and be installable as a PWA on desktop and mobile.

## **2.2 Non-Goals**

* No social or collaborative features in v1.

* No AI-powered hint or explanation generation inside the study session.

* No native iOS / Android app — PWA only.

# **3\. User Stories**

| ID | As a user I want to… | So that… |
| :---- | :---- | :---- |
| US-01 | Paste a LeetCode URL and auto-generate flashcards | I save time creating cards manually |
| US-02 | Paste a Q\&A block and generate one or more cards | I can import existing notes instantly |
| US-03 | Paste a theory paragraph and generate cards from it | I can learn concepts, not just problems |
| US-04 | Create a new topic and assign cards to it | My deck stays organised by subject |
| US-05 | Flip a card and mark myself correct or wrong | The app knows my confidence level |
| US-06 | Hear each question read aloud automatically | I can study without looking at a screen |
| US-07 | See a GitHub-style heatmap of my practice history | I can track my consistency |
| US-08 | See my daily score chart over time | I can measure improvement |
| US-09 | Install the app on my phone from the browser | I can open it like a native app |
| US-10 | Continue studying offline | I am not blocked by connectivity issues |

# **4\. Card Creation — Input Types**

## **4.1 LeetCode / Problem Link Input**

The user pastes a URL (e.g. https://leetcode.com/problems/two-sum/). The app fetches and parses the problem title, description, and constraints to auto-generate a flashcard. At minimum one card is generated: Question \= problem statement summary, Answer \= approach \+ time/space complexity.

| *📌  Important: URL parsing must degrade gracefully. If a URL cannot be fetched (CORS, private problem), the app must display a clear error and prompt the user to paste the content manually instead.* |
| :---- |

## **4.2 Pasted Q\&A Text Input**

The user pastes one or more Q\&A pairs in free text. The app uses Claude API to extract individual question–answer pairs and creates one card per pair. The user must be able to review, edit, or delete any extracted card before saving.

## **4.3 Theory Paragraph Input**

The user pastes a block of conceptual text (e.g. an explanation of binary search). The app uses Claude API to generate a set of flashcards covering the key concepts. The number of generated cards should reflect the density of the paragraph — a 200-word paragraph should yield 3–6 cards.

| *📌  Important: For both Q\&A and paragraph inputs, the user must always see a preview of all generated cards before they are saved to Firebase. No card should be saved silently.* |
| :---- |

# **5\. Topics (Subject Organisation)**

Every card must belong to exactly one topic. Topics are user-created and user-named. Examples: Arrays, Trees, Dynamic Programming, Graph Theory.

* Users can create a new topic from any card-creation flow or from the topic management page.

* Topics are listed in the sidebar and on the dashboard.

* Users can rename or delete a topic. Deleting a topic must warn the user if it contains cards, and must ask whether to delete the cards or move them to another topic.

* Cards can be moved between topics after creation.

* Each topic shows a card count badge and a mini progress ring indicating how many due cards exist today.

# **6\. Flashcard Study Session**

## **6.1 Session Flow**

The study session presents one card at a time in the following sequence:

1. Card appears showing the Question side only.

2. The question is read aloud automatically via text-to-speech (Web Speech API).

3. User taps / clicks the card or a Flip button to reveal the Answer.

4. User self-grades: taps Got It or Missed It.

5. The app records the result, updates the spaced-repetition schedule, and advances to the next card.

## **6.2 Audio**

* Auto-read: The question text is spoken automatically when a card is displayed.

* A speaker / replay button is always visible so the user can re-trigger speech.

* Speech can be paused or cancelled when the card is flipped.

* Audio must respect the device's mute / silent mode and must not play if the browser blocks auto-play.

* Speed and voice selection are configurable in settings (slow / normal / fast; available system voices).

| *📌  Important: Audio is a first-class feature, not an afterthought. It must be tested on both desktop Chrome/Firefox and mobile Safari. Silent failures must show a visible indicator, not fail silently.* |
| :---- |

## **6.3 Spaced Repetition**

The app uses an SM-2-inspired algorithm. Key rules:

* Got It increases the interval: 1 day → 3 days → 7 days → 14 days → 30 days, then doubles.

* Missed It resets the interval to 1 day.

* A card's next review date is stored in Firebase.

* The session queue for any given day contains all cards whose next review date is today or earlier.

* The daily session ends when the queue is empty. A completion screen is shown.

# **7\. Dashboard**

The dashboard is the default landing screen after login. It must convey the user's progress at a glance without requiring any interaction.

## **7.1 Summary Metrics Row**

* Cards due today

* Cards studied today

* Current streak (consecutive days with at least one card reviewed)

* Total cards in deck

## **7.2 Activity Heatmap**

A GitHub-style calendar heatmap showing the number of cards reviewed on each day over the last 12 months. Each cell represents one day. Colour intensity maps to card count (0 \= empty/grey, 1–5 \= light, 6–15 \= medium, 16+ \= dark). Hovering / tapping a cell shows a tooltip: date \+ cards reviewed.

| *📌  Important: The heatmap must be readable on mobile. On screens narrower than 480px, display the last 16 weeks instead of 52\.* |
| :---- |

## **7.3 Daily Score Chart**

A bar or line chart showing the number of Got It vs Missed It responses per day over the last 30 days. Both series are shown together. The chart must include axis labels, a legend, and a zero-baseline.

## **7.4 Topic Progress List**

A list of all topics showing — for each topic — the total card count, cards mastered (interval ≥ 30 days), and cards due today. Clicking a topic opens the topic detail view.

# **8\. UI & Design Requirements**

| *📌  UI quality is a first-class requirement. The app must feel as polished as a commercial product, not a prototype. Every screen must be intentionally designed.* |
| :---- |

## **8.1 General Principles**

* Clean, minimal aesthetic. No decorative gradients or heavy shadows.

* Consistent spacing using an 8px grid.

* All interactive elements (buttons, cards, inputs) must have visible focus states for keyboard navigation.

* Colour palette must pass WCAG AA contrast on both light and dark backgrounds.

* Font must be legible at small sizes on mobile — minimum 14px for body text.

## **8.2 Flashcard Component**

* Card flip must use a CSS 3D transform animation (rotateY), not a fade or slide.

* Question side and Answer side must be visually distinct (different background tint or accent colour).

* Card must display topic tag in the top-left corner.

* Card must show the current card number and total (e.g. 3 / 12\) in the top-right corner.

* Got It and Missed It buttons are shown only after the card is flipped.

* Buttons must be large enough to tap comfortably on mobile (min 44 × 44px touch target).

## **8.3 Responsive Layout**

* Desktop (≥ 1024px): Sidebar navigation \+ main content area side by side.

* Tablet (768px – 1023px): Collapsible sidebar with hamburger toggle.

* Mobile (\< 768px): Bottom tab navigation. Sidebar replaced by a slide-in drawer.

* Flashcard study view must be full-screen-capable on mobile (no nav bars during session).

## **8.4 PWA Requirements**

* A valid Web App Manifest with name, short name, icons (192px, 512px), theme colour, and display: standalone.

* A service worker that caches the app shell and all static assets.

* The app must be fully functional offline once loaded (Firebase offline persistence enabled).

* Install prompt (beforeinstallprompt) must be intercepted and shown as an in-app banner, not the browser default.

## **8.5 Dark Mode**

* The app must support system-level dark mode via prefers-color-scheme.

* Users can also toggle dark/light manually in settings.

* All colours, card faces, and chart fills must adapt correctly — no hardcoded hex values in components.

# **9\. Data & Firebase Architecture**

## **9.1 Authentication**

* Google Sign-In via Firebase Authentication.

* All data is scoped per authenticated user (userId).

## **9.2 Firestore Collections**

| Collection | Document ID | Key Fields |
| :---- | :---- | :---- |
| users/{uid} | uid | displayName, email, settings, streakCount, lastActiveDate |
| topics/{topicId} | auto | uid, name, createdAt, cardCount |
| cards/{cardId} | auto | uid, topicId, question, answer, interval, nextReviewDate, createdAt |
| reviews/{reviewId} | auto | uid, cardId, date, result (got\_it | missed\_it) |

## **9.3 Offline Support**

* Firebase Firestore offline persistence must be enabled.

* Cards reviewed offline must sync when connectivity is restored.

* The UI must display a subtle offline banner when the device has no connection.

# **10\. Test Cases**

Every UI element and user flow must have a corresponding test case. The following tables define the minimum required test coverage.

## **10.1 Authentication**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-AUTH-01 | User clicks Sign in with Google | OAuth popup opens; on success, user is redirected to Dashboard |
| TC-AUTH-02 | User is already signed in and opens the app | User lands on Dashboard without seeing the login screen |
| TC-AUTH-03 | User clicks Sign Out | Session is cleared; user is redirected to Login screen |
| TC-AUTH-04 | Unauthenticated user tries to access /dashboard | Redirected to Login screen |

## **10.2 Card Creation — Link Input**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-LINK-01 | User pastes a valid LeetCode URL and clicks Generate | Preview screen shows ≥1 generated card with question and answer |
| TC-LINK-02 | User pastes an invalid / unreachable URL | Error message shown; user prompted to paste content manually |
| TC-LINK-03 | User edits a generated card in preview | Changes are reflected when the card is saved |
| TC-LINK-04 | User deletes one card in preview before saving | Deleted card is not saved to Firebase |
| TC-LINK-05 | User saves generated cards | Cards appear in the selected topic; card count updates |

## **10.3 Card Creation — Q\&A Paste Input**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-QA-01 | User pastes multi-pair Q\&A text | Each pair is extracted as a separate card in preview |
| TC-QA-02 | User pastes text with no detectable Q\&A structure | App shows a warning and still attempts to generate at least one card |
| TC-QA-03 | User submits empty input | Submit button is disabled; inline validation message shown |

## **10.4 Card Creation — Theory Paragraph Input**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-THEORY-01 | User pastes a 200-word theory paragraph | 3–6 cards are generated and shown in preview |
| TC-THEORY-02 | User pastes a very short paragraph (\<30 words) | At least 1 card is generated; no error thrown |
| TC-THEORY-03 | API call fails during generation | User sees a retry option and an error explanation |

## **10.5 Topic Management**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-TOPIC-01 | User creates a new topic | Topic appears in sidebar and topic list with card count 0 |
| TC-TOPIC-02 | User creates a topic with a duplicate name | Inline error shown; topic not created |
| TC-TOPIC-03 | User renames a topic | New name shown everywhere the topic appears |
| TC-TOPIC-04 | User deletes a topic with cards | Warning dialog shown with option to delete cards or reassign them |
| TC-TOPIC-05 | User deletes a topic with no cards | Topic is deleted immediately with a toast confirmation |
| TC-TOPIC-06 | User moves a card to a different topic | Card count updates for both source and destination topics |

## **10.6 Study Session**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-STUDY-01 | User starts a session with due cards | First card is shown; question is read aloud within 1 second |
| TC-STUDY-02 | User flips a card | Card rotates with 3D CSS animation; answer is shown; Got It / Missed It buttons appear |
| TC-STUDY-03 | User taps Got It | Card is marked correct; interval increases; next card is shown |
| TC-STUDY-04 | User taps Missed It | Card interval resets to 1 day; next card is shown |
| TC-STUDY-05 | User taps the speaker / replay button | Question is read aloud again from the beginning |
| TC-STUDY-06 | Session queue is empty | Completion screen shown with session summary (correct, wrong, time) |
| TC-STUDY-07 | User starts a session with no due cards | Empty state shown; no crash |

## **10.7 Audio (Text-to-Speech)**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-AUDIO-01 | Card loads in a browser with SpeechSynthesis support | Question text is spoken automatically |
| TC-AUDIO-02 | Card loads in a browser where auto-play is blocked | Silent fallback; speaker icon shown as inactive; no JS error |
| TC-AUDIO-03 | User changes voice in settings | Next card uses the selected voice |
| TC-AUDIO-04 | User changes speed to Slow | Speech rate noticeably slower on next card |
| TC-AUDIO-05 | User flips the card before speech finishes | Speech is cancelled; answer side shown silently |

## **10.8 Dashboard**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-DASH-01 | User opens the dashboard after studying today | Correct cards studied today count is reflected |
| TC-DASH-02 | User hovers / taps a heatmap cell | Tooltip shows date and card count for that day |
| TC-DASH-03 | User has no study history | Heatmap renders with all empty cells; no error |
| TC-DASH-04 | Daily score chart renders | Both Got It and Missed It bars are shown; axes are labelled |
| TC-DASH-05 | User views dashboard on a 375px mobile screen | Heatmap shows last 16 weeks; all metrics readable; no overflow |

## **10.9 PWA & Offline**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-PWA-01 | User visits on Chrome mobile and meets install criteria | In-app install banner appears (not browser default) |
| TC-PWA-02 | User installs the PWA | App opens in standalone mode without browser chrome |
| TC-PWA-03 | User goes offline after initial load | Offline banner shown; existing cards still accessible |
| TC-PWA-04 | User reviews cards offline | Reviews are queued; sync occurs when connection is restored |
| TC-PWA-05 | User opens the app with no prior cache | Graceful loading state shown; no blank screen |

## **10.10 Responsive UI**

| TC-ID | Test Case | Expected Result |
| :---- | :---- | :---- |
| TC-RESP-01 | App opened at 1440px width | Sidebar is visible and expanded by default |
| TC-RESP-02 | App opened at 768px width | Sidebar is collapsed; hamburger toggle visible |
| TC-RESP-03 | App opened at 375px width | Bottom tab navigation shown; no horizontal overflow |
| TC-RESP-04 | User taps Got It on mobile | Touch target ≥ 44×44px; no accidental adjacent tap |
| TC-RESP-05 | Dark mode is active on system level | All screens use dark colour palette; no bright flash on load |

# **11\. Out of Scope (v1)**

* Shared decks or collaborative study sessions.

* In-app code execution for algorithmic problems.

* Leaderboards or social features.

* Export to Anki or other flashcard formats.

* Payment or subscription tiers.

# **12\. Glossary**

| Term | Definition |
| :---- | :---- |
| Card | A single flashcard consisting of a question and an answer. |
| Topic | A user-created category that groups related cards (e.g. Trees, Sorting). |
| Session | A single practice run through the user's due cards. |
| Got It | User self-rating indicating they recalled the answer correctly. |
| Missed It | User self-rating indicating they did not recall the answer. |
| Interval | The number of days before a card is shown again (spaced repetition). |
| Heatmap | A calendar grid showing daily study activity by intensity. |
| PWA | Progressive Web App — a web app installable on device home screens. |
| SM-2 | SuperMemo 2 algorithm — the basis for the spaced repetition schedule. |

