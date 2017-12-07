import model.Status;
import model.Todo;
import model.TodoDao;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.ModelAndView;
import spark.Request;
import spark.template.thymeleaf.ThymeleafTemplateEngine;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static spark.Spark.*;

public class BasicTodoList {

    public static final String SUCCESS = "success";

    public static void main(String[] args) {

        TodoDao.add(Todo.create("first TODO item"));
        TodoDao.add(Todo.create("second TODO item"));
        TodoDao.add(Todo.create("third TODO item"));

        exception(Exception.class, (e, req, res) -> e.printStackTrace()); // print all exceptions
        staticFiles.location("/public");
        port(9999);

        // Render main UI
        get("/", (req, res) -> {
            Map<String, Object> model = new HashMap<>();
            return renderTemplate("index", model);
        });

        // Add new
        post("/todos", (req, res) -> {
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
                jo.put("completed", dao.isComplete());
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

    private static String renderTemplate(String template, Map model) {
        return new ThymeleafTemplateEngine().render(new ModelAndView(model, template));
    }

}
