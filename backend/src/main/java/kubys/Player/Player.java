package kubys.Player;

import com.fasterxml.jackson.annotation.JsonBackReference;
import kubys.Map.Cell;
import kubys.Map.Map;
import kubys.Map.Position;
import kubys.User.User;
import lombok.*;
import org.springframework.format.annotation.NumberFormat;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Player extends Cell {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonBackReference
    private User user;

    @Transient
    @JsonBackReference
    private Map map;
    @Embedded
    private Position position;

    @Column
    private String name;
    @Column
    @NumberFormat
    private int level;

    @Column
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private Set<PlayerCharacteristics> characteristics = new HashSet<>();

    @Column
    @NumberFormat
    private int pm;
    @Column
    @NumberFormat
    private int pa;

    @Transient
    @Builder.Default
    private boolean connected = true;

    public String toString() {
        return "Player(id=" + this.getId() + ", map=" + (map != null ? map.getName() : "null") + ", position=" + this.getPosition() + ", name=" + this.getName() + ")";
    }
}