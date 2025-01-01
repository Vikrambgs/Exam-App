

---

**Prompt to Generate JSON-Formatted MCQ Questions**

Your task is to create multiple-choice questions (MCQs) in JSON format. Each question should be represented as an object, and all questions should be stored within an array. The JSON structure must follow one or more of the formats outlined below.

### General Guidelines
1. Each question must have a **unique ID** represented as `"id"` (e.g., "Q1").
2. The `"parts"` field contains the main body of the question. It may include plain text, a mix of text and special structures (e.g., pre-options or matching lists), or a combination of both.
3. The `"o"` field (options) contains an array of possible answers.
4. The `"a"` field (answer) represents the index (zero-based) of the correct option in the `"o"` array.
5. Ensure that the **option order is shuffled** for every question. The correct answer must not consistently appear in the same position (e.g., always at index 0).
6. For **matching questions**, shuffle the pairs in `"list1"` and `"list2"` to ensure variety.
7. Always try to cover **all concepts** relevant to the given context or book content.
8. Include diverse question types (e.g., simple, matching, and pre-options) to comprehensively test the learner's understanding.

### Supported Formats
Here are examples of the structures you can use:

#### **Type 1: Simple Questions**
- Contains a plain text question and multiple answer choices.
```json
{
    "id": "Q1",
    "parts": [
        "The Supreme Court envisaged in the Constitution of India in 1950 included:"
    ],
    "o": [
        "One Chief Justice and 7 Judges",
        "One Chief Justice and 11 Judges",
        "One Chief Justice and 15 Judges",
        "One Chief Justice and 30 Judges"
    ],
    "a": 0
}
```

#### **Type 2: Pre-Options Embedded**
- Includes a special `"pre_o"` structure inside the `"parts"` for intermediate or dependent sub-options.
```json
{
    "id": "Q24",
    "parts": [
        "Law aspirants appear for different entrance exams to get admission in law colleges. Which of the following combinations is the National Law Academy correctly denotes the entrance examination for admission to universities (NLUs)?",
        {
            "pre_o": [
                "Common Law Admission Test (CLAT)",
                "Law School Admission Test (LSAT)",
                "All India Law Entrance Test (AILET)",
                "All India Bar Examination (AIBE)"
            ]
        },
        "Choose the correct answer from the options given below."
    ],
    "o": [
        "Only A",
        "A and C Only",
        "Only C",
        "A, B, C and D"
    ],
    "a": 1
}
```

#### **Type 3: Matching Lists**
- Includes a `"match"` object with `"list1"` and `"list2"` for matching questions.
```json
{
    "id": "Q31",
    "parts": [
        "Match List-I with List-II",
        {
            "match": {
                "list1": [
                    "Poison declaration and action program",
                    "United Nations Commission on International Trade Law",
                    "International Convention on Civil and Political Rights",
                    "General Agreement on Trade and Services"
                ],
                "list2": [
                    "Provided a framework for domestic laws on intervention",
                    "United Nations High Commission for Human Rights",
                    "Liberalisation of Legal Services",
                    "Free legal aid and access to justice"
                ]
            }
        },
        "Choose the correct answer from the options given below."
    ],
    "o": [
        "(A) (I), (B) (IV), (C) (III), (D) (II)",
        "(A) (II), (B) (I), (C) (IV), (D) (III)",
        "(A) (III), (B) (II), (C) (I), (D) (IV)",
        "(A) (IV), (B) (III), (C) (II), (D) (I)"
    ],
    "a": 1
}
```

### Expected Output
An array of JSON objects representing MCQs, adhering to one or more of the above formats, with shuffled options and diverse question types covering all concepts from the given material.
