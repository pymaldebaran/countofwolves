/**
 * @jest-environment jsdom
 */

import { test, expect } from '@jest/globals'
import { min2ms, sec2min, ms2cs, ms2sec, ms2min, ms2hour, ms2day } from './countofwolves.mjs'

test('sec2min converts correctly seconds to minutes', () => {
    expect(sec2min(60)).toBe(1);
    expect(sec2min(30)).toBe(0.5);
    expect(sec2min(3600)).toBe(60);
})

test('min2ms converts correctly minutes to milliseconds', () => {
    expect(min2ms(1)).toBe(60000);
    expect(min2ms(0.5)).toBe(30000);
    expect(min2ms(60)).toBe(3600000);
})

test('ms2cs converts correctly milliseconds to centiseconds', () => {
    expect(ms2cs(10)).toBe(1);
    expect(ms2cs(1000)).toBe(100);
    expect(ms2cs(60000)).toBe(6000);
})

test('ms2sec converts correctly milliseconds to seconds', () => {
    expect(ms2sec(1000)).toBe(1);
    expect(ms2sec(500)).toBe(0.5);
    expect(ms2sec(60000)).toBe(60);
})

test('ms2min converts correctly milliseconds to minutes', () => {
    expect(ms2min(60000)).toBe(1);
    expect(ms2min(30000)).toBe(0.5);
    expect(ms2min(3600000)).toBe(60);
})

test('ms2hour converts correctly milliseconds to hours', () => {
    expect(ms2hour(3600000)).toBe(1);
    expect(ms2hour(7200000)).toBe(2);
    expect(ms2hour(1800000)).toBe(0.5);
})

test('ms2day converts correctly milliseconds to days', () => {
    expect(ms2day(86400000)).toBe(1);
    expect(ms2day(172800000)).toBe(2);
    expect(ms2day(43200000)).toBe(0.5);
})
