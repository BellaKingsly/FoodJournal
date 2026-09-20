/*
 * Date: 06/09/2026
 * Name: Penglei Fan / Cole Zinda
 *
 * File Path: backend/src/main/java/com/foodjournal/api/MenuItem.java
 * Function: Represents a menu dish and converts it to an API JSON response
 */

package com.foodjournal.api;

/** Stores the menu data returned to customer and chef pages. */
final class MenuItem {
    final int id;
    final String name;
    final String description;
    final double price;
    final String category;
    final String image;
    final double rating;

    MenuItem(
            int id,
            String name,
            String description,
            double price,
            String category,
            String image,
            double rating) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.rating = rating;
    }

    /** Converts this menu item into the JSON shape expected by the frontend. */
    String json() {
        return "{\"id\":"
                + id
                + ",\"name\":"
                + quote(name)
                + ",\"description\":"
                + quote(description)
                + ",\"price\":"
                + price
                + ",\"category\":"
                + quote(category)
                + ",\"image\":"
                + quote(image)
                + ",\"rating\":"
                + rating
                + "}";
    }

    private static String quote(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
