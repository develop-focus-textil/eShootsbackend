/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { UniqueEntityID } from '@domain/shared/core'
import { DateCommonValueObject, EmailValueObject, IpValueObject, PasswordValueObject, TermsValueObject, UserAggregate } from '@domain/user'
import { type User } from '@infra/user/entities/userSchema'
import { UserMapper } from '@infra/user/repository/userMapper'

describe('UserMapper', () => {
  //
  const currentDate = new Date('2023-03-04T03:52:15.368Z')

  //
  let domain: UserAggregate
  let persistence: User
  //
  beforeAll(() => {
    // Create user from domain

    domain = UserAggregate.create(
      {
        email: EmailValueObject.create('valid_mail@domain.com').getResult(),
        password: PasswordValueObject.create('valid_password').getResult(),
        terms: [
          TermsValueObject.create({
            acceptedAt: DateCommonValueObject.create(currentDate).getResult(),
            ip: IpValueObject.create('45.192.110.42').getResult(),
            userAgent: {
              name: 'firefox',
              os: 'LINUX',
              type: 'browser',
              version: '80.0.1'
            }
          }).getResult()
        ],
        createdAt: currentDate,
        updatedAt: currentDate
      },
      new UniqueEntityID('valid_id')
    ).getResult()

    // Create persistence user
    persistence = {
      createdAt: new Date(currentDate),
      email: 'valid_mail@domain.com',
      id: 'valid_id',
      password: 'valid_password',
      terms: [
        {
          ip: '45.192.110.42',
          acceptedAt: new Date('2023-03-04T03:52:15.368Z'),
          userAgent: {
            name: 'firefox',
            os: 'LINUX',
            type: 'browser',
            version: '80.0.1'
          }
        }
      ],
      updatedAt: currentDate
    }
  })
  //
  it('should be defined', () => {
    const mapper = new UserMapper()
    expect(mapper).toBeDefined()
  })

  it('should convert object from persistence to domain', () => {
    const mapper = new UserMapper()
    const result = mapper.toDomain(persistence)
    expect(result).toEqual(domain)
  })

  it('should convert object from domain to persistence', () => {
    const mapper = new UserMapper()
    const result = mapper.toPersistence(domain)
    expect(result).toEqual(persistence)
  })
})
