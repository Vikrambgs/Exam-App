import { useSelector, useDispatch } from 'react-redux'
import { setCurrentQuestion } from '../../store/slices/examSlice'
import classNames from 'classnames'

const statusColors = {
    "not-attempted": "bg-gray-700 hover:bg-gray-600 text-gray-200",
    viewed: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900",
    answered: "bg-green-400 hover:bg-green-300 text-green-900",
    "answered-marked-review": "bg-green-400 hover:bg-green-300 text-green-900",
    "marked-review": "bg-yellow-400 hover:bg-yellow-300 text-yellow-900",
};

function QuestionNavigation() {
  const dispatch = useDispatch()
  const questions = useSelector(state => state.exam.questions)
  const currentIndex = useSelector(state => state.exam.currentQuestionIndex)
  const questionStatus = useSelector(state => state.exam.questionStatus)

  const statusCounts = {
    'not-attempted': Object.values(questionStatus).filter(status => status === 'not-attempted').length,
    'viewed': Object.values(questionStatus).filter(status => status === 'viewed').length,
    'answered': Object.values(questionStatus).filter(status => status === 'answered').length,
    'marked-review': Object.values(questionStatus).filter(status => status === 'marked-review').length,
  }

  return (
      <div className="bg-slate-900 rounded-lg p-4 w-full flex flex-col h-full border border-gray-600">
          <h3 className="font-semibold text-gray-300 text-lg text-center uppercase tracking-wide pb-2.5 mb-2">
              Questions Status
          </h3>
          <div className="flex flex-wrap mb-4 gap-2 justify-center">
              {questions.map((question, index) => (
                  <button
                      key={question.id}
                      onClick={() => dispatch(setCurrentQuestion(index))}
                      className={classNames(
                          "w-[10%] aspect-square rounded flex items-center justify-center text-xs font-medium transition-all duration-200 bg-gray-400 relative",
                          statusColors[questionStatus[question.id]],

                          currentIndex === index
                              ? "ring-1 ring-indigo-300 transform scale-105"
                              : ""
                      )}
                  >
                      {String(index + 1).padStart(2, "0")}
                      {(questionStatus[question.id] === "marked-review" ||
                          questionStatus[question.id] === "answered-marked-review") && (
                          <span className="absolute w-4/5 h-4/5 border-2 border-purple-600 rounded-full"></span>
                      )}
                  </button>
              ))}
          </div>

          <div className="space-y-2 mt-auto pt-2">
              <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center">
                      <div
                          className={classNames(
                              "w-3 h-3 rounded-full mr-2",
                              statusColors["not-attempted"].split(" ")[0]
                          )}
                      />
                      <span className="text-gray-300 text-sm">Not Viewed</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                      {statusCounts["not-attempted"]}
                  </span>
              </div>
              <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center">
                      <div
                          className={classNames(
                              "w-3 h-3 rounded-full mr-2",
                              statusColors["viewed"].split(" ")[0]
                          )}
                      />
                      <span className="text-gray-300 text-sm">Unattempted</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                      {statusCounts["viewed"]}
                  </span>
              </div>
              <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center">
                      <div
                          className={classNames(
                              "w-3 h-3 rounded-full mr-2",
                              statusColors["answered"].split(" ")[0]
                          )}
                      />
                      <span className="text-gray-300 text-sm">Answered</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                      {statusCounts["answered"]}
                  </span>
              </div>
              <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center">
                      <div
                          className={classNames(
                              "w-3 h-3 rounded-full mr-2 bg-purple-500",
                              
                          )}
                      />
                      <span className="text-gray-300 text-sm">Marked for Review</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                      {statusCounts["marked-review"]}
                  </span>
              </div>
          </div>
      </div>
  );
}

export default QuestionNavigation
