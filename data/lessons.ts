import { Lesson, VocabularyWord, Phrase } from "@/types/learning";

export const lessons: Lesson[] = [
  // --- SPANISH LESSONS ---
  {
    id: "es-l1",
    unitId: "es-unit-1",
    title: "Greetings & Basics",
    description: "Master essential greetings, say goodbye, and learn simple polite replies in Spanish.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: [
      "Learn common Spanish greetings",
      "Understand gender nuances in greetings",
      "Recognize simple polite replies"
    ],
    activities: [
      {
        id: "es-l1-a1",
        type: "vocabulary_match",
        instruction: "Match the Spanish greetings with their English translations.",
        pairs: [
          { word: "hola", translation: "hello" },
          { word: "adiós", translation: "goodbye" },
          { word: "buenos días", translation: "good morning" },
          { word: "gracias", translation: "thank you" }
        ]
      },
      {
        id: "es-l1-a2",
        type: "multiple_choice",
        instruction: "Select the correct expression for asking 'How are you?' in a friendly way.",
        question: "How do you say 'How are you?' in Spanish?",
        options: ["¿Cómo estás?", "Hola", "Buenos días", "Adiós"],
        correctAnswer: "¿Cómo estás?",
        context: "Use '¿Cómo estás?' for friends and family, and '¿Cómo está usted?' for formal situations."
      },
      {
        id: "es-l1-a3",
        type: "sentence_builder",
        instruction: "Build the greeting: 'Hello, how are you?'",
        scrambledWords: ["estás?", "¿cómo", "Hola,", "tú"],
        correctSentence: "Hola, ¿cómo estás?",
        translation: "Hello, how are you?"
      }
    ]
  },
  {
    id: "es-l2",
    unitId: "es-unit-1",
    title: "First Conversation",
    description: "Roleplay a friendly introduction in a Madrid café with your AI tutor, Sofía.",
    type: "chat",
    xp: 15,
    order: 2,
    goals: [
      "Share your name in Spanish",
      "Ask someone for their name",
      "Say 'Nice to meet you'"
    ],
    aiTeacherConfig: {
      name: "Sofía",
      persona: "A warm, patient, and encouraging Spanish tutor from Madrid who speaks clear, accessible Castilian Spanish.",
      voiceId: "es-ES-Neural-Sofia",
      systemPrompt: "You are Sofía, an AI Spanish tutor helping a beginner practice introductions in a Madrid café. Keep sentences simple and vocabulary basic. If they make a grammatical error, point it out gently and show them the correct way. Encourage them to share their name, ask for your name, and use 'Mucho gusto' (Nice to meet you)."
    },
    activities: [
      {
        id: "es-l2-a1",
        type: "chat_roleplay",
        instruction: "Chat with Sofía. Greet her, introduce yourself, and ask for her name.",
        scenario: "You are sitting at a café in Madrid. An amicable Spanish lady sits next to you and strikes up a conversation.",
        aiCharacterName: "Sofía",
        aiInitialMessage: "¡Hola! Buenas tardes. ¿Cómo estás? Me llamo Sofía, ¿y tú?",
        studentRole: "Introduce yourself, tell Sofía how you are doing, and ask her for her name.",
        aiSystemPrompt: "You are Sofía, an AI Spanish tutor helping a beginner practice introductions in a Madrid café. Keep sentences simple and vocabulary basic. If they make a grammatical error, point it out gently and show them the correct way. Encourage them to share their name, ask for your name, and use 'Mucho gusto' (Nice to meet you)."
      }
    ]
  },
  {
    id: "es-l3",
    unitId: "es-unit-1",
    title: "Ordering Coffee",
    description: "Learn to order a delicious café con leche and navigate payments with Carlos.",
    type: "audio",
    xp: 20,
    order: 3,
    goals: [
      "Order coffee politely in Spanish",
      "Ask for the price / bill",
      "Practice correct pronunciation of common cafe orders"
    ],
    aiTeacherConfig: {
      name: "Carlos",
      persona: "An energetic and friendly Argentine barista from Buenos Aires who loves chatty customers.",
      voiceId: "es-AR-Neural-Carlos",
      systemPrompt: "You are Carlos, a Spanish-speaking barista. Help the student order a coffee. Guide them through choosing the type of milk/sugar and saying please/thank you. Provide pronunciation feedback if needed."
    },
    activities: [
      {
        id: "es-l3-a1",
        type: "speaking_practice",
        instruction: "Read the phrase aloud to order a coffee with milk.",
        phrase: "Un café con leche, por favor.",
        translation: "A coffee with milk, please.",
        pronunciationHint: "oon kah-FEH kon LEH-cheh, por fah-VOR"
      },
      {
        id: "es-l3-a2",
        type: "multiple_choice",
        instruction: "Choose the correct phrase to ask for the total price.",
        question: "How do you ask 'How much is it?' in Spanish?",
        options: ["¿Cuánto cuesta?", "Muchas gracias", "Hola amigo", "Me llamo Carlos"],
        correctAnswer: "¿Cuánto cuesta?",
        context: "You can also say '¿Cuánto es?' or ask for the check with 'La cuenta, por favor.'"
      },
      {
        id: "es-l3-a3",
        type: "sentence_builder",
        instruction: "Build the order: 'A water, please.'",
        scrambledWords: ["por", "favor.", "agua,", "Un"],
        correctSentence: "Un agua, por favor.",
        translation: "A water, please."
      },
      {
        id: "es-l3-a4",
        type: "sentence_builder",
        instruction: "Build the order: 'A tea, please.'",
        scrambledWords: ["favor.", "por", "té,", "Un"],
        correctSentence: "Un té, por favor.",
        translation: "A tea, please."
      }
    ]
  },
  {
    id: "es-l4",
    unitId: "es-unit-1",
    title: "AI Video Teacher: Tapas",
    description: "Learn about traditional Spanish dishes in an interactive video session with Lucía.",
    type: "video",
    xp: 25,
    order: 4,
    goals: [
      "Identify traditional Spanish tapas and food",
      "Express food preferences using 'me gusta'",
      "Follow video instructions in Spanish"
    ],
    aiTeacherConfig: {
      name: "Lucía",
      persona: "A vibrant, expressive Spanish language teacher and culinary enthusiast from Barcelona. She uses visual aids, hand gestures, and high-quality audio-visual prompts.",
      voiceId: "es-ES-Neural-Lucia",
      systemPrompt: "You are Lucía, a virtual Spanish teacher running a live video-based lesson. Present the student with Spanish dishes (tapas, paella, churros). Ask the student if they like paella and guide them to answer 'Me gusta la paella'."
    },
    activities: [
      {
        id: "es-l4-a1",
        type: "multiple_choice",
        instruction: "Identify the famous Spanish rice dish flavored with saffron.",
        question: "What is 'paella'?",
        options: [
          "A traditional Spanish rice dish",
          "A sweet chocolate pastry",
          "A cold vegetable soup",
          "A spicy pork sausage"
        ],
        correctAnswer: "A traditional Spanish rice dish",
        context: "Paella originated in Valencia. It is cooked in a large shallow pan and often contains vegetables, seafood, or meats."
      },
      {
        id: "es-l4-a2",
        type: "speaking_practice",
        instruction: "Say that you like paella.",
        phrase: "Me gusta la paella.",
        translation: "I like paella.",
        pronunciationHint: "meh GOOS-tah lah pah-EH-yah"
      }
    ]
  },

  // --- FRENCH LESSONS ---
  {
    id: "fr-l1",
    unitId: "fr-unit-1",
    title: "Bonjour!",
    description: "Learn fundamental French greetings, say goodbye, and distinguish formal vs. informal registers.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: [
      "Learn common French greetings",
      "Understand formal vs. informal 'you' (tu vs. vous)",
      "Say thank you and please"
    ],
    activities: [
      {
        id: "fr-l1-a1",
        type: "vocabulary_match",
        instruction: "Match the French greetings with their English translations.",
        pairs: [
          { word: "bonjour", translation: "hello" },
          { word: "au revoir", translation: "goodbye" },
          { word: "merci", translation: "thank you" },
          { word: "s'il vous plaît", translation: "please (formal)" }
        ]
      },
      {
        id: "fr-l1-a2",
        type: "multiple_choice",
        instruction: "Choose the greeting you would use in the evening.",
        question: "How do you say 'Good evening' in French?",
        options: ["Bonsoir", "Bonjour", "Au revoir", "Merci"],
        correctAnswer: "Bonsoir",
        context: "Use 'Bonsoir' generally after 6 PM or sunset."
      }
    ]
  },
  {
    id: "fr-l2",
    unitId: "fr-unit-1",
    title: "Meeting Pierre",
    description: "Roleplay a formal introduction at a Paris art gallery opening with Pierre.",
    type: "chat",
    xp: 15,
    order: 2,
    goals: [
      "Greet someone formally in French",
      "Introduce yourself",
      "Use 'Enchanté' (Nice to meet you)"
    ],
    aiTeacherConfig: {
      name: "Pierre",
      persona: "A polite, elegant, and classical French art curator from Paris who values formal language.",
      voiceId: "fr-FR-Neural-Pierre",
      systemPrompt: "You are Pierre, a French curator greeting a visitor at an art gallery. Practice formal French introductions. Use 'vous'. Guide the student to say hello, give their name, and say 'Enchanté de vous rencontrer' (Nice to meet you)."
    },
    activities: [
      {
        id: "fr-l2-a1",
        type: "chat_roleplay",
        instruction: "Introduce yourself formally to Pierre.",
        scenario: "You are attending an art gallery opening in Paris. You meet Pierre, the gallery curator.",
        aiCharacterName: "Pierre",
        aiInitialMessage: "Bonjour. Enchanté de vous rencontrer. Comment vous appelez-vous ?",
        studentRole: "Say hello, tell Pierre your name, and ask how he is doing.",
        aiSystemPrompt: "You are Pierre, a French curator greeting a visitor at an art gallery. Practice formal French introductions. Use 'vous'. Guide the student to say hello, give their name, and say 'Enchanté de vous rencontrer' (Nice to meet you)."
      }
    ]
  },
  // --- JAPANESE LESSONS ---
  {
    id: "ja-l1",
    unitId: "ja-unit-1",
    title: "Konnichiwa!",
    description: "Learn essential Japanese greetings and polite phrases.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: [
      "Say hello in Japanese",
      "Express gratitude with Arigatou",
      "Say goodbye"
    ],
    activities: [
      {
        id: "ja-l1-a1",
        type: "vocabulary_match",
        instruction: "Match the Japanese words with their English translations.",
        pairs: [
          { word: "こんにちは (konnichiwa)", translation: "hello" },
          { word: "ありがとう (arigatou)", translation: "thank you" },
          { word: "さようなら (sayounara)", translation: "goodbye" },
          { word: "はい (hai)", translation: "yes" }
        ]
      },
      {
        id: "ja-l1-a2",
        type: "multiple_choice",
        instruction: "Select the correct meaning of 'Konnichiwa'.",
        question: "What does 'Konnichiwa' mean?",
        options: ["Goodbye", "Thank you", "Hello", "Yes"],
        correctAnswer: "Hello",
        context: "Konnichiwa is the standard greeting used in the afternoon."
      }
    ]
  },
  // --- GERMAN LESSONS ---
  {
    id: "de-l1",
    unitId: "de-unit-1",
    title: "Hallo!",
    description: "Learn basic German greetings and politeness.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: [
      "Greet someone in German",
      "Say goodbye",
      "Say please and thank you"
    ],
    activities: [
      {
        id: "de-l1-a1",
        type: "vocabulary_match",
        instruction: "Match the German words with their English translations.",
        pairs: [
          { word: "Hallo", translation: "hello" },
          { word: "Tschüss", translation: "goodbye" },
          { word: "Danke", translation: "thank you" },
          { word: "Bitte", translation: "please" }
        ]
      },
      {
        id: "de-l1-a2",
        type: "multiple_choice",
        instruction: "Select the correct translation of 'thank you'.",
        question: "How do you say 'thank you' in German?",
        options: ["Bitte", "Danke", "Hallo", "Tschüss"],
        correctAnswer: "Danke",
        context: "Danke means thank you. You can say 'Danke schön' for thank you very much."
      }
    ]
  }
];

