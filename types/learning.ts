export interface Language {
  id: string;
  code: string; // e.g., 'es', 'fr', 'de'
  name: string; // e.g., 'Spanish'
  nativeName: string; // e.g., 'Español'
  flag: string; // emoji or image key
  tagline: string;
  description: string;
}

export interface Unit {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
}

export type LessonType = 'video' | 'audio' | 'chat' | 'vocabulary';

export interface AITeacherConfig {
  name: string;
  persona: string;
  voiceId: string; // voice option for synthesis
  systemPrompt: string; // prompt instructions for the AI
  avatarUrl?: string;
}

export type ActivityType =
  | 'vocabulary_match'
  | 'multiple_choice'
  | 'sentence_builder'
  | 'speaking_practice'
  | 'chat_roleplay';

export interface ActivityBase {
  id: string;
  type: ActivityType;
  instruction: string;
}

export interface VocabularyPair {
  word: string;
  translation: string;
}

export interface VocabularyMatchActivity extends ActivityBase {
  type: 'vocabulary_match';
  pairs: VocabularyPair[];
}

export interface MultipleChoiceActivity extends ActivityBase {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
  context?: string; // Additional grammatical tips/explanations
}

export interface SentenceBuilderActivity extends ActivityBase {
  type: 'sentence_builder';
  scrambledWords: string[];
  correctSentence: string;
  translation: string;
}

export interface SpeakingPracticeActivity extends ActivityBase {
  type: 'speaking_practice';
  phrase: string;
  translation: string;
  pronunciationHint?: string;
}

export interface ChatRoleplayActivity extends ActivityBase {
  type: 'chat_roleplay';
  scenario: string;
  aiCharacterName: string;
  aiAvatar?: string;
  aiInitialMessage: string;
  studentRole: string;
  aiSystemPrompt: string;
}

export type Activity =
  | VocabularyMatchActivity
  | MultipleChoiceActivity
  | SentenceBuilderActivity
  | SpeakingPracticeActivity
  | ChatRoleplayActivity;

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  type: LessonType;
  xp: number;
  order: number;
  goals: string[]; // e.g. ["Introduce yourself", "Greet others"]
  aiTeacherConfig?: AITeacherConfig;
  activities: Activity[];
}

export interface VocabularyWord {
  id: string;
  languageId: string;
  word: string;
  translation: string;
  partOfSpeech: string; // e.g. "noun", "verb", "adjective", "greeting"
  exampleSentence: string;
  exampleTranslation: string;
  audioUrl?: string;
}

export interface Phrase {
  id: string;
  languageId: string;
  phrase: string;
  translation: string;
  context: string; // e.g. "Greetings", "Shopping", "Food"
}
