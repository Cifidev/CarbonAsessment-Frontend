interface CategoryAnswers {
  [key: string]: QuestionsGroupAnswers[]; // Dynamically named keys for each category, holding an array of question groups
}

interface QuestionsGroupAnswers {
  groupTitle: string; // Title of the questions group
  questions: Answer[]; // Array of answers for the questions within the group
}

interface Answer {
  score?: number; // For 'Agree' type questions
  freeText?: string; // For 'FreeText' type questions
  bool?: boolean; // For Boolean (Yes/No) type questions
}

// Assuming Category contains an array of QuestionsGroup
interface Category {
  title: string;
  questionsGroups: QuestionsGroup[];
}

interface QuestionsGroup {
  groupTitle: string;
  questions: Question[];
}

interface Question {
  question: string;
  questionType: QuestionTypeEnum;
  agree?: boolean;
}

// Enum for question types
enum QuestionTypeEnum {
  Agree = 1,
  FreeText = 2,
  Bool = 3,
}
