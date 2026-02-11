package com.company.salestracker.service.impl;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.company.salestracker.service.RedisService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	public void set(String key, Object value) {
		redisTemplate.opsForValue().set(key, value);
	}

	@Override
	public void set(String key, Object value, long timeout, TimeUnit unit) {

		redisTemplate.opsForValue().set(key, value, timeout, unit);
	}

	@Override
	public <T> T get(String key, Class<T> type) {

		Object value = redisTemplate.opsForValue().get(key);

		if (value == null)
			return null;

		return type.cast(value);
	}

	@Override
	public void delete(String key) {
		redisTemplate.delete(key);
	}

	@Override
	public boolean exists(String key) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(key));
	}

	@Override
	public Long increment(String key) {
		return redisTemplate.opsForValue().increment(key);
	}


}
