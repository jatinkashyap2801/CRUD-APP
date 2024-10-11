---

# CRUD App (Owl Framework)

This project is a simple **Task Management** application built using the **Owl** framework. The app enables users to perform Create, Read, Update, and Delete (CRUD) operations on tasks and provides a user-friendly interface to manage daily to-do lists.

## Detailed Explanation of the Code

The app is structured using two main components:

1. **Root Component**: Represents the main app structure and handles the list of tasks.
2. **Task Component**: Manages individual tasks, including actions like editing, deleting, and marking tasks as completed.

### Importing Required Owl Modules
The code begins by importing the required modules from the `owl` framework:

```javascript
const { Component, mount, xml, useState, useRef, onMounted } = owl;
```

These modules enable defining components, managing state, binding events, and controlling component lifecycle.

### Task Component
The **Task** component is responsible for displaying each task and providing controls to modify it. The template is defined using Owl's `xml` templating system:

```javascript
class Task extends Component {
    static template = xml`
        <div class="task">
        <h1  t-att-class="props.task.mark?'done':''">
            <input type="checkbox" t-att-checked="props.task.mark" t-on-click="toggle_task" />
            <t t-if="!state.edit">
                <t t-out="props.task.text"/>
                <br/><br/>
                <button t-on-click="edit_task">Edit</button>   
            </t>
            <t t-else>
                <input type="text" t-model="props.task.text" />
                <br/><br/>
                <button t-on-click="save_task">Save</button>   
            </t>
            <button class="del_btn" t-on-click="delete_task">Delete</button>   
        </h1>
        </div>
    `;
```

- **Checkbox**: The checkbox marks the task as completed or not using the `toggle_task()` method.
- **Edit Button**: Switches the task to an editable state using `edit_task()` and changes to a save button.
- **Save Button**: Updates the task text and calls the parent component’s `onedit()` method.
- **Delete Button**: Removes the task by calling the `delete_task()` method and triggering `ondelete()` from the parent component.

### Task Component Methods

1. **`delete_task()`**:
   - Deletes the task by calling `this.props.ondelete(this.props.task.id);`.
   - This triggers the `ondelete` method passed from the parent component (`Root`).

2. **`toggle_task()`**:
   - Toggles the `mark` property of the task, indicating whether the task is completed.

3. **`edit_task()`**:
   - Switches the task to edit mode by toggling the `state.edit` property.

4. **`save_task()`**:
   - Exits edit mode, saves the task's modified text, and calls the `onedit()` method passed from the parent component.

### Root Component
The **Root** component serves as the main container for the app. It handles task creation, deletion, and storage. The component’s structure is defined in its template:

```javascript
class Root extends Component {
    static template = xml`
        <div class="task-list">
        <h1 class="h1">Add items</h1>
        <input type="text" class="form_text" placeholder="Enter item" t-on-keyup="additem" t-ref="add-input" />
        <br/><br/><br/><br/>
        <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task" ondelete.bind="deletetask" onedit.bind="save_to_local_storage" />
        </t>
        </div> 
    `;
    static components = { Task }
```

- **Input Field**: Provides an input box for entering new tasks. It triggers the `additem()` method on pressing the `Enter` key.
- **Task List**: Loops through the `tasks` array and creates a `Task` component for each item.

### Root Component Methods and Properties

1. **`setup()`**:
   - Initializes the `tasks` state using the `useState()` hook, which holds an array of task objects.
   - Loads existing tasks from `localStorage` using `load_from_local_storage()`.
   - Sets up a reference to the input field (`useRef`) and focuses on it once the component is mounted.

2. **`load_from_local_storage()`**:
   - Retrieves stored tasks from `localStorage` (if available) and returns them as an array.
   - This method ensures that tasks persist between sessions.

3. **`save_to_local_storage()`**:
   - Saves the current state of the `tasks` array to `localStorage` as a JSON string.

4. **`additem(e)`**:
   - Listens for the `Enter` key (`keyCode == 13`) on the input field.
   - Creates a new task with a unique `id`, `text` (from input), and `mark` (false by default).
   - Clears the input field and pushes the new task to the `tasks` array.
   - Calls `save_to_local_storage()` to persist the updated task list.

   ```javascript
   if (e.keyCode == 13) {
        const text = e.target.value.trim();
        e.target.value = "";
        if (text) {
            const newtask = {
                text: text,
                id: this.nextid++,
                mark: false
            }
            this.tasks.push(newtask);
            this.save_to_local_storage();
        }
    }
   ```

5. **`deletetask(task_id)`**:
   - Finds the index of the task in the `tasks` array by its `id` and removes it.
   - Updates the `tasks` array and calls `save_to_local_storage()`.

6. **`nextid` Property**:
   - Keeps track of the next unique ID to assign to newly added tasks. The `nextid` value is incremented each time a new task is created.

### Mounting the App

The `Root` component is mounted to the DOM using the following line:

```javascript
mount(Root, document.body)
```

This command mounts the `Root` component to the `body` of the HTML document, making it the main app component.

### Conclusion

This application showcases a basic use of Owl’s state management, templating, and component system to build a CRUD task manager. The app structure and interaction logic demonstrate how Owl can be used to manage component state and perform local storage operations effectively.

--- 
