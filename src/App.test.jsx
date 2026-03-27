import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  // ===== 表示切り替え =====
  it('音名/度数トグルが表示される', () => {
    render(<App />)
    expect(screen.getByText('音名')).toBeTruthy()
    expect(screen.getByText('度数')).toBeTruthy()
  })

  it('度数ボタンをクリックすると度数の凡例が表示される', () => {
    render(<App />)
    fireEvent.click(screen.getByText('度数'))
    expect(screen.getByText('度数の凡例')).toBeTruthy()
  })

  it('音名ボタンをクリックすると度数の凡例が非表示になる', () => {
    render(<App />)
    fireEvent.click(screen.getByText('度数'))
    fireEvent.click(screen.getByText('音名'))
    expect(screen.queryByText('度数の凡例')).toBeNull()
  })
})
