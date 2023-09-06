package angela.code.repository;

import angela.code.domain.Routine;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Routine entity.
 *
 * When extending this class, extend RoutineRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface RoutineRepository extends RoutineRepositoryWithBagRelationships, JpaRepository<Routine, Long> {
    @Query("select routine from Routine routine where routine.addedBy.login = ?#{principal.username}")
    List<Routine> findByAddedByIsCurrentUser();

    default Optional<Routine> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Routine> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Routine> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct routine from Routine routine left join fetch routine.addedBy",
        countQuery = "select count(distinct routine) from Routine routine"
    )
    Page<Routine> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct routine from Routine routine left join fetch routine.addedBy")
    List<Routine> findAllWithToOneRelationships();

    @Query("select routine from Routine routine left join fetch routine.addedBy where routine.id =:id")
    Optional<Routine> findOneWithToOneRelationships(@Param("id") Long id);
}
