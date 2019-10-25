package todo.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import todo.model.Status;
import todo.model.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import todo.repository.TodoRepository;

import java.util.List;

@CrossOrigin
@RestController
public class Controller {

    @Value("${success}")
    private String success;

    @Autowired
    TodoRepository todoRepository;


    @PostMapping("/addTodo")
    @ResponseBody
    public Todo addNewTodo(@RequestParam("todo-title") String title, Todo todo) {
        todo.setTitle(title);
        return todoRepository.saveAndFlush(todo);
    }

    @PostMapping("/list")
    public List<Todo> getAllTodo() {
        return todoRepository.findAll();
    }

    @DeleteMapping("/todos/{id}")
    public String removeById(@PathVariable Long id) {
        todoRepository.deleteById(id);
        return success;
    }

    @DeleteMapping("/todos/completed")
    public String removeAllCompleted() {
        todoRepository.removeAllCompleted(Status.COMPLETE);
        return success;
    }


    @PutMapping("/todos/{id}")
    public String updateById(@PathVariable Long id,String title) {
        todoRepository.updateById(title, id);
        return success;
    }

    @GetMapping("/todos/{id}")
    public String findById(@PathVariable Long id) {
        return todoRepository.getTodoById(id).getTitle();
    }

    @PutMapping("/todos/{id}/toggle_status")
    public String toggleStatusById(@PathVariable Long id) {
        if (todoRepository.getTodoById(id).getStatus() == Status.COMPLETE) {
            todoRepository.toggleStatusById(id, Status.ACTIVE);
        } else {
            todoRepository.toggleStatusById(id, Status.COMPLETE);
        }
        return success;
    }


}