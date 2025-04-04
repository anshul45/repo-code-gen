# Generated Code - 2025-04-03T14:43:43.087Z

## src/components/TaskCard.tsx
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: string, updatedTask: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onEdit(task.id, {
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onEdit(task.id, { completed: !task.completed });
  };

  return (
    <Card className={`w-full transition-all duration-200 ${task.completed ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </CardTitle>
            <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
              {task.priority}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        ) : (
          <p className={`text-sm text-gray-600 ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.description || 'No description provided'}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleComplete}
          className={task.completed ? 'border-green-500 text-green-600' : ''}
        >
          {task.completed ? (
            <>
              <X className="h-4 w-4 mr-1" /> Mark Incomplete
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" /> Mark Complete
            </>
          )}
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSaveEdit}>
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

```

# Generated Code - 2025-04-03T14:44:00.389Z

## src/components/TaskForm.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const TaskForm = ({
  task,
  onSubmit,
  onCancel,
  isEditing = false,
}: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    });
    
    if (!isEditing) {
      // Reset form if not editing
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">
          Task Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          className="w-full min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority" className="font-medium">
          Priority
        </Label>
        <Select
          value={priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
        >
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-1 h-4 w-4" />
          {isEditing ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

```

# Generated Code - 2025-04-03T14:44:14.509Z

## src/components/Sidebar.tsx
import Link from 'next/link';
import { Home, CheckSquare, LayoutList, Settings, Star, Tag, Calendar } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  return (
    <aside className={`w-64 h-screen bg-slate-900 text-white p-4 flex flex-col ${className}`}>
      <div className="flex items-center mb-8 px-2">
        <CheckSquare className="h-6 w-6 text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">TaskMaster</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/" 
              className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <Home className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/all-tasks" 
              className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <LayoutList className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
              <span>All Tasks</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/today" 
              className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <Calendar className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
              <span>Today</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/important" 
              className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <Star className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
              <span>Important</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/tags" 
              className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <Tag className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
              <span>Tags</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="border-t border-slate-700 pt-4 mt-6">
        <Link 
          href="/settings" 
          className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <Settings className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-400" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

```

# Generated Code - 2025-04-03T14:44:21.567Z

## src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950`}>
        <div className="flex min-h-screen">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 p-6 pt-8 overflow-auto">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

```

# Generated Code - 2025-04-03T14:44:36.828Z

## src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID using UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date to show relative time (today, yesterday, etc.)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDate(d);
  }
}

/**
 * Truncates a string to a maximum length and adds ellipsis
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || str.length === 0) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Sort array of objects by a property
 */
export function sortByProperty<T>(array: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return direction === 'asc' ? -1 : 1;
    if (a[property] > b[property]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

```

# Generated Code - 2025-04-03T14:44:52.983Z

## src/hooks/use-toast.ts
import { useState } from 'react';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  action?: React.ReactNode;
  duration?: number;
}

type ToastActionElement = React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;

interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastType;
  action?: ToastActionElement;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, type = 'default', action, duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: title || '',
      description,
      type,
      action,
      duration,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove toast after duration
    setTimeout(() => {
      dismiss(id);
    }, duration);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  // Helper methods for common toast types
  const success = (props: Omit<ToastProps, 'type'>) => toast({ ...props, type: 'success' });
  const error = (props: Omit<ToastProps, 'type'>) => toast({ ...props, type: 'error' });
  const warning = (props: Omit<ToastProps, 'type'>) => toast({ ...props, type: 'warning' });
  const info = (props: Omit<ToastProps, 'type'>) => toast({ ...props, type: 'info' });

  // Task specific helper methods
  const taskCreated = (taskTitle: string) => {
    success({
      title: 'Task Created',
      description: `"${taskTitle}" has been successfully created.`,
      duration: 3000,
    });
  };

  const taskUpdated = (taskTitle: string) => {
    success({
      title: 'Task Updated',
      description: `"${taskTitle}" has been successfully updated.`,
      duration: 3000,
    });
  };

  const taskDeleted = (taskTitle: string) => {
    success({
      title: 'Task Deleted',
      description: `"${taskTitle}" has been successfully deleted.`,
      duration: 3000,
    });
  };

  const taskCompleted = (taskTitle: string, completed: boolean) => {
    success({
      title: completed ? 'Task Completed' : 'Task Reopened',
      description: completed 
        ? `"${taskTitle}" has been marked as completed.` 
        : `"${taskTitle}" has been reopened.`,
      duration: 3000,
    });
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
    success,
    error,
    warning,
    info,
    taskCreated,
    taskUpdated,
    taskDeleted,
    taskCompleted,
  };
}

