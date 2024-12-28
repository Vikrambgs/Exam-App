import { useSelector, useDispatch } from 'react-redux'
import { setCurrentQuestion } from '../store/slices/examSlice'
import classNames from 'classnames'

const statusColors = {
  'not-attempted': 'bg-gray-300 hover:bg-gray-400',
  'viewed': 'bg-yellow-300 hover:bg-yellow-400',
  'answered': 'bg-green-300 hover:bg-green-400',
  'marked-review': 'bg-purple-400 hover:bg-purple-500'
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
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 w-full flex flex-col">
      <h3 className="font-semibold mb-2 text-gray-800 text-center uppercase">Questions Status</h3>
      <div className="flex flex-wrap mb-2 gap-2 justify-center">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => dispatch(setCurrentQuestion(index))}
            className={classNames(
              'w-[10%] aspect-square rounded flex items-center justify-center text-xs font-medium transition-all duration-200',
              statusColors[questionStatus[question.id]],
              currentIndex === index ? 'ring-1 ring-indigo-500' : '',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      
      <div className="space-y-1.5 mt-auto">
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-2.5 h-2.5 rounded mr-2', statusColors['not-attempted'].split(' ')[0])} />
            <span className="text-gray-600 text-sm">Not Attempted</span>
          </div>
          <span className="text-gray-600 text-sm">{statusCounts['not-attempted']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-2.5 h-2.5 rounded mr-2', statusColors['viewed'].split(' ')[0])} />
            <span className="text-gray-600 text-sm">Viewed</span>
          </div>
          <span className="text-gray-600 text-sm">{statusCounts['viewed']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center">
            <div className={classNames('w-2.5 h-2.5 rounded mr-2', statusColors['answered'].split(' ')[0])} />
            <span className="text-gray-600 text-sm">Answered</span>
          </div>
          <span className="text-gray-600 text-sm">{statusCounts['answered']}</span>
        </div>
        <div className="flex items-center justify-between px-1.5 mb-2">
          <div className="flex items-center">
            <div className={classNames('w-2.5 h-2.5 rounded mr-2', statusColors['marked-review'].split(' ')[0])} />
            <span className="text-gray-600 text-sm">Marked for Review</span>
          </div>
          <span className="text-gray-600 text-sm">{statusCounts['marked-review']}</span>
        </div>
      </div>
    </div>
  )
}

export default QuestionNavigation
