package angela.code.radiantroutine.repositories;

import angela.code.radiantroutine.entities.Product;
import angela.code.radiantroutine.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByUser(User user);
}
