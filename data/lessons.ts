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
  {
    id: "es-l5",
    unitId: "es-unit-1",
    title: "Travel & Directions",
    description: "Ask for directions and find your way around a Spanish city like a local.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: [
      "Ask where places are located",
      "Understand left, right, and straight",
      "Use polite expressions while traveling",
    ],
    activities: [
      {
        id: "es-l5-a1",
        type: "vocabulary_match",
        instruction: "Match the Spanish direction words with their English translations.",
        pairs: [
          { word: "izquierda", translation: "left" },
          { word: "derecha", translation: "right" },
          { word: "recto", translation: "straight" },
          { word: "estación", translation: "station" },
        ],
      },
    ],
  },
  {
    id: "es-l6",
    unitId: "es-unit-1",
    title: "Shopping",
    description: "Shop for clothes, ask for sizes, and bargain politely in Spanish markets.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Ask for prices", "Talk about clothing items", "Use numbers up to 100"],
    activities: [
      {
        id: "es-l6-a1",
        type: "vocabulary_match",
        instruction: "Match Spanish shopping words with their English translations.",
        pairs: [
          { word: "ropa", translation: "clothes" },
          { word: "talla", translation: "size" },
          { word: "precio", translation: "price" },
          { word: "barato", translation: "cheap" },
        ],
      },
    ],
  },

  {
    id: "fr-l3",
    unitId: "fr-unit-1",
    title: "Daily Life",
    description: "Talk about days, time, and routines in French.",
    type: "vocabulary",
    xp: 12,
    order: 3,
    goals: ["Say days of the week", "Use simple time expressions"],
    activities: [
      {
        id: "fr-l3-a1",
        type: "vocabulary_match",
        instruction: "Match French words with their English translations.",
        pairs: [
          { word: "lundi", translation: "monday" },
          { word: "matin", translation: "morning" },
          { word: "soir", translation: "evening" },
          { word: "aujourd'hui", translation: "today" },
        ],
      },
    ],
  },
  {
    id: "fr-l4",
    unitId: "fr-unit-1",
    title: "At the Café",
    description: "Order a croissant and café au lait like a Parisian.",
    type: "audio",
    xp: 15,
    order: 4,
    goals: ["Order food and drinks", "Be polite at the counter"],
    activities: [
      {
        id: "fr-l4-a1",
        type: "vocabulary_match",
        instruction: "Match French café words with their English translations.",
        pairs: [
          { word: "café", translation: "coffee" },
          { word: "croissant", translation: "croissant" },
          { word: "addition", translation: "bill" },
          { word: "s'il vous plaît", translation: "please" },
        ],
      },
    ],
  },
  {
    id: "fr-l5",
    unitId: "fr-unit-1",
    title: "Travel & Directions",
    description: "Find your way around Paris and ask for directions.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: ["Ask where places are", "Know left, right, straight"],
    activities: [
      {
        id: "fr-l5-a1",
        type: "vocabulary_match",
        instruction: "Match French direction words with their English translations.",
        pairs: [
          { word: "gauche", translation: "left" },
          { word: "droite", translation: "right" },
          { word: "tout droit", translation: "straight ahead" },
          { word: "gare", translation: "train station" },
        ],
      },
    ],
  },
  {
    id: "fr-l6",
    unitId: "fr-unit-1",
    title: "Shopping",
    description: "Shop in Paris and talk about prices and sizes in French.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Ask for prices", "Talk about clothing"],
    activities: [
      {
        id: "fr-l6-a1",
        type: "vocabulary_match",
        instruction: "Match French shopping words with their English translations.",
        pairs: [
          { word: "vêtements", translation: "clothes" },
          { word: "taille", translation: "size" },
          { word: "prix", translation: "price" },
          { word: "cher", translation: "expensive" },
        ],
      },
    ],
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
  {
    id: "ja-l2",
    unitId: "ja-unit-1",
    title: "Daily Life",
    description: "Talk about your day, time, and routine in Japanese.",
    type: "vocabulary",
    xp: 12,
    order: 2,
    goals: ["Say morning, afternoon, evening", "Use simple time expressions"],
    activities: [
      {
        id: "ja-l2-a1",
        type: "vocabulary_match",
        instruction: "Match the Japanese words with their English translations.",
        pairs: [
          { word: "朝 (asa)", translation: "morning" },
          { word: "昼 (hiru)", translation: "noon" },
          { word: "夜 (yoru)", translation: "night" },
          { word: "今日 (kyou)", translation: "today" },
        ],
      },
    ],
  },
  {
    id: "ja-l3",
    unitId: "ja-unit-1",
    title: "At the Café",
    description: "Order a matcha, ask for the menu, and pay in Japanese.",
    type: "audio",
    xp: 15,
    order: 3,
    goals: ["Order food politely", "Ask for the bill"],
    activities: [
      {
        id: "ja-l3-a1",
        type: "vocabulary_match",
        instruction: "Match Japanese café words with English translations.",
        pairs: [
          { word: "メニュー (menyuu)", translation: "menu" },
          { word: "お茶 (ocha)", translation: "tea" },
          { word: "水 (mizu)", translation: "water" },
          { word: "ください (kudasai)", translation: "please give me" },
        ],
      },
    ],
  },
  {
    id: "ja-l4",
    unitId: "ja-unit-1",
    title: "Travel & Directions",
    description: "Navigate Tokyo with confidence by asking where things are.",
    type: "vocabulary",
    xp: 15,
    order: 4,
    goals: ["Ask for directions", "Recognize key place names"],
    activities: [
      {
        id: "ja-l4-a1",
        type: "vocabulary_match",
        instruction: "Match Japanese direction words with English translations.",
        pairs: [
          { word: "駅 (eki)", translation: "station" },
          { word: "右 (migi)", translation: "right" },
          { word: "左 (hidari)", translation: "left" },
          { word: "まっすぐ (massugu)", translation: "straight" },
        ],
      },
    ],
  },
  {
    id: "ja-l5",
    unitId: "ja-unit-1",
    title: "Shopping",
    description: "Shop in Japan and ask how much things cost.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: ["Ask for prices", "Use numbers"],
    activities: [
      {
        id: "ja-l5-a1",
        type: "vocabulary_match",
        instruction: "Match Japanese shopping words with their English translations.",
        pairs: [
          { word: "いくら (ikura)", translation: "how much" },
          { word: "円 (en)", translation: "yen" },
          { word: "高い (takai)", translation: "expensive" },
          { word: "安い (yasui)", translation: "cheap" },
        ],
      },
    ],
  },
  {
    id: "ja-l6",
    unitId: "ja-unit-1",
    title: "Family & Friends",
    description: "Introduce your family and friends in Japanese.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Talk about family", "Introduce others"],
    activities: [
      {
        id: "ja-l6-a1",
        type: "vocabulary_match",
        instruction: "Match Japanese family words with English translations.",
        pairs: [
          { word: "家族 (kazoku)", translation: "family" },
          { word: "お母さん (okaasan)", translation: "mother" },
          { word: "お父さん (otousan)", translation: "father" },
          { word: "友達 (tomodachi)", translation: "friend" },
        ],
      },
    ],
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
  },
  {
    id: "de-l2",
    unitId: "de-unit-1",
    title: "Daily Life",
    description: "Talk about days, time, and routines in German.",
    type: "vocabulary",
    xp: 12,
    order: 2,
    goals: ["Say days of the week", "Use simple time expressions"],
    activities: [
      {
        id: "de-l2-a1",
        type: "vocabulary_match",
        instruction: "Match German words with their English translations.",
        pairs: [
          { word: "Montag", translation: "monday" },
          { word: "Morgen", translation: "morning" },
          { word: "Abend", translation: "evening" },
          { word: "heute", translation: "today" },
        ],
      },
    ],
  },
  {
    id: "de-l3",
    unitId: "de-unit-1",
    title: "At the Café",
    description: "Order coffee and pastries in a German café.",
    type: "audio",
    xp: 15,
    order: 3,
    goals: ["Order food", "Ask for the bill"],
    activities: [
      {
        id: "de-l3-a1",
        type: "vocabulary_match",
        instruction: "Match German café words with their English translations.",
        pairs: [
          { word: "Kaffee", translation: "coffee" },
          { word: "Kuchen", translation: "cake" },
          { word: "Rechnung", translation: "bill" },
          { word: "bitte", translation: "please" },
        ],
      },
    ],
  },
  {
    id: "de-l4",
    unitId: "de-unit-1",
    title: "Travel & Directions",
    description: "Find your way around Berlin and ask for directions.",
    type: "vocabulary",
    xp: 15,
    order: 4,
    goals: ["Ask for directions", "Know key direction words"],
    activities: [
      {
        id: "de-l4-a1",
        type: "vocabulary_match",
        instruction: "Match German direction words with their English translations.",
        pairs: [
          { word: "links", translation: "left" },
          { word: "rechts", translation: "right" },
          { word: "geradeaus", translation: "straight ahead" },
          { word: "Bahnhof", translation: "train station" },
        ],
      },
    ],
  },
  {
    id: "de-l5",
    unitId: "de-unit-1",
    title: "Shopping",
    description: "Shop in Germany and talk about prices and sizes.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: ["Ask for prices", "Talk about clothing"],
    activities: [
      {
        id: "de-l5-a1",
        type: "vocabulary_match",
        instruction: "Match German shopping words with their English translations.",
        pairs: [
          { word: "Kleidung", translation: "clothes" },
          { word: "Größe", translation: "size" },
          { word: "Preis", translation: "price" },
          { word: "teuer", translation: "expensive" },
        ],
      },
    ],
  },
  {
    id: "de-l6",
    unitId: "de-unit-1",
    title: "Family & Friends",
    description: "Introduce your family and friends in German.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Talk about family", "Introduce others"],
    activities: [
      {
        id: "de-l6-a1",
        type: "vocabulary_match",
        instruction: "Match German family words with their English translations.",
        pairs: [
          { word: "Familie", translation: "family" },
          { word: "Mutter", translation: "mother" },
          { word: "Vater", translation: "father" },
          { word: "Freund", translation: "friend" },
        ],
      },
    ],
  },

  // --- KOREAN LESSONS ---
  {
    id: "ko-l1",
    unitId: "ko-unit-1",
    title: "Annyeong!",
    description: "Learn basic Korean greetings and polite expressions.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: ["Greet someone in Korean", "Say thank you", "Say goodbye"],
    activities: [
      {
        id: "ko-l1-a1",
        type: "vocabulary_match",
        instruction: "Match Korean words with their English translations.",
        pairs: [
          { word: "안녕하세요 (annyeonghaseyo)", translation: "hello" },
          { word: "감사합니다 (gamsahamnida)", translation: "thank you" },
          { word: "안녕히 가세요 (annyeonghi gaseyo)", translation: "goodbye" },
          { word: "네 (ne)", translation: "yes" },
        ],
      },
    ],
  },
  {
    id: "ko-l2",
    unitId: "ko-unit-1",
    title: "Daily Life",
    description: "Talk about days, time, and routines in Korean.",
    type: "vocabulary",
    xp: 12,
    order: 2,
    goals: ["Say days of the week", "Use simple time expressions"],
    activities: [
      {
        id: "ko-l2-a1",
        type: "vocabulary_match",
        instruction: "Match Korean words with their English translations.",
        pairs: [
          { word: "오늘 (oneul)", translation: "today" },
          { word: "아침 (achim)", translation: "morning" },
          { word: "저녁 (jeonyeok)", translation: "evening" },
          { word: "내일 (naeil)", translation: "tomorrow" },
        ],
      },
    ],
  },
  {
    id: "ko-l3",
    unitId: "ko-unit-1",
    title: "At the Café",
    description: "Order coffee and snacks at a Korean café.",
    type: "audio",
    xp: 15,
    order: 3,
    goals: ["Order food", "Use polite expressions"],
    activities: [
      {
        id: "ko-l3-a1",
        type: "vocabulary_match",
        instruction: "Match Korean café words with their English translations.",
        pairs: [
          { word: "커피 (keopi)", translation: "coffee" },
          { word: "물 (mul)", translation: "water" },
          { word: "메뉴 (menyu)", translation: "menu" },
          { word: "주세요 (juseyo)", translation: "please give me" },
        ],
      },
    ],
  },
  {
    id: "ko-l4",
    unitId: "ko-unit-1",
    title: "Travel & Directions",
    description: "Navigate Seoul and ask for directions in Korean.",
    type: "vocabulary",
    xp: 15,
    order: 4,
    goals: ["Ask for directions", "Know key direction words"],
    activities: [
      {
        id: "ko-l4-a1",
        type: "vocabulary_match",
        instruction: "Match Korean direction words with their English translations.",
        pairs: [
          { word: "왼쪽 (oenjjok)", translation: "left" },
          { word: "오른쪽 (oreunjjok)", translation: "right" },
          { word: "직진 (jikjin)", translation: "straight" },
          { word: "역 (yeok)", translation: "station" },
        ],
      },
    ],
  },
  {
    id: "ko-l5",
    unitId: "ko-unit-1",
    title: "Shopping",
    description: "Shop in Korea and ask how much things cost.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: ["Ask for prices", "Use numbers"],
    activities: [
      {
        id: "ko-l5-a1",
        type: "vocabulary_match",
        instruction: "Match Korean shopping words with their English translations.",
        pairs: [
          { word: "얼마 (eolma)", translation: "how much" },
          { word: "원 (won)", translation: "won (currency)" },
          { word: "비싸요 (bissayo)", translation: "expensive" },
          { word: "싸요 (ssayo)", translation: "cheap" },
        ],
      },
    ],
  },
  {
    id: "ko-l6",
    unitId: "ko-unit-1",
    title: "Family & Friends",
    description: "Introduce your family and friends in Korean.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Talk about family", "Introduce others"],
    activities: [
      {
        id: "ko-l6-a1",
        type: "vocabulary_match",
        instruction: "Match Korean family words with their English translations.",
        pairs: [
          { word: "가족 (gajok)", translation: "family" },
          { word: "어머니 (eomeoni)", translation: "mother" },
          { word: "아버지 (abeoji)", translation: "father" },
          { word: "친구 (chingu)", translation: "friend" },
        ],
      },
    ],
  },

  // --- CHINESE LESSONS ---
  {
    id: "zh-l1",
    unitId: "zh-unit-1",
    title: "Nǐ hǎo!",
    description: "Learn basic Chinese (Mandarin) greetings and politeness.",
    type: "vocabulary",
    xp: 10,
    order: 1,
    goals: ["Greet in Chinese", "Say thank you", "Say goodbye"],
    activities: [
      {
        id: "zh-l1-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese words with their English translations.",
        pairs: [
          { word: "你好 (nǐ hǎo)", translation: "hello" },
          { word: "谢谢 (xièxie)", translation: "thank you" },
          { word: "再见 (zàijiàn)", translation: "goodbye" },
          { word: "是 (shì)", translation: "yes / is" },
        ],
      },
    ],
  },
  {
    id: "zh-l2",
    unitId: "zh-unit-1",
    title: "Daily Life",
    description: "Talk about your day, time, and routines in Chinese.",
    type: "vocabulary",
    xp: 12,
    order: 2,
    goals: ["Say days and times", "Use basic verbs"],
    activities: [
      {
        id: "zh-l2-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese words with their English translations.",
        pairs: [
          { word: "今天 (jīntiān)", translation: "today" },
          { word: "早上 (zǎoshang)", translation: "morning" },
          { word: "晚上 (wǎnshang)", translation: "evening" },
          { word: "明天 (míngtiān)", translation: "tomorrow" },
        ],
      },
    ],
  },
  {
    id: "zh-l3",
    unitId: "zh-unit-1",
    title: "At the Café",
    description: "Order tea and snacks at a Chinese café.",
    type: "audio",
    xp: 15,
    order: 3,
    goals: ["Order drinks", "Use polite expressions"],
    activities: [
      {
        id: "zh-l3-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese café words with their English translations.",
        pairs: [
          { word: "茶 (chá)", translation: "tea" },
          { word: "咖啡 (kāfēi)", translation: "coffee" },
          { word: "水 (shuǐ)", translation: "water" },
          { word: "请 (qǐng)", translation: "please" },
        ],
      },
    ],
  },
  {
    id: "zh-l4",
    unitId: "zh-unit-1",
    title: "Travel & Directions",
    description: "Get around Beijing and ask for directions in Mandarin.",
    type: "vocabulary",
    xp: 15,
    order: 4,
    goals: ["Ask for directions", "Know key direction words"],
    activities: [
      {
        id: "zh-l4-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese direction words with their English translations.",
        pairs: [
          { word: "左 (zuǒ)", translation: "left" },
          { word: "右 (yòu)", translation: "right" },
          { word: "直走 (zhí zǒu)", translation: "go straight" },
          { word: "车站 (chēzhàn)", translation: "station" },
        ],
      },
    ],
  },
  {
    id: "zh-l5",
    unitId: "zh-unit-1",
    title: "Shopping",
    description: "Shop in China and ask how much things cost.",
    type: "vocabulary",
    xp: 15,
    order: 5,
    goals: ["Ask for prices", "Use numbers"],
    activities: [
      {
        id: "zh-l5-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese shopping words with their English translations.",
        pairs: [
          { word: "多少钱 (duōshǎo qián)", translation: "how much" },
          { word: "元 (yuán)", translation: "yuan (currency)" },
          { word: "贵 (guì)", translation: "expensive" },
          { word: "便宜 (piányi)", translation: "cheap" },
        ],
      },
    ],
  },
  {
    id: "zh-l6",
    unitId: "zh-unit-1",
    title: "Family & Friends",
    description: "Introduce your family and friends in Chinese.",
    type: "vocabulary",
    xp: 15,
    order: 6,
    goals: ["Talk about family", "Introduce others"],
    activities: [
      {
        id: "zh-l6-a1",
        type: "vocabulary_match",
        instruction: "Match Chinese family words with their English translations.",
        pairs: [
          { word: "家人 (jiārén)", translation: "family" },
          { word: "妈妈 (māma)", translation: "mother" },
          { word: "爸爸 (bàba)", translation: "father" },
          { word: "朋友 (péngyǒu)", translation: "friend" },
        ],
      },
    ],
  },
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
