import moxios from 'moxios'
import registrationService from '@/services/registration'


describe('service/registration', () => {

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('should pass the response to caller when request succeeded', () => {
    expect.assertions(2)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent() // 최근의 요청 가져오기
      expect(request).toBeTruthy() // 최근의 요청이 존재하는지 확인
      request.respondWith({ // 요청에 대한 응답 지정
        status: 200,
        response: {result: 'success'}
      })
    })
    return registrationService.register().then(data => {
      expect(data.result).toEqual('success')
    })
  })

  it('should propagate the error to caller when request failed', () => {
    expect.assertions(2)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      expect(request).toBeTruthy()
      request.reject({
        status: 400,
        response: {message: 'Bad request'}
      })
    })
    return registrationService.register().catch(error => {
      expect(error.response.message).toEqual('Bad request')
    })
  })

})
