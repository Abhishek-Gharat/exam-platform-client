import React from 'react';
import { QUESTION_TYPES } from '../../constants/questionTypes';
import MCQQuestion from './MCQQuestion';
import ExplainMeQuestion from './ExplainMeQuestion';
import CodeQuestion from './CodeQuestion';

const QuestionRenderer = ({ question, answer, onAnswerChange }) => {
  if (!question) return null;
  switch (question.type) {
    case QUESTION_TYPES.MCQ:
      return (
        <MCQQuestion
          question={question}
          selectedOption={answer?.selectedOption ?? null}
          onSelect={opt => onAnswerChange(question.id, { selectedOption: opt })}
        />
      );
    case QUESTION_TYPES.EXPLAIN_ME:
      return (
        <ExplainMeQuestion
          question={question}
          answer={answer?.writtenAnswer || ''}
          onChange={text => onAnswerChange(question.id, { writtenAnswer: text })}
        />
      );
    case QUESTION_TYPES.WRITE_CODE:
      return (
        <CodeQuestion
          question={question}
          selectedOption={answer?.selectedOption ?? null}
          onSelect={opt => onAnswerChange(question.id, { selectedOption: opt })}
        />
      );
    default:
      return <div className="text-center py-8 text-gray-500">Unknown question type</div>;
  }
};

export default QuestionRenderer;