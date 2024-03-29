import { SignUpEmailAndPasswordUseCases } from '@application/useCases/user/signup/signUpWithEmailAndPasswordUseCase'
import { type IUserRepositoryContract } from '@domain/contracts/repositories/userRepository.contract'
import { type OS } from '@domain/user'
import { mock, type MockProxy } from 'jest-mock-extended'

export interface IFakerDTO {
  email?: string
  password?: string
  ip?: string
  acceptedTerms?: boolean
  userAgent?: {
    name?: string
    version?: string
    os?: keyof typeof OS
    type?: string
  }
}

describe('SignUpUseCase', () => {
  const fakeDTO = (props?: IFakerDTO) => {
    return {
      acceptedTerms: props?.acceptedTerms ?? true,
      email: props?.email ?? 'johnjoe@example.com',
      ip: props?.ip ?? '123.123.123.123',
      password: props?.password ?? 'valid_password',
      userAgent: {
        name: props?.userAgent?.name ?? 'Mozilla/5.0',
        os: props?.userAgent?.os ?? 'LINUX',
        type: props?.userAgent?.type ?? 'Browser',
        version: props?.userAgent?.version ?? '29.0.12.1.236'
      }
    }
  }

  let userRepository: MockProxy<IUserRepositoryContract>
  let sut: SignUpEmailAndPasswordUseCases

  beforeEach(() => {
    userRepository = mock()
    sut = new SignUpEmailAndPasswordUseCases(userRepository)
  })

  it('Should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('Should return fails if not accept the terms', async () => {
    const fakerDTO = fakeDTO({ acceptedTerms: false })
    const result = await sut.run(fakerDTO)
    expect(result.isFailure).toBe(true)
    expect(result.isSuccess).toBe(false)
    expect(result.error).toBe('Terms should be accepted')
  })

  it('Shpuld fails if user already exists for provided email', async () => {
    jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(true)
    const fakerDTO = fakeDTO()
    const result = await sut.run(fakerDTO)

    expect(userRepository.exist).toHaveBeenCalledWith({ email: fakerDTO.email })
    expect(userRepository.exist).toHaveBeenCalledTimes(1)
    expect(result.isFailure).toBe(true)
    expect(result.isSuccess).toBe(false)
    expect(result.error).toBe('User already exist for provided email')
  })

  it('Should save user with success', async () => {
    jest.spyOn(userRepository, 'save').mockResolvedValueOnce()

    const fakerDTO = fakeDTO()
    const result = await sut.run(fakerDTO)

    expect(userRepository.save).toHaveBeenCalledTimes(1)
    expect(result.isFailure).toBe(false)
    expect(result.isSuccess).toBe(true)
  })
})
