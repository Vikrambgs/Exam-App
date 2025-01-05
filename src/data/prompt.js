const prompt = `
**Task**: Generate a JSON array of multiple-choice questions (MCQs) adhering to the specified format and guidelines. Each question is represented as an object within an array.

---

### **General Guidelines**:

1. **Structure**:
   - Each question must have a unique \`id\` (e.g., \`"Q1"\`, \`"Q2"\`, etc.).
   - The \`parts\` field contains the question text or a mix of text and special structures (e.g., matching lists, pre-options). 
     - For \`parts\`, multiple text segments may be included, but only one special structure (e.g., \`pre_o\` or \`match\`) is allowed per question.
   - The \`o\` field contains the answer options in an array.
   - The \`a\` field holds the zero-based index of the correct answer within \`o\`.

2. **Shuffling**:
   - Randomize the order of answer options (\`o\`) for each question.
   - For **matching questions**, shuffle \`list1\` and \`list2\` independently. Avoid repetitive patterns like \`(A)→(1), (B)→(2), (C)→(3), (D)→(4)\` unless it happens by chance.

3. **Question Types**:
   - **Type 1 (Simple Questions)**: Standard text-based questions with options (50-60% of the total).
   - **Type 2 (Pre-Options)**: Questions with a \`pre_o\` structure, where a set of preliminary options is provided before the main question.
   - **Type 3 (Matching)**: Questions featuring two lists (\`list1\` and \`list2\`) for matching items. Lists should have 4-6 items, with a preference for 4-5 items.

4. **Content Guidelines**:
   - Maintain conceptual depth while ensuring simplicity.
   - Cover a wide range of relevant topics unless the user specifies a focus area.
   - Incorporate diverse question types to maintain variety.
   - Include **case-based questions** related to real-life scenarios (4-5 questions out of every 50).

5. **Formatting**:
   - Adhere strictly to the JSON format for all outputs.
   - Follow the specific structures for each question type as shown in the examples below.

---

### **Question Types and Examples**:

#### **Type 1: Simple Question**
\`\`\`json
{
  "id": "Q1",
  "parts": ["What is the capital of France?"],
  "o": ["Berlin", "Paris", "Madrid", "Rome"],
  "a": 1
}
\`\`\`

#### **Type 2: Pre-Options**
\`\`\`json
{
  "id": "Q2",
  "parts": [
    "Which of the following statements are correct?",
    { "pre_o": ["Option A: The sky is blue.", "Option B: The grass is green.", "Option C: Water is dry.", "Option D: Fire is cold."] }
  ],
  "o": ["Only A and B", "Only C", "All of the above", "Only A"],
  "a": 0
}
\`\`\`

#### **Type 3: Matching**
\`\`\`json
{
  "id": "Q3",
  "parts": [
    "Match the following:",
    {
      "match": {
        "list1": ["Paris", "Berlin", "Madrid", "Rome"],
        "list2": ["France", "Germany", "Spain", "Italy"]
      }
    }
  ],
  "o": [
    "(A)→(I) (B)→(II) (C)→(III) (D)→(IV)",
    "(A)→(IV) (B)→(III) (C)→(I) (D)→(II)",
    "(A)→(II) (B)→(I) (C)→(IV) (D)→(III)",
    "(A)→(III) (B)→(IV) (C)→(II) (D)→(I)"
  ],
  "a": 0
}
\`\`\`

---

### **Output Specifications**:
1. Generate a JSON array of **No. of question provided by user** distributed across all types.
   - **Type 1 (Simple Questions)**: 50%-60% of total questions.
   - **Type 2 (Pre-Options)**: 20%-30% of total questions.
   - **Type 3 (Matching Questions)**: 15%-20% questions.
   - Include **5%-10% case-based questions** spread across the three types.

2. Ensure high-quality, exam-oriented questions. If unable to generate all 50 in one response, continue from the next request.

3. Maintain variety in topics, question structure, and answer patterns.

Generate total of 50 question from given content or pdf.
`;


export default prompt;
