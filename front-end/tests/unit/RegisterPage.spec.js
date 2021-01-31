import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import RegisterPage from '@/views/RegisterPage'
import VueRouter from 'vue-router'

// vm.$router에 접근할 수 있도록
// 테스트에 Vue Router 추가하기
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

// registrationService의 mock
jest.mock('@/services/registration')

describe('RegisterPage.vue', () => {
  let wrapper
  let fieldUsername
  let fieldEmailAddress
  let fieldPassword
  let buttonSubmit

  beforeEach(() => {
    wrapper = mount(RegisterPage, {
      localVue,
      router
    })
    fieldUsername = wrapper.find('#username')
    fieldEmailAddress = wrapper.find('#emailAddress')
    fieldPassword = wrapper.find('#password')
    buttonSubmit = wrapper.find('form button[type="submit"]')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should render registration form', () => {
    expect(wrapper.find('.logo').attributes().src)
      .toEqual('/static/images/logo.png')
    expect(wrapper.find('.tagline').text())
      .toEqual('Open source task management tool')
    expect(fieldUsername.element.value).toEqual('')
    expect(fieldEmailAddress.element.value).toEqual('')
    expect(fieldPassword.element.value).toEqual('')
    expect(buttonSubmit.text()).toEqual('Create account')
  })

  it('should contain data model with initial values', () => {
    expect(wrapper.vm.form.username).toEqual('')
    expect(wrapper.vm.form.emailAddress).toEqual('')
    expect(wrapper.vm.form.password).toEqual('')
  })

  /*
  it('should have form inputs bound with data model', () => {
    const username = 'sunny'
    const emailAddress = 'sunny@taskagile.com'
    const password = 'VueJsRocks!'

    wrapper.vm.form.username = username
    wrapper.vm.form.emailAddress = emailAddress
    wrapper.vm.form.password = password
    expect(fieldUsername.element.value).toEqual(username)
    expect(fieldEmailAddress.element.value).toEqual(emailAddress)
    expect(fieldPassword.element.value).toEqual(password)
  })
  */

  it('should have form submit event handler `submitForm`', () => {
    const stub = jest.fn()
    wrapper.setMethods({submitForm: stub})
    buttonSubmit.trigger('submit')
    expect(stub).toBeCalled()
  })

  it('should register when it is a new user', async () => {
    const stub = jest.fn()
    wrapper.vm.$router.push = stub
    wrapper.vm.form.username = 'sunny'
    wrapper.vm.form.emailAddress = 'sunny@taskagile.com'
    wrapper.vm.form.password = 'JestRocks!'
    wrapper.vm.submitForm()
    await wrapper.vm.$nextTick(() => {
      expect(stub).toHaveBeenCalledWith({name: 'LoginPage'})
    })
  })

  it('should fail it is not a new user', async () => {
    // In the mock, only sunny@taskagile.com is new user
    wrapper.vm.form.username = 'ted'
    wrapper.vm.form.emailAddress = 'ted@taskagile.com'
    wrapper.vm.form.password = 'JestRocks!'
    expect(wrapper.find('.failed').isVisible()).toBe(false)
    wrapper.vm.submitForm()
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.failed').isVisible()).toBe(true)
    })
  })


  /*
  it('should render correct content', () => {
    const Constructor = Vue.extend(RegisterPage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.logo').getAttribute('src'))
      .toEqual('/static/images/logo.png')
    expect(vm.$el.querySelector('.tagline').textContent)
      .toEqual('Open source task management tool')
    expect(vm.$el.querySelector('#username').value).toEqual('')
    expect(vm.$el.querySelector('#emailAddress').value).toEqual('')
    expect(vm.$el.querySelector('#password').value).toEqual('')
    expect(vm.$el.querySelector('form button[type="submit"]').textContent)
      .toEqual('Create account')
  })
  */
})