export const vocabulary: VocabularyWord[] = [
  // Spanish
  {
    id: "es-v1",
    languageId: "es",
    word: "hola",
    translation: "hello",
    partOfSpeech: "greeting",
    exampleSentence: "Hola, ¿cómo estás?",
    exampleTranslation: "Hello, how are you?"
  },
  {
    id: "es-v2",
    languageId: "es",
    word: "gracias",
    translation: "thank you",
    partOfSpeech: "expression",
    exampleSentence: "Muchas gracias por la comida.",
    exampleTranslation: "Thank you very much for the food."
  },
  {
    id: "es-v3",
    languageId: "es",
    word: "café",
    translation: "coffee",
    partOfSpeech: "noun",
    exampleSentence: "Quiero un café con leche.",
    exampleTranslation: "I want a coffee with milk."
  },
  // French
  {
    id: "fr-v1",
    languageId: "fr",
    word: "bonjour",
    translation: "hello / good morning",
    partOfSpeech: "greeting",
    exampleSentence: "Bonjour tout le monde !",
    exampleTranslation: "Good morning everyone!"
  },
  {
    id: "fr-v2",
    languageId: "fr",
    word: "merci",
    translation: "thank you",
    partOfSpeech: "expression",
    exampleSentence: "Merci pour votre aide.",
    exampleTranslation: "Thank you for your help."
  },
  // Japanese
  {
    id: "ja-v1",
    languageId: "ja",
    word: "こんにちは",
    translation: "hello",
    partOfSpeech: "greeting",
    exampleSentence: "こんにちは、お元気ですか？",
    exampleTranslation: "Hello, how are you?"
  },
  {
    id: "ja-v2",
    languageId: "ja",
    word: "ありがとう",
    translation: "thank you",
    partOfSpeech: "expression",
    exampleSentence: "手伝ってくれてありがとう。",
    exampleTranslation: "Thank you for helping me."
  },
  // German
  {
    id: "de-v1",
    languageId: "de",
    word: "Hallo",
    translation: "hello",
    partOfSpeech: "greeting",
    exampleSentence: "Hallo! Wie geht es dir?",
    exampleTranslation: "Hello! How are you?"
  },
  {
    id: "de-v2",
    languageId: "de",
    word: "Danke",
    translation: "thank you",
    partOfSpeech: "expression",
    exampleSentence: "Vielen Dank für das Geschenk.",
    exampleTranslation: "Thank you very much for the gift."
  }
];

