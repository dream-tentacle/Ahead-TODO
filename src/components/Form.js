import React, { useState, useRef } from "react";

function Form(props) {
  const [name, setName] = useState("");
  const fileInputRef = useRef(null);
  const saveTasks = props.saveTasks;
  const handleButtonClick = () => {
    // Reset file input element to trigger onChange event
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };
  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(name);
    setName("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <button
        className="btn"
        type="button"
        onClick={saveTasks}
        style={{ left: "40px", position: "absolute" }}
      >
        保存
      </button>
      <div
        className="btn"
        type="file"
        onClick={handleButtonClick}
        style={{ right: "40px", position: "absolute" }}
      >
        加载
      </div>
      <input
        type="file"
        onChange={props.handleUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          添加任务
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        添加
      </button>
    </form>
  );
}

export default Form;
