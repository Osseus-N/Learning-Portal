import { useState } from "react";
import type { QuizDocument, QuizQuestion } from "../types";
import { Badge, Card } from "./UI";

type Answer = number | number[] | string;

function isCorrect(question: QuizQuestion, answer: Answer | undefined): boolean {
  if (answer === undefined) return false;
  switch (question.type) {
    case "multiple-choice":
    case "code-output":
      return answer === question.answer;
    case "multi-select":
      return Array.isArray(answer) && [...answer].sort().join(",") === [...question.answers].sort().join(",");
    case "fill-blank":
      return typeof answer === "string" && answer.trim().toLowerCase() === question.answer.toLowerCase();
  }
}

export function QuizPlayer({ quiz, onComplete }: { quiz: QuizDocument; onComplete?: () => void }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [complete, setComplete] = useState(false);
  const score = quiz.questions.filter((question) => isCorrect(question, answers[question.id])).length;

  function checkQuiz() {
    const results = Object.fromEntries(quiz.questions.map((question) => [question.id, true]));
    setChecked(results);
    setComplete(true);
    if (score === quiz.questions.length) onComplete?.();
  }

  function select(questionId: string, value: Answer) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setChecked((current) => ({ ...current, [questionId]: false }));
    setComplete(false);
  }

  function renderOptions(question: Extract<QuizQuestion, { options: string[] }>, multiple = false) {
    const current = answers[question.id];
    return (
      <div className="choice-list">
        {question.options.map((option, index) => {
          const selected = multiple ? Array.isArray(current) && current.includes(index) : current === index;
          return (
            <label className={`choice${selected ? " selected" : ""}`} key={option}>
              <input
                type={multiple ? "checkbox" : "radio"}
                name={question.id}
                checked={selected}
                onChange={() => {
                  if (multiple) {
                    const values = Array.isArray(current) ? current : [];
                    select(question.id, selected ? values.filter((item) => item !== index) : [...values, index]);
                  } else select(question.id, index);
                }}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    );
  }

  function renderQuestion(question: QuizQuestion, index: number) {
    const result = isCorrect(question, answers[question.id]);
    const showResult = Boolean(checked[question.id]);
    return (
      <fieldset className="quiz-question" key={question.id}>
        <legend><span className="question-number">{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
        {question.type === "multiple-choice" && renderOptions(question)}
        {question.type === "multi-select" && <>{renderOptions(question, true)}<p className="small muted">Select all that apply.</p></>}
        {question.type === "code-output" && <><pre className="quiz-code"><code>{question.code}</code></pre>{renderOptions(question)}</>}
        {question.type === "fill-blank" && (
          <div className="fill-code">
            <code>{question.codeBefore}</code>
            <label className="sr-only" htmlFor={`answer-${question.id}`}>Your missing C keyword</label>
            <input id={`answer-${question.id}`} value={typeof answers[question.id] === "string" ? String(answers[question.id]) : ""} onChange={(event) => select(question.id, event.target.value)} placeholder="type keyword" />
            <code>{question.codeAfter}</code>
          </div>
        )}
        {showResult && <div className={`quiz-feedback ${result ? "correct" : "incorrect"}`} role="status">
          <strong>{result ? "Correct" : "Not quite"}</strong> · {question.explanation}
        </div>}
      </fieldset>
    );
  }

  return (
    <Card className="quiz-card">
      <div className="section-head">
        <div><p className="section-eyebrow">INTERACTIVE CHECK</p><h2>{quiz.title}</h2></div>
        <Badge tone="info">{quiz.questions.length} questions</Badge>
      </div>
      {quiz.questions.map(renderQuestion)}
      <div className="row between quiz-footer">
        <span className="small muted">{complete ? `Score: ${score} / ${quiz.questions.length}` : "Answer each question, then check your work."}</span>
        <button className="btn btn-primary" type="button" onClick={checkQuiz} disabled={quiz.questions.some((question) => answers[question.id] === undefined || answers[question.id] === "")}>Check answers</button>
      </div>
      {complete && score === quiz.questions.length && <p className="inline-alert alert-success mt" role="status">Quiz passed. Great work!</p>}
    </Card>
  );
}
