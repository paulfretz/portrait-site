/**
 * Example Test
 * Verifies Jest and React Testing Library are configured correctly
 * This file can be deleted once real tests are written
 */

import { render, screen } from '@testing-library/react'

describe('Test Configuration', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello World</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('test').toContain('es')
    expect([1, 2, 3]).toHaveLength(3)
  })
})