export const phrases: Phrase[] = [
  // Spanish
  {
    id: "es-p1",
    languageId: "es",
    phrase: "¿Cómo te llamas?",
    translation: "What is your name?",
    context: "Greetings"
  },
  {
    id: "es-p2",
    languageId: "es",
    phrase: "Mucho gusto.",
    translation: "Nice to meet you.",
    context: "Greetings"
  },
  // French
  {
    id: "fr-p1",
    languageId: "fr",
    phrase: "Comment vous appelez-vous ?",
    translation: "What is your name? (formal)",
    context: "Greetings"
  },
  {
    id: "fr-p2",
    languageId: "fr",
    phrase: "S'il vous plaît.",
    translation: "Please. (formal)",
    context: "Polite Request"
  },
  // Japanese
  {
    id: "ja-p1",
    languageId: "ja",
    phrase: "お元気ですか？ (o-genki desu ka)",
    translation: "How are you?",
    context: "Greetings"
  },
  {
    id: "ja-p2",
    languageId: "ja",
    phrase: "はじめまして (hajimemashite)",
    translation: "Nice to meet you (for the first time)",
    context: "Greetings"
  },
  // German
  {
    id: "de-p1",
    languageId: "de",
    phrase: "Wie geht es Ihnen?",
    translation: "How are you? (formal)",
    context: "Greetings"
  },
  {
    id: "de-p2",
    languageId: "de",
    phrase: "Es freut mich, Sie kennenzulernen.",
    translation: "Nice to meet you.",
    context: "Greetings"
  }
];
