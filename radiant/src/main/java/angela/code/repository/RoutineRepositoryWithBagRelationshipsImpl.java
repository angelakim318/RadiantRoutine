package angela.code.repository;

import angela.code.domain.Routine;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class RoutineRepositoryWithBagRelationshipsImpl implements RoutineRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Routine> fetchBagRelationships(Optional<Routine> routine) {
        return routine.map(this::fetchProducts);
    }

    @Override
    public Page<Routine> fetchBagRelationships(Page<Routine> routines) {
        return new PageImpl<>(fetchBagRelationships(routines.getContent()), routines.getPageable(), routines.getTotalElements());
    }

    @Override
    public List<Routine> fetchBagRelationships(List<Routine> routines) {
        return Optional.of(routines).map(this::fetchProducts).orElse(Collections.emptyList());
    }

    Routine fetchProducts(Routine result) {
        return entityManager
            .createQuery("select routine from Routine routine left join fetch routine.products where routine is :routine", Routine.class)
            .setParameter("routine", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Routine> fetchProducts(List<Routine> routines) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, routines.size()).forEach(index -> order.put(routines.get(index).getId(), index));
        List<Routine> result = entityManager
            .createQuery(
                "select distinct routine from Routine routine left join fetch routine.products where routine in :routines",
                Routine.class
            )
            .setParameter("routines", routines)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
