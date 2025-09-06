// Simple test file to verify theme and language functionality

import { describe, it, expect } from 'vitest'
import { translations } from '../i18n'

describe('Theme and Language Functionality', () => {
  it('should have translations for both languages', () => {
    expect(translations['en-US']).toBeDefined()
    expect(translations['zh-CN']).toBeDefined()
  })

  it('should have matching keys for both languages', () => {
    const enKeys = Object.keys(translations['en-US'])
    const zhKeys = Object.keys(translations['zh-CN'])
    
    expect(enKeys.length).toBe(zhKeys.length)
    
    enKeys.forEach(key => {
      expect(translations['zh-CN']).toHaveProperty(key)
    })
  })

  it('should have theme-related translations', () => {
    expect(translations['en-US']['theme.light']).toBe('Light')
    expect(translations['zh-CN']['theme.light']).toBe('浅色')
    
    expect(translations['en-US']['theme.dark']).toBe('Dark')
    expect(translations['zh-CN']['theme.dark']).toBe('深色')
  })

  it('should have language-related translations', () => {
    expect(translations['en-US']['language.chinese']).toBe('中文')
    expect(translations['zh-CN']['language.chinese']).toBe('中文')
    
    expect(translations['en-US']['language.english']).toBe('English')
    expect(translations['zh-CN']['language.english']).toBe('English')
  })
})