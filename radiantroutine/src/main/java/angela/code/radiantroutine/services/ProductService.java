package angela.code.radiantroutine.services;

import angela.code.radiantroutine.entities.Product;
import angela.code.radiantroutine.entities.User;
import angela.code.radiantroutine.exceptions.UserNotFoundException;
import angela.code.radiantroutine.repositories.ProductRepository;
import angela.code.radiantroutine.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Product> getAllProducts(User user) {
        return productRepository.findByUser(user);
    }

    public Product getProductById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    public Product createProduct(User user, Product product) {
        if(user == null) {
            throw new UserNotFoundException("User not found");
        }
        product.setUser(user);
        user.getProducts().add(product);
        userRepository.save(user);
        return productRepository.save(product);
    }

    public Product updateProduct(Product existingProduct, Product updatedProduct) {
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setBrand(updatedProduct.getBrand());
        existingProduct.setType(updatedProduct.getType());
        existingProduct.setImage(updatedProduct.getImage());
        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Product product) {
        productRepository.delete(product);
    }

}
