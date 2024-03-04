import { QuestionTypeEnum } from "../enums/question-type.enum";

export interface Question {
  question: string;
  questionType: QuestionTypeEnum;
  agree?: boolean;
  subsection: string;
  subsectionTitle: string;
  subsectionIntent: string;
  subsectionMetric: string;
  subsectionDescription: string;

}
