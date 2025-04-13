package com.ogthmi.chekzam.util;

import java.util.Random;

public class IdGenerator {
    public static final int ID_LENGTH = 12;
    public static String generateRandomId(){
        Random random = new Random();
        StringBuilder id = new StringBuilder();
        for (int i = 0; i < ID_LENGTH; i++){
            id.append(random.nextInt(10));
        }
        return id.toString();
    }
}