```

# Generated Code - 2025-04-03T14:45:05.498Z

## src/data/tasks.ts
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  tags?: string[];
}

export const tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete project proposal',
    description: 'Draft and finalize the project proposal for the new client including timeline, budget, and deliverables.',
    priority: 'high',
    completed: false,
    createdAt: new Date('2023-04-01'),
    dueDate: new Date('2023-04-05'),
    tags: ['work', 'client']
  },
  {
    id: uuidv4(),
    title: 'Schedule team meeting',
    description: 'Set up weekly team sync to discuss project progress and blockers.',
    priority: 'medium',
    completed: true,
    createdAt: new Date('2023-04-02'),
    dueDate: new Date('2023-04-03'),
    tags: ['work', 'team']
  },
  {
    id: uuidv4(),
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and vegetables from the supermarket.',
    priority: 'low',
    completed: false,
    createdAt: new Date('2023-04-02'),
    tags: ['personal']
  },
  {
    id: uuidv4(),
    title: 'Research new technologies',
    description: 'Explore emerging technologies for potential integration in future projects.',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2023-04-03'),
    dueDate: new Date('2023-04-10'),
    tags: ['work', 'learning']
  },
  {
    id: uuidv4(),
    title: 'Update portfolio website',
    description: 'Add recent projects and update skills section on personal portfolio site.',
    priority: 'high',
    completed: false,
    createdAt: new Date('2023-04-03'),
    dueDate: new Date('2023-04-15'),
    tags: ['personal', 'career']
  }
];

```

# Generated Code - 2025-04-03T14:45:38.165Z

## src/app/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { tasks as initialTasks } from '@/data/tasks';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Plus, SortAsc, SortDesc, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  tags?: string[];
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const { taskCreated, taskUpdated, taskDeleted, taskCompleted } = useToast();

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: generateId(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks([task, ...tasks]);
    setShowForm(false);
    taskCreated(task.title);
  };

  const handleEditTask = (id: string, updatedTask: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const newTask = { ...task, ...updatedTask };
        
        // Handle completion status change
        if (updatedTask.completed !== undefined && updatedTask.completed !== task.completed) {
          taskCompleted(task.title, updatedTask.completed);
        } else if (Object.keys(updatedTask).some(key => key !== 'completed')) {
          // Only show update toast if we're not just toggling completion
          taskUpdated(task.title);
        }
        
        return newTask;
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
      taskDeleted(taskToDelete.title);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const filteredAndSortedTasks = [...tasks]
    .filter(task => filterPriority === 'all' || task.priority === filterPriority)
    .sort((a, b) => {
      // Sort by created date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const activeTasks = filteredAndSortedTasks.filter(task => !task.completed);
  const completedTasks = filteredAndSortedTasks.filter(task => task.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Task Manager</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your tasks efficiently and stay organized
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                <SortDesc className="h-4 w-4 mr-2" />
                Newest first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                Low Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Task Button */}
          <Button onClick={toggleForm} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
          <TaskForm 
            onSubmit={handleAddTask} 
            onCancel={toggleForm}
          />
        </div>
      )}

      {/* Active Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Tasks</CardTitle>
          <CardDescription>
            You have {activeTasks.length} active {activeTasks.length === 1 ? 'task' : 'tasks'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTasks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              No active tasks. Add a new task to get started!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>
              You have completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```