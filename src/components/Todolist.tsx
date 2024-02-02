// Todolist.tsx
import './Todolist.css';
import React, {useEffect, useState} from "react";


let newid = 0

export interface Todo {
    id: number
    label: string


    favourite: boolean
    edit: boolean


}

export const Todolist = () => {


    const [inputValue, setInputValue] = useState("")
    const [todos, setTodos] = useState<Todo[]>(() => {
        const localData = localStorage.getItem("todo");
        return localData ? JSON.parse(localData) : [];
    });
    const [editing, setEditing] = useState<number | null>(null)
    const [toggleSubmit, setToggleSubmit] = useState(true)
    const [filter, setFilter] = useState("")
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]); // Dieser Zustand speichert die gefilterten Todos, während todos unverändert bleibt.


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value)
    }

     function handleFilter(e: React.ChangeEvent<HTMLInputElement>){
        setFilter(e.target.value)
    }

    function addTodo() {
        if (inputValue !== "" && toggleSubmit) {
            const newTodo: Todo = {
                label: inputValue,
                id: newid++,
                favourite: false,
                edit: false

            }
            setTodos(prevState => [...prevState, newTodo])
            console.log(newTodo)
            setInputValue("")
        } else {
            setTodos(todos.map((todo) => {
                    if (todo.id === editing) {
                        setInputValue("")
                        setToggleSubmit(true)
                        return {...todo, label: inputValue}
                    }
                    return todo
                })
            )
        }
    }

    function deleteTodo(id: number) {
        const filteredTodos = todos.filter((todo) => todo.id !== id)
        setTodos(filteredTodos) // neues array wird erstellt mit allen todos welche eine andere id haben, die id vom todoo die übereinstimmt wird aus dem neuen array das gerendert wird ausgelschlossen

        const todoToDelete = todos.find((todo) => todo.id === id);
        if (todoToDelete && todoToDelete.edit) {
            setInputValue("");
        }
        setToggleSubmit(true)

    }


    function addToFavourites(newTodo: Todo) {
        setTodos(todos.map(todo => {
            if (todo.id === newTodo.id) {
                console.log(newTodo)
                return {...todo, favourite: !todo.favourite}; // Toggle the favourite status
            }
            return todo;
        }));
    }


    function editTodo(id: number) {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                setInputValue(todo.label);
                setEditing(id);
                setToggleSubmit(false);

                return { ...todo, edit: !todo.edit };
            }

            return todo;
        }));
    }

    function removeEdit(id: number) {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                setInputValue("")
                setToggleSubmit(true)
                return { ...todo, edit: !todo.edit };
            }
            return todo;
        }));
    }
    function deleteAll() {
        setTodos([])
        setInputValue("")
        setToggleSubmit(true)
    }


    useEffect(() => {
            const filtered = todos.filter((todo) => {
                return todo.label.toLowerCase().includes(filter.toLowerCase())
            })
            setFilteredTodos(filtered)
    },[filter])

    console.log(todos)


    useEffect(() => {
        localStorage.setItem("todo", JSON.stringify(todos))
    }, [todos])

    return (
        <>
            <div className="todoContainer">
                <div className="inputGroup">
                    <input value={inputValue} onChange={handleChange} placeholder="Enter a task..."
                           className="todoInput"/>

                    <input value={filter} onChange={handleFilter} placeholder=" Search..."
                           className="todoInput"/>
                    {
                        toggleSubmit ? <button onClick={addTodo} className="submitButton">Add</button> :
                            <button onClick={addTodo} className="submitButton">Update</button>
                    }
                    <button className={"deleteAllButon"} onClick={deleteAll}>Delete All</button>
                </div>


                <ul className="todoList">
                    {(filter === "" ? todos : filteredTodos).map((todo, index) => (
                        todo.favourite ? (
                            <li key={index} className="todoItemCompleted">
                                {todo.label}
                                <div>
                                    <button onClick={() => deleteTodo(todo.id)} className="deleteButton">X</button>
                                    <button onClick={() => addToFavourites(todo)} className={"favouriteButton"}>Remove</button>
                                    {todo.edit ? <button className="editButton" onClick={() => removeEdit(todo.id)}>Remove</button> : <button className="editButton" onClick={() => editTodo(todo.id)}>Edit</button>}
                                </div>
                            </li>
                        ) : (
                            <li key={index} className="todoItem">
                                {todo.label}
                                <div>
                                    <button onClick={() => deleteTodo(todo.id)} className="deleteButton">X</button>
                                    <button onClick={() => addToFavourites(todo)} className={"favouriteButton"}>Favourite</button>
                                    {todo.edit ? <button className="editButton" onClick={() => removeEdit(todo.id)}>Remove</button> : <button className="editButton" onClick={() => editTodo(todo.id)}>Edit</button>}
                                </div>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </>
    );
}





// unterschied zu state und eigenschaft fürs erkennen des editieren eines einzelnen todos ( mit dem removebutton problem )

/*
Wenn Sie einen globalen State verwenden, der außerhalb der Todo-Liste definiert ist, um zu verfolgen, ob ein Todo bearbeitet wird, dann gilt dieser Zustand für alle Todos gleichzeitig. Wenn Sie also in den Bearbeitungsmodus wechseln, denken alle Todos, dass sie bearbeitet werden sollen, weil sie alle denselben globalen State teilen.

Wenn Sie stattdessen eine edit-Eigenschaft innerhalb jedes einzelnen Todo-Objekts haben, kann jedes Todo unabhängig von den anderen bearbeitet werden. Das Ändern dieser Eigenschaft betrifft nur das spezifische Todo, bei dem die Änderung vorgenommen wurde, nicht alle Todos auf einmal. Jedes Todo hat seine eigene edit-Einstellung, die unabhängig von den anderen ist.
 */



/*
Was ich bisher gemacht habe

1. RemoveButton hinzugefügt für jeden einzelnen todo
2. Wenn ich das todo das ich gerade am bearbeiten bin lösche, soll der inputValue geleert sein,
3. Update Button zu add button zurück gemacht, wenn ich alle todos lösche, wenn ich auf removebutton klicke, und wenn ich das todo das ich editiere lösche
4; Searchlist um einzelne Todos zu suchen

Was ich noch machen muss

Wenn ich ein todo editieren will und der removebutton steht, und wenn ich dann bei dem anderen todo auf edit drücke soll der erste todo dessen button remove ist verschwinden und wieder zu edit werden

 */