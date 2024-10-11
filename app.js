const { Component, mount, xml, useState, useRef, onMounted } = owl;
class Task extends Component {
    static template = xml`
        <div class="task">
        <h1  t-att-class="props.task.mark?'done':''"><input type="checkbox" t-att-checked="props.task.mark" t-on-click="toggle_task" />
        <t t-if="!state.edit" >
        <t t-out="props.task.text"/>
        <br/>
        <br/>
        <button t-on-click="edit_task" >Edit</button>   
        </t>
        <t t-else="state.edit" >
        <input type="text" t-model="props.task.text" />
        <br/>
        <br/>
        <button t-on-click="save_task" >Save</button>   
        </t>
        <button class="del_btn" t-on-click="delete_task" >Delete</button>   
        </h1>
        </div>
        `;
    delete_task() {
        this.props.ondelete(this.props.task.id);
    }

    toggle_task() {
        this.props.task.mark = !this.props.task.mark;
    }
    edit_task() {
        this.state.edit = !this.state.edit
    }
    save_task() {
        this.state.edit = !this.state.edit
        this.props.onedit()
    }
    setup() {
        this.state = useState({
            edit: false,
        });
    }
    static props = ['task', 'ondelete', 'onedit']
}
class Root extends Component {
    static template = xml`
        <div class="task-list">
        <h1 class="h1">Add items </h1>
        <input type="text" class="form_text" placeholder="Enter item" t-on-keyup="additem" t-ref="add-input" />
        <br/>
        <br/>
        <br/>
        <br/>
        <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task" ondelete.bind="deletetask" onedit.bind="save_to_local_storage" />
        </t>
        </div> 
        `;
    static components = { Task }
    setup() {
        // this.edit=useState(false)
        this.tasks = useState(this.load_from_local_storage());
        const inputref = useRef('add-input');
        onMounted(() => inputref.el.focus());
    }
    load_from_local_storage() {
        const tasks = localStorage.getItem('tasks')
        return tasks ? JSON.parse(tasks) : [];
    }
    save_to_local_storage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
    additem(e) {
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
    }
    deletetask(task_id) {
        const del_task = this.tasks.findIndex(
            (task) => task.id === task_id
        );
        console.log(del_task)
        if (del_task != -1) {
            this.tasks.splice(del_task, 1);
            this.save_to_local_storage();

        }
        console.log(del_task)
    }
    nextid = 1;
}
mount(Root, document.body)


