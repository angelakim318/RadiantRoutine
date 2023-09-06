package angela.code.repository;

import angela.code.domain.Routine;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface RoutineRepositoryWithBagRelationships {
    Optional<Routine> fetchBagRelationships(Optional<Routine> routine);

    List<Routine> fetchBagRelationships(List<Routine> routines);

    Page<Routine> fetchBagRelationships(Page<Routine> routines);
}
