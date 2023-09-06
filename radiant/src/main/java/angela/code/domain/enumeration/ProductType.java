package angela.code.domain.enumeration;

/**
 * The ProductType enumeration.
 */
public enum ProductType {
    TONER("Toner"),
    ESSENCE("Essence"),
    SERUM("Serum"),
    EMULSION("Emulsion"),
    MOISTURIZER("Moisturizer"),
    OIL("Oil"),
    EYE_CREAM("Eye Cream"),
    MASK("Mask"),
    SUNSCREEN("Sunscreen");

    private final String value;

    ProductType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
