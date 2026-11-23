package com.pottedLeaf.plantstore.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pottedLeaf.plantstore.service.ChatBotService;

@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
@RestController
@RequestMapping("/api/v1")
public class ChatBotController {
	
	private  final ChatBotService chatBotService;

	public ChatBotController(ChatBotService chatBotService) {
		super();
		this.chatBotService = chatBotService;
	}
	
	@GetMapping("/query")
	public String ask(@RequestParam String question) {
		return chatBotService.answerUserQuery(question);
	}
	

}
