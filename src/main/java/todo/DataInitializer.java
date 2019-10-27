package todo;


import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import todo.model.TodoAppUser;
import todo.repository.UserRepository;

import java.util.Arrays;

@Component
@Slf4j
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

        users.save(TodoAppUser.builder()
                .username("admin")
                .password(passwordEncoder.encode("password"))
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build()
        );

    }
}
