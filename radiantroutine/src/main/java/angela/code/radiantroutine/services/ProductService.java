package angela.code.radiantroutine.services;

import angela.code.radiantroutine.entities.Product;
import angela.code.radiantroutine.entities.User;
import angela.code.radiantroutine.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts(User user) {
        return productRepository.findByUser(user);
    }

    public Product getProductById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    public Product createProduct(User user, Product product) {
        user.getProducts().add(product);
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
