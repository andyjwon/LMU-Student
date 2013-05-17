#include <stdlib.h>

struct x;
typedef struct x x;

struct x {
    x* x;
};

/**
 * Example of how to make x.x == x in C.
 */
int main() {
    x* x = malloc (sizeof(x));
    x->x = x;

    return 0;
}