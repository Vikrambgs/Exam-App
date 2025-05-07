import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import {
  setTheme,
  setFontSize,
  toggleSoundEffects,
  toggleTimerDisplay,
  updateQuestionNavigation,
  updateResultDisplay,
  updateAccessibility,
  updateNotifications,
} from '../store/slices/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settings = useSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState('general');

  // Apply font size changes
  useEffect(() => {
    const root = document.documentElement;
    switch (settings.fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  }, [settings.fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [settings.accessibility.highContrast]);

  // Apply reduced motion
  useEffect(() => {
    if (settings.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings.accessibility.reducedMotion]);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'display', label: 'Display' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Theme</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setTheme('light'))}
            className={`p-2 rounded-lg ${
              settings.theme === 'light'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <SunIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => dispatch(setTheme('dark'))}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <MoonIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 dark:text-white">Font Size</h3>
        <div className="flex space-x-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => dispatch(setFontSize(size.value))}
              className={`px-4 py-2 rounded-lg ${
                settings.fontSize === size.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Sound Effects</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enable/disable sound effects</p>
        </div>
        <Switch
          checked={settings.soundEffects}
          onChange={() => dispatch(toggleSoundEffects())}
          className={`${
            settings.soundEffects ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Timer Display</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Show/hide timer during exams</p>
        </div>
        <Switch
          checked={settings.timerDisplay}
          onChange={() => dispatch(toggleTimerDisplay())}
          className={`${
            settings.timerDisplay ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.timerDisplay ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 dark:text-white">Question Navigation</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="dark:text-white">Show Progress</span>
            <Switch
              checked={settings.questionNavigation.showProgress}
              onChange={() =>
                dispatch(
                  updateQuestionNavigation({
                    showProgress: !settings.questionNavigation.showProgress,
                  })
                )
              }
              className={`${
                settings.questionNavigation.showProgress
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  settings.questionNavigation.showProgress
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <span className="dark:text-white">Allow Skip Questions</span>
            <Switch
              checked={settings.questionNavigation.allowSkip}
              onChange={() =>
                dispatch(
                  updateQuestionNavigation({
                    allowSkip: !settings.questionNavigation.allowSkip,
                  })
                )
              }
              className={`${
                settings.questionNavigation.allowSkip
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  settings.questionNavigation.allowSkip
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">High Contrast</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Increase text contrast</p>
        </div>
        <Switch
          checked={settings.accessibility.highContrast}
          onChange={() =>
            dispatch(
              updateAccessibility({
                highContrast: !settings.accessibility.highContrast,
              })
            )
          }
          className={`${
            settings.accessibility.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.accessibility.highContrast
                ? 'translate-x-6'
                : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Reduced Motion</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations</p>
        </div>
        <Switch
          checked={settings.accessibility.reducedMotion}
          onChange={() =>
            dispatch(
              updateAccessibility({
                reducedMotion: !settings.accessibility.reducedMotion,
              })
            )
          }
          className={`${
            settings.accessibility.reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.accessibility.reducedMotion
                ? 'translate-x-6'
                : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Exam Reminders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming exams</p>
        </div>
        <Switch
          checked={settings.notifications.examReminders}
          onChange={() =>
            dispatch(
              updateNotifications({
                examReminders: !settings.notifications.examReminders,
              })
            )
          }
          className={`${
            settings.notifications.examReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.notifications.examReminders
                ? 'translate-x-6'
                : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium dark:text-white">Result Alerts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when results are available</p>
        </div>
        <Switch
          checked={settings.notifications.resultAlerts}
          onChange={() =>
            dispatch(
              updateNotifications({
                resultAlerts: !settings.notifications.resultAlerts,
              })
            )
          }
          className={`${
            settings.notifications.resultAlerts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              settings.notifications.resultAlerts
                ? 'translate-x-6'
                : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
        <button
          onClick={() => navigate('/exam')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Exam
        </button>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'display' && renderDisplaySettings()}
        {activeTab === 'accessibility' && renderAccessibilitySettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
      </div>
    </div>
  );
};

export default Settings; 
