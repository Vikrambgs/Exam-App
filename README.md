**A complete web-based Quiz/Exam App that will help user to practice thier specific subject or topics how he is performing**

### 🧩 Technologies (Frontend Focused):

-   **React + Redux** for UI state and test flow
-   **TailwindCSS** for design
-   **TypeScript** for whole app
-   **Supabase** for backend and authentication

### App Layout

there will be multiple routes like :

| Route    | Description                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| /login   | Show login page                                                                                                           |
| /signup  | Show signup page                                                                                                          |
| /home    | show a simple dashboard of exams given by user; if not, show options for other exams they can start                       |
| /exam    | For actual exam page, which will show one question at a time and options with a question navigation on right side section |
| /result  | For the result page of the user                                                                                           |
| /profile | Show profile page for user                                                                                                |
| /exam    | Show all available exams, allowing the user to search and explore exams                                                   |
| /profile | show profile page for user\*\*\*\*                                                                                        |

i will mainly explain /exam routes here
so on exam routes there will be a nav bar at top which will show info like exam name, exma types , timers, restart exam, submit exam, and a toggle button to toggle right sidebar for question navigation and a setting icon for exam settings and on nav bar bottom border will be a progress bar which will show how much time is left in complete exam

after nav bar there will be main exam section in which there contain two section with width percentage 75% and 25% width second section

-   first is question rendering section with option and next and previous button with mark for review button , save question button on question rendering there will be a top status bar which will show current question number, question time spent with progress bar, a button for save question, a button for mark for review, a button for clear selected option if any option is selected  
    and there will be option as button for each option

-   second section on right size will be a side panel for question navigation with each question number of button to jump to that question with different colored for different status of question like attempted, not attempted and not visited , answered, mark for review and at bottom there will be statics count like answered, not answered, not visited and mark for review

---

On result page there will be a detailed dashboard statustics with total questions, total attempted and total not attempted with score and percentage of score and a button to restart the exam add more details

build it with modern design and good user experience with simple, sleak and clean desifn do not make any rounded border and apply some shadow like effect and some vibrant colors for better user experience do not add too much padding and margin keep in mind main all padding and margin with ui rules with hierarchy of focus of user and ui concept
