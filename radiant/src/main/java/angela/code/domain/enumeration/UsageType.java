package angela.code.domain.enumeration;

/**
 * The UsageType enumeration.
 */
public enum UsageType {
    CURRENTLY_USING("Currently Using"),
    NOT_USING("Not Using");

    private final String value;

    UsageType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
