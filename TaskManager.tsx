import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/LocalStorage';
import Card from '../components/Card';
import Button from '../components/Button';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'All' | 'Active' | 'Completed';

const TaskManager: React.FC = () => {
  // Use custom hook for persisting tasks
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Filter tasks using useMemo for performance
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Active':
        return tasks.filter(task => !task.completed);
      case 'Completed':
        return tasks.filter(task => task.completed);
      case 'All':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const filterButtons: Filter[] = ['All', 'Active', 'Completed'];

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600 dark:text-blue-400">
        Task Manager
      </h1>
      <Card className="mb-8">
        <form onSubmit={addTask} className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </form>
      </Card>

      <div className="flex justify-center space-x-4 mb-6">
        {filterButtons.map(f => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'primary' : 'secondary'}
            className="w-24"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {tasks.length === 0 
              ? "No tasks yet! Add one above." 
              : `No ${filter.toLowerCase()} tasks.`}
          </p>
        ) : (
          filteredTasks.map(task => (
            <Card key={task.id} className="flex items-center justify-between transition-shadow hover:shadow-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span
                  className={`ml-4 text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}
                >
                  {task.text}
                </span>
              </div>
              <Button variant="danger" onClick={() => deleteTask(task.id)} className="text-sm px-3 py-1">
                Delete
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;