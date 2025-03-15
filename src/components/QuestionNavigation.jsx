import { useSelector, useDispatch } from 'react-redux'
import { setCurrentQuestion } from '../store/slices/examSlice'
import classNames from 'classnames'

const statusColors = {
  'not-attempted': 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  'viewed': 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800',
  'answered': 'bg-green-200 hover:bg-green-300 text-green-800',
  'marked-review': 'bg-purple-200 hover:bg-purple-300 text-purple-800',
  'answered-marked-review': 'bg-emerald-200 hover:bg-emerald-300 text-emerald-800'
}

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
    'answered-marked-review': Object.values(questionStatus).filter(status => status === 'answered-marked-review').length,
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full flex flex-col h-full">
      <h3 className="font-semibold text-gray-800 text-center uppercase tracking-wide border-b pb-2">Questions Status</h3>
      <div className="flex flex-wrap mb-4 gap-2 justify-center">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => dispatch(setCurrentQuestion(index))}
            className={classNames(
              'w-[10%] aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 shadow-sm',
              statusColors[questionStatus[question.id]],
              currentIndex === index ? 'ring-2 ring-indigo-500 transform scale-110' : '',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 mt-auto">
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-3 h-3 rounded-full mr-2', statusColors['not-attempted'].split(' ')[0])} />
            <span className="text-gray-700 text-sm">Not Attempted</span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{statusCounts['not-attempted']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-3 h-3 rounded-full mr-2', statusColors['viewed'].split(' ')[0])} />
            <span className="text-gray-700 text-sm">Viewed</span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{statusCounts['viewed']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-3 h-3 rounded-full mr-2', statusColors['answered'].split(' ')[0])} />
            <span className="text-gray-700 text-sm">Answered</span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{statusCounts['answered']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-3 h-3 rounded-full mr-2', statusColors['marked-review'].split(' ')[0])} />
            <span className="text-gray-700 text-sm">Marked for Review</span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{statusCounts['marked-review']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-3 h-3 rounded-full mr-2', statusColors['answered-marked-review'].split(' ')[0])} />
            <span className="text-gray-700 text-sm">Answered & Marked</span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{statusCounts['answered-marked-review']}</span>
        </div>
      </div>
    </div>
  )
}

export default QuestionNavigation
