package model;

public class Todo {

    private String title;
    private String id;
    private Status status;
    private static int _idCounter = 0;

    private Todo(String title, String id, Status status) {
        this.title = title;
        this.id = id;
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isCompleted() {
        return this.status == Status.COMPLETE;
    }

    public static Todo create(String title) {
        _idCounter++;
        return new Todo(title, String.valueOf(_idCounter), Status.ACTIVE);
    }

}
