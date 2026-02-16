package com.company.salestracker.util;

import java.time.LocalDate;

public class DateUtil {

	public DateUtil() {
		// TODO Auto-generated constructor stub
	}

	public static boolean isFutureDate(LocalDate date) {
		return date != null && date.isAfter(LocalDate.now());
	}

	public static boolean isTodayOrFuture(LocalDate date) {
		return date != null && (date.isEqual(LocalDate.now()) || date.isAfter(LocalDate.now()));
	}

	public static boolean isPastDate(LocalDate date) {
		return date != null && date.isBefore(LocalDate.now());
	}

}
