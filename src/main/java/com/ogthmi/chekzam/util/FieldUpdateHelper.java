package com.ogthmi.chekzam.util;

import java.util.function.Consumer;

public class FieldUpdateHelper {
    private <T> void updateIfPresent(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

}
