package todo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import todo.model.TodoAppUser;

import java.util.Optional;

public interface UserRepository extends JpaRepository<TodoAppUser, Long> {

    Optional<TodoAppUser> findByUsername(String username);

}
