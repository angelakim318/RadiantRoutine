package angela.code.radiantroutine.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    // Define morning routine as a set of products
    @ManyToMany
    @JoinTable(
            name = "morning_routine_product",
            joinColumns = @JoinColumn(name = "morning_routine_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> morningRoutine = new HashSet<>();

    // Define evening routine as set of products
    @ManyToMany
    @JoinTable(
            name = "evening_routine_product",
            joinColumns = @JoinColumn(name = "evening_routine_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> eveningRoutine = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<Product> getMorningRoutine() {
        return morningRoutine;
    }

    public void setMorningRoutine(Set<Product> morningRoutine) {
        this.morningRoutine = morningRoutine;
    }

    public Set<Product> getEveningRoutine() {
        return eveningRoutine;
    }

    public void setEveningRoutine(Set<Product> eveningRoutine) {
        this.eveningRoutine = eveningRoutine;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
