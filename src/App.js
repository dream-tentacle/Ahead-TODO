import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
async function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const contents = event.target.result;
      const json = JSON.parse(contents);

      resolve(json);
    };

    reader.onerror = function () {
      reject(new Error("无法读取文件"));
    };

    reader.readAsText(file);
  });
}
function App(props) {
  const [filter, setFilter] = useState("Active");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // 加载数据
    let data = localStorage.getItem("data");
    if (data) {
      setTasks(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    // 保存数据
    if (tasks.length === 0) return;
    localStorage.setItem("data", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(name) {
    let date, ahead_days;
    // 将name切分为名字、日期、提前天数
    let splited = name.split(" ");
    if (splited.length === 3) {
      name = splited[0];
      date = splited[1];
      ahead_days = splited[2];
    } else if (splited.length === 2) {
      name = splited[0];
      date = splited[1];
      ahead_days = 5;
    }
    if (date.length === 4) {
      date =
        new Date().getFullYear() + "-" + date[0] + date[1] + "-" + date[2] + date[3];
    } else if (date.length === 6) {
      date =
        "20" + date[0] + date[1] + "-" + date[2] + date[3] + "-" + date[4] + date[5];
    } else if (date.length === 8) {
      date =
        date[0] +
        date[1] +
        date[2] +
        date[3] +
        "-" +
        date[4] +
        date[5] +
        "-" +
        date[6] +
        date[7];
    }
    let newTask = {
      id: `todo-${nanoid()}`,
      name,
      completed: false,
      date,
      ahead_days,
    };

    setTasks([...tasks, newTask]);
  }
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }
  const saveTasks = () => {
    // 用户选择保存到文件
    console.log("save");
    let data = JSON.stringify(tasks);
    let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const json = await readJsonFile(file);
      setTasks(json);
    } catch (err) {
      console.log(err);
    }
    console.log(file);
  }
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => {
      if (task.completed) {
        return false;
      }
      let now = new Date();
      let date = new Date(task.date);
      let ahead_days = task.ahead_days;
      let diff = date.getTime() - now.getTime();
      let days = Math.floor(diff / (24 * 3600 * 1000)) + 1;
      return days <= ahead_days;
    },
    Completed: (task) => task.completed,
  };
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        date={task.date}
        ahead_days={task.ahead_days}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const headingText = `${taskList.length} 项任务`;

  return (
    <div className="todoapp stack-large">
      <h1>Ahead Todo</h1>
      <Form addTask={addTask} saveTasks={saveTasks} handleUpload={handleUpload} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>

      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
