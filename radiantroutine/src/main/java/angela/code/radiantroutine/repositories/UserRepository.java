package angela.code.radiantroutine.repositories;

import angela.code.radiantroutine.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
