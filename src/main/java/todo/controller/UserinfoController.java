package todo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import todo.model.TodoAppUser;


@RestController
public class UserinfoController {


    @GetMapping("/me")
    public String currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        TodoAppUser user = (TodoAppUser) authentication.getPrincipal();
        return user.getUsername() + "\n" + user.getRoles();
    }
}
