package angela.code.domain;

import angela.code.domain.enumeration.RoutineType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Routine.
 */
@Entity
@Table(name = "routine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Routine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "selected_date")
    private LocalDate selectedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "routine_type")
    private RoutineType routineType;

    @ManyToOne
    private User addedBy;

    @ManyToMany
    @JoinTable(
        name = "rel_routine__product",
        joinColumns = @JoinColumn(name = "routine_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "routines" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Routine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSelectedDate() {
        return this.selectedDate;
    }

    public Routine selectedDate(LocalDate selectedDate) {
        this.setSelectedDate(selectedDate);
        return this;
    }

    public void setSelectedDate(LocalDate selectedDate) {
        this.selectedDate = selectedDate;
    }

    public RoutineType getRoutineType() {
        return this.routineType;
    }

    public Routine routineType(RoutineType routineType) {
        this.setRoutineType(routineType);
        return this;
    }

    public void setRoutineType(RoutineType routineType) {
        this.routineType = routineType;
    }

    public User getAddedBy() {
        return this.addedBy;
    }

    public void setAddedBy(User user) {
        this.addedBy = user;
    }

    public Routine addedBy(User user) {
        this.setAddedBy(user);
        return this;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public Routine products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Routine addProduct(Product product) {
        this.products.add(product);
        product.getRoutines().add(this);
        return this;
    }

    public Routine removeProduct(Product product) {
        this.products.remove(product);
        product.getRoutines().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Routine)) {
            return false;
        }
        return id != null && id.equals(((Routine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Routine{" +
            "id=" + getId() +
            ", selectedDate='" + getSelectedDate() + "'" +
            ", routineType='" + getRoutineType() + "'" +
            "}";
    }
}
