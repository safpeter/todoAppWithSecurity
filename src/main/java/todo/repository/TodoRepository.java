package todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import todo.model.Status;
import todo.model.Todo;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findAll();

    void deleteById(Long id);

    @Transactional
    @Modifying
    @Query("delete FROM Todo WHERE status = :status")
    void removeAllCompleted(@Param("status") Status status);

    @Transactional
    @Modifying
    @Query("UPDATE Todo t set t.title = :title where t.id = :id")
    void updateById(@Param("title") String title, @Param("id") Long id);


    Todo getTodoById(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE Todo s set s.status = :status where s.id = :id")
    void toggleStatusById(@Param("id") Long id, @Param("status") Status status);


}
