package todo;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import todo.model.TodoAppUser;
import todo.repository.UserRepository;

import java.util.Arrays;

public class DataInitializer implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository users;


    public DataInitializer(UserRepository users) {
        passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        this.users = users;
    }


    @Override
    public void run(String... args) {
        users.save(TodoAppUser.builder()
                .username("user")
                .password(passwordEncoder.encode("password"))
                .roles(Arrays.asList("ROLE_USER"))
                .build()
        );

    }
}
