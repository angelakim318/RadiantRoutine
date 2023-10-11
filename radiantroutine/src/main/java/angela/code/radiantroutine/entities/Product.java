package angela.code.radiantroutine.entities;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private String type;

    // Store images as binary data (BLOB - Binary Large Object) in database
    @Lob
    private byte[] image;

    @ManyToMany(mappedBy = "morningRoutine")
    private Set<Routine> morningRoutines = new HashSet<>();

    @ManyToMany(mappedBy = "eveningRoutine")
    private Set<Routine> eveningRoutines = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Set<Routine> getMorningRoutines() {
        return morningRoutines;
    }

    public void setMorningRoutines(Set<Routine> morningRoutines) {
        this.morningRoutines = morningRoutines;
    }

    public Set<Routine> getEveningRoutines() {
        return eveningRoutines;
    }

    public void setEveningRoutines(Set<Routine> eveningRoutines) {
        this.eveningRoutines = eveningRoutines;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
