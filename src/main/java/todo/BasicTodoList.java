package todo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BasicTodoList {

    @Value("${success}")
    private String SUCCESS;

    public static void main(String[] args) {
        SpringApplication.run(BasicTodoList.class, args);
    }

}


//        // Toggle all status
//        put("/todos/toggle_all", (req, res) -> {
//            String complete = req.queryParams("toggle-all");
//            TodoDao.toggleAll(complete.equals("true"));
//            return SUCCESS;
//        });
//
//
//        // Update by id
//        put("/todos/:id", (req, res) -> {
//            TodoDao.update(req.params("id"), req.queryParams("todo-title"));
//            return SUCCESS;
//        });
//
//
//
//
//
//}
