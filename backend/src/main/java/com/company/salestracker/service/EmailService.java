package com.company.salestracker.service;

import java.io.UnsupportedEncodingException;

import jakarta.mail.MessagingException;

public interface EmailService {

	void sendPlainText(String to, String subject, String body);

	void sendHtml(String to, String subject, String htmlBody) throws MessagingException, UnsupportedEncodingException;

}
