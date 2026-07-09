import { describe, it, expect } from 'vitest'
import { createWorkspaceSchema, inviteMemberSchema } from './schemas'

describe('createWorkspaceSchema', () => {
  it('accepts a valid workspace', () => {
    expect(createWorkspaceSchema.safeParse({ name: 'Casa', currency: 'COP' }).success).toBe(true)
  })

  it('rejects an empty name', () => {
    expect(createWorkspaceSchema.safeParse({ name: '', currency: 'COP' }).success).toBe(false)
  })

  it('rejects a currency code that is not 3 letters', () => {
    expect(createWorkspaceSchema.safeParse({ name: 'Casa', currency: 'US' }).success).toBe(false)
    expect(createWorkspaceSchema.safeParse({ name: 'Casa', currency: 'USDD' }).success).toBe(false)
  })
})

describe('inviteMemberSchema', () => {
  it('accepts a valid invite', () => {
    expect(inviteMemberSchema.safeParse({ email: 'a@b.com', role: 'member' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(inviteMemberSchema.safeParse({ email: 'not-an-email', role: 'member' }).success).toBe(false)
  })

  it('rejects a role outside member/admin', () => {
    expect(inviteMemberSchema.safeParse({ email: 'a@b.com', role: 'owner' }).success).toBe(false)
  })
})
