package angela.code.domain.enumeration;

/**
 * The RoutineType enumeration.
 */
public enum RoutineType {
    MORNING("Morning"),
    EVENING("Evening");

    private final String value;

    RoutineType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
