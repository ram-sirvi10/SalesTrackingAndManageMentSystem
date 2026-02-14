package com.company.salestracker.runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.company.salestracker.service.EmailService;

import lombok.extern.slf4j.Slf4j;

@Component

public class EmailSendTestRunner implements CommandLineRunner {

	@Autowired
	private EmailService emailsend;


	@Override
	public void run(String... args) throws Exception {
	
//		emailsend.sendHtml("ramsirvi10@gmail.com", "Mail otp", "This is testing email send ");

	}

}
