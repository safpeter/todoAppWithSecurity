
import model.Todo;
import model.TodoDao;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;

import static spark.Spark.*;

public class BasicTodoList {

    private static final String SUCCESS = "{\"success\":true}";

    public static void main(String[] args) {

        addSampleData();

        exception(Exception.class, (e, req, res) -> e.printStackTrace()); // print all exceptions
        staticFiles.location("/public");
        port(9999);

        // Add new
        post("/addTodo", (req, res) -> {
            Todo newTodo = Todo.create(req.queryParams("todo-title"));
            TodoDao.add(newTodo);
            return SUCCESS;
        });

        // List by id
        post("/list", (req, resp) -> {
            List<Todo> daos = TodoDao.ofStatus(req.queryParams("status"));
            JSONArray arr = new JSONArray();
            for (Todo dao : daos) {
                JSONObject jo = new JSONObject();
                jo.put("id", dao.getId());
                jo.put("title", dao.getTitle());
                jo.put("completed", dao.isCompleted());
                arr.put(jo);
            }
            return arr.toString(2);
        });

        // Remove all completed
        delete("/todos/completed", (req, res) -> {
            TodoDao.removeCompleted();
            return SUCCESS;
        });

        // Toggle all status
        put("/todos/toggle_all", (req, res) -> {
            String complete = req.queryParams("toggle-all");
            TodoDao.toggleAll(complete.equals("true"));
            return SUCCESS;
        });

        // Remove by id
        delete("/todos/:id", (req, res) -> {
            TodoDao.remove(req.params("id"));
            return SUCCESS;
        });

        // Update by id
        put("/todos/:id", (req, res) -> {
            TodoDao.update(req.params("id"), req.queryParams("todo-title"));
            return SUCCESS;
        });

        // Find by id
        get("/todos/:id", (req, res) -> TodoDao.find(req.params("id")).getTitle());

        // Toggle status by id
        put("/todos/:id/toggle_status", (req, res) -> {
            boolean completed = req.queryParams("status").equals("true");
            TodoDao.toggleStatus(req.params("id"), completed);
            return SUCCESS;
        });
    }

    private static void addSampleData() {
        TodoDao.add(Todo.create("first TODO item"));
        TodoDao.add(Todo.create("second TODO item"));
        TodoDao.add(Todo.create("third TODO item"));
    }

}
