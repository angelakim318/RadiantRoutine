package angela.code.radiantroutine.repositories;

import angela.code.radiantroutine.entities.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
}
