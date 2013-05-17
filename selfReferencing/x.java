/**
 * Example of how to make x.x == x in Java.
 */
public class x {
    public x x;

    public x () {
        this.x = this;
    }

    @Override
    public String toString() {
        return "This is object x.";
    }

    public static void main (String[] args) {
        x x = new x();
        x = x.x;

        System.out.println(x.toString());
        System.out.println(x.x.toString());
    }
}