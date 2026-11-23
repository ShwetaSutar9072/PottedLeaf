package com.pottedLeaf.plantstore.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/** Turns errors into a JSON body { "message": "..." } that the React app can show. */
@RestControllerAdvice
public class RestExceptionHandler {

    // 403 / 404 etc. thrown on purpose (for example "Admin only")
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> status(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", String.valueOf(e.getReason())));
    }

    // wrong password, username taken, cart empty...
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handle(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", String.valueOf(e.getMessage())));
    }
}
