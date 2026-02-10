package com.company.salestracker.service.impl;

public class OtpServiceImpl  {

	public String generateOtp() {

		int otp = (int) (Math.random() * 900000) + 100000;
		return String.valueOf(otp);
	}

}
