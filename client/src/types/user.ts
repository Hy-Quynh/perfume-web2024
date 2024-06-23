export type UserCreateBody = {
  email: string
  phone: string
  password?: string
}

export type UserLoginBodyType = {
  email: string
  password: string
}

export type UserUpdateBody = {
  email: string
  phone: string
  name: string
  address: string
}