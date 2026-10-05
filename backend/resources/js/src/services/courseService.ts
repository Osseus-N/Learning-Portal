import type { CourseDocument, QuizDocument } from "../types";

const fundamentalsQuiz: QuizDocument = {
  id: "functions-check",
  title: "Functions quick check",
  questions: [
    {
      id: "entry-point",
      type: "multiple-choice",
      prompt: "Which function is the standard entry point of a C program?",
      options: ["printf()", "main()", "return()", "include()"],
      answer: 1,
      explanation: "Execution of a hosted C program starts in main().",
    },
    {
      id: "return-types",
      type: "multi-select",
      prompt: "Which are valid return types for a function that returns no value?",
      options: ["void", "int", "float", "char"],
      answers: [0],
      explanation: "Use void when a function does not return a value.",
    },
    {
      id: "sum-output",
      type: "code-output",
      prompt: "What does this program print?",
      code: "int add(int a, int b) { return a + b; }\nprintf(\"%d\", add(3, 5));",
      options: ["8", "35", "3", "Compilation error"],
      answer: 0,
      explanation: "The add function returns 3 + 5, so printf displays 8.",
    },
    {
      id: "return-keyword",
      type: "fill-blank",
      prompt: "Complete the function so it sends its result back to the caller.",
      codeBefore: "int doubleValue(int value) {\n  ",
      codeAfter: " value * 2;\n}",
      answer: "return",
      explanation: "The return statement passes the expression result to the caller.",
    },
  ],
};

const documents: CourseDocument[] = [
  {
    id: "c-fundamentals",
    title: "C Programming Fundamentals",
    description: "Variables, types, decisions, loops, and functions in approachable lessons.",
    difficulty: "Beginner",
    duration: "10 lessons · ~4 hours",
    tags: ["C", "Functions", "Beginner"],
    lessons: [
      {
        id: "functions",
        title: "Functions and return values",
        durationMinutes: 12,
        summary: "Write reusable functions, pass parameters, and return values.",
        content: [
          "A C function groups a task into a named, reusable block of code. A function can receive values through parameters and send a result back with return.",
          "Declare the return type before the function name. Use void when a function does not return a value.",
        ],
        code: "#include <stdio.h>\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main(void) {\n  printf(\"Sum: %d\\\\n\", add(3, 5));\n  return 0;\n}",
        quiz: fundamentalsQuiz,
      },
      {
        id: "loops",
        title: "Loops and conditions",
        durationMinutes: 16,
        summary: "Repeat work with for and while loops and make decisions with if.",
        content: [
          "Loops repeat a block of code while a condition remains true.",
          "Use a for loop when the number of iterations is known, and while when the loop depends on a condition.",
        ],
      },
      { id: "variables", title: "Variables and data types", durationMinutes: 14, summary: "Store values using C's built-in data types.", content: ["Variables reserve a named place in memory. Every variable has a type that determines which values it can store."] },
      { id: "input-output", title: "Input and output", durationMinutes: 13, summary: "Read and display formatted values.", content: ["Use printf to display formatted output and scanf to read values into variables."] },
      { id: "arrays", title: "Working with arrays", durationMinutes: 17, summary: "Store collections of values in a fixed-size sequence.", content: ["An array stores multiple values of the same type. Its first element has index zero."] },
      { id: "strings", title: "Strings in C", durationMinutes: 18, summary: "Represent and work with null-terminated character arrays.", content: ["C strings are character arrays ending with the null character, written as '\\0'."] },
      { id: "pointers-intro", title: "Pointer basics", durationMinutes: 19, summary: "Explore addresses and pointer variables.", content: ["A pointer stores the address of another object. Use & to get an address and * to access the pointed-to value."] },
      { id: "structs", title: "Group data with structs", durationMinutes: 16, summary: "Create compound types for related values.", content: ["A struct groups fields of related information under one type."] },
      { id: "files", title: "File input and output", durationMinutes: 20, summary: "Read and write simple files.", content: ["The standard I/O library provides FILE streams and functions for file operations."] },
      { id: "wrap-up", title: "Put it together", durationMinutes: 15, summary: "Review core C concepts in a small program.", content: ["Combine functions, arrays, and control flow to build a small, testable program."] },
    ],
  },
  {
    id: "c-arrays",
    title: "Arrays and Data Structures in C",
    description: "Work with arrays, strings, structs, and practical data organization.",
    difficulty: "Intermediate",
    duration: "12 lessons · ~5 hours",
    tags: ["C", "Arrays", "Data structures"],
    lessons: Array.from({ length: 12 }, (_, index) => ({
      id: `array-${index + 1}`,
      title: ["Array fundamentals", "Indexing and iteration", "Multidimensional arrays", "Character arrays", "C strings", "String functions", "Structures", "Nested structures", "Unions", "Enumerations", "Data layout", "Practice project"][index],
      durationMinutes: 20,
      summary: "Learn a data organization technique with short explanations and practice.",
      content: ["This lesson introduces a focused C data organization concept and lets you apply it in code."],
    })),
  },
  {
    id: "c-pointers",
    title: "Pointers and Memory in C",
    description: "Understand pointers, addresses, dynamic memory, and safe cleanup.",
    difficulty: "Advanced",
    duration: "8 lessons · ~3 hours",
    tags: ["C", "Pointers", "Memory"],
    lessons: Array.from({ length: 8 }, (_, index) => ({
      id: `memory-${index + 1}`,
      title: ["Addresses and pointers", "Pointer arithmetic", "Arrays and pointers", "Pointers to functions", "Dynamic allocation", "Working with the heap", "Memory safety", "Practice project"][index],
      durationMinutes: 22,
      summary: "Understand memory and apply a safe pointer technique.",
      content: ["This lesson explains a core C memory concept and provides examples to reason about safely."],
    })),
  },
];

export interface CourseService {
  listCourses(): Promise<CourseDocument[]>;
  getCourse(courseId: string): Promise<CourseDocument | null>;
}

export const courseService: CourseService = {
  async listCourses() {
    return structuredClone(documents);
  },
  async getCourse(courseId) {
    return structuredClone(documents.find((course) => course.id === courseId) ?? null);
  },
};
