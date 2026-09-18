/*
 * Date: 06/09/2026
 * Name: Cole Zinda
 *
 * File Path: backend/src/main/java/com/foodjournal/api/Order.java
 * Function: Represents a customer order and converts it to an API JSON response
 */

package com.foodjournal.api;

/** Stores order details that are listed and updated through the order API. */
final class Order {
    final String id;
    final String customerName;
    final String chefName;
    String status;
    final double total;
    final String address;

    Order(
            String id,
            String customerName,
            String chefName,
            String status,
            double total,
            String address) {
        this.id = id;
        this.customerName = customerName;
        this.chefName = chefName;
        this.status = status;
        this.total = total;
        this.address = address;
    }

    /** Converts this order into the JSON shape expected by the frontend. */
    String json() {
        return "{\"id\":"
                + quote(id)
                + ",\"customerName\":"
                + quote(customerName)
                + ",\"chefName\":"
                + quote(chefName)
                + ",\"status\":"
                + quote(status)
                + ",\"total\":"
                + total
                + ",\"address\":"
                + quote(address)
                + "}";
    }

    private static String quote(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
